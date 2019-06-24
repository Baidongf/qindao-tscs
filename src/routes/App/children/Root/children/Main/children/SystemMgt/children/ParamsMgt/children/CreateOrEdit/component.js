import React from 'react'
import {Form, Row, Col, Select, Input, Button } from 'antd'
import queryString from 'query-string'
import {commonChangeHandler} from 'utils/antd'
import HzBreadcrumb from 'components/HzBreadcrumb'
import moment from 'moment'
import './component.scss'

const TextArea = Input.TextArea
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
      orgObj: {}
    }
    this.queryObj = queryString.parse(props.location.search)
    this.operation = this.queryObj.operation
    switch (this.operation) {
      case 'create':
        this.state.operationCnName = '添加';
        break
      case 'edit':
        this.state.operationCnName = '编辑';
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
      "type": this.initStatus,
      "updateById": this.initStatus,
      "updatedDt": this.initStatus,
      "value": this.initStatus
    }
  }

  submitHandler() {
    const orgObj = Object.assign({}, this.state.orgObj)

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }

      // 日期转化为时间戳格式
      ['updatedDt'].forEach(dateKey => {
          if (orgObj[dateKey]) {
            orgObj[dateKey] = orgObj[dateKey].valueOf()
          }
        }
      )

      if (this.operation === 'create') {
      } else {
        this.props.upDateParams(orgObj, () => {
          this.props.history.goBack()
        })
      }
    })
  }

  valueChangeHandler(key, value) {
    commonChangeHandler(this, 'orgObj', key, value)
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
        orgObj: {...paramsDetail}
      })
    }
  }

  render() {
    const {getFieldDecorator} = this.props.form
    return (
      <div className='param-createOrEdit-component'>
        <div className='breadcrumb-rea'>
          <HzBreadcrumb/>
        </div>
        <div className='main-body'>
          <Form className='form'>
            <div className='form-content'>
              <div className='form-title'>
                <span className='text'>{this.state.operationCnName}参数</span>
              </div>
              <div className='form-body'>
                <Row>
                  <Col span={12}>
                    <FormItem label='名称' {...labelProps}>
                      {getFieldDecorator('name', {
                        rules: [{required: true, message: '请输参数名称'}, {max: 20, message: '不能超过20字'}],
                        initialValue: this.state.orgObj.name
                      })(
                        <Input
                          placeholder='请输入参数名称'
                          onChange={this.valueChangeHandler.bind(this, 'name')}
                          disabled
                        />
                      )}
                    </FormItem>
                  </Col>

                </Row>

                <Row>
                  <Col span={12}>
                    <FormItem label='类型' {...labelProps}>
                      {getFieldDecorator('type', {
                        rules: [{required: true, message: '请选择参数类型'}],
                        initialValue: this.state.orgObj.type
                      })(
                        <Select
                          placeholder='请选择参数类型'
                          onChange={this.valueChangeHandler.bind(this, 'type')}
                          disabled
                        >
                          <Option value='system'>系统参数</Option>
                          <Option value='date'>天数</Option>
                          <Option value='amount'>金额</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label='参数' {...labelProps}>
                      {getFieldDecorator('value', {
                        rules: [{required: true, message: '请输入参数'}],
                        initialValue: this.state.orgObj.value
                      })(
                        <Input placeholder='请输入参数'
                          span={12}
                          onChange={this.valueChangeHandler.bind(this, 'value')}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>

                <Row>
                  <Col span={12}>
                    <FormItem label='描述' {...labelProps}>
                      {getFieldDecorator('description', {
                        rules: [{required: true, message: '请输入描述'}],
                        initialValue: this.state.orgObj.description
                      })(
                        <TextArea
                          autosize={{ minRows: 5 }}
                          placeholder='请输入描述'
                          onChange={this.valueChangeHandler.bind(this, 'description')}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>

                {/* <div className='row-line-gap'></div> */}

                {/* <Row>
                  <Col span={12}>
                    <FormItem label='设置人' {...labelProps}>
                      {getFieldDecorator('updateById', {
                        rules: [{required: true, message: '请输入主要行业'}, {max: 20, message: '不能超过20字'}],
                        initialValue: this.state.orgObj.updateById
                      })(
                        <Input placeholder='请输入设置人'
                          onChange={this.valueChangeHandler.bind(this, 'updateById')}
                          disabled={true}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row> */}

                {/* <Row>
                  <Col span={12}>
                    <FormItem label='设置日期' {...labelProps}>
                      {getFieldDecorator('updatedDt', {
                        rules: [{required: true, message: '请输入设置日期'},],
                        initialValue: this.state.orgObj.updatedDt
                      })(
                        <DatePicker placeholder='请输入设置日期'
                          onChange={this.valueChangeHandler.bind(this, 'updatedDt')}
                          disabled={true}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row> */}

              </div>
            </div>
          </Form>

          <div className='btns-area clearfix'>
            <Button
              className='btn-submit  '
              type='primary'
              onClick={this.submitHandler.bind(this)}
              // disabled={!this.state.canSubmit}
            >
              {(!this.operation || this.operation === 'create') ? '确定' : '保存'}
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
