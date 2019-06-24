import React from 'react'
import './component.scss'
import Popup from 'components/Popup'
import { fetchData } from 'utils/dataAccess/axios'
import { Button, Select, message, Icon } from 'antd'
import addIcon from './images/add-icon.svg'
import removeIcon from './images/remove-icon.svg'

const Option = Select.Option
class CustomerAssign extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      popupVisible: false,
      companyName: '',
      companyCode: '',

      // 添加的客户经理
      // 初始化有一个，至少有一个
      managers: [{
        renderKey: 0,
      }],

      // 模糊搜索 客户经理数据
      CustomerManagersArr: []
    }

    this.managerRenderKey = 0
    this.initManagers = []
    this.showCustomPopup = this.showCustomPopup.bind(this)
    this.addManager = this.addManager.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
    this.valueChangeHandler = this.valueChangeHandler.bind(this)
    this.searchCustomerManagers = this.searchCustomerManagers.bind(this)
  }

  showCustomPopup(ev) {
    ev.preventDefault()
    ev.stopPropagation()

    // 这里拿到公司的 companyKey
    const {
      companyKey,
      companyName,
      companyCode,
    } = this.props

    this.setState({
      popupVisible: true,
      companyName,
      companyCode,
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
    const { companyKey } = this.props
    const { managers } = this.state
    managers.forEach((manager) => {
      if (manager.managerId) {
        requestData.push({
          companyKey,
          userId: manager.managerId,
        })
      }
    })

    if (requestData.length === 0) {
      // 没有选择客户经理
      message.warning('请选择客户经理')
      return false
    }

    this.props.distributeCustomer(companyKey, requestData, () => {
      message.success('客户分配成功')
      this.setState({ popupVisible: false })
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
  componentWillMount() {}

  componentDidMount() {
    if (this.props.allManagers.data.length < 1) {
      this.props.getAllManagers()
    }
    fetchData({url: `/crm-fd/api/allocationCustomer/findCustomer/${this.props.companyKey}`}).then((res) => {
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


  render() {
    const {
      popupVisible,
      companyName,
      companyCode,

      managers,
      CustomerManagersArr,
    } = this.state

    return (
      <div
        className='cust-operation-component'
        onClick={this.stopPropagation.bind(this)}
      >
        <Popup
          visible={popupVisible}
          title={'客户分配'}
          width={866}
          mask={true}
          onCancel={this.handleCancel}
          onOk={this.handleConfirm}
          className='customer-assign-popup'
        >
          <div className='customer-assign-content'>

            {/* 只读信息展示区 start */}
            <div className='line-container'>
              <span className='line-left'>客户名称</span>
              <span className='line-right'>{companyName}</span>
            </div>

            <div className='line-container'>
              <span className='line-left'>客户编号</span>
              <span className='line-right'>{companyCode}</span>
            </div>
            {/* 只读信息展示区 end */}

            {/* 客户经理动态添加区 start */}
            <div className='line-container'>
              <span className='line-left left-label-fixed'>客户经理</span>
              <span className='line-right line-right-container'>
                <div className='cascader-area'>
                {
                  managers.map((manager, index, managers) => {
                    return (
                      <div
                        className='cascader-container'
                        key={manager.renderKey}
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
                        </span>
                        {
                          managers.length > 1 ?
                          <span
                            className='remove-manager'
                            onClick={this.removeManager.bind(this, manager.renderKey)}
                          >
                            <Icon type="minus-circle" className='minus-icon'/>
                          </span> : null
                        }
                      </div>
                    )
                  })
                }
                </div>

                <div>
                  <div
                    className='add-manager-area'
                    onClick={this.addManager}
                  >
                    <Icon type="plus-circle" className='plus-icon' />
                    <span className='wording'>添加客户经理</span>
                  </div>
                </div>
              </span>
            </div>
            {/* 客户经理动态添加区 end */}

          </div>
        </Popup>
        <Button className='customer-assign' onClick={this.showCustomPopup}>分配</Button>
      </div>
    )
  }
}

export default CustomerAssign
