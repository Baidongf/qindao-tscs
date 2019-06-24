/**
 * @desc: {企业列表，高级筛选弹窗，单选 / 多选}
 * @author: xieyuzhong
 * @Date: 2019-01-09 14:48:37
 * @Last Modified by: zhengyiqiu
 * @Last Modified time: 2019-02-25 16:47:08
 */
import React from 'react'

class SelectFilterOption extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      expand: !this.props.showExpandBtn
    }

    this.isMulti = this.props.isMulti || false
    this.onChange = this.props.onChange || (() => {})
    this.defaultSelection = this.props.defaultSelection || '全部'
  }

  onClickSelection = (selection) => {
    const { title, filters } = this.props
    let newFilters = Object.assign({}, filters)
    newFilters[title] = newFilters[title] || [this.defaultSelection]
    if (this.isMulti) {
      if (selection === this.defaultSelection) {
        newFilters[title] = [selection]
      } else {
        newFilters[title] = newFilters[title].filter((f) => f !== this.defaultSelection)
        if (!newFilters[title].includes(selection)) {
          newFilters[title].push(selection)
        } else {
          newFilters[title] = newFilters[title].filter(v=>v!==selection)
        }
      }
    } else {
      if (!newFilters[title].includes(selection)) {
        newFilters[title] = [selection]
      } else {
        newFilters[title] = newFilters[title].filter(v=>v!==selection)
      }
    }
    this.onChange(newFilters)
  }

  onClickExpandBtn = () => {
    this.setState({
      expand: !this.state.expand
    })
  }

  render () {
    const {
      selections = [],
      title,
      filters
    } = this.props

    const filterList = filters[title] || [this.defaultSelection]

    return (
      <div className='filter-option'>
        <span className='filter-title'>{ `${title}${this.isMulti ? '[多选]' : ''}` }</span>
        {
          selections.length !== 0 && selections[0] === '全部' ? (
            <span
              className={filterList.includes(selections[0])
                ? 'filter-option-item active' : 'filter-option-item'}
              onClick={() => this.onClickSelection(selections[0])}>
              {selections[0]}
            </span>) : ''
        }
        <ul className={this.state.expand ? 'filter-option-list' : 'filter-option-list single-line'}>
          {
            selections.map((sel, idx) => {
              if (idx === 0 && sel === '全部') return
              return (
                <li className={filterList.includes(sel) ? 'filter-option-item active' : 'filter-option-item'}
                  key={title + idx}
                  onClick={() => this.onClickSelection(sel)}
                >
                  {sel}
                </li>
              )
            })
          }
        </ul>
        {
          this.props.showExpandBtn ? (
            <button className={`btn ok-btn expand-btn ${this.state.expand ? 'up-btn-icon' : 'down-btn-icon'}`} onClick={this.onClickExpandBtn}>
              {this.state.expand ? '收起' : '更多'}
            </button>
          ) : null
        }
      </div>
    )
  }
}

export default SelectFilterOption
