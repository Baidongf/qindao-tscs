import React from 'react'
import './component.scss'
import { withRouter } from 'react-router-dom'
import { Pagination } from 'antd'
import RecentBrowse from './children/RecentBrowse'
import SearchResultItem from './children/SearchResultItem'

class SearchResultPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      keyword: ''
    }

    this.pagination = {
      current: 1,
      pageSize: 10,
      showQuickJumper: true,
      showSizeChanger: true,
      onChange: (page, pageSize) => {
        this.pagination.current = page
        this.search()
      },
      onShowSizeChange: (page, pageSize) => {
        this.pagination.pageSize = pageSize
        this.search()
      }
    }

    this.search = this.search.bind(this)
  }

  getKeyword() {
    const search = this.props.location.search
    const keyword = decodeURIComponent(search.substring(9))
    this.setState({ keyword })
  }

  componentWillMount() {
    this.getKeyword()
  }

  search() {
    const { keyword } = this.state
    const { pageSize, current } = this.pagination
    this.props.search({
      keyWord: keyword,
      pageSize,
      pageNo: current
    })
  }

  componentDidMount() {
    this.search()
  }

  componentWillReceiveProps({ customerList }) {
    if (customerList !== this.props.customerList) {
      this.pagination.total = customerList.total
    }
  }


  render() {

    const { keyword } = this.state
    const { customerList } = this.props

    return (
      <div className='search-result-component'>

        {/* 搜索结果区 */}
        <div className='search-result-container'>
          <div className='search-result-info'>
            为您搜索到
            <span className='span'> { customerList.total } </span>
            条关于
            <span className='span'> { keyword } </span>
            的记录
          </div>

          <div className='search-result-type'>企业</div>

          <div className='search-result-list-container'>
            {
              customerList.data.map(item => {
                return (
                  <SearchResultItem
                    key={item.objectKey}
                    data={item}
                  />
                )
              })
            }
            {
              // 搜索结果为空时的展示图片
              typeof customerList.total !== 'undefined' && customerList.total === 0 ?
              <div className='no-result-tip'></div> : null
            }
          </div>

          {
            this.pagination.total && this.pagination.total > this.pagination.pageSize ?
            <div className='pagination-container'>
              <Pagination
                {...this.pagination}
              />
            </div> : null
          }

        </div>

        {/* 最近浏览区 */}
        <div className='recent-browse-container'>
          <RecentBrowse />
        </div>

      </div>
    )
  }
}

export default withRouter(SearchResultPage)
