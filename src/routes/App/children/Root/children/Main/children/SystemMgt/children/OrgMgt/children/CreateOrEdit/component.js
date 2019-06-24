import React from 'react'
import { withRouter } from 'react-router-dom'
import { Form, Row, Col, Select, Input, Button, DatePicker } from 'antd'
import queryString from 'query-string'
import { commonChangeHandler } from 'utils/antd'
import moment from 'moment'
import HzBreadcrumb from 'components/HzBreadcrumb'
import SingleOwnInstitution from 'components/SingleOwnInstitution'
import styles from './component.module.scss'
const FormItem = Form.Item
const Option = Select.Option
const labelProps = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
}

class CreateOrEditFrom extends React.Component {
  constructor(props) {

    super(props)
    this.state = {
      orgObj: {
      },
      paramsConfig: {
        primaryBusiness: [],
        customerGroup: [],
        industry: []
      }

    }
    this.queryObj = queryString.parse(props.location.search)
    this.operation = this.queryObj.operation
    switch(this.operation) {
      case 'create': this.state.operationCnName = '添加'; break
      case 'edit': this.state.operationCnName = '编辑'; break
      default:
    }
    this.id = this.queryObj.id

    this.initStatus = this.queryObj.operation === 'edit'
    this.fieldsValidateStatus = {
      name: this.initStatus, // 机构全称
      orgNo: this.initStatus, // 机构编号

      parentId: this.initStatus, // 上级机构
      // level: this.initStatus, // 机构级别

      customerGroup: this.initStatus, // 主要客群
      primaryBusiness: this.initStatus, // 主营业务

      industry: this.initStatus, // 主营行业
      distAreaCd: this.distAreaCd, // 邮编

      status: this.initStatus, // 机构状态
      address: this.initStatus, //机构地址

      principal: this.initStatus, // 负责人
      tel: this.initStatus, // 机构电话

      effectiveDate: this.initStatus, // 生效日期
      // expiryDate: this.initStatus, // 失效日期
    }
  }
  submitHandler() {
    const orgObj = Object.assign({}, this.state.orgObj)
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        console.log(err)
        return
      }

      // 日期转化为时间戳格式
      ['effectiveDate', 'expiryDate'].forEach(dateKey => {
          if (orgObj[dateKey]) {
            orgObj[dateKey] = orgObj[dateKey].valueOf()
          }
        }
      )

      // 新建时(或编辑时修改)，对上级机构进行数据格式转换
      if (
        this.operation === 'create' ||
        orgObj.parentId.indexOf('===') > -1
      ) {
        const parentString = orgObj.parentId
        const parentIdString = parentString.split('===')[1]
        const parentIdArr = parentIdString.split('-')
        const parentId = parentIdArr[parentIdArr.length - 1]
        orgObj.parentId = parentId
      }

      if (this.operation === 'create') {
        this.props.saveOrg(orgObj, () => {
          this.props.history.goBack()
        })
      } else {
        this.props.updateOrg(orgObj, () => {
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

  componentWillMount() {
    if (this.operation === 'edit') {
      this.props.getOrgDetail(this.id)
    }
    this.props.getParamsConfig()
  }

  componentWillReceiveProps({ orgDetail, paramsConfig }) {

    if (orgDetail !== this.props.orgDetail) {

      // 日期转化为时间戳格式
      ['effectiveDate', 'expiryDate'].forEach(dateKey => {
        if (orgDetail[dateKey]) {
          orgDetail[dateKey] = moment(orgDetail[dateKey])
        }
      })
      this.setState({
        orgObj: { ...orgDetail }
      })
    }
    if (paramsConfig !== this.props.paramsConfig) {
      this.setState({
        paramsConfig: {
          primaryBusiness: paramsConfig.primaryBusiness.value.split(','),
          customerGroup: paramsConfig.customerGroup.value.split(','),
          industry: paramsConfig.industry.value.split(',')
        }
      })
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div className={ styles['createOrEdit-component']} >
        <div className={styles['breadcrumb-rea']}>
          <HzBreadcrumb/>
        </div>
        <div className={styles['main-body']}>
          <Form className={styles['form']}>
            <div className={styles['form-content']}>
              <div className={styles['form-title']}>
              <span className={styles['text']}>{ this.state.operationCnName }机构</span>
              </div>
              <div className={styles['form-body']}>
              <Row>
                  <Col span={12}>
                    <FormItem label='机构名称' {...labelProps}>
                      {getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入机构名称' }, { max: 20, message: '不能超过20字' }],
                        initialValue: this.state.orgObj.name
                      })(
                        <Input placeholder='请输入机构名称'
                          onChange={this.valueChangeHandler.bind(this, 'name')}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label='机构编号' {...labelProps}>
                      {getFieldDecorator('orgNo', {
                        rules: [{ required: true, message: '请输入机构编号' }, { max: 20, message: '不能超过20字' }
                        ],
                        initialValue: this.state.orgObj.orgNo
                      })(
                        <Input placeholder='请输入机构编号'
                          onChange={this.valueChangeHandler.bind(this, 'orgNo')}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>

                <Row>
                  <Col span={12}>
                    <FormItem label='上级机构' {...labelProps}>
                      {getFieldDecorator('parentId', {
                        rules: [{ required: true, message: '请输入上级机构' }],
                        initialValue: this.state.orgObj.parentName
                      })(
                        <SingleOwnInstitution
                          placeholder='请选择上级机构'
                          onChange={this.valueChangeHandler.bind(this, 'parentId')}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label='主要业务' {...labelProps}>
                      {getFieldDecorator('primaryBusiness', {
                        rules: [{ required: true, message: '请输入主要业务' }, { max: 20, message: '不能超过20字' }
                        ],
                        initialValue: this.state.orgObj.primaryBusiness
                      })(
                        <Select placeholder='请输入主要业务'
                          onChange={this.valueChangeHandler.bind(this, 'primaryBusiness')}
                        >
                          {
                            this.state.paramsConfig.primaryBusiness.map(item => (
                              <Option key={ item }>{ item }</Option>
                            ))
                          }
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <div className={styles['row-line-gap']}></div>
                <Row>
                  <Col span={12}>
                    <FormItem label='主要客群' {...labelProps}>
                      {getFieldDecorator('customerGroup', {
                        rules: [{ required: true, message: '请输入主要客群' }, { max: 20, message: '不能超过20字' }],
                        initialValue: this.state.orgObj.customerGroup
                      })(
                        <Select placeholder='请输入主要客群'
                          onChange={this.valueChangeHandler.bind(this, 'customerGroup')}
                        >
                          {
                            this.state.paramsConfig.customerGroup.map(item => (
                              <Option key={ item }>{ item }</Option>
                            ))
                          }
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label='邮编' {...labelProps}>
                      {getFieldDecorator('distAreaCd', {
                        rules: [
                          { required: true, message: '请输入邮编' },
                          { max: 6, message: '请输入6位数邮编' },
                          { min: 6, message: '请输入6位数邮编' }
                        ],
                        initialValue: this.state.orgObj.distAreaCd
                      })(
                        <Input placeholder='请输入邮编'
                          onChange={this.valueChangeHandler.bind(this, 'distAreaCd')}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label='主要行业' {...labelProps}>
                      {getFieldDecorator('industry', {
                        rules: [{ required: true, message: '请输入主要行业' }, { max: 20, message: '不能超过20字' }],
                        initialValue: this.state.orgObj.industry
                      })(
                        <Select placeholder='请输入主要行业'
                          onChange={this.valueChangeHandler.bind(this, 'industry')}
                        >
                          {
                            this.state.paramsConfig.industry.map(item => (
                              <Option key={ item }>{ item }</Option>
                            ))
                          }
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label='机构地址' {...labelProps}>
                      {getFieldDecorator('address', {
                        rules: [{ required: true, message: '请输入机构地址' }, { max: 20, message: '不能超过20字' }
                      ],
                        initialValue: this.state.orgObj.address
                      })(
                        <Input placeholder='请输入机构地址'
                          onChange={this.valueChangeHandler.bind(this, 'address')}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  {/* <Col span={12}>
                    <FormItem label='机构状态' {...labelProps}>
                      {getFieldDecorator('status', {
                        rules: [{ required: true, message: '请输入机构状态' }, { max: 20, message: '不能超过20字' }],
                        initialValue: this.state.orgObj.status
                      })(
                        <Select placeholder='请输入机构状态'
                          onChange={this.valueChangeHandler.bind(this, 'status')}
                        >
                          <Option value='0'>无效</Option>
                          <Option value='1'>有效</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col> */}
                  <Col span={12}>
                    <FormItem label='联系电话' {...labelProps}>
                      {getFieldDecorator('tel', {
                        rules: [{ required: true, message: '请输入联系电话' }, { max: 20, message: '不能超过20字' }],
                        initialValue: this.state.orgObj.tel
                      })(
                        <Input placeholder='请输入联系电话'
                          onChange={this.valueChangeHandler.bind(this, 'tel')}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <div className={styles['row-line-gap']}></div>
                <Row>
                  <Col span={12}>
                    <FormItem label='负责人' {...labelProps}>
                      {getFieldDecorator('principal', {
                        rules: [{ required: true, message: '请输入负责人' }, { max: 20, message: '不能超过20字' }],
                        initialValue: this.state.orgObj.principal
                      })(
                        <Input placeholder='请输入负责人'
                          onChange={this.valueChangeHandler.bind(this, 'principal')}
                        />
                      )}
                    </FormItem>
                  </Col>
                  {/* <Col span={12}>
                    <FormItem label='失效日期' {...labelProps}>
                      {getFieldDecorator('expiryDate', {
                        // rules: [{ required: true, message: '请输入失效日期' }, { max: 20, message: '不能超过20字' }],
                        initialValue: this.state.orgObj.expiryDate
                      })(
                        <DatePicker placeholder='请输入失效日期'
                          onChange={this.valueChangeHandler.bind(this, 'expiryDate')}
                        />
                      )}
                    </FormItem>
                  </Col> */}
                </Row>
                {/* <Row>
                  <Col span={12}>
                    <FormItem label='生效日期' {...labelProps}>
                      {getFieldDecorator('effectiveDate', {
                        rules: [{ required: true, message: '请输入生效日期' }],
                        initialValue: this.state.orgObj.effectiveDate
                      })(
                        <DatePicker placeholder='请输入生效日期'
                          onChange={this.valueChangeHandler.bind(this, 'effectiveDate')}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row> */}
              </div>
            </div>
          </Form>
          <div className={styles['btns-area'] + ' clearfix'}>
            <Button
              className={styles['btn-submit  ']}
              style={{float:"right"}}
              type='primary'
              onClick={this.submitHandler.bind(this)}
              // disabled={!this.state.canSubmit}
            >
              {(!this.operation || this.operation === 'create') ? '确定' : '保存'}
            </Button>
            <Button style={{marginRight:8}} className={styles['btn-cancel']} onClick={() => {
              this.props.history.goBack()
            }}>取消</Button>



          </div>
        </div>
      </div>
    )
  }
}
const CreateOrEdit = Form.create()(CreateOrEditFrom)
export default withRouter(CreateOrEdit)
