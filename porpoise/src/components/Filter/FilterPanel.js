import React from 'react'
import { connect } from 'react-redux'
import EdgeFilter from './EdgeFilter'
import VertexFilter from './VertexFilter'
import EdgeDigFilter from './EdgeDigFilter'

import { changeFilterOptions, changeFilterTab } from 'actions/Filter'
import { getChartData, setMergeChartData } from 'actions/Chart'

class FilterPanel extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      filterOptions: JSON.parse(JSON.stringify(this.props.filterOptions)),
      isSubmitBtnValid: true
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.filterOptions !== nextProps.filterOptions) {
      this.setState({ filterOptions: JSON.parse(JSON.stringify(nextProps.filterOptions)) })
    }
  }

  changeFilterOptions = (filterOptions) => {
    this.setState({ filterOptions })
  }

  submitNewFilter = () => {
    if (!this.state.isSubmitBtnValid) return

    const { filterOptions } = this.state
    this.props.setMergeChartData()
    this.props.changeFilterOptions(filterOptions)
    this.props.getChartData(filterOptions)
  }

  cancelNewFilter = () => {
    const { FilterUIStatus, filterOptions } = this.props
    this.setState({ filterOptions: JSON.parse(JSON.stringify(filterOptions)) })
    for (let filter in FilterUIStatus) {
      FilterUIStatus[filter].show = false
    }
    this.props.changeFilterTab(FilterUIStatus)
  }

  setSubmitBtnStatus = (status) => {
    this.setState({
      isSubmitBtnValid: status
    })
  }

  render () {
    const properties = {
      filterOptions: this.state.filterOptions,
      changeFilterOptions: this.changeFilterOptions,
      setSubmitBtnStatus: this.setSubmitBtnStatus
    }
    const filterPanelMap = {
      '主题筛选': <EdgeFilter {...properties} />,
      '实体筛选': <VertexFilter {...properties} />,
      '关系挖掘': <EdgeDigFilter {...properties} />
    }
    const { FilterUIStatus } = this.props
    let CurrentShowPanel = ''
    for (let filter in FilterUIStatus) {
      if (FilterUIStatus[filter].show) {
        CurrentShowPanel = filter
        break
      }
    }
    return (
      <div className={'filter-panel-wrap clearfix ' + CurrentShowPanel}>
        {filterPanelMap[CurrentShowPanel]}
        {
          CurrentShowPanel ? (
            <p className='operation-area clearfix'>
              <span className={
                this.state.isSubmitBtnValid ? 'ok-btn btn' : 'ok-btn btn invalid'
              }
                onClick={this.submitNewFilter}>确定</span>
              <span className='cancel-btn btn' onClick={this.cancelNewFilter}>取消</span>
            </p>
          ) : null
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    FilterUIStatus: state.FilterUIStatus,
    filterOptions: state.FilterOptions
  }
}

const mapDispatchToProps = {
  changeFilterOptions,
  getChartData,
  setMergeChartData,
  changeFilterTab
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterPanel)
