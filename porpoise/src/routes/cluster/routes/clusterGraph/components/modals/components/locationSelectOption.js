/**
 * @desc: {企业列表，高级筛选弹窗，省份地区}
 * @author: xieyuzhong
 * @Date: 2019-01-09 14:48:37
 * @Last Modified by: zhengyiqiu
 * @Last Modified time: 2019-02-26 14:58:33
 */
import React from 'react'

class LocationSelectOption extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      expand: !this.props.showExpandBtn,
      provinces: [],
      cities: [],
      curProvince: ''
    }

    this.isMulti = this.props.isMulti || false
    this.onChange = this.props.onChange || (() => { })
    this.defaultSelection = this.props.defaultSelection || '全部'
  }

  componentDidMount() {
    fetch('/api/getProvinces').then((response) => {
      if (!response.ok) {
        throw Error(response.status)
      }
      return response
    }).then((response) => {
      return response.json()
    }).then((data) => {
      if (!data.status) {
        this.setState({
          provinces: [{ name: '全部' }, ...data.data]
        })
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    const { filters, title } = nextProps
    if (filters !== this.props.filters) {
      if (!filters[title] || filters[title][this.defaultSelection]) {
        this.setState({
          cities: []
        })
      }
    }
  }

  onClickProvince = (selection) => {
    const selectName = selection.name
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
      curProvince: selectName
    })
    let keys = Object.keys(newFilters[title] || {})
    // 省份双击取消或者点击全部时去掉市区子筛选区域
    if (selectName === this.defaultSelection || !keys.includes(selectName)) {
      this.setState({
        cities: []
      })
      return
    }
    this.getCities(selectName)
  }

  getCities = (name) => {
    fetch(`/api/getCities?province=${encodeURIComponent(name)}`).then((response) => {
      if (!response.ok) {
        throw Error(response.status)
      }
      return response
    }).then((response) => {
      return response.json()
    }).then((data) => {
      if (!data.code) {
        const cities = Object.keys(data.data.subFilterData)
        if (cities.length === 1) {
          this.setState({
            cities: []  // 直辖市不再展示市区，只展示全部
          })
        } else {
          this.setState({
            cities: ['全部', ...cities]
          })
        }
      }
    })
  }

  onClickCity = (selection) => {
    const { title, filters } = this.props
    const { curProvince } = this.state
    const newFilters = Object.assign({}, filters)
    if (this.isMulti) {
      if (selection === this.defaultSelection) {
        newFilters[title][curProvince] = [this.defaultSelection]
      } else {
        newFilters[title][curProvince] = newFilters[title][curProvince]
          .filter((c) => c !== this.defaultSelection)
        if (!newFilters[title][curProvince].includes(selection)) {
          newFilters[title][curProvince].push(selection)
        } else {
          newFilters[title][curProvince] = newFilters[title][curProvince].filter(v => v !== selection)
          // 如果只选中了一个城市，双击城市就高亮全部
          if (newFilters[title][curProvince].length === 0) {
            newFilters[title][curProvince] = [this.defaultSelection]
          }
        }
      }
    } else {
      if (!newFilters[title][curProvince].includes(selection)) {
        newFilters[title][curProvince] = [selection]
      } else {
        newFilters[title][curProvince] = newFilters[title][curProvince].filter(v => v !== selection)
      }
    }
    this.onChange(newFilters)
  }

  onClickExpandBtn = () => {
    this.setState({
      expand: !this.state.expand,
      cities: this.state.expand ? [] : this.state.cities  // 收起时 cities 也收起
    })
  }

  render() {
    const {
      title,
      filters
    } = this.props
    const filter = filters[title] || { [this.defaultSelection]: [] }

    return (
      <div className='filter-option'>
        <span className='filter-title'>{`${title}${this.isMulti ? '[多选]' : ''}`}</span>
        {
          this.state.provinces.length !== 0 && this.state.provinces[0].name === '全部' ? (
            <span
              className={filter[this.state.provinces[0].name]
                ? 'filter-option-item active' : 'filter-option-item'}
              onClick={() => this.onClickProvince(this.state.provinces[0])}>
              {this.state.provinces[0].name}
            </span>) : ''
        }
        <ul className={this.state.expand ? 'filter-option-list' : 'filter-option-list single-line'}>
          {
            this.state.provinces.map((p, idx) => {
              if (idx === 0 && p.name === '全部') {
                return
              }
              return (
                <li
                  className={filter[p.name]
                    ? 'filter-option-item active' : 'filter-option-item'}
                  key={title + idx}
                  onClick={() => this.onClickProvince(p)}
                >
                  {p.name}
                </li>
              )
            })
          }
        </ul>
        {
          this.state.cities.length ? (
            <div className='filter-option-sub-list'>
              {
                this.state.cities.length !== 0 && this.state.cities[0] === '全部' ? (
                  <span
                    className={
                      `filter-option-item filter-option-sub-item
                      ${filter[this.state.curProvince] && filter[this.state.curProvince].includes(this.state.cities[0]) ? 'active' : ''}`
                    }
                    onClick={() => this.onClickCity(this.state.cities[0])}>
                    {this.state.cities[0]}
                  </span>) : ''
              }
              {
                this.state.cities.length ? (
                  <ul className='clearfix'>
                    {
                      this.state.cities.map((c, idx) => {
                        if (idx === 0 && c === '全部') return
                        return (
                          <li
                            className={
                              `filter-option-item filter-option-sub-item
                              ${filter[this.state.curProvince] && filter[this.state.curProvince].includes(c) ? 'active' : ''}`
                            }
                            key={idx}
                            onClick={() => this.onClickCity(c)}
                          >
                            {c}
                          </li>
                        )
                      })
                    }
                  </ul>
                ) : null
              }
            </div>) : ''
        }
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

export default LocationSelectOption
