import React from 'react'
import './component.scss'

import {getQueryObj} from 'utils/url.js'
import {Popover, Input, message} from 'antd'
import {withRouter} from "react-router";
import HzLink from 'components/HzLink'
import emptyMessage from './images/empty-message.png'
import {Link} from "react-router-dom"

/*navIcon import*/
import customerManage from './images/navIcon/customerManage.png'
import customerDynamic from './images/navIcon/customerDynamic.png'
import projectWatch from './images/navIcon/projectWatch.png'
import projectReserve from './images/navIcon/projectReserve.png'
import opportunityManage from './images/navIcon/optunity.png'
import marketingResult from './images/navIcon/marketingResult.png'
import productList from './images/navIcon/productList.png'
import knowledgeImage from './images/navIcon/knowledgeImage.png'
import knowledgeLibrary from './images/navIcon/knowledgeLibrary.png'
import systemSetting from './images/navIcon/systemSetting.png'
import schedule from './images/navIcon/schedule.png'
import marketingActivity from './images/navIcon/marketingActivity.png'
/*navIcon import end*/

const SearchInput = Input.Search

/*TODO:配置相应连接*/
let navMap = [ //根据iconName和后端icon字段对应数据对应,hrefManager,

  {icon: customerManage, href: '/#/root/main/customerMgt/home', iconName: 'customerManage'},//客户管理
  {icon: customerDynamic, href: '/#/root/main/customerDynamic/home', iconName: 'customerDynamic'}, //客户动态
  {icon: projectWatch, href: '/#/root/main/projectMonitor/home', iconName: 'projectWatch'}, //项目监测
  {icon: projectReserve, href: '/#/root/main/projectReserve/home', iconName: 'projectReserve'}, //项目储备
  {icon: opportunityManage, href: '/#/root/main/opportunityMgt/home', iconName: 'opportunityManage'},//商机管理
  {icon: marketingResult, href: '/#/root/main/markResult', iconName: 'marketingResult'},// 营销成果
  {icon: productList, href: '/#/root/main/productBase/home', iconName: 'productList'}, //产品目录
  {
    icon: knowledgeImage,
    href: '/graph/#/graph?company=富滇银行股份有限公司&type=Graph&operation=snapshot',
    iconName: 'knowledgeImage',
    _blank: true
  }, //知识图谱
  {
    icon: knowledgeLibrary,
    href: '/#/root/main/customerKnowlMgt/home',
    hrefManager: '/#/root/main/managerKnowlMgt/home',
    iconName: 'knowledgeLibrary'
  }, //知识库
  {icon: systemSetting, href: '/#/root/main/systemMgt/home', iconName: 'systemSettng'},//系统设置
  {icon: schedule, href: '/#/root/main/schedule/home', iconName: 'schedule'}, //日程
  {icon: marketingActivity, href: '/#/root/main/marketingActivity/home', iconName: 'marketingActivity'}, // 营销活动

]


class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isHome: false,
      navList: [],
      messages: [],
      searchKeyword: '',
      activeNav:-1,
      actNavList:[{
        navName:'渠道管理',
        navLink:'/root/main/home?isHome=true',
        navKey:0
      },{
        navName:'数据管理',
        navLink:'/root/main/home?isHome=true',
        navKey:1
      },{
        navName:'规则管理',
        navLink:'/root/main/home?isHome=true',
        navKey:2
      },{
        navName:'任务管理',
        navLink:'/root/main/home?isHome=true',
        navKey:3
      },{
        navName:'名单管理',
        navLink:'/root/main/home?isHome=true',
        navKey:4
      },{
        navName:'查询管理',
        navLink:'/root/main/home?isHome=true',
        navKey:5
      },{
        navName:'用户管理',
        navLink:'/root/main/home?isHome=true',
        navKey:6
      },]
    }


    // 消息面板跳转链接集合
    this.base = '/root/main'
    this.urls = {
      INNER_EVENT: '/customerDynamic/detail?source=0&key=',
      OUTER_EVENT: '/customerDynamic/detail?source=1&key=',
      BUSINESS: '/opportunityMgt/mineOpt/detail?id=',
      WORK_SCHEDULE: '/schedule/detail?id=',
      KNOWLEDGE: '/customerKnowlMgt/detail?id=',
      MARKETING_CAMPAIGNS: '/marketingActivity/ReceiveActivity/detail?id=',
    }
    this.timeoutId = null
    this.readAllMessages = this.readAllMessages.bind(this)
    this.searchWhenInput = this.searchWhenInput.bind(this)
    this.searchHandler = this.searchHandler.bind(this)
    this.switchRoleHandler = this.switchRoleHandler.bind(this)
  }

  // 从 localStorage 中检测是否存在已经选择的角色
  checkIfHadRole() {
    const role = localStorage.getItem('CURRENT_ROLE')
    if (role) {
      this.props.setRole(JSON.parse(role))
    } else {
      console.log('localStorage 中没有 role')
    }
  }

  // 已读所有消息
  readAllMessages() {
    this.props.readAllMessages(() => {
      const messages = this.state.messages.slice(0)
      messages.forEach((item) => {
        if (parseInt(item.status) === 0) {
          item.status = 1
        }
      })
      this.props.emptyUnreadMessages()
      this.setState({messages})
    })
  }

  componentWillMount() {
    this.props.getLoginUserInfo()
    this.props.getUserPermission()
    this.props.getMessageCount()
    this.props.getHeaderMessage()
    this.props.getBatchTime()
    let isHome = window.location.hash.indexOf('/root/main/home') > -1
    this.setState({
      isHome: isHome
    })
    this.props.history.listen(() => {
      isHome = window.location.hash.indexOf('/root/main/home') > -1
      this.setState({
        isHome: isHome
      })
    })
  }

  componentWillReceiveProps({userPermission, headerMessage, loginUserInfo}) {
    if (userPermission !== this.props.userPermission) {
      let result = []
      let currentNav = null
      // if (parseInt(loginUserInfo.isCustomerManager) === 1) { //客户经理
      //
      // } else {
      //   navMap[8].href = navMap[8].hrefManager //知识库链接切换为管理员链接
      // }
      userPermission.data && userPermission.data.forEach(permission => {
        let flag = navMap.some(nav => {
          if (nav.iconName === permission.icon) {
            currentNav = nav
            return true
          }
          return false
        })
        flag && result.push({
          name: permission.name,
          href: currentNav.href,
          icon: currentNav.icon,
          _blank: currentNav._blank
        })
      })
      this.setState({
        navList: result
      })
    }

    if (headerMessage !== this.props.headerMessage) {
      const messages = ((headerMessage && headerMessage.data) || []).slice(0)
      this.setState({messages})
    }
  }

  componentWillUnmount() {
    this.setState = (state) => {
      return;
    }
  }

  searchWhenInput(ev) {
    let keyword = ev.target.value.trim()
    this.setState({searchKeyword: keyword})
    if (keyword === '') {
      return false
    }

    let that = this
    clearTimeout(this.timeoutId)
    this.timeoutId = setTimeout(function () {
      that.props.search({
        keyWord: keyword,
        pageNo: 1,
        pageSize: 5,
      })
    }, 800)
  }

  // 搜索框 - 搜索
  searchHandler(value) {
    let keyword = value.trim()
    if (keyword === '') {
      message.info('请输入搜索关键词')
    } else {
      keyword = encodeURIComponent(keyword)
      this.props.history.push(`/root/main/searchResult?keyword=${keyword}`)
    }
  }

  // 切换角色
  switchRoleHandler(roleId, roleName) {
    this.props.selectRole(roleId, () => {
      message.success(`角色切换为${roleName}`)
      this.props.setRole({roleId, roleName})
      this.props.getLoginUserInfo() // 切换角色后重新调用info接口，更新用户信息(主要是localStorage中的IS_CUSTOMER_MANAGER字段)
      localStorage.setItem('CURRENT_ROLE', JSON.stringify({roleId, roleName}))
      window.location.href = '/#/root/main/home?isHome=true'
    })
  }

  // 退出登录
  logout() {
    this.props.logout().then(() => {
      this.props.setRole({})
      this.props.history.push('/')
    })
  }

  // 跳转到消息的详情页
  jumpToMessageDetail(schema, key, id) {
    const {base, urls} = this

    // 容错处理
    if (!urls[schema]) {
      message.error(`schema不存在 | ${schema}`)
      return;
    }

    this.props.readMessage([id])

    let detailUrl = `${base}${urls[schema]}${key}`
    this.props.history.push(detailUrl)
  }

  navAct = (index) => {
    this.setState({
      activeNav: index
    })
  }

  render() {

    const { messageCount, loginUserInfo, customerList, batchTime } = this.props
    const { messages, searchKeyword } = this.state
    // 导航列表
    let navList = () => (
      <div className='header-nav-wrap'>
        {this.state.navList.map((item, index) => {
          return <a href={item.href} className='item' key={index} target={item._blank ? '_blank' : '_self'}>
            <img src={item.icon} className='img' alt=''/>
            <p className='p'> {item.name}</p>
          </a>
        })}
      </div>
    )

    // 消息列表
    let messageList = () => {
      return (
        <div className='header-message-wrap '>
          <div className='message-header clearfix'>
            <div className='title clearfix'>
              <h3 className="title-h">消息</h3>
              {
                messageCount > 0 ?
                  <p className='title-p'>未读{messageCount}</p> : null
              }
            </div>
            {
              messageCount > 0 ?
                <div className='read-all' onClick={this.readAllMessages}>全部标志已读</div> : null
            }
          </div>
          <div className='message-list'>
            {
              messages.length > 0 ?
                messages.map((msg, index) => {
                  return (
                    <div
                      className='item'
                      key={`${msg.id}-${index}`}
                      schema={msg.msgSchema}
                      messagekey={msg.msgKey}
                      onClick={
                        this.jumpToMessageDetail.bind(
                          this,
                          msg.msgSchema,
                          msg.msgKey,
                          msg.id
                        )
                      }
                    >

                      <div className='item-content'>
                        <div className='name'>
                          {
                            parseInt(msg.status) === 0 ?
                              <span className='name-s'></span> : null
                          }
                          <p className='name-p'>{msg.title}</p>
                        </div>
                        <div className='item-desc'>
                          {
                            msg.msgSchema === 'INNER_EVENT' ?
                              <div className='btn inner'>行内动态</div> : (
                                msg.msgSchema === 'OUTER_EVENT' ?
                                  <div className='btn outer'>行外动态</div> : (
                                    msg.msgSchema === 'BUSINESS' ?
                                      <div className='btn business'>商机提醒</div> : (
                                        msg.msgSchema === 'WORK_SCHEDULE' ?
                                          <div className='btn schedule'>日程提醒</div> : (
                                            msg.msgSchema === 'KNOWLEDGE' ?
                                              <div className='btn knowledge'>知识库</div> : (
                                                msg.msgSchema === 'MARKETING_CAMPAIGNS' ?
                                                  <div className='btn marketing'>营销活动</div> : null
                                              )
                                          )
                                      )
                                  )
                              )
                          }
                          <div className='time fixed-right'>{msg.createTime}</div>
                        </div>
                      </div>
                    </div>
                  )
                }) :
                <div className='no-message-icon'>
                  <img
                    alt=''
                    className='no-message-pic'
                    src={emptyMessage}
                  />
                  <div className='empty-tip'>暂时没有消息哦～</div>
                </div>
            }

          </div>
          <div className='look-all'><HzLink to='/root/main/messageMgt/home'>查看全部消息</HzLink></div>
        </div>
      )
    }

    // 角色选择面板
    let roleSelectPanel = () => (
      <div className='header-role-select-panel'>
        {
          // 20190505: 屏蔽角色选择功能
          // loginUserInfo.roles &&
          // loginUserInfo.roles.map((role, index) => {
          //   return (
          //     <div
          //       className='panel-item'
          //       key={role.id}
          //       onClick={this.switchRoleHandler.bind('this', role.id, role.name)}
          //     >{role.name}</div>
          //   )
          // })
        }
        <div className='panel-item' onClick={this.logout.bind(this)}>退出</div>
      </div>
    )

    // 导航栏
    let actNavList = () =>(
      <ul>
        {this.state.actNavList.map((item,index) =>{
          return <Link className={this.state.activeNav === index ? 'actLi' : ' '} to={item.navLink} replace key={index} onClick={() => {
            this.navAct(index)
          }}><li>{item.navName}</li></Link>
        })}
      </ul>
    )
    return (
      // <div className={this.state.isHome ? 'header-component is-home' : 'header-component'}>
        <div className='header-component'>
        <a className='logoin' href='/#/root/main/home?isHome=true'>青岛银行交易安全防控系统 </a>
        <div className='header-right'>

          {
            !!batchTime.data ?
              <div className='latest-time inline'>数据日期: { batchTime.data }</div> :
              null
          }

          <div className='search-box inline'>
            <SearchInput
              placeholder='请输入客户名称查询'
              onSearch={this.searchHandler}
              className='header-search-input'
              onChange={this.searchWhenInput}
            />

            {
              !!searchKeyword && customerList.total > 0 ?
                <div className='search-results-panel'>
                  {
                    customerList.data.map(result => {
                      const position = result.name.indexOf(searchKeyword)
                      const beforeStr = result.name.substr(0, position)
                      const afterStr = result.name.substr(position + searchKeyword.length)
                      return position > -1 ? (
                        <div
                          className='search-result'
                          key={result.objectKey}
                          onClick={this.searchHandler.bind(this, result.name)}
                        >
                          {beforeStr}
                          <span className='keyword'>{searchKeyword}</span>
                          {afterStr}
                        </div>
                      ) : (
                        <div
                          className='search-result'
                          key={result.objectKey}
                          onClick={this.searchHandler.bind(this, result.name)}
                        >{result.name}</div>
                      )

                    })
                  }
                </div> : null
            }

          </div>
          
          <div className='chooseNav'>
            {actNavList()}
          </div>
          
          <Popover content={navList()} placement="bottomRight">
            <div className='nav inline'></div>
          </Popover>

          <Popover content={messageList()} placement="bottomRight">
            <div className='message inline'>
              <span className='message-count'
                    style={{display: this.props.messageCount > 0 ? 'block' : 'none'}}
              ></span>
            </div>
          </Popover>
          <div className='divider inline'></div>
          <div className='user-info inline'>
            {loginUserInfo.name &&
            <HzLink to='/root/main/personalInfo'>
              <div className='img'></div>
              <div className='name'>{loginUserInfo.name}</div>
            </HzLink>}

            {/* 切换角色 */}
            <Popover
              trigger="click"
              content={roleSelectPanel()}
              placement="bottomRight"
            >
              <div className='down'></div>
            </Popover>
          </div>

        </div>
      </div>
    )
  }
}

export default withRouter(Header)
