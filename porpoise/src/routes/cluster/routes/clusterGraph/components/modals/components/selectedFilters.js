import React from 'react'
import './selectedFilters.scss'

class SelectedFilters extends React.Component {

  removeListFilterItem = (parentList, item) => {
    if (this.props.disableClick) {
      return
    }
    const idx = parentList.indexOf(item)
    parentList.splice(idx, 1)
    if (!parentList.length) {
      parentList.push('全部')
    }
    this.props.onChange(Object.assign({}, this.props.filters))
  }

  removeRangeFilter = (key) => {
    if (this.props.disableClick) {
      return
    }
    const { filters } = this.props
    delete filters[key]
    this.props.onChange(Object.assign({}, filters))
  }

  removeLocation = (filter, province, city) => {
    if (this.props.disableClick) {
      return
    }
    if (!city) {
      delete filter[province]
    } else {
      const provinceList = filter[province]
      const idx = provinceList.indexOf(city)
      provinceList.splice(idx, 1)
      if (!provinceList.length) {
        delete filter[province]
      }
    }
    this.props.onChange(Object.assign({}, this.props.filters))
  }

  getSelectedFilters = () => {
    const { filters } = this.props
    const filterLis = []

    Object.keys(filters).map((key) => {
      const filter = filters[key]
      if (filter instanceof Array) {  // array
        filter.forEach((f) => {
          filterLis.push(
            <li key={key + f} className='filter-result-item'
              onClick={() => this.removeListFilterItem(filter, f)}
            >
              {key}: {f}
            </li>
          )
        })
      } else if (typeof filter === 'object') {
        if ('min' in filter && 'max' in filter) { // range, min - max
          filterLis.push(
            <li key={key} className='filter-result-item'
              onClick={() => this.removeRangeFilter(key)}
            >
              {key}: {filter.min_display} - {filter.max_display} {filter.unit}
            </li>
          )
        } else if ('min' in filter) { // range, min
          filterLis.push(
            <li key={key} className='filter-result-item'
              onClick={() => this.removeRangeFilter(key)}
            >
              {key}: {filter.min_display} {filter.unit}以上
            </li>
          )
        } else if ('max' in filter) { // range, max
          filterLis.push(
            <li key={key} className='filter-result-item'
              onClick={() => this.removeRangeFilter(key)}
            >
              {key}: {filter.max_display} {filter.unit}以内
            </li>
          )
        } else if (key === '省份地区') {  // location
          Object.keys(filter).forEach((province) => {
            filter[province].forEach((city) => {
              if (city === '全部') {
                filterLis.push(
                  <li key={key + province} className='filter-result-item'
                    onClick={() => this.removeLocation(filter, province)}
                  >
                    {key}: {province}
                  </li>
                )
              } else {
                filterLis.push(
                  <li key={key + province + city} className='filter-result-item'
                    onClick={() => this.removeLocation(filter, province, city)}
                  >
                    {key}: {province}{city}
                  </li>
                )
              }
            })
          })
        } else if (key === '行业门类') {  // location
          Object.keys(filter).forEach((industry) => {
            filter[industry].forEach((industryDetail) => {
              if (industryDetail === '全部') {
                filterLis.push(
                  <li key={key + industry} className='filter-result-item'
                    onClick={() => this.removeLocation(filter, industry)}
                  >
                    {key}: {industry}
                  </li>
                )
              } else {
                filterLis.push(
                  <li key={key + industry + industryDetail} className='filter-result-item'
                    onClick={() => this.removeLocation(filter, industry, industryDetail)}
                  >
                    {key}: {industry}/{industryDetail}
                  </li>
                )
              }
            })
          })
        }

      }
    })

    return (
      <ul className={`filter-result-list scroll-style
        ${this.props.disableClick ? 'hide-click-btn' : ''}`}>
        {filterLis}
      </ul>
    )
  }

  render () {
    return (
      Object.keys(this.props.filters).length ? (
        <div className='filter-result'>
          <span className='filter-title'>已选条件:</span>
          { this.getSelectedFilters() }
        </div>
      ) : <div />
    )
  }
}

export default SelectedFilters
