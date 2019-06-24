import React from 'react'
import {Form, Row, Col, Select, Input, Button, DatePicker,Spin,message} from 'antd'
import queryString from 'query-string'
import {commonChangeHandler} from 'utils/antd'
import moment from 'moment'
import HzBreadcrumb from 'components/HzBreadcrumb'
import './component.scss'
import {dateFmt} from 'utils/timeFormat'
import closeIcon from './image/close.png'
import RelationOpportunity from 'components/RelationOpportunity'
import RelationCustomer from 'components/RelationCustomer'


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
      showRemindTime: false,
      remindTimeNum: 0,
      scheduleObj: {
        periodType: '',
        remindTime: undefined,
        remindFlag: false,
        remindType: 0,
        name: '',
        description: '',
        notifyUserIds:[]
      },
      createUserLoading:false,
      canSubmit: false,
      showAddCustomer: false,
      opportunityList: [],
      customerList: []
    }
    this._isCreate = false
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
      "description": this.initStatus,
      "endTime": this.initStatus,
      "notifyUserIds": this.initStatus,
      "periodValue": this.initStatus,
      "startTime": this.initStatus,
      "title": this.initStatus
    }
  }

  submitHandler() {

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }
      console.log(this.state.scheduleObj.notifyUserIds)
      let params = {
        "businessIds": this.state.opportunityList.map(item => {
          return item.id
        }),
        "customerKeys": this.state.customerList.map(item => {
          return item.objectKey
        }),
        "description": this.state.scheduleObj.description,
        "endTime": this.state.scheduleObj.endTime.format('YYYY-MM-DD HH:mm:ss'),
        "name": this.state.scheduleObj.name,
        "notifyUserIds": this.state.scheduleObj.notifyUserIds.join(","),
        "periodType": this.state.scheduleObj.periodType,
        "periodValue": 1,
        "remindFlag": this.state.remindTimeNum !== 0,
        "remindTime": undefined,
        "startTime": this.state.scheduleObj.startTime.format('YYYY-MM-DD HH:mm:ss'),
        "title": this.state.scheduleObj.title,
        remindType: this.state.remindTimeNum
      }
      let startTime = new Date(this.state.scheduleObj.startTime.format('YYYY/MM/DD HH:mm:ss'))
      switch (this.state.remindTimeNum) {
        case 0:
          break;
        case 1:
          params.remindTime = dateFmt(startTime, 'yyyy-MM-dd hh:mm:ss')
          break;
        case 2:
          params.remindTime = dateFmt(new Date(startTime.getTime() - 15 * 60 * 1000), 'yyyy-MM-dd hh:mm:ss')
          break;
        case 3:
          params.remindTime = dateFmt(new Date(startTime.getTime() - 30 * 60 * 1000), 'yyyy-MM-dd hh:mm:ss')
          break;
        case 4:
          params.remindTime = dateFmt(new Date(startTime.getTime() - 60 * 60 * 1000), 'yyyy-MM-dd hh:mm:ss')
          break;
        case 5:
          params.remindTime = this.state.scheduleObj.remindTime?this.state.scheduleObj.remindTime.format("YYYY-MM-DD hh:mm:ss"):""
          if(!params.remindTime){
            message.warning("提醒时间不能为空")
            return;
          }
          break;
        default:
          break;
      }

      if (this.operation === 'create') {
        if (!this._isCreate) {
          this._isCreate = true
          this.props.saveSchedule(params, () => {
            this._isCreate = false
            this.props.history.goBack()
          }, () => {
            this._isCreate = false
          })
        }
      } else {
        params.id = this.id
        this.props.updateSchedule(params, () => {
          this.props.history.goBack()
        })
      }
    })
  }

  valueChangeHandler(key, value) {

    commonChangeHandler(this, 'scheduleObj', key, value)
    setTimeout(() => {
      this.props.form.setFieldsValue({
        [key]: this.state.scheduleObj[key]
      })
    }, 0)

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

  remindTimeChange = (value) => {
    this.setState({
      remindTimeNum: value,
      showRemindTime: value === 5
    })
    this.validate('name')
  }

  remindTimePickerHandler = (value, dateString) => {
    this.setState({
      scheduleObj: Object.assign(this.state.scheduleObj, {remindTime: moment(value)})
    })
    this.validate('name')
  }

  createUserSearch = (value) => {
    this.props.getCreateUser(value)
  }

  createUserSelect = (value, option) => {
    this.valueChangeHandler('notifyUserIds', value)
  }

  opportunityDelete = (item) => {
    let result = this.state.opportunityList.filter(opportunity => {
      return opportunity.id !== item.id
    })
    this.validate('name')
    this.setState({
      opportunityList: result
    })
  }

  customerDelete = (item) => {
    let result = this.state.customerList.filter(customer => {
      return item.objectKey !== customer.objectKey
    })
    this.validate('name')
    this.setState({
      customerList: result
    })
  }


  relationConfirm = (list) => {
    this.validate('name')
    this.setState({
      opportunityList: list
    })
  }

  customerConfirm = (list) => {
    this.validate('name')
    this.setState({
      customerList: list
    })
  }


  componentWillMount() {
    if (this.queryObj.startTime) {
      this.setState({scheduleObj: Object.assign(this.state.scheduleObj, {startTime:  moment(this.queryObj.startTime)})})
    }
    this.props.getTitleParams({
      name: '日程主题',
      "pageNo": 1,
      "pageSize": 10
    })

    this.props.getCreateUser("",(res)=>{
      this.setState({
        createUserLoading:true
      })
    })
    if (this.operation === 'edit') {
      this.props.getScheduleDetail(this.id, (data) => {
        // this.props.getCreateUser("")
      })
    }
  }

  componentDidMount() {

  }

  componentWillReceiveProps({scheduleDetail, opportunityList}) {

    if (scheduleDetail !== this.props.scheduleDetail) {

      // 日期转化为时间戳格式
      ['startTime', 'endTime', 'remindTime'].forEach(dateKey => {
        if (scheduleDetail[dateKey]) {
          scheduleDetail[dateKey] = moment(scheduleDetail[dateKey])
        }
      })
      scheduleDetail.notifyUserIds=scheduleDetail.notifyUserIds?scheduleDetail.notifyUserIds.split(","):[]
      this.setState({
        scheduleObj: {...scheduleDetail},
        remindTimeNum: scheduleDetail.remindType,
        opportunityList: scheduleDetail.business,
        customerList: scheduleDetail.customers
      }, () => {
        this.opportunityRef.initCheckedList(scheduleDetail.business)
        this.customerRef.initCheckedList(scheduleDetail.customers)
      })
    }


  }

  render() {
    const {getFieldDecorator} = this.props.form
    const Option = Select.Option
    const {titleParams} = this.props
    return (
      <div className='schedule-createOrEdit-component'>
        <div className='breadcrumb-rea'>
          <HzBreadcrumb/>
        </div>
        <div className='form-wrap'>
          <Form className='form'>
            <div className='form-content'>
              <div className='form-title'>
                <span className='text'>{this.state.operationCnName}日程</span>
              </div>
              <div className='form-body'>
                <Row>
                  <Col span={12}>
                    <FormItem label='主题' {...labelProps}>
                      {getFieldDecorator('title', {
                        rules: [{required: true, message: '请选择日程主题'}],
                        initialValue: this.state.scheduleObj.title
                      })(
                        <Select
                          onChange={this.valueChangeHandler.bind(this, 'title')}
                          placeholder='请选择日程主题'
                        >
                          {titleParams.data[0] && titleParams.data[0].value.split(',').map((item) => {
                            return (
                              <Option value={item} key={item}>{item}</Option>
                            )
                          })}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label='日程名称' {...labelProps}>
                      {getFieldDecorator('name', {
                        rules: [{required: true, message: '请输入日程名称'}],
                        initialValue: this.state.scheduleObj.name
                      })(
                        <Input placeholder='请输入日程名称' onChange={this.valueChangeHandler.bind(this, 'name')}/>
                      )}
                    </FormItem>
                  </Col>
                </Row>


                <Row>
                  <Col span={12}>
                    <FormItem label='开始时间' {...labelProps}>
                      {getFieldDecorator('startTime', {
                        rules: [{required: true, message: '请选择日程开始时间'}],
                        initialValue: this.state.scheduleObj.startTime
                      })(
                        <DatePicker
                          format='YYYY-MM-DD HH:mm:ss'
                          showTime
                          placeholder="请选择日程开始时间"
                          onChange={this.valueChangeHandler.bind(this, 'startTime')}
                          onOk={this.valueChangeHandler.bind(this, 'startTime')}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label='结束时间' {...labelProps}>
                      {getFieldDecorator('endTime', {
                        rules: [{required: true, message: '请选择日程结束时间'}],
                        initialValue: this.state.scheduleObj.endTime
                      })(
                        <DatePicker
                          format='YYYY-MM-DD HH:mm:ss'
                          showTime
                          placeholder="请选择日程结束时间"
                          onChange={this.valueChangeHandler.bind(this, 'endTime')}
                          onOk={this.valueChangeHandler.bind(this, 'endTime')}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>


                <Row>
                  <Col span={12}>
                    {this.state.createUserLoading?<FormItem label='知会人' {...labelProps}>
                        {getFieldDecorator('notifyUserIds', {
                          // rules: [{required: true, message: '请搜索选择知会人'}],
                          initialValue: this.state.scheduleObj.notifyUserIds
                        })(
                          <Select
                            mode="multiple"
                            showSearch
                            style={{width: 200}}
                            placeholder="请搜索选择知会人"
                            optionFilterProp="children"
                            onSearch={this.createUserSearch}
                            onChange={this.createUserSelect}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          >
                            {this.props.createUser.data.map((user,index) => {
                              return (
                                <Option value={user.id+""} key={user.id+index}>{user.name}</Option>
                              )
                            })}
                          </Select>
                        )}
                      </FormItem>:
                      <FormItem label='知会人' {...labelProps}>
                        {getFieldDecorator('notifyUserIds', {
                          // rules: [{required: true, message: '请搜索选择知会人'}],
                          // initialValue: this.state.scheduleObj.notifyUserIds
                        })(
                          <Spin/>
                        )}
                      </FormItem>}
                  </Col>
                  <Col span={12}>
                    <FormItem label='重复周期' {...labelProps}>
                      {getFieldDecorator('periodValue', {
                        // rules: [{required: true, message: '请选择重复周期'}],
                        initialValue: this.state.scheduleObj.periodType||""
                      })(
                        // {<Input
                        //   type={'number'}
                        //   placeholder="请选择重复周期"
                        //   onChange={this.valueChangeHandler.bind(this, 'periodValue')}
                        //   style={{width: '50%'}}
                        // />
                        // }
                        <Select style={{width:120}}
                                onChange={this.valueChangeHandler.bind(this, 'periodType')}
                          // className='period-select'
                        >
                          <Option value=''>无</Option>
                          <Option value='month'>月</Option>
                          <Option value='quarter'>季度</Option>
                        </Select>
                      )}
                    </FormItem>

                  </Col>
                </Row>

                <Row>
                  <Col span={12}>
                    <FormItem label='日程描述' {...labelProps}>
                      {getFieldDecorator('description', {
                        rules: [{required: true, message: '请输入日程描述'}],
                        initialValue: this.state.scheduleObj.description
                      })(
                        <Input.TextArea
                          placeholder="请输入日程描述"
                          onChange={this.valueChangeHandler.bind(this, 'description')}
                          rows={6}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label='提醒时间' {...labelProps}>
                      {getFieldDecorator('remindType', {
                        rules: [{required: false, message: '请输入日程描述'}],
                        initialValue: this.state.remindTimeNum
                      })(
                        <Select
                          placeholder="请选择提醒时间"
                          onChange={this.remindTimeChange}
                        >
                          <Option value={0}>无</Option>
                          <Option value={1}>准时提醒</Option>
                          <Option value={2}>15分钟前</Option>
                          <Option value={3}>30分钟前</Option>
                          <Option value={4}>1小时前</Option>
                          <Option value={5}>自定义</Option>
                        </Select>
                      )}
                      {this.state.remindTimeNum === 5 && <DatePicker
                        style={{display:"block",marginTop:10}}
                        defaultValue={this.state.scheduleObj.remindTime}
                        format='YYYY-MM-DD HH:mm:ss'
                        showTime
                        placeholder="请选择提醒时间"
                        onChange={this.remindTimePickerHandler}
                        onOk={this.remindTimePickerHandler}
                        // className='remind-time-select'
                      />}
                    </FormItem>

                  </Col>
                </Row>


              </div>
            </div>
          </Form>
        </div>


        <RelationCustomer
          type="schedule"
          onRef={(ref) => {
            this.customerRef = ref
          }}
          confirm={this.customerConfirm}
          deleteHandler={(item) => {
            this.customerDelete(item)
          }}
        />

        <RelationOpportunity
          onRef={(ref) => {
            this.opportunityRef = ref
          }}
          confirm={this.relationConfirm}
          deleteHandler={(item) => {
            this.opportunityDelete(item)
          }}
        />

        <div className='btn-wrap clearfix'>
          <div className='btns-area clearfix'>

            <Button className='btn-cancel' onClick={() => {
              this.props.history.goBack()
            }}>取消</Button>
            <Button
              className='btn-submit  '
              type='primary'
              onClick={this.submitHandler.bind(this)}
              /* disabled={!this.state.canSubmit}*/
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
