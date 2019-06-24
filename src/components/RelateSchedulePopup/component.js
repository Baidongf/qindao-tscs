import React from 'react'
import './component.scss'
import closeIcon from './images/close.png'
import { Pagination, Radio,Button } from 'antd'

/**
 * @desc 关联日程弹窗组件
 * @prop {String} [relateWith] dynamic(和动态关联) / business(和商机关联)
 * @prop {String} [relateKey] 动态或日程的全局唯一标识(一般为 objectKey 或 id)
 */
class RelateSchedulePopup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      queryScheduleParams: {
        keyWord: '',
        pageNo: 1,
        pageSize: 5,
      },
      scheduleTotal: 0,
      checkedList: [], //已关联过的日程，用来过滤显示在面板中全部日程列表
      currentCheckedItem: {},
      currentPage: 1,
      visible: false,
    }

    this.relateWith = ''
    this.relateKey = ''
  }

  componentWillMount() {
    if (
      this.props.onRef &&
      typeof(this.props.onRef) === 'function'
    ) {
      this.props.onRef(this)
    }

    const { relateWith, relateKey } = this.props
    this.relateWith = relateWith
    this.relateKey = relateKey
  }

  componentDidMount() {
    // 获取已经关联当前动态/商机的日程列表
    const { relateWith, relateKey } = this
    if (relateWith === 'dynamic') {
      this.props.getDynamicRelatedScheduleList(relateKey).then(() => {
        this.searchSchedule()
      })
    } else if (relateWith === 'business') {
      this.props.getBusinessRelatedScheduleList(relateKey).then(() => {
        this.searchSchedule()
      })
    } else {
      this.searchSchedule()
    }
  }

  componentWillReceiveProps({
    scheduleList,
    dynamicRelatedScheduleList,
    businessRelatedScheduleList,
  }) {

    if (dynamicRelatedScheduleList !== this.props.dynamicRelatedScheduleList) {
      this.setState({
        checkedList: dynamicRelatedScheduleList.data
      })
    }

    if (businessRelatedScheduleList !== this.props.businessRelatedScheduleList) {
      this.setState({
        checkedList: businessRelatedScheduleList.data
      })
    }

    if (scheduleList !== this.props.scheduleList) {
      this.setState({ scheduleTotal: scheduleList.total })
    }
  }

  // 获取日程列表(全部)
  searchSchedule = (scheduleKeyword = '') => {
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

  // 选择日程（单选）
  radioChange = (e, currentCheckedItem) => {
    this.setState({ currentCheckedItem })
  }

  // 显示弹窗
  showPopup = () => {
    this.setState({
      visible: true
    })
  }

  // 取消
  cancelHandler = () => {
    this.setState({
      currentCheckedItem: {},
      visible: false
    })
  }

  // 确定
  confirmHandler = () => {
    const { currentCheckedItem } = this.state
    const { relateWith, relateKey } = this
    if (Object.keys(currentCheckedItem).length > 0) {
      if (relateWith === 'dynamic') {
        this.props.relateScheduleAndDynamic({
          companyDynamicKey: relateKey,
          workScheduleId: currentCheckedItem.id
        }, () => {
          this.afterConfirmHandler()
        })
      } else if (relateWith === 'business') {
        this.props.relateScheduleAndBusiness({
          businessChanceId: relateKey,
          workScheduleId: currentCheckedItem.id
        }, () => {
          this.afterConfirmHandler()
        })
      }
    }
  }

  afterConfirmHandler = () => {
    const { checkedList, currentCheckedItem } = this.state
    this.setState({
      checkedList: [
        ...checkedList,
        currentCheckedItem,
      ],
      currentCheckedItem: {},
      visible: false
    })
  }


  render() {
    const { scheduleList } = this.props
    const { checkedList, currentCheckedItem, visible } = this.state

    return (
      visible ?
      <div className='related-schedule-popup-component'>
        <div className='popup-cover'></div>
        <div className='popup-content'>
          {/* 弹窗头部 */}
          <div className='title clearfix'>
            <div className='label'>关联日程</div>
            <img
              alt=''
              className='close'
              src={closeIcon}
              onClick={() => { this.cancelHandler() }}
            />
          </div>

          {/* 搜索 */}
          <div className='search'>
            <input
              placeholder='请输入日程主题/日程名称搜索'
              onInput={(e) => { this.searchInputHandler(e) }}
            />
          </div>

          {/* 全部日程展示列表 */}
          <div className='schedule-list'>
            <div className='header'>
              <div>主题</div>
              <div>日程名称</div>
              <div>开始时间</div>
              <div>结束时间</div>
              <div></div>
            </div>

            {/* 日程列表渲染 */}
            {
              scheduleList.data.filter(item => {
                return checkedList.every(checkedItem => {
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
                        checked={currentCheckedItem.id === item.id}
                        onClick={(e) => { this.radioChange(e, item) }}
                      />
                    </div>
                  </div>
                )
              })
            }

          </div>



          {/* 翻页 */}
          {
            this.state.scheduleTotal > 5 ?
              <div className='pagination-wrap'>
                <Pagination
                  total={this.state.scheduleTotal}
                  pageSize={5}
                  current={this.state.currentPage}
                  onChange={this.schedulePageChange}
                />
              </div> : null
          }


          <div className='btn-group'>
            <Button
              type="primary"
              className='confirm  '
              onClick={() => { this.confirmHandler() }}
            >确定</Button>
            <Button
              className='cancel'
              style={{marginRight:8}}
              onClick={() => { this.cancelHandler() }}
            >取消</Button>

          </div>

        </div>
      </div> : null
    )
  }
}

export default RelateSchedulePopup
