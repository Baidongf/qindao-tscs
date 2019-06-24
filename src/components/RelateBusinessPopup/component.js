import React from 'react'
import './component.scss'
import closeIcon from './images/close.png'
import { Pagination, Radio,Button } from 'antd'

const decode_status = ['新建','沟通','完成','终止']

/**
 * @desc 关联商机弹窗组件
 * @prop {String} [relateKey] 动态的全局唯一标识(一般为 objectKey 或 id)
 * @prop {Function} [confirmCallback] 点击“确定”按钮后的回调函数
 */
class RelateBusinessPopup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      queryParams: {
        keyWord: '',
        pageNo: 1,
        pageSize: 5,
      },
      opportunityTotal: 0,
      checkedList: [], //已关联过的商机，用来过滤显示在面板中全部商机列表
      currentCheckedItem: {},
      currentPage: 1,
      visible: false,
    }

    this.relateKey = ''
  }

  componentWillMount() {
    if (
      this.props.onRef &&
      typeof(this.props.onRef) === 'function'
    ) {
      this.props.onRef(this)
    }

    const { relateKey } = this.props
    this.relateKey = relateKey
  }

  componentDidMount() {
    // 获取已经关联当前动态/商机的日程列表
    const { relateKey } = this
    this.props.getDynamicRelatedBusinessList(relateKey)
    this.searchOpportunity()
  }

  componentWillReceiveProps({
    opportunityList,
    dynamicRelatedBusinessList,
  }) {

    if (opportunityList !== this.props.opportunityList) {
      this.setState({ opportunityTotal: opportunityList.total })
    }

    if (dynamicRelatedBusinessList !== this.props.dynamicRelatedScheduleList) {
      this.setState({
        checkedList: dynamicRelatedBusinessList.data
      })
    }
  }

  // 获取日程列表(全部)
  searchOpportunity = (opportunityKeyword = '') => {
    this.setState({
      queryParams: Object.assign(
        this.state.queryParams,
        { nameOrCustomerName: opportunityKeyword }
      )
    }, () => {
      this.props.getOpportunityList(this.state.queryParams)
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
        queryParams: Object.assign(this.state.queryParams, { pageNo: 1 }),
        currentPage: 1
      })
      this.searchOpportunity(str)
    }, 300)
  }

  // 日程列表翻页
  opportunityPageChange = (page) => {
    this.setState({
      queryParams: Object.assign(this.state.queryParams, { pageNo: page }),
      currentPage: page,
    }, () => {
      this.searchOpportunity()
    })
  }

  // 选择商机（单选）
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
    const { relateKey } = this
    if (Object.keys(currentCheckedItem).length > 0) {
      this.props.relateBusinessWithDynamic({
        businessChanceId: currentCheckedItem.id,
        companyDynamicKey: relateKey
      }, () => {
        this.afterConfirmHandler()
      })
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

    this.props.confirmCallback && this.props.confirmCallback()
  }


  render() {
    const { opportunityList } = this.props
    const { checkedList, currentCheckedItem, visible } = this.state

    return (
      visible ?
      <div className='related-opportunity-popup-component'>
        <div className='popup-cover'></div>
        <div className='popup-content'>
          {/* 弹窗头部 */}
          <div className='title clearfix'>
            <div className='label'>关联商机</div>
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
              placeholder='请输入商机名称/客户名称搜索'
              onInput={(e) => { this.searchInputHandler(e) }}
            />
          </div>

          {/* 全部日程展示列表 */}
          <div className='opportunity-list'>
            <div className='header'>
              <div>商机名称</div>
              <div>客户名称</div>
              <div>跟进人</div>
              <div>商机状态</div>
              <div></div>
            </div>

            {/* 日程列表渲染 */}
            {
              opportunityList.data.filter(item => {
                return checkedList.every(checkedItem => {
                  return item.id !== checkedItem.id
                })
              }).map(item => {
                return (
                  <div className='item' key={item.id}>
                    <div>{item.name}</div>
                    <div>{item.customerName}</div>
                    <div>{item.followUserName}</div>
                    <div>{decode_status[item.status]}</div>
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
            this.state.opportunityTotal > 5 ?
              <div className='pagination-wrap'>
                <Pagination
                  total={this.state.opportunityTotal}
                  pageSize={5}
                  current={this.state.currentPage}
                  onChange={this.opportunityPageChange}
                />
              </div> : null
          }


          <div className='btn-group'>
            <Button
              className='cancel'
              style={{marginRight:8}}
              onClick={() => { this.cancelHandler() }}
            >取消</Button>
            <Button
              type="primary"
              className='confirm  '
              onClick={() => { this.confirmHandler() }}
            >确定</Button>

          </div>

        </div>
      </div> : null
    )
  }
}

export default RelateBusinessPopup
