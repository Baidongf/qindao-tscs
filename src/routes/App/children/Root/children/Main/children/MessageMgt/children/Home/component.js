import React from 'react'
import './component.scss'
import { Button, Table, message, Input } from 'antd'
import HzBreadcrumb from 'components/HzBreadcrumb'

const Search = Input.Search

const FILTER_INIT_VALUES = {
  "messageCategoryId": undefined,
  "status": undefined,
  "keyWord": undefined,
}

const PAGE_SIZE = 10

class Home extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      currentFirstId: undefined,//一级分类ID
      currentSecondId: undefined,//二级分类ID
      secondCategory: [], // 二级分类列表
      filterObj: {
        ...FILTER_INIT_VALUES
      },
      selectedRows: [],//选择的消息
      selectedRowKeys: []
    }

    this.titleMap = {
      INNER_EVENT: '行内动态',
      OUTER_EVENT: '行外动态',
      WORK_SCHEDULE: '日程提醒',
      BUSINESS: '商机提醒',
      KNOWLEDGE: '知识库更新提醒',
      MARKETING_CAMPAIGNS: '营销活动提醒'
    }

    this.titleColorMap = {
      INNER_EVENT: 'three',
      OUTER_EVENT: 'four',
      WORK_SCHEDULE: 'five',
      BUSINESS: 'six',
      KNOWLEDGE: 'two',
      MARKETING_CAMPAIGNS: 'one'
    }

    this.readStatus = {
      0: 'unread',
      1: 'read'
    }

    // 消息详情跳转链接集合
    this.base = '/root/main'
    this.urls = {
      INNER_EVENT: '/customerDynamic/detail?source=0&key=',
      OUTER_EVENT: '/customerDynamic/detail?source=1&key=',
      BUSINESS: '/opportunityMgt/mineOpt/detail?id=',
      WORK_SCHEDULE: '/schedule/detail?id=',
      KNOWLEDGE: '/customerKnowlMgt/detail?id=',
      MARKETING_CAMPAIGNS: '/marketingActivity/ReceiveActivity/detail?id=',
    }

    this.columns = [
      {
        title: '',
        dataIndex: 'msgSchema',
        width: 80,
        render: (value, row, index) => <span
          title={value} className={['listing-detail ' + this.titleColorMap[value]]}>{this.titleMap[value] || ""}</span>,
      }, {
        title: '消息标题',
        dataIndex: 'title',
        width: 250,
        render: (value, row, index) => (
          <span
            className='msg-title-container'
            onClick={this.jumpToMessageDetail.bind(this, row.msgSchema, row.msgKey, row.id)}
          >
            <span className={'read-status ' + this.readStatus[row.status]}></span>
            <span title={value} className="msg-title">{value}</span>
          </span>
        )
      }, {
        title: '消息类型',
        dataIndex: 'messageCategoryName',
        width: 100,
        render: (value, row, index) => {
          return (<span title={value}>{value}</span>)
        }
      },
      // {
      //   title: '客户名称',
      //   width: 125,
      //   dataIndex: 'customerName',
      //   render: (text) => {
      //     return text ? text : '暂无'
      //   }
      // },
      {
        title: '推送时间',
        dataIndex: 'createTime',
        width: 70,
        render: (text) => {
          return text ? text.split(' ')[0] : '暂无'
        }
      }]

    this.pagination = {
      showQuickJumper: true,
      total: 0,
      current: 1,
      pageSize: PAGE_SIZE,
      onChange: (page, pageSize) => {
        this.pagination.current = page
        this.searchHandler()
      }
    }
  }

  // 消息跳转到对应详情页
  jumpToMessageDetail = (schema, key, id) => {
    const { base, urls } = this

    // 容错处理
    if (!urls[schema]) {
      message.error(`schema不存在 | ${schema}`)
      return;
    }

    this.props.readMessage([id])

    let detailUrl = `${base}${urls[schema]}${key}`
    this.props.history.push(detailUrl)
  }

  searchHandler = () => {
    const obj = {
      status: this.state.filterObj.status,
      messageCategoryId: this.state.filterObj.messageCategoryId,
      keyWord: this.state.filterObj.keyWord,
      pageNo: this.pagination.current,
      pageSize: this.pagination.pageSize
    }
    this.props.getMessageList(obj)
  }

  statusHandler = (status) => {
    this.pagination.pageNo = 1
    this.setState({
      filterObj: Object.assign(this.state.filterObj, { status: status })
    }, () => {
      this.searchHandler()
    })
  }

  firstCategoryHandler = (category) => {
    this.pagination.pageNo = 1
    if (category) {
      this.setState({
        currentFirstId: category.id,
        currentSecondId: undefined,
        secondCategory: category.childrens,
        filterObj: Object.assign(this.state.filterObj, { messageCategoryId: category.id })
      })
    } else {
      this.setState({
        currentFirstId: undefined,
        currentSecondId: undefined,
        secondCategory: [],
        filterObj: Object.assign(this.state.filterObj, { messageCategoryId: undefined })
      })
    }
    setTimeout(() => {
      this.searchHandler()
    }, 0)
  }

  secondCategoryHandler = (category) => {
    this.pagination.pageNo = 1
    if (category) {
      this.setState({
        currentSecondId: category.id,
        filterObj: Object.assign(this.state.filterObj, { messageCategoryId: category.id })
      })
    } else {
      this.setState({
        currentSecondId: null,
        filterObj: Object.assign(this.state.filterObj, { messageCategoryId: this.state.currentFirstId })
      })
    }
    setTimeout(() => {
      this.searchHandler()
    }, 0)
  }

  readAllHandler = () => {
    this.props.readAllMessage({}, () => {
      this.searchHandler()
    })
  }

  readHandler = () => {
    this.props.readMessage(this.state.selectedRows.map(item => {
      return item.id
    }), () => {
      this.setState({
        selectedRows: [],
        selectedRowKeys: []
      })
      this.searchHandler()
    })
  }

  deleteHandler = () => {
    this.props.deleteMessage(this.state.selectedRows.map(item => {
      return item.id
    }), () => {
      this.setState({
        selectedRows: [],
        selectedRowKeys: []
      })
      this.searchHandler()
    })
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRows: selectedRows,
      selectedRowKeys: selectedRowKeys
    })
  }

  componentDidMount() {
    this.props.getMessageCategory()
    this.searchHandler()
  }

  componentWillReceiveProps({ messageList }) {
    if (this.props.messageList !== messageList) {
      messageList.data.forEach((item, index) => {
        item.key = `${item.id}-${index}`
      })

      this.pagination.total = messageList.total
    }
  }

  render() {
    let { messageCategory } = this.props
    let { messageList } = this.props
    let { selectedRows, selectedRowKeys } = this.state
    let rowSelection = {
      selectedRowKeys: selectedRowKeys,
      selectedRows: selectedRows,
      onChange: this.onSelectChange
    }
    return (
      <div className='message-center-home-component'>
        <HzBreadcrumb />
        <div className='filter-area'>
          {/* <div className='title'>消息中心</div> */}
          <div className='status'>
            <div className='label'>状态</div>
            <div className={typeof this.state.filterObj.status !== 'number' ? 'item active' : 'item'}
              onClick={() => {
                this.statusHandler()
              }}>全部
            </div>
            <div className={this.state.filterObj.status === 1 ? 'item active' : 'item'}
              onClick={() => {
                this.statusHandler(1)
              }}>已读
            </div>
            <div className={this.state.filterObj.status === 0 ? 'item active' : 'item'}
              onClick={() => {
                this.statusHandler(0)
              }}>未读
            </div>
          </div>
          <div className='message-type'>
            <div className='first'>
              <div className='label'>消息类型</div>
              <div className={typeof this.state.currentFirstId !== 'number' ? 'item active' : 'item'}
                onClick={() => {
                  this.firstCategoryHandler()
                }}
              >全部
              </div>
              {messageCategory.data.map(item => {
                return (
                  <div className={item.id === this.state.currentFirstId ? 'item active' : 'item'}
                    key={item.id}
                    onClick={() => {
                      this.firstCategoryHandler(item)
                    }}
                  >{item.name}</div>
                )
              })}
            </div>
            {this.state.secondCategory.length > 0 &&
              <div className='second'>
                <div className={typeof this.state.currentSecondId !== 'number' ? 'item active' : 'item'}
                  onClick={() => {
                    this.secondCategoryHandler()
                  }}
                >全部
              </div>
                {this.state.secondCategory.map(item => {
                  return (
                    <div className={item.id === this.state.currentSecondId ? 'item active' : 'item'}
                      key={item.id}
                      onClick={() => {
                        this.secondCategoryHandler(item)
                      }}
                    >{item.name}</div>
                  )
                })}
              </div>
            }

          </div>
        </div>
        <div className='table-area'>
          <Button className="btn-style" onClick={this.deleteHandler}>删除</Button>
          <Button className="btn-style" onClick={this.readHandler}>标记为已读</Button>
          <Button className="btn-style" onClick={this.readAllHandler}>全部标记为已读</Button>

          <div className='search-container'>
            <Search
              placeholder='请输入消息关键字搜索'
              onChange={(ev) => {
                const filterObj = this.state.filterObj
                const value = ev.target.value
                this.setState({
                  filterObj: Object.assign({}, filterObj, { keyWord: value })
                })
              }}
              onSearch={this.searchHandler}
            />
          </div>

          <div className='hz-table'>
            <Table
              columns={this.columns}
              bordered
              dataSource={messageList.data}
              pagination={this.pagination.total > 10 ? this.pagination : false}
              rowSelection={rowSelection}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Home
