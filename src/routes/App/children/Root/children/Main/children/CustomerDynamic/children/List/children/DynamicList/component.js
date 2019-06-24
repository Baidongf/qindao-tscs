import React from 'react'
import './component.scss'
import { Pagination } from 'antd'
import ListTitle from './children/ListTitle'
import DynamicItem from './children/DynamicItem'

class DynamicList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.pagination = {
      current: 1,
      pageSize: 10,
    }

    this.handlePageChange = this.handlePageChange.bind(this)
    this.handlePageSizeChange = this.handlePageSizeChange.bind(this)
  }

  handlePageSizeChange(page, pageSize) {
    const { dynamicFilter, institutionDynamicFilter, myDynamicFilter, listType } = this.props
    this.pagination.pageSize = pageSize
    dynamicFilter.pageSize = pageSize

    if (listType === 'institutionDynamic') {
      institutionDynamicFilter.pageSize = pageSize
      this.props.getInstitutionDynamicLst(institutionDynamicFilter)
    } else if (listType === 'myDynamic') {
      myDynamicFilter.pageSize = pageSize
      this.props.getMyDynamicList(myDynamicFilter)
    }
  }

  handlePageChange(page, pageSize) {
    const { dynamicFilter, listType, institutionDynamicFilter, myDynamicFilter } = this.props
    this.pagination.current = page
    dynamicFilter.pageNo = page

    if (listType === 'institutionDynamic') {
      institutionDynamicFilter.pageNo = page
      this.props.getInstitutionDynamicList(institutionDynamicFilter)
    } else if (listType === 'myDynamic') {
      myDynamicFilter.pageNo = page
      this.props.getMyDynamicList(myDynamicFilter)
    }
  }

  componentDidMount() {
    const { listType } = this.props
    if (listType === 'institutionDynamic') {
      this.props.getInstitutionDynamicList()
    } else if (listType === 'myDynamic') {
      this.props.getMyDynamicList()
    } else {
      console.log('未传入指定的 listType')
    }
    // this.props.getDynamicList()
  }

  render() {

    const { listType, institutionDynamicList, myDynamicList } = this.props
    let renderDynamicList = { data: [] }

    if (listType === 'institutionDynamic') {
      renderDynamicList = institutionDynamicList
    } else if (listType === 'myDynamic') {
      renderDynamicList = myDynamicList
    }
    return (
      <div className='dynamic-list-component'>
        <div className='count-info'>
          共 <span className='color-red'>{renderDynamicList.total}</span> 条动态信息
        </div>

        <div className='list-container'>

          {/* 搜索结果标题栏 */}
          <ListTitle type={listType} />

          {/* 搜索结果内容区 */}
          <div className='list-content'>
            {
              renderDynamicList.data.length
                ? renderDynamicList.data.map((item) => {
                  return (
                    <DynamicItem
                      key={item.objectKey}
                      item={item}
                      type={listType}
                    />
                  )
                })
                : (
                  <div className='no-content'>
                    暂无数据
                  </div>
                )
            }
          </div>

          <div className='pagination-container'>
            {
              renderDynamicList.total && renderDynamicList.total > 0 ?
                <Pagination
                  showSizeChanger
                  showQuickJumper
                  current={this.pagination.current}
                  pageSize={this.pagination.pageSize}
                  total={renderDynamicList.total}
                  onShowSizeChange={this.handlePageSizeChange}
                  onChange={this.handlePageChange}
                /> : null
            }
          </div>
        </div>
      </div>
    )
  }
}

export default DynamicList
