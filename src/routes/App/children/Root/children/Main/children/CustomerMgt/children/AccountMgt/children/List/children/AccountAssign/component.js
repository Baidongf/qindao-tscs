import React from 'react'
import './component.scss'
import Popup from 'components/Popup'
import { Button, Select, message, InputNumber, Spin } from 'antd'
import { fetchData } from 'utils/dataAccess/axios'
import addIcon from './images/add-icon.svg'
import removeIcon from './images/remove-icon.svg'
const Option = Select.Option
class AccountAssign extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      popupVisible: false,
      companyName: '',
      accountCode: '',
      // 添加的客户经理
      // 初始化有一个，至少有一个
      managers: [{
        renderKey: 0,
      }],


      isShowPercentWarning: false,

      CustomerManagersArr: [] // 客户经理数据
    }

    this.initManagers = [] // 保存初始状态客户已分配的客户经理
    this.managerRenderKey = 0

    this.showCustomPopup = this.showCustomPopup.bind(this)
    this.addManager = this.addManager.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
    this.searchCustomerManagers = this.searchCustomerManagers.bind(this)
    this.valueChangeHandler = this.valueChangeHandler.bind(this)
  }

  showCustomPopup(ev) {
    ev.preventDefault()
    ev.stopPropagation()

    // 这里拿到公司的 companyKey
    const {
      companyKey,
      companyName,
      accountCode,
    } = this.props

    this.setState({
      popupVisible: true,
      companyName,
      accountCode,
    })

    this.initManagers = [].concat(this.state.managers)
  }

  handleCancel(e) {
    e.stopPropagation()
    this.setState({
      popupVisible: false,
      managers: this.initManagers,
     })
  }

  // 点击确定按钮
  handleConfirm(e) {
    e.stopPropagation()
    const requestData = []
    const { companyKey, accountCode, okCallback } = this.props
    const { managers } = this.state
    managers.forEach((manager, i) => {
      if (manager.managerId) {
        if(!manager.percent){
          message.warning(`请输入第${i}个占比`)
          return
        }
        requestData.push({
          companyKey,
          account: accountCode,
          userId: manager.managerId,
          persent: manager.percent,
        })
      } else {  // 没有选择客户经理
        message.warning(`请选择第${i}个客户经理`)
        return false
      }
    })

    if (!this.checkPercent()) {
      // 检查输入的百分比是否等于100%
      return false
    }


    // TODO: 账户分配接口调用 / 回调后交互处理
    this.props.distributeAccount(accountCode, requestData, () => {
      message.success('账户分配成功')
      this.setState({ popupVisible: false }, okCallback && okCallback())
    })
  }

  stopPropagation(e) {
    e.stopPropagation()
  }

  // 添加客户经理
  addManager() {
    const _this = this
    const managers = this.state.managers
    this.setState({
      managers: [...managers, {
        renderKey: ++_this.managerRenderKey,
      }]
    })
  }

  // 删除客户经理
  removeManager(managerRenderKey) {
    const managers = this.state.managers.slice(0)
    const length = managers.length
    for (let i = 0; i < length; i++) {
      if (managers[i].renderKey === managerRenderKey) {
        managers.splice(i ,1)
        i = length
      }
    }
    this.setState({ managers })
    setTimeout(() => {
      this.checkPercent()
    }, 0)
  }


  // 百分比变化处理函数
  percentChangeHandler(managerRenderKey, percent) {
    let sum = 0
    let isShowPercentWarning = false
    const managers = this.state.managers.slice(0)
    const length = managers.length
    for (let i = 0; i < length; i++) {
      if (managers[i].renderKey === managerRenderKey) {
        managers[i].percent = percent
        i = length
      }
    }

    // 检验是否超过100%
    for (let j = 0; j < length; j++) {
      sum += managers[j].percent
      if (sum > 100) {
        isShowPercentWarning = true
      }
    }

    this.setState({
      managers,
      isShowPercentWarning,
    })
  }

  // 检查用户输入的百分比是否合法
  checkPercent() {
    const { managers } = this.state
    const length = managers.length
    let total = 0
    let result = true
    for (let i = 0; i < length; i++) {
      total += managers[i].percent
      if (total > 100) {
        message.error('分配占比总和超过100%')
        i = length
        result = false
      }
      this.setState({ isShowPercentWarning: !result })

      if (i === length - 1 && total < 100) {
        message.info('分配占比总和必须等于100%')
        result = false
      }
    }
    return result
  }

  componentDidMount() {
    // 如果全部数据是空，则直接结束搜索
    console.log('this.props: ', this.props)
    if (this.props.allManagers.data.length < 1) {
      this.props.getAllManagers()
    }
    fetchData({
      url: `/crm-fd/api/allocationCustomer/findAccount/${this.props.accountCode}`,
    }).then((res) => {
      if(res.data.success){
        const accountManager = []
        res.data.payload.data && res.data.payload.data.forEach((manager, index) => {
          accountManager.push({
            renderKey: index,
            managerId : manager.userId,
            managerName: manager.userName,
            percent: manager.persent
          })
        })
        this.managerRenderKey = accountManager.length
        this.setState({managers: accountManager})
      }
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
  valueChangeHandler(index, value) {
    const newManagers = [].concat(this.state.managers)
    newManagers[index].managerId = value
    this.setState({managers: newManagers})
  }
  searchCustomerManagers(userInput) {
    this.setState((preState, props) => ({
      CustomerManagersArr: props.allManagers.data.filter((manager) => {
        return manager.name.indexOf(userInput) > -1 || (manager.id+'').indexOf(userInput) > -1
      }).slice(0, 10)
    }))
  }
  render() {
    const {
      popupVisible,
      companyName,
      accountCode,
      managers,
      isShowPercentWarning,
      CustomerManagersArr
    } = this.state
    return (
      <div
        className='account-operation-component'
        onClick={this.stopPropagation.bind(this)}
      >
        <Popup
          visible={popupVisible}
          title={'账户分配'}
          width={866}
          mask={true}
          onCancel={this.handleCancel}
          onOk={this.handleConfirm}
          className='account-assign-popup'
        >
          <div className='account-assign-content'>

            {/* 只读信息展示区 start */}
            <div className='line-container'>
              <span className='line-left'>客户名称</span>
              <span className='line-right'>{companyName || '--'}</span>
            </div>

            <div className='line-container'>
              <span className='placeholder-span'>账户</span>
              <span className='line-left'>账号</span>
              <span className='line-right'>{accountCode}</span>
            </div>
            {/* 只读信息展示区 end */}

            {/* 客户经理动态添加区 start */}
            <div className='line-container'>
              <span className='line-left left-label-fixed'>客户经理</span>
              <span className='line-right line-right-container'>

                {
                  managers.map((manager, index, managers) => {
                    return (
                      <div
                        className='cascader-container'
                        key={manager.renderKey}
                        renderkey={manager.renderKey}
                      >
                        <span>
                          <Select
                            allowClear
                            showSearch
                            showArrow={false}
                            placeholder='请输入客户经理名字或工号'
                            defaultValue={manager.managerName}
                            onChange={this.valueChangeHandler.bind(this, index)}
                            onSearch={this.debounce(this.searchCustomerManagers, 500)}
                            className='input-customer-manager'
                            filterOption={false}
                          >
                            {
                              CustomerManagersArr.map(manager => {
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

                          <InputNumber
                            className='percent-input'
                            min={0}
                            max={100}
                            defaultValue={manager.percent}
                            formatter={value => `${value}%`}
                            parser={value => value.replace('%', '')}
                            onChange={this.percentChangeHandler.bind(this, manager.renderKey)}
                          />
                        </span>
                        {
                          managers.length > 1 ?
                          <span
                            className='remove-manager'
                            onClick={this.removeManager.bind(this, manager.renderKey)}
                          >
                            <img alt='' className='icon' src={removeIcon} />
                          </span> : null
                        }
                      </div>
                    )
                  })
                }

                <div>
                  <div
                    className='add-manager-area'
                  >
                    <span className='add-click-area' onClick={this.addManager}>
                      <img className='icon' alt='' src={addIcon} />
                      <span className='wording'>添加客户经理</span>
                    </span>
                    {
                      isShowPercentWarning ?
                      <span
                      className='warning'
                      onClick={(ev)=>{ev.stopPropagation()}}
                    >*比例综合超过100%，请重新输入</span> : null
                    }
                  </div>
                </div>
              </span>
            </div>
            {/* 客户经理动态添加区 end */}

          </div>
        </Popup>
        <Button className='account-assign' onClick={this.showCustomPopup}>分配</Button>
      </div>
    )
  }
}

export default AccountAssign
