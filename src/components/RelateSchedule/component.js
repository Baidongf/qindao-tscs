import React from 'react'
import './component.scss'
import {Button, Table} from 'antd'
import closeIcon from './images/close.png'
import { Pagination, Radio } from 'antd'
import { withRouter } from 'react-router-dom'

/**
 * @desc 关联日程组件
 * @prop [string] relateWith 将日程和谁关联，'dynamic'(动态) or 'business'(商机)
 * @prop [string] relateKey 被关联对象的key值（客户动态key 或 商机id）
 * @prop [boolean] oneCheck 是否单选（根据现有的UE交互场景，应和 relateOneByOne 保持一致）
 * @prop [boolean] relateOneByOne 在详情页一个一个添加(true) or 在新建商机页面统一添加(false)
 * @prop [function] confirm 点击弹窗中确定的回调函数，参数为 checkedList
 * @prop [function] deleteHandler 点击面板中删除按钮的回调函数，参数为删除的日程对象
 * @prop [boolean] multipleEdit 是否在编辑时支持多选操作(目前在编辑/跟进商机时使用)
 */
class RelateSchedule extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showSchedulePanel: false,
      queryScheduleParams: {
        keyWord: '',
        pageNo: 1,
        pageSize: 5,
      },
      opportunityTotal: 10,
      scheduleTotal: 0,
      checkedList: [],
      showScheduleList: [], // 外层展示(已关联的日程列表)
      currentPage: 1,

      columns: [{
        title: '主题',
        className: 'first-column',
        key: 'title',
        dataIndex: 'title',
      }, {
        title: '日程名称',
        key: 'name',
        dataIndex: 'name',
      }, {
        title: '开始时间',
        key: 'startTime',
        dataIndex: 'startTime',
      }, {
        title: '结束时间',
        key: 'endTime',
        dataIndex: 'endTime',
      }]
    }

    this.relateWith = ''
    this.relateKey = ''

    this.isCustomerManager = null

  }

  showFn = () => {
    this.setState({
      showSchedulePanel: true
    })
  }

  closeFn = () => {
    this.setState({
      showSchedulePanel: false
    })
  }

  initCheckedList = (list) => {
    this.setState({
      checkedList: [...list],
      showScheduleList: [...list]
    }, () => { })
  }

  // 获取日程列表
  searchSchedule = (scheduleKeyword) => {
    this.setState({
      queryScheduleParams: Object.assign(
        this.state.queryScheduleParams,
        { keyWord: scheduleKeyword }
      )
    }, () => {
      this.props.getScheduleList(this.state.queryScheduleParams)
    })
  }

  // 搜索日程
  searchInputHandler = (e) => {
    let str = e.target.value
    if (this.searchTimer) {
      clearTimeout(this.searchTimer)
    }
    this.searchTimer = setTimeout(() => {
      this.setState({
        queryScheduleParams: Object.assign(this.state.queryScheduleParams, { pageNo: 1 }),
        currentPage: 1
      })
      this.searchSchedule(str)
    }, 300)
  }

  // 日程列表翻页
  schedulePageChange = (page) => {
    this.setState({
      queryScheduleParams: Object.assign(this.state.queryScheduleParams, { pageNo: page }),
      currentPage: page,
    }, () => {
      this.searchSchedule()
    })
  }

  radioChange = (e, item) => {
    if (this.props.oneCheck) {
      // 单选
      let result = this.state.checkedList
      let flag = result.some(checkedItem => {
        return checkedItem.id === item.id
      })
      result = flag ? [] : [item]
      this.setState({
        checkedList: result
      })
    } else {
      // 多选
      // 直接更新 checkedList
      let indexOf = -1
      this.state.checkedList.forEach((checkedItem, index) => {
        if (checkedItem.id === item.id) {
          indexOf = index
        }
      })
      let result = this.state.checkedList
      if (indexOf >= 0) {
        result.splice(indexOf, 1)
        this.setState({
          checkedList: result
        })
      } else {
        result.push(item)
        this.setState({
          checkedList: result
        })
      }
    }
  }

  // 点击弹窗中确定按钮后的一些列页面交互
  afterConfirmHandler = () => {
    const { checkedList, showScheduleList } = this.state
    const { relateOneByOne } = this.props
    this.closeFn()

    if (relateOneByOne === true) {
      this.setState({
        showScheduleList: [
          ...showScheduleList,
          ...checkedList,
        ]
      })
    } else {
      this.setState({ showScheduleList: [...checkedList] })
    }

    this.props.confirm && this.props.confirm(checkedList)
  }

  // 点击弹窗中的确定
  confirmHandler = () => {
    const { relateOneByOne } = this.props
    const { relateWith, relateKey } = this
    const { checkedList } = this.state

    if (relateOneByOne === true && checkedList.length > 0) {
      // 如果 relateOneByOne === true, 则直接发起关联的请求
      if (relateWith === 'dynamic') {
        // 关联日程和客户动态
        this.props.relateScheduleAndDynamic({
          companyDynamicKey: relateKey,
          workScheduleId: checkedList[0].id,
        }, () => {
          this.afterConfirmHandler()
        })
      } else if (relateWith === 'business') {
        // 关联日程和商机
        this.props.relateScheduleAndBusiness({
          businessChanceId: relateKey,
          workScheduleId: checkedList[0].id,
        }, () => {
          this.afterConfirmHandler()
        })
      }

    } else {
      this.afterConfirmHandler()
    }
  }

  // 点击弹窗中的取消
  cancelHandler = () => {
    let result = this.state.showScheduleList
    this.setState({
      checkedList: [...result]
    })
    this.closeFn(false)
  }

  // 在外部列表删除日程后的一些列前端交互
  afterDeleteScheduleItem = (deletedItem) => {
    let result = []
    this.state.checkedList.forEach(checkedItem => {
      if (deletedItem.id !== checkedItem.id) {
        result.push(checkedItem)
      }
    })
    this.setState({
      checkedList: [...result],
      showScheduleList: [...result]
    })
    this.props.deleteHandler && this.props.deleteHandler(deletedItem)
  }

  // 在外部列表点击删除
  deleteScheduleItem = (item) => {
    const { relateOneByOne } = this.props
    const { relateWith, relateKey } = this

    if (relateOneByOne === true) {
      // 点击删除按钮就发起请求(一个一个删)
      if (relateWith === 'dynamic') {
        this.props.unRelateScheduleAndDynamic({
          workScheduleId: item.id,
          companyDynamicKey: relateKey,
        }, () => {
          this.afterDeleteScheduleItem(item)
        })
      } else if (relateWith === 'business') {
        this.props.unRelateScheduleAndBusiness({
          workScheduleId: item.id,
          businessChanceId: relateKey,
        }, () => {
          this.afterDeleteScheduleItem(item)
        })
      }

    } else {
      this.afterDeleteScheduleItem(item)
    }
  }

  componentWillMount() {
    const isCustomerManager = localStorage.getItem('IS_CUSTOMER_MANAGER')
    const { relateWith, relateKey } = this.props
    this.relateWith = relateWith
    this.relateKey = relateKey
    this.isCustomerManager = isCustomerManager

    if (
      isCustomerManager === '1' ||
      window.location.hash.indexOf('opportunityMgt/home/createOrEdit') > -1
    ) {
      const { columns } = this.state
      this.setState({
        columns: [...columns, {
          title: '操作',
          render: (text, record, index) => {
            return (
              <span
                className='delete-btn'
                onClick={() => {
                  this.deleteScheduleItem(record)
                }}
              ></span>
            )
          }
        }]
      })
    }
  }

  componentDidMount() {
    // 获取已关联当前动态/商机的日程列表
    const { relateWith, relateKey } = this
    const { relateOneByOne, multipleEdit } = this.props
    if (relateOneByOne === true || multipleEdit === true) {
      if (relateWith === 'dynamic') {
        this.props.getDynamicRelatedScheduleList(relateKey)
      } else if (relateWith === 'business') {
        this.props.getBusinessRelatedScheduleList(relateKey)
      }
    }

    // 获取全部的日程列表
    this.searchSchedule()
  }

  componentWillReceiveProps({
    scheduleList,
    dynamicRelatedScheduleList,
    businessRelatedScheduleList,
  }) {
    if (scheduleList !== this.props.scheduleList) {
      this.setState({ scheduleTotal: scheduleList.total })
    }

    if (dynamicRelatedScheduleList !== this.props.dynamicRelatedScheduleList) {
      this.initCheckedList(dynamicRelatedScheduleList.data)
    }

    if (businessRelatedScheduleList !== this.props.businessRelatedScheduleList) {
      this.initCheckedList(businessRelatedScheduleList.data)
    }


  }

  render() {
    let { scheduleList, oneCheck } = this.props
    const { isCustomerManager } = this
    const { columns, showScheduleList } = this.state
    return (
      <div className='relate-schedule-component'>
        <div className='add-opportunity add-wrap'>
          <div className='title clearfix'>
            <div className='label'>关联日程</div>

            {
              isCustomerManager === '1' ||
              window.location.hash.indexOf('opportunityMgt/home/createOrEdit') > -1 ?
                <div
                  className='btn'
                  onClick={() => { this.showFn(true) }}
                >关联日程</div> : null
            }

          </div>
          <div className='content'>
            <Table
              rowKey='id'
              columns={columns}
              dataSource={showScheduleList}
              pagination={false}
            />
          </div>
        </div>
        {
          this.state.showSchedulePanel &&
          <div className='popup'>
            <div className='popup-cover'></div>
            <div className='popup-content'>
              <div className='title clearfix'>
                {/* 弹窗头部 */}
                <div className='label'>关联日程</div>
                <img
                  className='close'
                  src={closeIcon}
                  alt=''
                  onClick={() => { this.cancelHandler() }}
                ></img>
              </div>

              {/* 搜索 */}
              <div className='search'>
                <input
                  placeholder='请输入日程主题/日程名称搜索'
                  onInput={(e) => { this.searchInputHandler(e) }}
                />
              </div>

              {/* 新建日程按钮 */}
              {/* <div
                className='create-schedule-button'
                onClick={() => {
                  this.props.history.push('/root/main/schedule/createOrEdit?operation=create')
                }}
              >新建日程</div> */}

              {/* 全部日程展示列表 */}
              <div className='schedule-list'>
                <div className='header'>
                  <div>主题</div>
                  <div>日程名称</div>
                  <div>开始时间</div>
                  <div>结束时间</div>
                  <div></div>
                </div>

                {
                  // 如果是单选，只展示没被关联过的日程
                  oneCheck === true ?
                    scheduleList.data.filter(item => {
                      return this.state.showScheduleList.every(checkedItem => {
                        return item.id !== checkedItem.id
                      })
                    }).map(item => {
                      return (
                        <div className='item' key={item.id}>
                          <div>{item.title}</div>
                          <div>{item.name}</div>
                          <div>{item.startTime}</div>
                          <div>{item.endTime}</div>
                          <div className='operation'>
                            <Radio
                              checked={
                                this.state.checkedList.some(checkedItem => {
                                  return item.id === checkedItem.id
                                })
                              }
                              onClick={(e) => { this.radioChange(e, item) }}></Radio>
                          </div>
                        </div>
                      )
                    }) :
                    scheduleList.data.map(item => {
                      return (
                        <div className='item' key={item.id}>
                          <div>{item.title}</div>
                          <div>{item.name}</div>
                          <div>{item.startTime}</div>
                          <div>{item.endTime}</div>
                          <div className='operation'>
                            <Radio
                              checked={
                                this.state.checkedList.some(checkedItem => {
                                  return item.id === checkedItem.id
                                })
                              }
                              onClick={(e) => {
                                this.radioChange(e, item)
                              }}></Radio>
                          </div>
                        </div>
                      )
                    })
                }


              </div>

              {
                // 列表项总数大于10个(大于一页)时才展示翻页
                this.state.scheduleTotal > 5 ?
                  <div className='pagination-wrap'>
                    <Pagination
                      total={this.state.scheduleTotal}
                      pageSize={5}
                      onChange={this.schedulePageChange}
                      current={this.state.currentPage}
                    ></Pagination>
                  </div> : null
              }

              <div className='btn-group'>
                <Button style={{marginRight:8}} className='cancel' onClick={() => {
                  this.cancelHandler()
                }}>取消</Button>
                <Button type="primary"   className='confirm  ' onClick={() => {
                  this.confirmHandler()
                }}>确定</Button>


              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default withRouter(RelateSchedule)
