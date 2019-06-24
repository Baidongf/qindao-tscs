/**
 * @file 搜索提示组件
 * @author zhutianpeng@haizhi.com
 */
import React from 'react'
import { connect } from 'react-redux'
import { fetchSearchSuggested, clearSearchSuggested } from '../../actions/SearchSuggested'
import './SearchSuggested.scss'
import { debounce } from 'throttle-debounce'
import PropTypes from 'prop-types'
import ReactPlaceholderSupport from 'react-placeholder-support'
const Input = ReactPlaceholderSupport('input')

/**
 * 搜索框组件
 */
class SearchSuggested extends React.Component {
  /**
   * constructor
   * @param {Object} props props
   */
  constructor (props) {
    super(props)
    this.state = {
      isInputActive: false,
      isDeleteButtonShow: false,
      isSuggestedListShow: false,
      value: this.props.value || '',
      activeIndex: -1
    }
    this.isOnComposition = false

    this.getSearchSuggested = debounce(500, this.props.getSearchSuggested)
    this.handleChange = this.handleChange.bind(this)
    this.handleComposition = this.handleComposition.bind(this)
    this.handleInputAndSearch = this.handleInputAndSearch.bind(this)
  }
  /**
   * 更新搜索框内容
   * @param  {Object} nextProps nextProps
   */
  componentWillReceiveProps (nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value })
    }
    if (nextProps.clearInput) {
      if (this.props.clearInput) { } // do nothing, eslint prop validation 的 bug, this.props.clearInput 必须要用一下...
      this.setState({ value: '' })
    }
  }

  /**
   * 输入框发生更改
   * @param {Object} event event
   */
  handleChange (event) {
    let v = event.target.value
    this.handleInputAndSearch(v)
  }

  handleComposition (e) {
    if (e.type === 'compositionend') {
      this.isOnComposition = false
      this.handleInputAndSearch(e.target.value)
    } else {
      this.isOnComposition = true
    }
  }

  handleInputAndSearch (v) {
    if (v) {
      this.setState({
        isInputActive: true,
        isDeleteButtonShow: true,
        isSuggestedListShow: true
      })
      this.state.value = v
      if (this.props.hideSuggestedList) {
        this.setState({
          isSuggestedListShow: false
        })
      } else if (!this.isOnComposition) {
        this.getSearchSuggested(v)
      }
    } else {
      this.setState({
        isInputActive: true,
        isDeleteButtonShow: false,
        isSuggestedListShow: false,
        value: v
      })
      this.props.clearSearchSuggested()
    }
    this.props.handleChange && this.props.handleChange(v)
  }

  /**
   * 输入框 focus
   * @param {Object} event event
   */
  handleFocus (event) {
    this.setState({
      isInputActive: true,
      isDeleteButtonShow: !!this.state.value
    })
  }

  /**
   * 输入框blur
   * @param {Object} event event
   */
  handleBlur (event) {
    this.setState({
      isInputActive: false,
      isSuggestedListShow: false,
      isDeleteButtonShow: !!this.state.value
    })
  }

  /**
   * 清空输入框
   */
  handleDelete () {
    this.setState({
      value: '',
      isDeleteButtonShow: false
    })
    this.selectSuggest('')
  }

  /**
   * 跳转至新页面
   */
  _gotoNewPage () {
    this.handleBlur()
    if (!this.props.goToNewPage) return

    const snapshot = this.props.reduxLocation.query.operation === 'snapshot' ? '&operation=snapshot' : ''
    if (this.props.searchSuggested.result) {
      if (this.state.activeIndex >= 0) {
        if (this.props.searchSuggested.result[this.state.activeIndex].name) {
          let name = this.props.searchSuggested.result[this.state.activeIndex].name
          window.open(`http://${location.host}${location.pathname}#/graph?company=${encodeURIComponent(name)}&type=Graph${snapshot}`, '_blank')
          return
        }
      }
    }

    window.open(`
      http://${location.host}${location.pathname}#graph?company=${encodeURIComponent(this.state.value)}&type=Graph${snapshot}
    `, '_blank')
  }

  /**
   * 点击搜索按钮，跳转至新页面，使用当前输入框中的值
   * @param {Object} event event
   */
  searchGotoNewPage (event) {
    if (!this.state.value) return
    this._gotoNewPage()
    this.props.searchHandler && this.props.searchHandler(this.state.value)
  }

  /**
   * 选择下拉框
   * @param {string} name 搜索提示
   */
  selectSuggest (name) {
    this.props.selectSuggest && this.props.selectSuggest(name)
  }

  /**
   * 鼠标选择下拉框
   * @param {Object} event event
   * @param {Number} index click index
   */
  handleMousedown (event, index) {
    const name = this.props.searchSuggested.result[index].name
    this.state.activeIndex = index
    this.setState({
      value: name
    })
    this.selectSuggest(name)
    this._gotoNewPage()
  }

  /**
   * 键盘选择下拉框
   * @param {Object} event event
   * @return {Boolean} nothing
   */
  handleKeyUp (event) {
    // 如果搜索提示列表或者处于拼音选词状态，不响应
    if (!this.props.searchSuggested.result || this.isOnComposition) {
      return false
    }
    let len = this.props.searchSuggested.result.length
    if (len <= 0) {
      return false
    }
    let current = event.target
    let parent = current.parentNode
    let child = parent.childNodes
    let ul = null
    for (let i in child) {
      if (child[i].className && child[i].className.includes('search-suggested-ul')) {
        ul = child[i]
      }
    }
    if (event.keyCode === 13) {
      this.selectSuggest(this.state.value)
      this._gotoNewPage()
    } else if (event.keyCode === 38) { // 向上键
      if (ul) {
        let clientHeight = ul.clientHeight
        let liHeight = ul.childNodes[0].clientHeight
        if (this.state.activeIndex <= 0) {
          this.setState({
            activeIndex: len - 1,
            value: this.props.searchSuggested.result[len - 1].name
          })
        } else {
          // 其他情况
          this.setState({
            activeIndex: this.state.activeIndex - 1,
            value: this.props.searchSuggested.result[this.state.activeIndex - 1].name
          })
          // 当前项移动的高度
          let offsetHeight = this.state.activeIndex * liHeight
          if (offsetHeight - clientHeight > 0) {
            ul.scrollTop = offsetHeight - 64
          } else {
            ul.scrollTop = 0
          }
        }
      }
    } else if (event.keyCode === 40) { // 向下键
      if (ul) {
        let clientHeight = ul.clientHeight
        let liHeight = ul.childNodes[0].clientHeight
        if (this.state.activeIndex < 0) {
          // 默认情况
          this.setState({
            activeIndex: 0,
            value: this.props.searchSuggested.result[0].name
          })
        } else if (this.state.activeIndex === len - 1) {
          // 当前在最后一项
          this.setState({
            activeIndex: 0,
            value: this.props.searchSuggested.result[0].name
          })
          ul.scrollTop = 0
        } else {
          // 其他情况
          this.setState({
            activeIndex: this.state.activeIndex + 1,
            value: this.props.searchSuggested.result[this.state.activeIndex + 1].name
          })
          // 当前项移动的高度
          let offsetHeight = this.state.activeIndex * liHeight
          if (offsetHeight - clientHeight > -64) {
            ul.scrollTop = offsetHeight - 64
          }
        }
      }
    } else {
      this.setState({
        activeIndex: -1
      })
      // console.log('!enter!up!down')
    }
  }

  /**
   * render
   * @return {Object} render object
   */
  render () {
    let { searchSuggested, placeholder } = this.props
    let searchSuggestedList = searchSuggested.result ? searchSuggested.result : []
    return (
      <div className='search-box' onKeyUp={(e) => this.handleKeyUp(e)}>
        <Input
          className={this.state.isInputActive ? 'search-input active' : 'search-input'}
          placeholder={placeholder || '请输入企业名称'}
          type='text'
          value={this.state.value}
          onCompositionStart={this.handleComposition}
          onCompositionUpdate={this.handleComposition}
          onCompositionEnd={this.handleComposition}
          onChange={this.handleChange}
          onFocus={() => this.handleFocus()}
          onBlur={(e) => this.handleBlur(e)}
          disabled={this.props.disableInput}
        />
        <i className='search-button' onClick={(e) => this.searchGotoNewPage(e)} />
        <i
          className={this.state.isDeleteButtonShow ? 'search-delete-button' : 'search-delete-button hide'}
          onClick={() => this.handleDelete()}
        />
        <ul className={this.state.isSuggestedListShow ? 'search-suggested-ul scroll-style show'
          : 'search-suggested-ul scroll-style'}>
          {
            searchSuggestedList.map((item, index) => {
              return (<li
                key={item._record_id}
                className={this.state.activeIndex === index ? 'search-suggested-li active' : 'search-suggested-li'}
                onMouseDown={(e) => this.handleMousedown(e, index)}
                onKeyUp={(e) => this.handleKeyUp(e)}
              >
                {item.name}
              </li>
              )
            }
            )
          }
        </ul>
      </div>
    )
  }
}

SearchSuggested.propTypes = {
  searchSuggested: PropTypes.object,
  value: PropTypes.string,
  clearInput: PropTypes.bool,
  getSearchSuggested: PropTypes.func,
  handleChange: PropTypes.func,
  goToNewPage: PropTypes.bool,
  selectSuggest: PropTypes.func,
  clearSearchSuggested: PropTypes.func,
  searchHandler: PropTypes.func,
  hideSuggestedList: PropTypes.bool,
  placeholder: PropTypes.string,
  disableInput: PropTypes.bool,
  reduxLocation: PropTypes.object
}

/**
 * map state to Props
 * @param {Object} state state
 * @return {Object} state
 */
const mapStateToProps = function (state) {
  return {
    searchSuggested: state.searchSuggested,
    isLoading: state.searchSuggestedIsLoading,
    curNode: state.curNode,
    reduxLocation: state.location
  }
}

/**
 * map dispatch to Props
 * @param {Object} dispatch dispatch
 * @return {Object} dispatch
 */
const mapDispatchToProps = (dispatch) => {
  return {
    getSearchSuggested: (keyword) => dispatch(fetchSearchSuggested(keyword)),
    clearSearchSuggested: () => dispatch(clearSearchSuggested())
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(SearchSuggested)
