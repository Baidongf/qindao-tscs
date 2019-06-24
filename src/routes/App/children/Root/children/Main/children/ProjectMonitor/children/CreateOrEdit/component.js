import React from 'react'
import { Button, Col, Form, Input, message, Row, Select } from 'antd'
import queryString from 'query-string'
import { commonChangeHandler } from 'utils/antd'
import moment from 'moment'
import HzBreadcrumb from 'components/HzBreadcrumb'
import './component.scss'
import uploadFile from 'utils/dataAccess/uploadFile'
import closeIcon from './image/closeIcon.png'
import expImg from "./image/customer_exemplor.png"
import axios from "axios";

const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input
const labelProps = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
}
const content = (
  <div style={{ width: 397, height: 88 }}>
    <img src={expImg} alt="" />
  </div>
);

class CreateOrEditFrom extends React.Component {
  constructor(props) {

    super(props)
    this.state = {
      projectObj: {
        "customerFilePath": "",
        "description": "",
        "name": "",
        "sortNum": '',
        "userId":this.props.userInfo.id,
        "userName":this.props.userInfo.name
      }
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
      "customerFilePath": this.initStatus,
      "description": this.initStatus,
      "name": this.initStatus,
      "sortNum": this.initStatus,
      "userId": true
    }
  }

  submitHandler() {
    const projectObj = Object.assign({}, this.state.projectObj)
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }

      // 日期转化为时间戳格式
      ['effectiveDate', 'expiryDate'].forEach(dateKey => {
        if (projectObj[dateKey]) {
          projectObj[dateKey] = projectObj[dateKey].valueOf()
        }
      }
      )
      if (this.operation === 'create') {
        this.props.saveProject(projectObj, () => {
          this.props.history.goBack()
        })
      } else {
        this.props.updateProject(projectObj, () => {
          this.props.history.goBack()
        })
      }
    })
  }

  uploadFileHandler = async () => {
    let data = await uploadFile()//上传文件成功后继续执行
    this.valueChangeHandler('customerFilePath', data.payload.data)
    this.validate('customerFilePath')
  }

  valueChangeHandler(key, value) {
    commonChangeHandler(this, 'projectObj', key, value)
    setTimeout(() => {
      this.props.form.setFieldsValue({
        [key]: this.state.projectObj[key]
      })
    }, 0)
    // console.log('stateObjKey',this.state.stateObjKey)
    /*setTimeout(() => {
      this.validate(key)
    })*/
  }

  validate(fieldName) {
    this.props.form.validateFields([fieldName], { first: true }, (err, values) => {
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

  createUserSearch = (value) => {
    this.props.getCreateUser(value)
  }

  createUserSelect = (value, option) => {
    this.valueChangeHandler('userId', value)
  }

  clearUploadFile = (e) => {
    this.setState({ projectObj: Object.assign(this.state.projectObj, { customerFilePath: '' }) })
    e.stopPropagation()
  }

  componentWillMount() {
    if (this.operation === 'edit') {
      this.props.getProjectDetail(this.id)
    } else {
      this.props.getSequence(payload => {
        this.setState({
          projectObj: Object.assign(this.state.projectObj, { sortNum: payload.data })
        })
      })
    }
    this.props.getCreateUser(this.state.projectObj.userId)
  }

  componentDidMount() {
    
  }

  componentWillReceiveProps({ projectDetail }) {

    if (projectDetail !== this.props.projectDetail) {

      // 日期转化为时间戳格式
      ['effectiveDate', 'expiryDate'].forEach(dateKey => {
        if (projectDetail[dateKey]) {
          projectDetail[dateKey] = moment(projectDetail[dateKey])
        }
      })
      this.setState({
        projectObj: { ...projectDetail }
      })
    }
  }

  render() {
    
    const { getFieldDecorator } = this.props.form
    return (
      <div className='createOrEdit-component'>
        <div className='breadcrumb-rea'>
          <HzBreadcrumb />
        </div>
        <div className='main-body'>
          <Form className='form'>
            <div className='form-content'>
              <div className='form-title'>
                <span className='text'>{this.state.operationCnName}项目</span>
              </div>
              <div className='form-body'>
                <Row>
                  <Col span={10}>
                    <FormItem label='项目名称' {...labelProps}>
                      {getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入项目名称' }, { max: 20, message: '不能超过20字' }],
                        initialValue: this.state.projectObj.name
                      })(
                        <Input placeholder='请输入项目名称'
                          onChange={this.valueChangeHandler.bind(this, 'name')}
                        />
                      )}
                    </FormItem>
                  </Col>
                  {/*<Col span={10}>*/}
                  {/*  <FormItem label='项目序号' {...labelProps}>*/}
                  {/*    {getFieldDecorator('sortNum', {*/}
                  {/*      rules: [{ required: true, message: '请输入项目序号' }],*/}
                  {/*      initialValue: this.state.projectObj.sortNum*/}
                  {/*    })(*/}
                  {/*      <Input placeholder='请输入项目序号'*/}
                  {/*        onChange={this.valueChangeHandler.bind(this, 'sortNum')}*/}
                  {/*        disabled={true}*/}
                  {/*      />*/}
                  {/*    )}*/}
                  {/*  </FormItem>*/}
                  {/*</Col>*/}
                </Row>
                <Row>
                  <Col span={10}>
                    <FormItem label='项目建立人' {...labelProps}>
                      {getFieldDecorator('userId', {
                        rules: [{ required: true, message: '请搜索项目建立人' }],
                        initialValue: this.state.projectObj.userName+"["+this.state.projectObj.userId+"]"
                      })(
                        <Select
                          // defaultValue={this.state.projectObj.userId}
                          showSearch
                          style={{ width: 200 }}
                          placeholder="请搜索项目建立人"
                          optionFilterProp="children"
                          onSearch={this.createUserSearch}
                          onSelect={this.createUserSelect}
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                          {this.props.createUser.data.map(user => {
                            return (
                              <Option value={user.id} key={user.id}>{user.name}</Option>
                            )
                          })}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={10}>
                    <FormItem label='项目描述' {...labelProps}>
                      {getFieldDecorator('description', {
                        rules: [{ required: true, message: '请输入项目描述' }, { max: 100, message: '不能超过100字' }],
                        initialValue: this.state.projectObj.description
                      })(
                        <TextArea
                          placeholder='请输入项目描述'
                          style={{ width: 480, height: 150 }}
                          onChange={this.valueChangeHandler.bind(this, 'description')}
                        >
                        </TextArea>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={10}>
                    <FormItem label='客户名单' {...labelProps}>
                      {getFieldDecorator('customerFilePath', {
                        // rules: [{required: true, message: '请选择覆盖企业的文件'}],
                        initialValue: this.state.projectObj.customerFilePath
                      })(
                        <div className='upload-file' onClick={this.uploadFileHandler}>
                        {/* <div className='upload-file'> */}
                          <p className='label'>{this.state.projectObj.customerFilePath || '请选择文件'}</p>
                          <img src={closeIcon} className={'upload-icon-close'} onClick={(e) => {
                            this.clearUploadFile(e)
                          }} />
                        </div>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <div className='file-format'><span className='tips'>支持文件格式：excel。查看</span>
                  <span className='example-format' onClick={() => {
                    axios({
                      url: "/crm-fd/api/tag/exportTemp",
                      method: 'get',
                      responseType: 'blob',
                    }).then(response => {
                      const blob = new Blob(
                        [response.data],
                        {
                          type: 'application/octet-stream;charset=utf-8'
                        }
                      )
                      const fileName = `示例.xls`
                      const linkNode = document.createElement('a')
                      const href = window.URL.createObjectURL(blob)
                      linkNode.href = href
                      linkNode.download = fileName
                      linkNode.style.display = 'none'
                      document.body.appendChild(linkNode)
                      linkNode.click()
                      document.body.removeChild(linkNode)
                      window.URL.revokeObjectURL(href)
                    }).catch(error => {
                      console.log(error)
                      message.error('下载失败')
                    })
                  }}>格式示例</span>
                  {/*<Popover content={content} title="格式示例" trigger="click">*/}
                  {/*  <span className='example-format'>格式示例</span>*/}
                  {/*</Popover>*/}
                </div>
              </div>
            </div>
          </Form>
          <div className='btns-area clearfix'>
            <Button
              className='btn-submit'
              type='primary'
              onClick={this.submitHandler.bind(this)}
              style={{ marginLeft: '10px' }}
            /*disabled={!this.state.canSubmit}*/
            >
              {(!this.operation || this.operation === 'create') ? '新建' : '保存'}
            </Button>
            <Button className='btn-cancel' onClick={() => {
              this.props.history.goBack()
            }}>取消</Button>
          </div>
        </div>
      </div>
    )
  }
}

const CreateOrEdit = Form.create()(CreateOrEditFrom)
export default CreateOrEdit
