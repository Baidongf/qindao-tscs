/**
 * @desc: { 企业列表，高级筛选弹窗，行业分类 }
 * @author: zhengyiqiu
 * @Create Date: 2019-02-25 17:05:16
 * @Last Modified by: zhengyiqiu
 * @Last Modified time: 2019-03-07 11:52:27
 */
import React from 'react'

class IndustrySelectOption extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      expand: !this.props.showExpandBtn,
      industry: [],
      industryDetail: [],
      curIndustry: ''
    }

    this.isMulti = this.props.isMulti || false
    this.onChange = this.props.onChange || (() => {})
    this.defaultSelection = this.props.defaultSelection || '全部'
  }

  componentDidMount () {
    fetch('/api/search/findIndustryCategory?parentRecordId=0').then((response) => {
      if (!response.ok) {
        throw Error(response.status)
      }
      return response
    }).then((response) => {
      return response.json()
    }).then((data) => {
      if (!data.status) {
        this.setState({
          industry: [{ name: '全部' }, ...data.data]
        })
      }
    })
  }

  componentWillReceiveProps (nextProps) {
    const { filters, title } = nextProps
    if (filters !== this.props.filters) {
      if (!filters[title] || filters[title][this.defaultSelection]) {
        this.setState({
          industryDetail: []
        })
      }
    }
  }

  onClickIndustry = (selection) => {
    const selectName = selection.name
    const selectId = selection.recordId
    const { title, filters } = this.props
    let newFilters = Object.assign({}, filters)
    newFilters[title] = newFilters[title] || { [this.defaultSelection]: [] }
    if (this.isMulti) {
      if (selectName === this.defaultSelection) {
        newFilters[title] = { [this.defaultSelection]: [] }
      } else {
        delete newFilters[title][this.defaultSelection]
        if (!newFilters[title][selectName]) {
          newFilters[title][selectName] = [this.defaultSelection]
        } else {
          // 删除二次点击的省
          delete newFilters[title][selectName]
        }
      }
    } else {
      if (!newFilters[title][selectName]) {
        newFilters[title] = { [selectName]: [] }
      } else {
        delete newFilters[title][selectName]
      }
    }
    this.onChange(newFilters)
    this.setState({
      curIndustry: selectName
    })
    let keys = Object.keys(newFilters[title] || {})
    // 一级行业双击取消或者点击全部时去掉子筛选区域
    if (selectName === this.defaultSelection || !keys.includes(selectName)) {
      this.setState({
        industryDetail: []
      })
      return
    }
    this.getIndustryDetail(selectName, selectId)
  }

  getIndustryDetail = (name, id) => {
    fetch(`/api/search/findIndustryCategory?parentRecordId=${id}`).then((response) => {
      if (!response.ok) {
        throw Error(response.status)
      }
      return response
    }).then((response) => {
      return response.json()
    }).then((data) => {
      if (!data.code) {
        const industryDetail = data.data
        this.setState({
          industryDetail: ['全部', ...industryDetail]
        })
      }
    })
  }

  onClickIndustryDetail = (selection) => {
    const { title, filters } = this.props
    const { curIndustry } = this.state
    const newFilters = Object.assign({}, filters)
    if (this.isMulti) {
      if (selection === this.defaultSelection) {
        newFilters[title][curIndustry] = [this.defaultSelection]
      } else {
        newFilters[title][curIndustry] = newFilters[title][curIndustry]
          .filter((c) => c !== this.defaultSelection)
        if (!newFilters[title][curIndustry].includes(selection)) {
          newFilters[title][curIndustry].push(selection)
        } else {
          newFilters[title][curIndustry] = newFilters[title][curIndustry].filter(v=>v!==selection)
          // 如果只选中了一个城市，双击城市就高亮全部
          if (newFilters[title][curIndustry].length === 0) {
            newFilters[title][curIndustry] = [this.defaultSelection]
          }
        }
      }
    } else {
      if (!newFilters[title][curIndustry].includes(selection)) {
        newFilters[title][curIndustry] = [selection]
      } else {
        newFilters[title][curIndustry] = newFilters[title][curIndustry].filter(v=>v!==selection)
      }
    }
    this.onChange(newFilters)
  }

  onClickExpandBtn = () => {
    this.setState({
      expand: !this.state.expand,
      industryDetail: this.state.expand ? [] : this.state.industryDetail  // 收起时 industryDetail 也收起
    })
  }

  render () {
    const {
      title,
      filters
    } = this.props

    const filter = filters[title] || { [this.defaultSelection]: [] }

    return (
      <div className='filter-option'>
        <span className='filter-title'>{ `${title}${this.isMulti ? '[多选]' : ''}` }</span>
        {
          this.state.industry.length !== 0 && this.state.industry[0].name === '全部' ? (
            <span
              className={filter[this.state.industry[0].name]
                ? 'filter-option-item active' : 'filter-option-item'}
              onClick={() => this.onClickIndustry(this.state.industry[0])}>
              {this.state.industry[0].name}
            </span>) : ''
        }
        <ul className={this.state.expand ? 'filter-option-list' : 'filter-option-list single-line'}>
          {
            this.state.industry.map((p, idx) => {
              if (idx === 0 && p.name === '全部') {
                return
              }
              return (
                <li
                  className={filter[p.name]
                    ? 'filter-option-item active' : 'filter-option-item'}
                  key={title + idx}
                  onClick={() => this.onClickIndustry(p)}
                >
                  {p.name}
                </li>
              )
            })
          }
        </ul>
        {
          this.state.industryDetail.length ? (
            <div className='filter-option-sub-list'>
              {
                this.state.industryDetail.length !== 0 && this.state.industryDetail[0] === '全部' ? (
                  <span
                    className={
                      `filter-option-item filter-option-sub-item
                      ${filter[this.state.curIndustry] && filter[this.state.curIndustry].includes(this.state.industryDetail[0]) ? 'active' : ''}`
                    }
                    onClick={() => this.onClickIndustryDetail(this.state.industryDetail[0])}>
                    {this.state.industryDetail[0]}
                  </span>) : ''
              }
              {
                this.state.industryDetail.length ? (
                  <ul className='clearfix'>
                    {
                      this.state.industryDetail.map((c, idx) => {
                        let cName = typeof c === 'string' ? c : c.name
                        if (idx === 0 && cName === '全部') return
                        return (
                          <li
                            className={
                              `filter-option-item filter-option-sub-item
                              ${filter[this.state.curIndustry] && filter[this.state.curIndustry].includes(cName) ? 'active' : ''}`
                            }
                            key={idx}
                            onClick={() => this.onClickIndustryDetail(cName)}
                          >
                            {cName}
                          </li>
                        )
                      })
                    }
                  </ul>
                ) : null
              }
            </div>) : ''
        }
        {/* {
          this.state.industryDetail.length ? (
            <ul className='filter-option-sub-list clearfix'>
              {
                this.state.industryDetail.map((c, idx) =>{
                  let cName = typeof c == 'string' ? c : c.name
                  return (
                    <li
                      className={
                        `filter-option-item filter-option-sub-item
                        ${filter[this.state.curIndustry] && filter[this.state.curIndustry].includes(cName) ? 'active' : ''}`
                      }
                      key={idx}
                      onClick={() => this.onClickIndustryDetail(cName)}
                    >
                      {cName}
                    </li>
                  )
                })
              }
            </ul>
          ) : null
        } */}
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

export default IndustrySelectOption
