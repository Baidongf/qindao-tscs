import React from 'react'
import {
  Form,
  Row,
  Col,
  Select,
  Input,
  Button,
  DatePicker,
  TreeSelect,
  Pagination,
  Radio,
  Icon,
  Upload,
  InputNumber,
  message
} from 'antd'
import queryString from 'query-string'
import {commonChangeHandler} from 'utils/antd'
import HzBreadcrumb from 'components/HzBreadcrumb'
import moment from 'moment'
import './component.scss'
import closeIcon from './images/close.png'
import jianhao from './images/jianhao.png'
import jiahao from './images/jiahao.png'

const FormItem = Form.Item
const Option = Select.Option
const labelProps = {
  labelCol: {span: 6},
  wrapperCol: {span: 18}
}

class CreateOrEditFrom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      prodObj: {
        knowledges: [],
        attachments: [],
        deadline:0
      },
      paramsConfig: {
        primaryBusiness: [],
        customerGroup: [],
        industry: []
      },
      showAdd: false,
      opportunityTotal: 10,
      currentPage: 1,
      filterObj: {
        "keyWord": undefined,
        "pageNo": 1,
        "pageSize": 10,
      },
      currentCheck: null,
      currentJoinType: ''
    }
    this.queryObj = queryString.parse(props.location.search)
    this.operation = this.queryObj.operation
    switch (this.operation) {
      case 'create':
        this.state.operationCnName = '新建';
        break
      case 'edit':
        this.state.operationCnName = '编辑';
        break
      default:
    }
    this.id = this.queryObj.id

    this.initStatus = this.queryObj.operation === 'edit'
    this.fieldsValidateStatus = {
      "code": this.initStatus,
      "concat": this.initStatus,
      "concatTel": this.initStatus,
      "deadline": this.initStatus,
      "description": this.initStatus,
      "issuingScale": this.initStatus,
      "knowledges": this.initStatus,
      "name": this.initStatus,
      "productCategoryId": this.initStatus,
      "rate": this.initStatus,
      "sellTime": this.initStatus,
      "selledBalance": this.initStatus,
      "type": this.initStatus
    }
  }

  submitHandler() {
    const prodObj = Object.assign({}, this.state.prodObj)

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }

      // 日期转化为时间戳格式
      // ['sellTime', 'deadline'].forEach(dateKey => {
      ['sellTime'].forEach(dateKey => {
          if (prodObj[dateKey]) {
            prodObj[dateKey] = prodObj[dateKey].valueOf()
          }
        }
      )

      if (this.operation === 'create') {
        this.props.saveProd(prodObj, () => {
          setTimeout(() => {
            this.props.history.goBack()
          }, 0)
        })
      } else {
        this.props.updateProd(prodObj, () => {
          setTimeout(() => {
            this.props.history.goBack()
          }, 0)
        })
      }
    })
  }

  valueChangeHandler(key, value) {
    commonChangeHandler(this, 'prodObj', key, value)
    setTimeout(() => {
      this.validate(key)
    })
  }

  validate(fieldName) {
    this.props.form.validateFields([fieldName], {first: true}, (err, values) => {
      if (!err) {
        for (let key in values) {
          this.fieldsValidateStatus[key] = true
        }
      } else {
        for (let key in values) {
          this.fieldsValidateStatus[key] = false
        }
      }
      this.updateSubmitStatus(this.fieldsValidateStatus, 'canSubmit')
    })
  }

  updateSubmitStatus(fieldsValidateStatus, stateKey) {
    for (let key in fieldsValidateStatus) {
      if (!fieldsValidateStatus[key]) {
        this.setState({
          [stateKey]: false
        })
        return
      }
    }
    this.setState({
      [stateKey]: true
    })
  }

  openInformation = (type) => {
    this.setState({showAdd: true})
    this.setState({currentJoinType: type})
  }
  cancelHandler = () => {
    this.setState({showAdd: false})
    this.setState({currentCheck: null})
  }

  confirmHandler = () => {
    let prod = Object.assign({}, this.state.prodObj)
    let knowledges = prod.knowledges
    if (this.state.currentCheck) {
      let flag = true
      knowledges.forEach(item => {
        if (item.joinType === this.state.currentJoinType) {
          flag = false
          item.knowledgeId = this.state.currentCheck.id
        }
      })
      if (flag) {
        prod.knowledges.push({
          knowledgeId: this.state.currentCheck.id,
          joinType: this.state.currentJoinType
        })
      }
      this.setState({prod: prod})
      this.setState({showAdd: false})
    }
  }

  searchInformation = (str) => {
    this.setState({filterObj: Object.assign(this.state.filterObj, {keyWord: str})}, () => {
      this.props.getKnowledgeList(this.state.filterObj)
    })
  }

  searchInputHandler = (e) => {
    let str = e.target.value
    if (this.searchTimer) {
      clearTimeout(this.searchTimer)
    }
    this.searchTimer = setTimeout(() => {
      this.setState({
        filterObj: Object.assign(this.state.filterObj, {pageNo: 1}),
        currentPage: 1
      })
      this.searchInformation(str)
    }, 300)
  }

  opportunityPageChange = (page) => {
    this.setState({
      filterObj: Object.assign(this.state.filterObj, {pageNo: page}),
      currentPage: page
    }, () => {
      this.searchInformation()
    })
  }

  radioChange = (e, item) => {
    this.setState({currentCheck: item})
  }

  backToCategory = () => {
    this.props.history.goBack()
  }

  goAddInformation = () => {
    this.props.history.push('/root/main/managerKnowlMgt/createOrEdit?operation=create')
  }

  // 文件上传
  handleFileUpload({file, fileList}) {

    // if (file.status === 'uploading') {
    //   this.setState({ uploading: true })
    // }
    if (file.status === 'done') {
      message.success('附件上传成功')
      let files = this.state.prodObj.attachments || []
      files.push({
        url: file.response.payload.data,
        name: file.name,
      })
      this.setState({
        prodObj: {...this.state.prodObj, attachments: files},
      })
    }
    if (file.status === "removed") {
      this.setState({
        prodObj: {
          ...this.state.prodObj, attachments: fileList.map(item => ({
            url: file.response.payload.data,
            name: file.name,
            id: item.id ? item.id : undefined,
            createTime: item.createTime ? item.createTime : undefined,
          }))
        },
      })
    }
    if (file.status === 'error') {
      this.setState({uploading: false})
      message.error('附件上传失败')
    }

  }

  componentWillMount() {
    this.props.getKnowledgeList(this.state.filterObj)
    this.props.getCatList()
    if (this.operation === 'edit') {
      this.props.getProdDetail(this.id, data => {
        // ['sellTime', 'deadline'].forEach(dateKey => {
        ['sellTime'].forEach(dateKey => {
          if (data[dateKey]) {
            data[dateKey] = moment(data[dateKey])
          }
        })
        data.defaultFileList = Array.isArray(data.attachments) && data.attachments.length > 0 ? data.attachments.map(item => ({
          uid: item.id,
          id: item.id,
          name: item.name,
          status: 'done',
          response: {payload: {data: item.url}}, // custom error message to show
          url: item.url,
        })) : []
        this.setState({
          prodObj: {...data}
        })
      })
    }
  }

  componentDidMount() {
  }


  componentWillReceiveProps({orgDetail, paramsConfig, catList, knowledgeList}) {
    /*
        if (orgDetail !== this.props.orgDetail) {
          // 日期转化为时间戳格式
          ['sellTime', 'deadline'].forEach(dateKey => {
            if (orgDetail[dateKey]) {
              orgDetail[dateKey] = moment(orgDetail[dateKey])
            }
          })
          this.setState({
            prodObj: {...orgDetail}
          },()=>{
            console.log(this.state.prodObj)
          })
        }*/

    if (catList !== this.props.catList) {
      let step = (arr) => {
        arr.forEach(item => {
          item.title = item.name
          item.value = item.id
          if (item.level === 1) {
            item.selectable = false
          }
          if (item.childrens && item.childrens.length > 0) {
            item.children = item.childrens
            step(item.childrens)
          }
        })
      }
      step(catList.data)
    }

    if (knowledgeList !== this.props.knowledgeList) {
      this.setState({opportunityTotal: knowledgeList.total})
    }
  }

  render() {
    const {getFieldDecorator} = this.props.form
    return (
      <div className='create-product-base'>
        <HzBreadcrumb/>
        <div className='breadcrumb-rea'></div>
        <div className='main-body'>
          <Form className='form'>
            <div className='form-content'>
              <div className='form-title'>
                <span className='text'>{this.state.operationCnName}产品</span>
              </div>
              <div className='form-body'>
                <Row>
                  <Col span={24} style={{position: 'relative'}}>
                    <FormItem label='产品分类' labelCol={{span: 3}} wrapperCol={{span: 21}}>
                      {getFieldDecorator('productCategoryId', {
                        rules: [{required: true, message: '请选择产品分类'}],
                        initialValue: this.state.prodObj.productCategoryId
                      })(
                        <TreeSelect placeholder='请选择产品分类'
                                    treeData={this.props.catList.data}
                                    onChange={this.valueChangeHandler.bind(this, 'productCategoryId')}
                                    style={{width: '85%'}}
                        />
                      )}
                    </FormItem>
                    {/*<div className={'add-category'} onClick={() => {*/}
                    {/*  this.backToCategory()*/}
                    {/*}}>*/}
                    {/*  <img src={jianhao}/>*/}
                    {/*  <p>返回二级分类</p>*/}
                    {/*</div>*/}
                  </Col>

                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label='产品名称' {...labelProps}>
                      {getFieldDecorator('name', {
                        rules: [{required: true, message: '请输入产品名称'}],
                        initialValue: this.state.prodObj.name
                      })(
                        <Input placeholder='请输入产品名称'
                               onChange={this.valueChangeHandler.bind(this, 'name')}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label='产品代码' {...labelProps}>
                      {getFieldDecorator('code', {
                        rules: [{required: true, message: '请输入产品代码'}
                        ],
                        initialValue: this.state.prodObj.code
                      })(
                        <Input placeholder='产品代码'
                               onChange={this.valueChangeHandler.bind(this, 'code')}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label='期限' {...labelProps}>
                      {getFieldDecorator('deadline', {
                        rules: [{required: true, message: '请输入期限'}
                        ],
                        initialValue: this.state.prodObj.deadline
                      })(
                        <InputNumber style={{width:"250px"}} onChange={this.valueChangeHandler.bind(this, 'deadline')} />
                        // <DatePicker placeholder='请输入期限'
                        //             onChange={this.valueChangeHandler.bind(this, 'deadline')}
                        // />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label='利率' {...labelProps}>
                      {getFieldDecorator('rate', {

                        initialValue: this.state.prodObj.rate
                      })(
                        <Input placeholder='请输入利率'
                               onChange={this.valueChangeHandler.bind(this, 'rate')}
                               type={'number'}
                        />
                      )}
                    </FormItem>
                  </Col>

                </Row>

                <Row>
                  <Col span={12}>
                    <FormItem label='发行规模' {...labelProps}>
                      {getFieldDecorator('issuingScale', {

                        initialValue: this.state.prodObj.issuingScale
                      })(
                        <Input placeholder='请输入发行规模'
                               onChange={this.valueChangeHandler.bind(this, 'issuingScale')}
                               type={'number'}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label='发行时间' {...labelProps}>
                      {getFieldDecorator('sellTime', {

                        initialValue: this.state.prodObj.sellTime
                      })(
                        <DatePicker placeholder='请选择发行时间'
                                    onChange={this.valueChangeHandler.bind(this, 'sellTime')}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label='联系人' {...labelProps}>
                      {getFieldDecorator('concat', {
                        rules: [{message: '请输入联系人'}],
                        initialValue: this.state.prodObj.concat
                      })(
                        <Input placeholder='请输入联系人'
                               onChange={this.valueChangeHandler.bind(this, 'concat')}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label='联系电话' {...labelProps}>
                      {getFieldDecorator('concatTel', {
                        rules: [{message: '请输入联系电话'}, {max: 20, message: '不能超过20字'}],
                        initialValue: this.state.prodObj.concatTel
                      })(
                        <Input placeholder='请输入联系电话'
                               onChange={this.valueChangeHandler.bind(this, 'concatTel')}
                        />
                      )}
                    </FormItem>
                  </Col>

                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem label='产品描述' labelCol={{span: 3}} wrapperCol={{span: 21}}>
                      {getFieldDecorator('description', {
                        rules: [{required: true, message: '请输入产品描述'}],
                        initialValue: this.state.prodObj.description
                      })(
                        <Input.TextArea placeholder='请输入产品描述'
                                        onChange={this.valueChangeHandler.bind(this, 'description')}
                                        rows={5}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem label='附件列表' labelCol={{span: 3}} wrapperCol={{span: 21}}>

                      {this.operation === "create" || this.state.prodObj.defaultFileList ?
                        <Upload
                          accept='multipart/form-data'
                          withCredentials={true}
                          action='/crm-fd/api/upload/file'
                          className='upload-button'
                          defaultFileList={this.state.prodObj.defaultFileList||[]}
                          onChange={(file, fileList) => {
                            this.handleFileUpload(file, fileList)
                          }}
                        >
                          <Icon type='upload' className='add-attachment-icon'/>
                          <span className='add-attachment-wording'>添加附件</span>
                        </Upload> : null}
                    </FormItem>
                  </Col>
                </Row>
              </div>
            </div>
          </Form>

          <div className='join-knowledge clearfix'>
            <div className='label'>关联知识库</div>
            <div className='btn-group clearfix'>
              <div onClick={() => {
                this.openInformation('管理办法')
              }}>管理办法
              </div>
              <div onClick={() => {
                this.openInformation('操作规程')
              }}>操作规程
              </div>
              <div onClick={() => {
                this.openInformation('营销指引')
              }}>营销指引
              </div>
            </div>
          </div>
          <div className='btns-area clearfix'>
            <Button
              className='btn-submit  '
              type='primary'
              onClick={this.submitHandler.bind(this)}
            >
              保存
            </Button>
            <Button className='btn-cancel' style={{marginRight:8}} onClick={() => {
              this.props.history.goBack()
            }}>取消</Button>


          </div>

          {this.state.showAdd && <div className='popup'>
            <div className='popup-cover'></div>
            <div className='popup-content'>
              <div className='title clearfix'>
                <div className='label'>关联信息</div>
                <img className='close' src={closeIcon} onClick={() => {
                  this.cancelHandler()
                }}></img>
              </div>
              <div className='search'>
                <input placeholder='搜索信息名称，内容关键词' onInput={(e) => {
                  this.searchInputHandler(e)
                }}/>

                {/*<div className={'add-information'} onClick={() => {*/}
                {/*  this.goAddInformation()*/}
                {/*}}>*/}
                {/*  <img src={jiahao}/>*/}
                {/*  <p>信息创建</p>*/}
                {/*</div>*/}

              </div>
              <div className='customer-list'>
                <div className='header'>
                  <div>信息名称</div>
                  <div>信息类型</div>
                  <div>更新时间</div>
                  <div>阅读量</div>
                  <div></div>
                </div>


                {this.props.knowledgeList && this.props.knowledgeList.data.map(item => {
                  return (
                    <div className='item' key={item.id}>
                      <div>{item.title}</div>
                      <div>{item.type}</div>
                      <div>{item.publishTime}</div>
                      <div>{item.viewCount}</div>
                      <div className='operation'>
                        <Radio
                          checked={this.state.currentCheck && (this.state.currentCheck.id === item.id)}
                          onClick={(e) => {
                            this.radioChange(e, item)
                          }}></Radio>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className='pagination-wrap'>
                <Pagination
                  total={this.state.opportunityTotal}
                  onChange={this.opportunityPageChange}
                  current={this.state.currentPage}
                ></Pagination>
              </div>
              <div className='btn-group'>
                <Button style={{marginRight:8}}  className='cancel' onClick={() => {
                  this.cancelHandler(false)
                }}>取消
                </Button>
                <Button type="primary" className='confirm  ' onClick={() => {
                  this.confirmHandler()
                }
                }>确定
                </Button>
              </div>
            </div>
          </div>}
        </div>
      </div>
    )
  }
}

const CreateOrEdit = Form.create()(CreateOrEditFrom)
export default CreateOrEdit
