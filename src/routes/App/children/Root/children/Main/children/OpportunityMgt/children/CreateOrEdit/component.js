import React from 'react'
import './component.scss'
import { withRouter } from 'react-router-dom'
import { Button, Form, Row, Col, Select, Input, Spin, message } from 'antd'
import { commonChangeHandler } from 'utils/antd'
import HzBreadcrumb from 'components/HzBreadcrumb'
import RelateSchedulePanel from 'components/RelateSchedule'
import RelateCustomerPanel from 'components/RelationCustomer'

const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input
const labelProps = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
}

class CreateOrEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      opportunityObj: {},
      canSubmit: false,

      foundCompanies: [], // “客户名称”输入框 根据用户输入进行搜索
      fetchingCompany: false, // 控制“客户名称” 输入框的搜索状态

      foundCustomerManagers: [], // “跟进人”输入框根据用户的输入在全部数据中搜到的数据

      foundCollaborators: [], // “协同人”输入框 根据用户输入进行搜索

      workScheduleIds: [], // 选择的日程id
      customerKeys: [], // 选择的客户key

    }

    this.operation = this.getQueryString('operation')
    this.fromFollow = this.getQueryString('fromFollow')
    this.id = this.getQueryString('id')
    this.initStatus = (this.operation === 'edit' || this.operation === 'follow')
    this.fieldsValidateStatus = {
      name: this.initStatus,
      // customerType: this.initStatus,
      // customerKey: this.initStatus,
      followUserId: true, // 默认是当前用户，所以不校验这项
      synergyUserIds: this.initStatus,
      status: true, // 默认选中“新建”，所以这里不用校验这项
      type: this.initStatus,
      description: this.initStatus,
    }

    this.debounce = this.debounce.bind(this)
    this.searchCustomerManagers = this.searchCustomerManagers.bind(this)
    this.searchCustomers = this.searchCustomers.bind(this)
    this.searchCollaborator = this.searchCollaborator.bind(this)
    this.submitHandler = this.submitHandler.bind(this)

    // 关联日程相关事件
    this.handleSchedulePopupConfirm = this.handleSchedulePopupConfirm.bind(this)
    this.handleSchedulePanelDelete = this.handleSchedulePanelDelete.bind(this)

    // 关联客户相关事件
    this.handleCustomerPopupConfirm = this.handleCustomerPopupConfirm.bind(this)
    this.handleCustomerPanelDelete = this.handleCustomerPanelDelete.bind(this)
  }

  componentWillMount() {
    const operation = this.getQueryString('operation')
    this.operation = operation
    const fromFollow = this.getQueryString('fromFollow')
    this.fromFollow = fromFollow
    // 初始化商机状态
    if (operation === 'create') {
      this.setState({
        opportunityObj: {
          status: 0
        }
      })
    }
  }

  getQueryString(key) {
    const reg = new RegExp(`(^|&)${key}=([^&]*)(&|$)`, 'i')
    const value = this.props.location.search.substr(1).match(reg)
    if (value != null) return unescape(value[2])
    return null
  }

  submitHandler() {
    const opportunityObj = Object.assign({}, this.state.opportunityObj)
    const { workScheduleIds, customerKeys } = this.state
    const { id } = this
    opportunityObj.workScheduleIds = workScheduleIds
    opportunityObj.customerKeys = customerKeys

    // 如果有id，是编辑商机(传id)，否则是新建商机(不传id)
    if (!!id) {
      opportunityObj.id = id
    }

    // 至少关联一个客户
    if ( customerKeys.length === 0 ) {
      message.error('必须关联至少一个客户')
      return false;
    }

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        console.log(err)
        return false
      }

      if (this.operation === 'edit' || this.operation === 'follow') {
        this.props.updateOpportunity(opportunityObj, () => {
          this.props.history.goBack()
        })
      } else if (this.operation === 'create') {
        opportunityObj.status = 0
        this.props.createOpportunity(opportunityObj, () => {
          this.props.history.goBack()
        })
      }

    })
  }

  valueChangeHandler(key, value) {
    commonChangeHandler(this, 'opportunityObj', key, value)
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
        return false
      }
    }
    this.setState({
      [stateKey]: true
    })
  }

  // 防抖
  debounce(fn, delay) {
    return function (args) {
      let that = this
      clearTimeout(fn.id)
      fn.id = setTimeout(function () {
        fn.call(that, args)
      }, delay)
    }
  }

  // 搜索客户（搜索公司）
  searchCustomers(userInput) {
    this.setState({
      foundCompanies: [],
      fetchingCompany: true,
    })

    this.props.searchCustomers(userInput).then(() => {
      const foundCompanies = this.props.searchedCustomers.data
      this.setState({
        foundCompanies,
        fetchingCompany: false
      })
    }).catch(() => {
      this.setState({
        foundCompanies: [],
        fetchingCompany: false
      })
    })
  }


  // 搜索协同人(搜索范围：同级和辖内的客户经理)
  searchCollaborator(userInput) {
    this.setState((preState, props) => ({
      foundCollaborators: props.allManagers.data.filter((manager) => {
        return manager.name.indexOf(userInput) > -1
      }).slice(0, 10)
    }))
  }


  // 搜索客户经理(在 prop 的 allManagers 中搜)
  searchCustomerManagers(userInput) {
    this.setState((preState, props) => ({
      foundCustomerManagers: props.allManagers.data.filter((manager) => {
        return manager.name.indexOf(userInput) > -1
      }).slice(0, 10)
    }))
  }


  componentDidMount() {
    // 1.获取辖内的所有客户经理
    // 2.获取同级的客户经理
    const institutionId = parseInt(localStorage.getItem('INSTITUTION_ID'))
    Promise.all([
      this.props.getAllManagers(),
      this.props.getInstitutionManagers(institutionId),
    ]).then(() => {
      // 如果是编辑/跟进商机，获取当前商机的信息
      if (this.operation === 'edit' || this.operation === 'follow') {
        const id = this.id
        this.props.getOpportunityDetail(id,(opportunityDetail)=>{

          this.setState({
            opportunityObj:{...opportunityDetail}
          })
        })
      }
    })
  }

  componentWillReceiveProps({ allManagers, opportunityDetail }) {
    if (allManagers !== this.props.allManagers) {
      // 先只展示前20个跟进人选项（客户经理）
      this.setState({
        foundCustomerManagers: [
          // ...allManagers.data.slice(0, 20),
          {
            // 需要把当前用户放进来，不然无法正确的渲染默认 id 为当前用户 id 的情况
            id: parseInt(localStorage.getItem('USER_ID')),
            name: localStorage.getItem('USER_NAME'),
          }
        ]
      }, () => {
        // 如果是新建页面，初始化跟进人为当前用户
        if (this.operation === 'create') {
          const userId = parseInt(localStorage.getItem('USER_ID'))
          this.setState({
            opportunityObj: {
              followUserId: userId
            }
          })
        }

      })
    }


    // 编辑页面时获取到的商机详情
    if (opportunityDetail !== this.props.opportunityDetail) {
      // make synergyUserIds from synergyUsers
      const {
        synergyUsers,
        followUserId,
        followUserName,
        customerName,
        customerKey,
      } = opportunityDetail
      const synergyUserIds = synergyUsers.map(user => user.userId)

      // 需要把获得的跟进人数据和协同人的数据 push 到对应 Select 组件的 Option 数据中，不然无法渲染
      const foundCustomerManagers = [{ id: followUserId, name: followUserName }]
      const foundCollaborators = synergyUsers.map(user => ({
        id: user.userId,
        name: user.userName
      }))
      const foundCompanies = [{ name: customerName, objectKey: customerKey }]

      if(opportunityDetail.customers){
        let customerKeys = []
        for (var item in opportunityDetail.customers){
          customerKeys.push(opportunityDetail.customers[item].objectKey)
        }
        this.setState({
          customerKeys
        })
      }
      this.setState({
        foundCustomerManagers,
        foundCollaborators,
        foundCompanies,
        opportunityObj: {
          ...opportunityDetail,
          synergyUserIds,
          customerKey
        }
      })
    }
  }


  // 关联日程弹窗点击确定的回调
  handleSchedulePopupConfirm(checkedSchedules) {
    const workScheduleIds = checkedSchedules.map(schedule => {
      return schedule.id
    })
    this.setState({ workScheduleIds })
  }


  // 关联日程面板点删除按钮
  handleSchedulePanelDelete(deletedSchedule) {
    const deletedId = deletedSchedule.id
    const preWorkScheduleIds = this.state.workScheduleIds
    const workScheduleIds = preWorkScheduleIds.filter(id => {
      return id !== deletedId
    })
    this.setState({ workScheduleIds })
  }

  // 关联客户弹窗点击确定的回调
  handleCustomerPopupConfirm(checkedCustomers) {
    const customerKeys = checkedCustomers.map(customer => {
      return customer.objectKey
    })
    this.setState({ customerKeys })
  }

  // 关联客户面板点删除按钮
  handleCustomerPanelDelete(deletedCustomer) {
    const deletedKey = deletedCustomer.objectKey
    const preCustomerKeys = this.state.customerKeys
    const customerKeys = preCustomerKeys.filter(key => {
      return key !== deletedKey
    })
    this.setState({ customerKeys })
  }


  render() {

    const { getFieldDecorator } = this.props.form
    const {
      canSubmit,
      foundCustomerManagers,
      fetchingCompany,
      foundCompanies,
      foundCollaborators,
      opportunityObj
    } = this.state
    console.log(this.state.opportunityObj.name)
    return (
      <div className='opportunity-create-or-edit-component'>
        <HzBreadcrumb />

        {/* 商机信息区 start */}
        <div className='main-body'>
          <Form className='form'>
            <div className='form-content'>

              <div className='form-title'>
                <span className='text'>
                  {
                    this.operation === 'create' ? '新建商机' :
                      (this.operation === 'edit' ? '编辑商机' :
                        (this.operation === 'follow' ? '跟进商机' : '商机')
                      )
                  }
                </span>
              </div>

              <div className='form-body'>

                {/* 商机名称 */}
                <Row>
                  <Col span={12}>
                    <FormItem label='商机名称' {...labelProps}>
                      {
                        getFieldDecorator('name', {
                          rules: [{ required: true, message: '请输入商机名称' }, { max: 100, message: '不能超过100字' }],
                          initialValue: opportunityObj.name
                        })(
                          <Input placeholder='请输入商机名称'
                            onChange={this.valueChangeHandler.bind(this, 'name')}
                            disabled={this.operation === 'edit' || this.operation === 'follow'}
                          />
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>

                <Row>
                  {/* 客户类型 */}
                  {/* <Col span={12}>
                    <FormItem label='客户类型' {...labelProps}>
                      {
                        getFieldDecorator('customerType', {
                          rules: [{ required: true, message: '请选择客户类型' }, { max: 20, message: '不能超过20字' }],
                          initialValue: this.state.opportunityObj.customerType
                        })(
                          <Select placeholder='请选择客户类型'
                            onChange={this.valueChangeHandler.bind(this, 'customerType')}
                            disabled={this.operation === 'edit' || this.operation === 'follow'}
                          >
                            <Option value='0'>行内</Option>
                            <Option value='1'>行外</Option>
                          </Select>
                        )
                      }
                    </FormItem>
                  </Col> */}

                  {/* 客户名称 */}
                  <Col span={12}>
                    {/* <FormItem label='客户名称' {...labelProps}>
                      {
                        getFieldDecorator('customerKey', {
                          rules: [{ required: true, message: '请输入客户名称' }],
                          initialValue: this.state.opportunityObj.customerKey
                        })(
                          <Select
                            allowClear
                            showSearch
                            showArrow={false}
                            placeholder='请输入客户名称'
                            notFoundContent={fetchingCompany ? <Spin size="small" /> : null}
                            onChange={this.valueChangeHandler.bind(this, 'customerKey')}
                            onSearch={this.debounce(this.searchCustomers, 500)}
                            className='input-item'
                            filterOption={false}
                            disabled={this.operation === 'edit' || this.operation === 'follow'}
                          >
                            {
                              foundCompanies.map(company => {
                                return (
                                  <Option
                                    key={company.objectKey}
                                    value={company.objectKey}
                                    title={company.name}
                                  >{company.name}</Option>
                                )
                              })
                            }
                          </Select>
                        )
                      }
                    </FormItem> */}
                  </Col>
                </Row>

                <div className='row-line-gap'></div>

                <Row>
                  <Col span={12}>
                    <FormItem label='跟进人' {...labelProps}>
                      {
                        getFieldDecorator('followUserId', {
                          rules: [{ required: true, message: '请输入跟进人' }],
                          initialValue: this.state.opportunityObj.followUserId
                        })(
                          <Select
                            allowClear
                            showSearch
                            showArrow={false}
                            placeholder='请输入跟进人'
                            onChange={this.valueChangeHandler.bind(this, 'followUserId')}
                            onSearch={this.debounce(this.searchCustomerManagers, 500)}
                            className='input-item'
                            filterOption={false}
                            disabled={this.operation === 'create'&&this.fromFollow === 'true'}
                          >
                            {
                              foundCustomerManagers.map(manager => {
                                return (
                                  <Option
                                    key={manager.id}
                                    value={manager.id}
                                    title={manager.name}
                                  >{manager.name}</Option>
                                )
                              })
                            }
                          </Select>
                        )
                      }
                    </FormItem>
                  </Col>

                  <Col span={12}>
                    <FormItem label='协同人' {...labelProps}>
                      {
                        getFieldDecorator('synergyUserIds', {
                          initialValue: opportunityObj.synergyUserIds
                        })(
                          <Select
                            mode='multiple'
                            allowClear
                            showSearch
                            showArrow={false}
                            placeholder='请输入协同人'
                            onChange={this.valueChangeHandler.bind(this, 'synergyUserIds')}
                            onSearch={this.debounce(this.searchCollaborator, 500)}
                            className='input-item'
                            filterOption={false}
                          >
                            {
                              foundCollaborators.map(collaborator => {
                                return (
                                  <Option
                                    key={collaborator.id}
                                    value={collaborator.id}
                                    title={collaborator.name}
                                  >{collaborator.name} </Option>
                                  // {collaborator.id}
                                )
                              })
                            }
                          </Select>
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>

                {/* <Row> */}

                  {/* <Col span={12}>
                    <FormItem label='商机状态' {...labelProps}>
                      {
                        getFieldDecorator('status', {
                          rules: [{ required: true, message: '请选择商机状态' }],
                          initialValue: this.operation === 'create' ?
                            0 : this.state.opportunityObj.status
                        })(
                          <Select placeholder='请选择商机状态'
                            onChange={this.valueChangeHandler.bind(this, 'status')}
                            disabled={
                              this.operation === 'create'
                              ||((this.operation === 'edit')
                              &&localStorage['USER_ID']
                              &&localStorage['USER_ID'] === this.state.opportunityObj.followUserId)
                            }
                          >
                            <Option value={0}>新建</Option>
                            <Option value={1}>沟通</Option>
                            <Option value={2}>完成</Option>
                            <Option value={3}>终止</Option>
                          </Select>
                        )
                      }
                    </FormItem>
                  </Col> */}
                <Row>
                <Col span={12}>
                    <FormItem label='商机描述' {...labelProps}>
                      {
                        getFieldDecorator('description', {
                          rules: [{ required: true, message: '请填写标签的描述信息' }, { max: 50, message: '不能超过50字' }],
                          initialValue: opportunityObj.description
                        })(
                          <TextArea
                            placeholder='请输入标签备注，最多不超过50个字'
                            style={{ width: 420, height: 100 }}
                            onChange={this.valueChangeHandler.bind(this, 'description')}
                          >
                          </TextArea>
                        )
                      }
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label='商机类型' {...labelProps}>
                      {
                        getFieldDecorator('type', {
                          rules: [{ required: true, message: '请选择商机类型' }, { max: 20, message: '不能超过20字' }],
                          initialValue: opportunityObj.type
                        })(
                          <Select placeholder='请选择商机类型'
                            onChange={this.valueChangeHandler.bind(this, 'type')}
                            disabled={this.operation === 'edit' || this.operation === 'follow'}
                          >
                            <Option value='业务到期'>业务到期</Option>
                            <Option value='企业注册'>企业注册</Option>
                            <Option value='供应链业务'>供应链业务</Option>
                            <Option value='融资需求'>融资需求</Option>
                            <Option value='投资需求'>投资需求</Option>
                            <Option value='咨询顾问'>咨询顾问</Option>
                          </Select>
                        )
                      }
                    </FormItem>
                  </Col>

                {/* </Row>

                <Row> */}

                </Row>
              </div>


            </div>
          </Form>
        </div>
        {/* 商机信息区 end */}

        {/* 关联日程 */}
        <RelateSchedulePanel
          relateWith='business'
          relateKey={this.id}
          oneCheck={false}
          relateOneByOne={false}
          multipleEdit={this.operation !== 'create'}
          confirm={this.handleSchedulePopupConfirm}
          deleteHandler={this.handleSchedulePanelDelete}
        />

        {/* TODO: 关联客户 */}
        <RelateCustomerPanel
          onRef={(ref) => {
            this.customerRef = ref
          }}
          confirm={this.handleCustomerPopupConfirm}
          deleteHandler={this.handleCustomerPanelDelete}
          opportunityObj={opportunityObj}
          customerKeys={this.state.customerKeys}
          changeOpportunityObj = {(curCustomerList)=>{
            let opportunityObj = Object.assign({},this.state.opportunityObj,{customers:curCustomerList})
            this.setState({
              opportunityObj
            })
              // let customerKeys = [].concat()
          }}
        />

        <div className='operation-area'>
          <Button
            type='primary'
            className='buttons'
            // disabled={!canSubmit}
            onClick={this.submitHandler}
          >确定</Button>

          <Button
            type='default'
            className='buttons'
            onClick={() => {
              this.props.history.goBack()
            }}
          >取消</Button>
        </div>

      </div>
    )
  }
}

const CreateOrEditForm = Form.create()(CreateOrEdit)
export default withRouter(CreateOrEditForm)
