import React from 'react'
import './component.scss'
import closeIcon from './images/close.png'
import {Button, Pagination, Radio} from 'antd'

class OwnInstitution extends React.Component {
  constructor(props) {
    super(props)
    this.props.onRef(this)
    this.state = {
      showAddOpportunity: false,
      queryOpportunityParams: {
        "nameOrCustomerName": "",
        "pageNo": 1,
        "pageSize": 10,
      },
      opportunityTotal: 10,
      checkedList: [],
      showOpportunityList: [],//外层展示
      currentPage: 1
    }

  }

  showFn = () => {
    this.setState({
      showAddOpportunity: true
    })
  }

  closeFn = () => {
    this.setState({
      showAddOpportunity: false
    })
  }

  initCheckedList = (list) => {
    this.setState({
      checkedList: [...list],
      showOpportunityList: [...list]
    }, () => {
    })
  }

  searchOpportunity = (str) => {
    this.setState({
      queryOpportunityParams: Object.assign(this.state.queryOpportunityParams, {nameOrCustomerName: str})
    }, () => {
      this.props.getOpportunityList(this.state.queryOpportunityParams)
    })
  }

  searchInputHandler = (e) => {
    let str = e.target.value
    if (this.searchTimer) {
      clearTimeout(this.searchTimer)
    }
    this.searchTimer = setTimeout(() => {
      this.setState({
        queryOpportunityParams: Object.assign(this.state.queryOpportunityParams, {pageNo: 1}),
        currentPage: 1
      })
      this.searchOpportunity(str)
    }, 300)
  }

  opportunityPageChange = (page) => {
    this.setState({
      queryOpportunityParams: Object.assign(this.state.queryOpportunityParams, {pageNo: page}),
      currentPage: page
    }, () => {
      this.searchOpportunity()
    })
  }


  radioChange = (e, item) => {
    if(this.props.oneCheck){
      let result = this.state.checkedList
      let flag = result.some(checkedItem => {
        return checkedItem.id === item.id
      })
      result = flag ? [] : [item]
      this.setState({
        checkedList: result
      })
    }else{
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

  confirmHandler = () => {
    this.closeFn()
    this.setState({
      showOpportunityList: [...this.state.checkedList]
    })
    this.props.confirm && this.props.confirm(this.state.checkedList)
  }

  cancelHandler = () => {
    let result = this.state.showOpportunityList
    this.setState({
      checkedList: [...result]
    })
    this.closeFn(false)
  }

  deleteOpportunityItem = (item) => {
    let result = []
    this.state.checkedList.forEach(checkedItem => {
      if (item.id !== checkedItem.id) {
        result.push(checkedItem)
      }
    })
    this.setState({
      checkedList: [...result],
      showOpportunityList: [...result]
    })

    this.props.deleteHandler && this.props.deleteHandler(item)
  }

  componentWillMount() {
    this.searchOpportunity()
  }

  componentWillReceiveProps({opportunityList}) {
    if (opportunityList !== this.props.opportunityList) {
      this.setState({opportunityTotal: opportunityList.total})
    }
  }

  render() {
    let {opportunityList} = this.props
    let opportunityStatusMap = ['新建', '沟通', '完成', '终止']
    return (
      <div className='relation-opportunity'>
        <div className='add-opportunity add-wrap'>
          <div className='title clearfix'>
            <div className='label'>关联商机</div>
            <div className='btn' onClick={() => {
              this.showFn(true)
            }}>关联商机
            </div>
          </div>
          <div className='content'>
            <div className='content-header'>
              <div>商机名称</div>
              <div>客户名称</div>
              <div>客户类型</div>
              <div>商机状态</div>
              <div>跟进人</div>
              <div>操作</div>
            </div>
            <div className='list'>
              {this.state.showOpportunityList.map(item => {
                return (
                  <div className='item' key={item.id}>
                    <div>{item.name}</div>
                    <div>{item.customerName}</div>
                    <div>{item.customerType == 0 ? '行内' : '行外'}</div>
                    <div>{opportunityStatusMap[item.status]}</div>
                    <div>{item.followUserName}</div>
                    <div className='operation'>
                      <div onClick={() => {
                        this.deleteOpportunityItem(item)
                      }}></div>
                    </div>
                  </div>
                )
              })}

            </div>
          </div>
        </div>
        {this.state.showAddOpportunity && <div className='popup'>
          <div className='popup-cover'></div>
          <div className='popup-content'>
            <div className='title clearfix'>
              <div className='label'>关联商机</div>
              <img className='close' alt='' src={closeIcon} onClick={() => {
                this.cancelHandler()
              }}></img>
            </div>
            <div className='search'>
              <input placeholder='搜索客户' onInput={(e) => {
                this.searchInputHandler(e)
              }}/>
            </div>
            <div className='opportunity-list'>
              <div className='header'>
                <div>商机名称</div>
                <div>客户名称</div>
                <div>客户类型</div>
                <div>商机状态</div>
                <div>跟进人</div>
                <div></div>
              </div>

              {opportunityList.data.map(item => {
                return (
                  <div className='item' key={item.id}>
                    <div>{item.name}</div>
                    <div>{item.customerName}</div>
                    <div>{item.customerType == 0 ? '行内' : '行外'}</div>
                    <div>{opportunityStatusMap[item.status]}</div>
                    <div>{item.followUserName}</div>
                    <div className='operation'>
                      <Radio
                        checked={this.state.checkedList.some(checkedItem => {
                          return item.id === checkedItem.id
                        })}
                        onClick={(e) => {
                          this.radioChange(e, item)
                        }}></Radio>
                    </div>
                  </div>
                )
              })}


            </div>
            <div className='pagination-wrap'>
              <Pagination
                total={this.state.opportunityTotal}
                onChange={this.opportunityPageChange}
                current={this.state.currentPage}
              ></Pagination>
            </div>
            <div className='btn-group'>
              <Button style={{marginRight:8}}  className='cancel' onClick={() => {
                this.cancelHandler()
              }}>取消
              </Button>
              <Button type="primary" className='confirm' onClick={() => {
                this.confirmHandler()
              }}>确定
              </Button>

            </div>
          </div>
        </div>}
      </div>
    )
  }
}

export default OwnInstitution
