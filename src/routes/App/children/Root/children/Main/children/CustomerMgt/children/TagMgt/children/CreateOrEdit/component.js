import React from 'react'
import { Form, Row, Col, Select, Input, Button, Upload, message, Icon } from 'antd'
import queryString from 'query-string'
import { commonChangeHandler } from 'utils/antd'
import HzBreadcrumb from 'components/HzBreadcrumb'
import DownloadFile from 'components/DownloadFile'
import './component.scss'
const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input
const labelProps = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
}

class CreateOrEditFrom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tagObj: {},
      uploadedFilePath: '',
    }
    this.queryObj = queryString.parse(props.location.search)
    this.operation = this.queryObj.operation
    switch (this.operation) {
      case 'create': this.state.operationCnName = '新建'; break
      case 'edit': this.state.operationCnName = '编辑'; break
      default:
    }
    this.id = this.queryObj.id
    this.initStatus = this.queryObj.operation === 'edit'

    this.fieldsValidateStatus = {
      name: false,
      status: false,
      describe: false,
    }

  }
  submitHandler() {
    const { tagObj, uploadedFilePath } = this.state

    const data = {
      name: tagObj.name,
      description: tagObj.describe,
      type: tagObj.status,
      source: '自定义标签',
      customerListPath: uploadedFilePath,
    }

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }

      this.props.createTag(data, () => {
        this.props.history.goBack();
      })
    })
  }

  valueChangeHandler(key, value) {
    commonChangeHandler(this, 'tagObj', key, value)
    setTimeout(() => {
      this.validate(key)
    })
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

  // 上传文件
  handleFileUpload(info) {
    const { status } = info.file
    if (status === 'done') {
      if (info.fileList.length > 1) {
        info.fileList.shift() // 删除上一个文件
      }
      const uploadedFilePath = info.file.response.payload.data
      this.setState({ uploadedFilePath })
    } else if (status === 'error') {
      message.error('文件上传失败')
    }
  }

  // 移除文件
  handleFileRemove(file) {
    this.setState({ uploadedFilePath: '' })
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
                <span className='text'>{this.state.operationCnName}标签</span>
              </div>
              <div className='form-body'>
                <Row>
                  <Col span={12}>
                    <FormItem label='标签名称' {...labelProps}>
                      {getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入标签名称' }, { max: 20, message: '不能超过20字' }],
                      })(
                        <Input placeholder='请输入标签名称'
                          onChange={this.valueChangeHandler.bind(this, 'name')}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label='标签类型' {...labelProps}>
                      {getFieldDecorator('status', {
                        rules: [{ required: true, message: '请选择标签类型' }, { max: 20, message: '不能超过20字' }],
                      })(
                        <Select placeholder='请选择标签类型'
                          onChange={this.valueChangeHandler.bind(this, 'status')}
                        >
                          <Option value='基本属性'>基本属性</Option>
                          <Option value='业务属性'>业务属性</Option>
                          <Option value='关系属性'>关系属性</Option>
                          <Option value='群体特征属性'>群体特征属性</Option>
                          <Option value='扩展类属性'>扩展类属性</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <div className='row-line-gap'></div>
                <Row>
                  <Col span={12}>
                    <FormItem label='标签描述' {...labelProps}>
                      {getFieldDecorator('describe', {
                        rules: [{ required: true, message: '请填写标签的描述信息' }, { max: 50, message: '不能超过50字' }],
                      })(
                        <TextArea
                          placeholder='请输入标签备注，最多不超过50个字'
                          style={{ width: 420, height: 100 }}
                          onChange={this.valueChangeHandler.bind(this, 'describe')}
                        >
                        </TextArea>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label='覆盖企业' {...labelProps}>
                      {getFieldDecorator('enterprise', {
                        rules: [{ required: true, message: '请选择覆盖企业的文件' }],
                      })(
                        <Upload
                          accept='.xlsx, .xls'
                          action='/crm-fd/api/upload/file'
                          multiple={false}
                          withCredentials={true}
                          onChange={this.handleFileUpload.bind(this)}
                          onRemove={this.handleFileRemove.bind(this)}
                        >
                          <Button
                            style={{ width: 410 }}
                          >
                            <Icon type="upload" className='upload-icon' />请选择文件
                        </Button>
                        </Upload>
                      )}
                    </FormItem>
                    <div className='file-format'>支持文件格式：excel。查看<DownloadFile fileName='示例.xls' downloadUrl='/crm-fd/api/tag/exportTemp'><span className='example-format'>格式示例</span></DownloadFile></div>
                  </Col>
                </Row>

              </div>
            </div>
          </Form>
          <div className='btns-area clearfix'>
            <Button
              className='btn-submit  '
              type='primary'
              onClick={this.submitHandler.bind(this)}
              // disabled={!this.state.canSubmit || !this.state.uploadedFilePath}
            >
              {(!this.operation || this.operation === 'create') ? '新建' : '保存'}
            </Button>
            <Button className='btn-cancel' style={{marginRight:8}} onClick={() => {
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
