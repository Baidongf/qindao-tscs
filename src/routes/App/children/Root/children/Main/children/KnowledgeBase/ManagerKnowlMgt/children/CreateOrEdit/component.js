import React from 'react'
import {Form, Row, Col, Select, Input, Button, DatePicker, Checkbox, message, Upload, Icon} from 'antd'
import queryString from 'query-string'
import {commonChangeHandler} from 'utils/antd'
import HzBreadcrumb from 'components/HzBreadcrumb'
import Loadable from 'react-loadable'
import RouteLoading from 'components/RouteLoading/index'
import moment from 'moment'
import './component.scss'
import ReactQuill, {Quill} from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const FormItem = Form.Item
const Option = Select.Option
const labelProps = {
  labelCol: {span: 6},
  wrapperCol: {span: 18}
}
const {TextArea} = Input;

const TYPE_CONV = [
  {type: '1', typeName: '行内规章（管理方法）'},
  {type: '2', typeName: '行内规章（操作规范）'},
  {type: '3', typeName: '行内规章（价格指导）'},
  {type: '4', typeName: '外部政策'},
  {type: '5', typeName: '行业动态'},
  {type: '6', typeName: '经典案例'}
]

const TYPE_OPTIONS = TYPE_CONV.map((option, index) => <Option value={option.type}
                                                              key={index}>{option.typeName}</Option>);

const IMPORTANT_CONV = [
  {type: 1, typeName: '普通'},
  {type: 2, typeName: '重要'},
  {type: 3, typeName: '特别重要'}
]

const IMPORTANT_OPTIONS = IMPORTANT_CONV.map((option, index) => <Option value={option.type}
                                                                        key={index}>{option.typeName}</Option>);

class CreateOrEditFrom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      knowlObj: {
        // notifyFlag: true,
        attachments: [],
        content: ""
      },
      paramsConfig: {
        primaryBusiness: [],
        customerGroup: [],
        industry: []
      },
      richText: ""
    }
    this.modules = {
      toolbar: {
        container: [
          [{'header': [1, 2, 3, 4, 5, 6, false]}],
          ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
          [{list: 'ordered'}, {list: 'bullet'}, {indent: '-1'}, {indent: '+1'}],
          ['link', 'image'],
          [{'color': []}, {'background': []}],
          ['clean'],
        ],
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
      title: this.initStatus, // 标题
      type: this.initStatus, // 类型
      content: this.initStatus, // 正文
      important: this.initStatus, // 重要程度
      status: this.initStatus, // 状态
    }
  }

  handleChange = (value) => {
    this.setState({richText: value})
  }
  submitHandler = (flag) => {
    const knowlObj = Object.assign({}, this.state.knowlObj)
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }

      // 日期转化为时间戳格式
      ['effectiveDate', 'expiryDate'].forEach(dateKey => {
          if (knowlObj[dateKey]) {
            knowlObj[dateKey] = knowlObj[dateKey].valueOf()
          }
        }
      )
      knowlObj.status = flag
      knowlObj.content = this.state.richText
      if (this.operation === "create") {
        this.props.saveKnowl(knowlObj, () => {
          this.props.history.goBack()
        })
      } else {
        this.props.updateKnowl(knowlObj, () => {
          this.props.history.goBack()
        })
      }
    })
  }

  valueChangeHandler(key, value) {
    commonChangeHandler(this, 'knowlObj', key, value)
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

  // 文件上传
  handleFileUpload({file, fileList}) {

    // if (file.status === 'uploading') {
    //   this.setState({ uploading: true })
    // }
    if (file.status === 'done') {
      message.success('附件上传成功')
      let files = this.state.knowlObj.attachments || []
      files.push({
        url: file.response.payload.data,
        name: file.name,
      })
      this.setState({
        knowlObj: {...this.state.knowlObj, attachments: files},
      })
    }
    if (file.status === "removed") {
      this.setState({
        knowlObj: {
          ...this.state.knowlObj, attachments: fileList.map(item => ({
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
    this.props.getKnowlParams()
    if (this.operation === 'edit') {
      this.props.getKnowlDetail(this.id, (res) => {
        res.defaultFileList = Array.isArray(res.attachments) && res.attachments.length > 0 ? res.attachments.map(item => ({
          uid: item.id,
          id: item.id,
          name: item.name,
          status: 'done',
          response: {payload: {data: item.url}}, // custom error message to show
          url: item.url,
        })) : [];

        // 日期转化为时间戳格式
        ['effectiveDate', 'expiryDate'].forEach(dateKey => {
          if (res[dateKey]) {
            res[dateKey] = moment(res[dateKey])
          }
        })
        this.setState({
          knowlObj: {...res},
          richText: res.content,
        })
      })

    }
  }

  componentDidMount() {
  }

  componentWillReceiveProps({knowlDetail, paramsConfig}) {
    // if (knowlDetail !== this.props.knowlDetail) {
    //
    //
    // }
  }

  render() {
    const {getFieldDecorator} = this.props.form
    const {knowlObj} = this.state
    let paramsStr = this.props.knowlParams.data[0] && this.props.knowlParams.data[0].value
    let params = []
    if (paramsStr) {
      params = paramsStr.split(',')
    }
    return (
      <div className='createOrEdit-component'>
        <HzBreadcrumb/>
        <div className='breadcrumb-rea'></div>
        <div className='main-body'>
          <Form className='form'>
            <div className='form-content'>
              <div className='form-title'>
                <span className='text'>{this.state.operationCnName}信息</span>
              </div>
              <div className='form-body'>
                <Row>
                  <Col span={24}>
                    <FormItem label='标题名称' labelCol={{span: 3}}
                              wrapperCol={{span: 21}}>
                      {getFieldDecorator('title', {
                        rules: [{required: true, message: '请输入标题名称，不超过50个字符'}, {max: 50, message: '不能超过20字'}],
                        initialValue: knowlObj.title
                      })(
                        <Input placeholder='请输入标题名称，不超过50个字符'
                               onChange={this.valueChangeHandler.bind(this, 'title')}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>

                <Row>
                  <Col span={12}>
                    <FormItem label='信息类型' {...labelProps}>
                      {getFieldDecorator('type', {
                        rules: [{required: true, message: '请选择信息类型'}],
                        initialValue: knowlObj.type
                      })(
                        <Select
                          value={knowlObj.type}
                          onChange={this.valueChangeHandler.bind(this, 'type')}
                          placeholder='请选择信息类型'
                          className='input-item common-length'
                          style={{width: 240}}
                        >
                          {params.map(item => {
                            return (<Option value={item} key={item}>{item}</Option>)
                          })}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label='重要程度' {...labelProps}>
                      {getFieldDecorator('important', {
                        initialValue: knowlObj.important
                      })(
                        <Select
                          value={knowlObj.important}
                          onChange={this.valueChangeHandler.bind(this, 'important')}
                          placeholder='请选择重要程度'
                          className='input-item common-length'
                          style={{width: 240}}
                        >
                          {IMPORTANT_OPTIONS}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row style={{paddingBottom: 42}}>
                  <Col className="rich-text-title-warp"
                       style={{textAlign: "right", color: "rgba(0, 0, 0, 0.85)", fontSize: 14}} span={3}>
                    {/*<TextArea rows={20} placeholder='请输入主要内容'*/}
                    {/*          onChange={this.valueChangeHandler.bind(this, 'content')}*/}
                    {/*/>*/}
                    主要内容：
                  </Col>
                  <Col span={21}>
                    <ReactQuill style={{height: 300}} modules={this.modules} value={this.state.richText}
                                onChange={this.handleChange}/>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem label='附件列表' labelCol={{span: 3}} wrapperCol={{span: 21}}>
                      {this.operation === "create" || this.state.knowlObj.defaultFileList ?
                        <Upload
                          className="form-upload"
                          accept='multipart/form-data'
                          withCredentials={true}
                          action='/crm-fd/api/upload/file'
                          className='upload-button'
                          defaultFileList={this.state.knowlObj.defaultFileList || []}
                          onChange={(file) => {
                            this.handleFileUpload(file)
                          }}
                        >
                          <Icon type='upload' className='add-attachment-icon'/>
                          <span className='add-attachment-wording'>添加附件</span>
                        </Upload> : null}
                    </FormItem>
                  </Col>
                </Row>
                {/*<Row>*/}
                {/*  <Col span={24}>*/}
                {/*    /!*<TextArea rows={20} placeholder='请输入主要内容'*!/*/}
                {/*    /!*          onChange={this.valueChangeHandler.bind(this, 'content')}*!/*/}
                {/*/>*/}
                {/*    <FormItem label='主要内容' labelCol={{span: 3}}*/}
                {/*              wrapperCol={{span: 21}}>*/}
                {/*      {getFieldDecorator('content', {*/}
                {/*        rules: [{required: true, message: '请输入主要内容'}],*/}
                {/*        initialValue: knowlObj.content*/}
                {/*      })(*/}
                {/*        <TextArea rows={20} placeholder='请输入主要内容'*/}
                {/*                onChange={this.valueChangeHandler.bind(this, 'content')}*/}
                {/*      />*/}

                {/*      )}*/}
                {/*    </FormItem>*/}
                {/*  </Col>*/}
                {/*</Row>*/}
              </div>
            </div>
          </Form>

          <div className='btns-area clearfix'>
            {/*<Checkbox*/}
            {/*  onChange={this.valueChangeHandler.bind(this, 'notifyFlag')}*/}
            {/*  checked={knowlObj.notifyFlag}*/}
            {/*  className='notifyFlag-check'*/}
            {/*>推送至消息</Checkbox>*/}
            {/*<Button*/}
            {/*  className='btn-cancel'*/}
            {/*  type='primary'*/}
            {/*  onClick={() => {*/}
            {/*    this.submitHandler(1)*/}
            {/*  }}*/}

            {/*>*/}
            {/*  发表*/}
            {/*</Button>*/}
            <Button
              type="primary"
              className='btn-submit '
              onClick={() => {
                this.submitHandler(0)
              }}
            >
              保存
            </Button>
            <Button style={{marginRight:8}} className='btn-cancel' onClick={() => {
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
