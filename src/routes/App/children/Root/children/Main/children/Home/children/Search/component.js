import React from 'react'
import { Input, message } from 'antd'
import './component.scss'
import { withRouter } from 'react-router-dom'

const SearchInput = Input.Search

/**
 * Search
 * @desc  首页搜索框
 */
class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchKeyword: ''
    }

    this.searchHandler = this.searchHandler.bind(this)
    this.searchWhenInput = this.searchWhenInput.bind(this)

    this.timeoutId = null
  }

  searchHandler(value) {
    let keyword = value.trim()
    if (keyword === '') {
      message.info('请输入搜索关键词')
    } else {
      keyword = encodeURIComponent(keyword)
      this.props.history.push(`/root/main/searchResult?keyword=${keyword}`)
    }
  }


  searchWhenInput(ev) {
    let keyword = ev.target.value.trim()
    this.setState({ searchKeyword: keyword })
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

  render() {

    const { customerList } = this.props
    const { searchKeyword } = this.state

    return (
      <div className='search-component'>
        <SearchInput
          placeholder='请输入客户名称查询'
          onSearch={this.searchHandler}
          className='search-input'
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
    )
  }
}

export default withRouter(Search)
