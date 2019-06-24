import React from 'react'
import { Cascader } from 'antd'
import categoryData from 'config/industryCategory.json'

class Category extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}

    this.categoryData = categoryData
    this.handleCategoryChange = this.handleCategoryChange.bind(this)
    this.cascaderFilter = this.cascaderFilter.bind(this)
  }

  handleCategoryChange(value, selectedOptions) {
    this.props.deliverIndustryCategory(value)
    this.props.deliverIndustryCategoryOptions(selectedOptions)
  }

  cascaderFilter(inputValue, path) {
    return (
      path.some(
        option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1
      )
    )
  }

  render() {

    const { categoryData } = this
    const { industryCategory } = this.props

    return (
      <div className='select-row'>
        <div span={3} className='filter-description'>行业分类</div>
        <div span={21} className='filter-content'>
          <Cascader
            options={categoryData}
            className='cascader-input'
            changeOnSelect
            showSearch={this.cascaderFilter}
            onChange={this.handleCategoryChange}
            value={industryCategory}
            placeholder='请选择行业分类'
          />
        </div>
      </div>
    )
  }
}

export default Category
