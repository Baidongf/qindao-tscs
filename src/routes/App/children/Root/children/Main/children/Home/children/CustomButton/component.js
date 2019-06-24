import React from 'react'
import './component.scss'
import fragmentIconSvg from './images/fragment-icon.svg'
import Popup from 'components/Popup'
import { Switch } from 'antd'

class CustomButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      popupVisible: false,
      switchers: [
        {
          key: 'customerInfo',
          wording: '客户信息',
          id: 23250,
          resourceId: 24,
        }, {
          key: 'customerActivity',
          wording: '客户动态',
          id: 23253,
          resourceId: 48,
        }, {
          key: 'businessOpportunity',
          wording: '商机管理',
          id: 23255,
          resourceId: 56,
        }, {
          key: 'workSchedule',
          wording: '工作日程',
          id: 23252,
          resourceId: 47,
        }, {
          key: 'marketingActivity',
          wording: '营销活动',
          id: 23256,
          resourceId: 62,
        }, {
          key: 'knowledgeBase',
          wording: '知识库',
          id: 23261,
          resourceId: 85,
        }, {
          key: 'marketingResults',
          wording: '营销成果',
          id: 23259,
          resourceId: 76,
        },
      ],


      isModuleShow: {
        customerInfo: false,
        customerActivity: false,
        businessOpportunity: false,
        workSchedule: false,
        marketingActivity: false,
        knowledgeBase: false,
        marketingResults: false,
      }
    }

    this.switchValue = true

    this.showCustomPopup = this.showCustomPopup.bind(this)
    this.handleSwitchChange = this.handleSwitchChange.bind(this)
    this.handleSwitcherClick = this.handleSwitcherClick.bind(this)

    this.handleCancel = this.handleCancel.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)

  }

  showCustomPopup() {
    this.setState({ popupVisible: true })
  }

  handleCancel(ev) {
    ev.stopPropagation()
    this.setState({ popupVisible: false })
  }

  handleConfirm(ev) {
    ev.stopPropagation()
    const { isModuleShow, switchers } = this.state
    const data = []
    const moduleKeys = Object.keys(isModuleShow)
    const switchersLength = switchers.length
    moduleKeys.forEach((moduleKey) => {
      if (isModuleShow[moduleKey]) {
        let resourceId
        for (let i = 0; i < switchersLength; i++) {
          if (moduleKey === switchers[i].key) {
            resourceId = switchers[i].resourceId
            i = switchersLength
          }
        }

        data.push({
          resourceId,
          sort: 0,
        })
      }
    })

    this.props.updateHomeModules(data, () => {
      // 前端更新首页数据模块列表
      this.props.deliverHomeModules({ data })
      this.setState({ popupVisible: false })
    })


  }

  handleSwitchChange(checked) {
    this.switchValue = checked
  }

  handleSwitcherClick(ev) {
    ev.stopPropagation()
    const target = ev.currentTarget.id
    const value = this.switchValue
    const prevState = this.state.isModuleShow;
    const change = {}
    if (value !== prevState[target]) {
      change[target] = value;
      const state = Object.assign(prevState, change)
      this.setState({ isModuleShow: state })
    }
  }

  initSwitchers(homeModules) {
    const { switchers, isModuleShow } = this.state
    const length = homeModules.data.length
    for (let i = 0; i < switchers.length; i++) {
      let resourceId = switchers[i].resourceId
      let key = switchers[i].key
      for (let j = 0; j < length; j++) {
        if (resourceId === homeModules.data[j].resourceId) {
          isModuleShow[key] = true
        }
      }
    }
    this.setState({ isModuleShow })
  }

  initSwitcherState() {
    // 根据用户拥有的模块权限，决定展示哪些模块的 switchers
    const permission = this.props.userPermission.data
    const switchers = []

    const length = permission.length
    for (let i = 0; i < length; i++) {
      if (permission[i].id === 1) {
        switchers.push({
          key: 'customerInfo',
          wording: '客户信息',
          id: 23250,
          resourceId: 24,
        })
        continue;
      }
      if (permission[i].id === 13) {
        switchers.push({
          key: 'customerActivity',
          wording: '客户动态',
          id: 23253,
          resourceId: 48,
        })
        continue;
      }
      if (permission[i].id === 30) {
        switchers.push({
          key: 'businessOpportunity',
          wording: '商机管理',
          id: 23255,
          resourceId: 56,
        })
        continue;
      }
      if (permission[i].id === 40) {
        switchers.push({
          key: 'marketingActivity',
          wording: '营销活动',
          id: 23256,
          resourceId: 62,
        })
        continue;
      }
      if (permission[i].id === 49) {
        switchers.push({
          key: 'marketingResults',
          wording: '营销成果',
          id: 23259,
          resourceId: 76,
        })
        continue;
      }
      if (permission[i].id === 56) {
        switchers.push({
          key: 'knowledgeBase',
          wording: '知识库',
          id: 23261,
          resourceId: 85,
        })
        continue;
      }
      if (permission[i].id === 82) {
        switchers.push({
          key: 'workSchedule',
          wording: '工作日程',
          id: 23252,
          resourceId: 47,
        })
        continue;
      }
    }

    this.setState({ switchers })
  }

  componentWillMount() {
    this.initSwitcherState()
  }

  componentDidMount() {
    const { homeModules } = this.props
    this.initSwitchers(homeModules)
  }

  render() {
    let visible = this.state.popupVisible
    const { homeModules, type } = this.props
    const { switchers, isModuleShow } = this.state

    return (
      <div
        className={`custom-button-component ${type === 'empty' ? 'empty-content' : ''}`}
        onClick={this.showCustomPopup}
      >
        <span className='wording-area'>
          <Popup
            visible={visible}
            okText='保存'
            title={'自定义模块'}
            width='360'
            bodyStyle={{ width: '360px' }}
            onCancel={this.handleCancel}
            onOk={this.handleConfirm}
          >
            {
              switchers.map((item, index) => {
                return (
                  <div className='switch-component' key={item.key}>
                    <span className='switch-item title'>{item.wording}</span>
                    <span
                      className='switch--item switcher'
                      id={item.key}
                      onClick={this.handleSwitcherClick}
                    >
                      <Switch
                        checkedChildren='开启'
                        unCheckedChildren='关闭'
                        defaultChecked={isModuleShow[item.key]}
                        onChange={this.handleSwitchChange}
                      />

                    </span>
                  </div>
                )
              })
            }
          </Popup>
          <img className='icon' src={fragmentIconSvg} alt='' />
          <span className='wording'>
            {
              type === 'empty' ? '添加自定义模块' : '自定义'
            }
          </span>
        </span>
      </div>
    )
  }
}

export default CustomButton
