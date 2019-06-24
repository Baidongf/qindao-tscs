import React from 'react'
import Checkbox from '../partials/Checkbox'
import { FilterUtil } from './FilterUtil'

class EdgeDigFilter extends React.Component {
  constructor (props) {
    super(props)
    this.relationList = {
      'concert': '一致行动关系',
      'actual_controller': '疑似实际控制人',
      'control_shareholder': '控股股东',
      // 'person_merge': '自然人可融合',
      'family': '亲属关系'
      // 'guarantee': '担保关系',
      // 'upstream': '上下游关系'
    }
    this.relationTips = {
      'concert': '一致行动关系：一致实体集（两个或两个以上的自然人或者企业）对某一企业实体或者任何事物会采取一致行动的关系。',
      'actual_controller': '疑似实际控制人指对当前企业直接或间接出资占比超过50%的法人或自然人，为当前企业的实际控制者',
      'control_shareholder': '控股股东指对当前企业出资占比超过50%的法人或自然人'
    }
    this.state = {
      options: this.props.filterOptions
    }

    this.handleChecked = this.handleChecked.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.filterOptions !== this.props.filterOptions) {
      this.setState({ options: nextProps.filterOptions })
    }
  }

  handleChecked (name, isChecked) {
    const options = this.state.options
    FilterUtil.setEdgeVisibility(options.edges, name, isChecked)
    this.props.changeFilterOptions(options)
  }

  render () {
    const { options } = this.state
    let Relation = []
    for (let filter in this.relationList) {
      Relation.push(
        <span className='checkbox-container' key={filter}>
          <Checkbox
            label={this.relationList[filter]}
            key={filter}
            name={filter}
            handleChecked={this.handleChecked}
            isChecked={FilterUtil.isEdgeVisible(options.edges, filter)} />
          {this.relationTips[filter] ? <span className='checkbox-tips'>{this.relationTips[filter]}</span> : null}
        </span>
      )
    }

    return (
      <div className='filter-detail filter-detail-list'>
        {Relation}
      </div>
    )
  }
}

export default EdgeDigFilter
