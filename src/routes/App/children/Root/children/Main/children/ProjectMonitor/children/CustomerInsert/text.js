import React from 'react'
import {Form, Row, Col, Select, Input, Button, DatePicker, Upload, Icon, message} from 'antd'
import queryString from 'query-string'
import {commonChangeHandler} from 'utils/antd'
import HzBreadcrumb from 'components/HzBreadcrumb'
import moment from 'moment'
import './component.module.scss'
import axios from "axios";

const FormItem = Form.Item
const Option = Select.Option
const labelProps = {
  labelCol: {span: 5},
  wrapperCol: {span: 19}
}

class CreateOrEditFrom extends React.Component {
  constructor(props) {

    super(props)
    this.state = {
      projectObj: {}
    }
    this.queryObj = queryString.parse(props.location.search)
    this.operation = this.queryObj.operation
    switch (this.operation) {
      case 'create':
        this.state.operationCnName = '取消';
        break
      case 'edit':
        this.state.operationCnName = '确定';
        break
      default:
    }
    this.id = this.queryObj.id

    this.initStatus = this.queryObj.operation === 'edit'
    this.fieldsValidateStatus = {
      "description": this.initStatus,
      "enabledFlag": this.initStatus,
      "key": this.initStatus,
      "name": this.initStatus,
    }
  }

  submitHandler() {
    const projectObj = Object.assign({}, this.state.projectObj)

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }

      // 日期转化为时间戳格式
      ['updatedDt'].forEach(dateKey => {
          if (projectObj[dateKey]) {
            projectObj[dateKey] = projectObj[dateKey].valueOf()
          }
        }
      )

      if (this.operation === 'create') {
      } else {
        this.props.upDateParams(projectObj, () => {
          this.props.history.goBack()
        })
      }
    })
  }

  valueChangeHandler(key, value) {
    commonChangeHandler(this, 'projectObj', key, value)
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

  componentWillMount() {
    if (this.operation === 'edit') {
      this.props.getParamsDetail(this.id)
    }
  }

  componentDidMount() {
  }

  componentWillReceiveProps({paramsDetail}) {
    if (paramsDetail !== this.props.paramsDetail) {

      // 日期转化为时间戳格式
      ['updatedDt'].forEach(dateKey => {
        if (paramsDetail[dateKey]) {
          paramsDetail[dateKey] = moment(paramsDetail[dateKey])
        }
      })
      this.setState({
        projectObj: {...paramsDetail}
      })
    }
  }

  render() {
    const {getFieldDecorator} = this.props.form
    return (
      <div className='createOrEdit-component'>
        <div className='breadcrumb-rea'>
          <HzBreadcrumb/>
        </div>
        <div className='main-body'>
          <Form className='form'>
            <div className='form-content'>
              <div className='form-body'>
                <Row>
                  <Col span={8}>
                    <FormItem label='项目名称' {...labelProps}>
                      {getFieldDecorator('name', {
                        initialValue: this.state.projectObj.name
                      })(
                        <Input placeholder='请输入参数'
                               onChange={this.valueChangeHandler.bind(this, 'name')}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label='项目序号' {...labelProps}>
                      {getFieldDecorator('sortNum', {
                        initialValue: this.state.projectObj.sortNum
                      })(
                        <Input placeholder='请输入参数'
                               span={8}
                               onChange={this.valueChangeHandler.bind(this, 'value')}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>

                <Row>
                  <Col span={8}>
                    <FormItem label='项目建立人' {...labelProps}>
                      {getFieldDecorator('userName', {
                        initialValue: this.state.projectObj.userName
                      })(
                        <Input placeholder='请输入参数'
                               span={8}
                               onChange={this.valueChangeHandler.bind(this, 'value')}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label='所属机构' {...labelProps}>
                      {getFieldDecorator('type', {
                        rules: [{required: true, message: '参数种类'}, {max: 20, message: '不能超过20字'}
                        ],
                        initialValue: this.state.projectObj.type
                      })(
                        <Input placeholder='请输入参数'
                               span={8}
                               onChange={this.valueChangeHandler.bind(this, 'value')}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>

                <Row>
                  <Col span={8}>
                    <FormItem label='客户名单' {...labelProps}>
                      {getFieldDecorator('institutionName', {
                        rules: [{ required: true, message: '请选择覆盖企业的客户名单' }],
                        initialValue: this.state.projectObj.institutionName
                      })(
                        <Upload>
                          <Button
                            style={{width: 380}}
                          >
                            <Icon type="upload" className='upload-icon' />请选择文件
                          </Button>
                        </Upload>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <div className='file-format'>支持文件格式：excel。查看
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
                </div>

              </div>
            </div>
          </Form>
          <div className='btns-area clearfix'>

            <Button className='btn-cancel' onClick={() => {
              this.props.history.goBack()
            }}>取消</Button>
            <Button
              className='btn-submit  '
              type='primary'
              onClick={this.submitHandler.bind(this)}
              disabled={!this.state.canSubmit}
            >
              {(!this.operation || this.operation === 'create') ? '确定' : '保存'}
            </Button>

          </div>
        </div>
      </div>
    )
  }
}


const CreateOrEdit = Form.create()(CreateOrEditFrom)
export default CreateOrEdit
