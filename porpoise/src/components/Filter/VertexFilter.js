import React from 'react'
import Tab from './partials/Tab'
import InputRange from './partials/InputRange'
import InputDatePicker from './partials/InputDatePicker'
import { filterUIStatus } from '../../graph.config'

import PropTypes from 'prop-types'

class VertexFilter extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      activeTab: Object.keys(filterUIStatus['实体筛选'].subtab)[0],
      options: this.props.filterOptions
    }

    this.handleInputRange = this.handleInputRange.bind(this)

    const objectFilterProps = {
      handleInputRange: this.handleInputRange,
      options: this.props.filterOptions,
      setSubmitBtnStatus: this.props.setSubmitBtnStatus
    }
    this.ObjectFilterMap = {
      '公司': <Company {...objectFilterProps} />,
      '案件': <Case {...objectFilterProps} />,
      '标书': <Bid {...objectFilterProps} />
    }
    this.displayTabs = Object.keys(filterUIStatus['实体筛选'].subtab)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.filterOptions !== this.props.filterOptions) {
      this.setState({ options: nextProps.filterOptions })
    }
  }

  handleTabChange (tab) {
    this.setState({ activeTab: tab })
  }

  handleInputRange (name, range) {
    const options = this.state.options
    const vertex = options.filter.vertex
    for (let vertexName in options.filter.vertex) {
      for (let vertexPropsName in vertex[vertexName]) {
        if (name === vertexPropsName) {
          vertex[vertexName][vertexPropsName] = range
          break
        }
      }
    }
    this.props.changeFilterOptions(options)
  }

  render () {
    let { activeTab } = this.state

    return (
      <div>
        <Tab
          tabList={this.displayTabs}
          handleTabChange={(tab) => this.handleTabChange(tab)}
        />
        {this.ObjectFilterMap[activeTab]}
      </div>
    )
  }
}

VertexFilter.propTypes = {
  filterOptions: PropTypes.object,
  changeFilterOptions: PropTypes.func,
  getChartData: PropTypes.func
}

class Company extends React.Component {
  render () {
    const { options } = this.props

    return (
      <div className='filter-detail filter-detail-one-layer'>
        <div className='filter-detail-content'>
          <InputRange
            filterTitle='注册资本(万元)'
            handleInputRange={this.props.handleInputRange}
            name='capital'
            placeholder='请输入金额'
            initRange={options.filter.vertex.Company.capital}
            unit={10000}
            setValidStatus={this.props.setSubmitBtnStatus}
          />
          <InputDatePicker
            filterTitle='成立日期'
            handleInputRange={this.props.handleInputRange}
            name='operation_startdate'
            placeholder='请输入时间'
            initRange={options.filter.vertex.Company.operation_startdate}
            setValidStatus={this.props.setSubmitBtnStatus}
          />
        </div>
      </div>
    )
  }
}

Company.propTypes = {
  options: PropTypes.object,
  handleInputRange: PropTypes.func
}

class Case extends React.Component {
  constructor (props) {
    super(props)
    this.caseFilters = {
      'Judgement_wenshu': {
        'case_date': '裁判文书'
      },
      'Court_bulletin_doc': {
        'court_time': '开庭公告'
      },
      'Judge_process': {
        'filing_date': '审判流程'
      },
      'Court_announcement_doc': {
        'bulletin_date': '法院公告'
      }
    }
  }

  render () {
    const { options } = this.props
    const caseFilters = this.caseFilters
    let InputRanges = []

    for (let filterName in caseFilters) {
      for (let filterPropsName in caseFilters[filterName]) {
        InputRanges.push(
          <div className='filter-detail-content' key={filterPropsName}>
            <InputDatePicker
              filterTitle={caseFilters[filterName][filterPropsName]}
              handleInputRange={this.props.handleInputRange}
              name={filterPropsName}
              placeholder='请输入时间'
              initRange={options.filter.vertex[filterName][filterPropsName]}
            />
          </div>
        )
      }
    }

    return (
      <div className='filter-detail filter-detail-one-layer'>
        <div className='filter-detail-content'>
          {InputRanges}
        </div>
      </div>
    )
  }
}

Case.propTypes = {
  options: PropTypes.object,
  handleInputRange: PropTypes.func
}

class Bid extends React.Component {
  render () {
    const { options } = this.props

    return (
      <div className='filter-detail filter-detail-one-layer'>
        <div className='filter-detail-content'>
          <InputDatePicker
            filterTitle='发布日期'
            handleInputRange={this.props.handleInputRange}
            name='publish_time'
            placeholder='请输入时间'
            initRange={options.filter.vertex.Bid_detail.publish_time}
          />
        </div>
      </div>
    )
  }
}

Bid.propTypes = {
  options: PropTypes.object,
  handleInputRange: PropTypes.func
}

export default VertexFilter
