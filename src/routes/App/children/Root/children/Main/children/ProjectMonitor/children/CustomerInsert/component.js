import React from 'react'
import {Form, Row, Col, Select, Input, Button, DatePicker, Upload, Icon, message} from 'antd'
import queryString from 'query-string'
import {commonChangeHandler} from 'utils/antd'
import HzBreadcrumb from 'components/HzBreadcrumb'
import moment from 'moment'
import './component.scss'
import uploadFile from 'utils/dataAccess/uploadFile'
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
      "customerFilePath": false,
    }
  }

  uploadFileHandler = async () => {
    let data = await uploadFile()
    this.valueChangeHandler('customerFilePath', data.payload.data)
    this.validate('customerFilePath')
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
      this.props.addCustomer({
        id:this.id,
        customerFilePath:this.state.projectObj.customerFilePath
      },() => {
        this.props.history.goBack()
      })
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
    this.props.getProjectDetail(this.id)
  }

  componentDidMount() {
  }

  componentWillReceiveProps({projectDetail}) {
    if (projectDetail !== this.props.projectDetail) {

      // 日期转化为时间戳格式
      ['updatedDt'].forEach(dateKey => {
        if (projectDetail[dateKey]) {
          projectDetail[dateKey] = moment(projectDetail[dateKey])
        }
      })
      this.setState({
        projectObj: {...projectDetail}
      })
    }
  }

  render() {
    const {getFieldDecorator} = this.props.form
    let {projectDetail} = this.props
    return (
      <div className='add-customer-list'>
        <div className='breadcrumb-rea'>
          <HzBreadcrumb/>
        </div>
        <div className='main-body clearfix'>
          <Form className='form'>
            <div className='form-content'>
              <div className='form-body'>
                <Row>
                  <Col span={10}>
                    <FormItem label='项目名称' {...labelProps}>
                      <Input placeholder='请输入参数'
                             value={projectDetail.name}
                             disabled={true}
                      />
                    </FormItem>
                  </Col>
                  <Col span={10}>
                    <FormItem label='项目序号' {...labelProps}>
                      <Input placeholder='请输入参数'
                             value={projectDetail.sortNum}
                             disabled={true}
                      />
                    </FormItem>
                  </Col>
                </Row>

                <Row>
                  <Col span={10}>
                    <FormItem label='项目建立人' {...labelProps}>
                      <Input placeholder='请输入参数'
                             disabled={true}
                             value={projectDetail.userName}
                      />
                    </FormItem>
                  </Col>
                  <Col span={10}>
                    <FormItem label='所属机构' {...labelProps}>
                      <Input placeholder='请输入参数'
                             value={projectDetail.institutionName}
                             disabled={true}
                      />
                    </FormItem>
                  </Col>
                </Row>

                <Row>
                  <Col span={10}>
                    <FormItem label='客户名单' {...labelProps}>
                      {getFieldDecorator('customerFilePath', {
                        rules: [{required: true, message: '请选择覆盖企业的文件'}],
                        initialValue: this.state.projectObj.customerFilePath
                      })(
                        <div className='upload-file' onClick={this.uploadFileHandler}>
                          <p className='label'>{this.state.projectObj.customerFilePath || '请选择文件'}</p>
                        </div>
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
