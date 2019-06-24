import React from 'react'
import './component.scss'
import FilterPanel from './children/FilterPanel'
import DynamicList from './children/DynamicList'


class List extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {

    // listType 决定是 “机构客户动态(institutionDynamic)” 还是 “我的客户动态(myDynamic)”
    const { listType } = this.props
    return (
      <div className='dynamic-list-container-component'>

        <div className='dynamic-filter-panel-container'>
          <FilterPanel listType={listType} />
        </div>

        <div className='dynamic-list-container'>
          <DynamicList listType={listType} />
        </div>
      </div>
    )
  }
}

export default List
