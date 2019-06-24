import React from 'react'
import './component.scss'
import closeIcon from './images/close.png'
import { Pagination, Radio,Button } from 'antd'

class RelateCustomerPanel extends React.Component {
  constructor(props) {
    super(props)
    this.props.onRef(this)
    this.state = {
      showAddOpportunity: false,
      queryOpportunityParams: {
        "keyWord": "",
        "pageNo": 1,
        "pageSize": 6,
      },
      opportunityTotal: 10,
      currentPage: 1,
      checkedList: [],
      showOpportunityList: [],//外层展示
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
    if(str === undefined){
      str = ""
    }
    this.setState({
      queryOpportunityParams: Object.assign(this.state.queryOpportunityParams, { keyWord: str })
    }, () => {
      this.props.getCustomerList(this.state.queryOpportunityParams)
    })
  }


  searchInputHandler = (e) => {
    let str = e.target.value
    if (this.searchTimer) {
      clearTimeout(this.searchTimer)
    }
    this.searchTimer = setTimeout(() => {
      this.setState({
        queryOpportunityParams: Object.assign(this.state.queryOpportunityParams, { pageNo: 1 }),
        currentPage: 1
      })
      this.searchOpportunity(str)
    }, 300)
  }


  opportunityPageChange = (page) => {
    this.setState({
      queryOpportunityParams: Object.assign(this.state.queryOpportunityParams, { pageNo: page }),
      currentPage: page
    }, () => {
      this.searchOpportunity()
    })
  }


  radioChange = (e, item) => {
    if (this.props.oneCheck) {
      let result = this.state.checkedList
      let flag = result.some(checkedItem => {
        return checkedItem.objectKey === item.objectKey
      })
      result = flag ? [] : [item]
      this.setState({
        checkedList: result
      })
    } else {
      let indexOf = -1
      this.state.checkedList.forEach((checkedItem, index) => {
        if (checkedItem.objectKey === item.objectKey) {
          indexOf = index
        }
      })
      let result = [].concat(this.state.checkedList)
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
    this.props.changeOpportunityObj && this.props.changeOpportunityObj([...this.state.checkedList])
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
      if (item.objectKey !== checkedItem.objectKey) {
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

  componentWillReceiveProps({ customerList , opportunityObj , customerKeys}) {
    if (customerList !== this.props.customerList) {
      this.setState({ opportunityTotal: customerList.total })
    }

    if(opportunityObj&&opportunityObj.customers){

      opportunityObj.customers = opportunityObj.customers.filter(item => {
        var flag = false
        for(let i in customerKeys){
          if(item.objectKey === customerKeys[i]){
            flag = true
          }
        }
        return flag
      })




      this.setState({
        showOpportunityList: opportunityObj.customers ,
        checkedList:opportunityObj.customers
      })
    }
  }

  render() {
    let { customerList, type } = this.props
    return (
      <div className='relation-customer'>

        <div className='add-customer add-wrap'>
          <div className='title clearfix'>
            <div className={`label ${type === 'schedule' ? '' : 'ant-form-item-required'}`}>关联客户</div>
            <div className='btn' onClick={() => {
              this.showFn(true)
            }}>关联客户
            </div>
          </div>
          <div className='content'>
            <div className='content-header'>
              <div>客户名称</div>
              <div>客户类型</div>
              <div>所属机构</div>
              <div>客户经理</div>
              <div>操作</div>
            </div>
            <div className='list'>
              {
                this.state.showOpportunityList.map(item => {
                  return (
                    <div className='item' key={item.objectKey}>
                      <div>{item.name}</div>
                      <div>{item.isInter == 0 ? '行内' : '行外'}</div>
                      <div>{item.groupName}</div>
                      <div>{item.legalPerson}</div>
                      <div className='operation'>
                        <div onClick={() => {
                          this.deleteOpportunityItem(item)
                        }}></div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>

        {this.state.showAddOpportunity && <div className='popup'>
          <div className='popup-cover'></div>
          <div className='popup-content'>
            <div className='title clearfix'>
              <div className='label'>关联客户</div>
              <img alt='' className='close' src={closeIcon} onClick={() => {
                this.cancelHandler()
              }}></img>
            </div>
            <div className='search'>
              <input placeholder='搜索客户' onInput={(e) => {
                this.searchInputHandler(e)
              }} />
            </div>
            <div className='customer-list'>
              <div className='header'>
                <div>客户名称</div>
                <div>客户类型</div>
                <div>所属机构</div>
                <div>客户经理</div>
                <div></div>
              </div>


              {customerList.data.map(item => {
                return (
                  <div className='item' key={item.objectKey}>
                    <div>{item.name}</div>
                    <div>{item.isInter == 0 ? '行内' : '行外'}</div>
                    <div>{item.groupName}</div>
                    <div>{item.legalPerson}</div>
                    <div className='operation'>
                      <Radio
                        checked={this.state.checkedList.some(checkedItem => {
                          // checked={this.state.showOpportunityList.some(checkedItem => {
                          return item.objectKey === checkedItem.objectKey
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
              <Button style={{marginRight:8}} className='cancel' onClick={() => {
                this.cancelHandler(false)
              }}>取消
              </Button>
              <Button type="primary"  className='confirm  ' onClick={() => {
                this.confirmHandler()
              }
              }>确定
              </Button>


            </div>
          </div>
        </div>}

      </div>
    )
  }
}

export default RelateCustomerPanel
