import React from 'react'
import { connect } from 'react-redux'
import Tab from './partials/Tab'
import Checkbox from '../partials/Checkbox'
import InputRange from './partials/InputRange'
import SelectFilter from './partials/SelectFilter'
import InputDatePicker from './partials/InputDatePicker'
import { changeFilterTab } from '../../actions/Filter'
import { graphPostBody } from '../../graph.config'
import { FilterUtil } from './FilterUtil'
import PropTypes from 'prop-types'

const LAYER = ['1层']

class EdgeFilter extends React.Component {
  constructor(props) {
    super(props)

    this.tabList = Object.keys(this.props.FilterUIStatus['主题筛选']['subtab'])

    this.state = {
      activeTab: this.tabList[0],
      options: this.props.filterOptions
    }
    this.handleTabChange = this.handleTabChange.bind(this)
    this.handleChecked = this.handleChecked.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.handleInputRange = this.handleInputRange.bind(this)
    this.changeFilterOptions = this.changeFilterOptions.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.filterOptions !== this.props.filterOptions) {
      this.setState({ options: nextProps.filterOptions })
    }
  }

  handleTabChange (tab) {
    this.setState({ activeTab: tab })
    for (let i in this.props.FilterUIStatus['主题筛选']['subtab']) {
      if (i === tab) {
        this.props.FilterUIStatus['主题筛选']['subtab'][i] = true
      } else {
        this.props.FilterUIStatus['主题筛选']['subtab'][i] = false
      }
    }
    this.props.changeFilterTab(this.props.FilterUIStatus)
  }

  changeFilterOptions (options) {
    this.props.changeFilterOptions(options)
  }

  handleChecked (name, isChecked, edge) {
    const options = this.state.options
    const { sueMap, officerMap, shareholderMap } = graphPostBody

    // 配置 options.filter 中的数组
    if (Object.keys(sueMap).includes(name)) {   // 涉诉关系
      FilterUtil.configOptionArr(options.filter.edge.sue.type, sueMap[name], isChecked)
    } else if (Object.keys(shareholderMap).includes(name)) { // 股东类型
      FilterUtil.configOptionArr(options.filter.edge.shareholder.shareholder_type, name, isChecked)
    } else if (Object.keys(officerMap).includes(name)) {    // 主要人员
      FilterUtil.configOptionArr(options.filter.edge.officer.position, name, isChecked)
    } else {
      FilterUtil.setEdgeVisibility(options.edges, name, isChecked)   // 配置 options.edges
    }

    // 双向检查, 一级勾选与二级勾选联动
    if (edge && 'children' in edge) {
      if (isChecked) {
        edge.children.push(...Object.keys(graphPostBody[name + 'Map']))
      } else {
        edge.children.splice(0)
      }
    }
    if (edge && 'parent' in edge) {
      if (isChecked) {
        edge.parent.visible = true
      } else if (!edge.sibling.length) {
        edge.parent.visible = false
      }
    }
    this.changeFilterOptions(Object.assign({}, options))  // 需要换一个对象，否则不会重新渲染，产生联动
  }

  handleSelect (name, idx) {
    const options = this.state.options
    FilterUtil.setEdgeTraceDepth(options.edges, name, idx)
    this.changeFilterOptions(options)
  }

  handleInputRange (name, range) {
    const options = this.state.options
    const type = name.split('_')[0]
    const filter = options.filter.edge[type]
    if (Object.keys(filter).includes(name)) {
      filter[name] = range
    }
    this.changeFilterOptions(options)
  }

  render () {
    let { activeTab, options } = this.state
    const belongBankRelation = this.props.belongBankRelation
    let _this = this
    function Relation () {
      const props = {
        setSubmitBtnStatus: _this.props.setSubmitBtnStatus,
        handleChecked: _this.handleChecked,
        options: options
      }
      if (activeTab === '基本关系') {
        return <BasicRelation
          handleSelect={_this.handleSelect}
          handleInputRange={_this.handleInputRange}
          {...props}
        />
      } else if (activeTab === '涉诉关系') {
        return <SueRelation {...props} />
      } else if (activeTab === '招中标关系') {
        return <BidRelation {...props} />
      } else if (activeTab === '行内关系') {
        return <InnerRelation
          handleInputRange={_this.handleInputRange}
          belongBankRelation={belongBankRelation}
          {...props}
        />
      } else if (activeTab === '事件关系') {
        return <EventRelation {...props} />
      } else {
        return null
      }
    }

    return (
      <div>
        <Tab
          tabList={this.tabList}
          handleTabChange={this.handleTabChange}
        />
        <Relation />
      </div>
    )
  }
}

EdgeFilter.propTypes = {
  FilterUIStatus: PropTypes.object,
  filterOptions: PropTypes.object,
  changeFilterOptions: PropTypes.func,
  changeFilterTab: PropTypes.func
}

class BasicRelation extends React.Component {
  render () {
    const { options } = this.props
    const shareholderType = options.filter.edge.shareholder.shareholder_type
    const position = options.filter.edge.officer.position

    return (
      <div className='filter-detail'>
        <div className='filter-detail-title'>
          <Checkbox label='对外投资' name='invest' handleChecked={this.props.handleChecked}
            isChecked={FilterUtil.isEdgeVisible(options.edges, 'invest')} />
        </div>
        <div className='filter-detail-content'>
          {/* <SelectFilter
            filterTitle='追溯层数'
            liRange={LAYER}
            disabled={!FilterUtil.isEdgeVisible(options.edges, 'invest')}
            handleSelect={this.props.handleSelect}
            initSelect={FilterUtil.getEdgeTraceDepth(options.edges, 'invest') - 1}
            name='invest'
          /> */}
          <InputRange
            filterTitle='出资金额(万元)'
            handleInputRange={this.props.handleInputRange}
            name='invest_amount'
            placeholder='请输入金额'
            disabled={!FilterUtil.isEdgeVisible(options.edges, 'invest')}
            initRange={options.filter.edge.invest.invest_amount}
            unit={10000}
            setValidStatus={this.props.setSubmitBtnStatus}
          />
          <InputRange
            filterTitle='占资比例(%)'
            disabled={!FilterUtil.isEdgeVisible(options.edges, 'invest')}
            handleInputRange={this.props.handleInputRange}
            name='invest_ratio'
            placeholder='请输入比例'
            initRange={options.filter.edge.invest.invest_ratio}
            threshold={{ min: 0, max: 100 }}
            setValidStatus={this.props.setSubmitBtnStatus}
          />
        </div>
        <div className='filter-detail-title'>
          <Checkbox
            label='股东'
            name='shareholder'
            edge={{ children: shareholderType }}
            handleChecked={this.props.handleChecked}
            isChecked={FilterUtil.isEdgeVisible(options.edges, 'shareholder')}
          />
        </div>
        <div className='filter-detail-content'>
          {/* <SelectFilter
            filterTitle='追溯层数'
            liRange={LAYER}
            disabled={!FilterUtil.isEdgeVisible(options.edges, 'shareholder')}
            handleSelect={this.props.handleSelect}
            initSelect={FilterUtil.getEdgeTraceDepth(options.edges, 'shareholder') - 1}
            name='shareholder'
          /> */}
          <div className='sub-content-items'>
            <p className='filter-detail-sub-title'>股东类型:</p>
            <Checkbox
              label='自然人股东'
              name='Person'
              edge={{ parent: FilterUtil.findEdgeByClass(options.edges, 'shareholder'), sibling: shareholderType }}
              handleChecked={this.props.handleChecked}
              isChecked={shareholderType.includes('Person') &&
                FilterUtil.isEdgeVisible(options.edges, 'shareholder')}
            />
            <Checkbox
              label='法人股东'
              name='Company'
              edge={{ parent: FilterUtil.findEdgeByClass(options.edges, 'shareholder'), sibling: shareholderType }}
              handleChecked={this.props.handleChecked}
              isChecked={shareholderType.includes('Company') &&
                FilterUtil.isEdgeVisible(options.edges, 'shareholder')}
            />
          </div>
          <InputRange
            filterTitle='占资比例(%)'
            handleInputRange={this.props.handleInputRange}
            disabled={!FilterUtil.isEdgeVisible(options.edges, 'shareholder')}
            name='shareholder_ratio'
            placeholder='请输入比例'
            initRange={options.filter.edge.shareholder.shareholder_ratio}
            threshold={{ min: 0, max: 100 }}
            setValidStatus={this.props.setSubmitBtnStatus}
          />
        </div>
        <div className='filter-detail-title'>
          <Checkbox
            label='主要人员'
            name='officer'
            edge={{ children: position }}
            handleChecked={this.props.handleChecked}
            isChecked={FilterUtil.isEdgeVisible(options.edges, 'officer')}
          />
        </div>
        <div className='filter-detail-content content-items'>
          <Checkbox
            label='董事'
            name='董事'
            edge={{ parent: FilterUtil.findEdgeByClass(options.edges, 'officer'), sibling: position }}
            handleChecked={this.props.handleChecked}
            isChecked={position.includes('董事') && FilterUtil.isEdgeVisible(options.edges, 'officer')}
          />
          <Checkbox
            label='监事'
            name='监事'
            edge={{ parent: FilterUtil.findEdgeByClass(options.edges, 'officer'), sibling: position }}
            handleChecked={this.props.handleChecked}
            isChecked={position.includes('监事') && FilterUtil.isEdgeVisible(options.edges, 'officer')}
          />
          <Checkbox
            label='法定代表人'
            name='法定代表人'
            edge={{ parent: FilterUtil.findEdgeByClass(options.edges, 'officer'), sibling: position }}
            handleChecked={this.props.handleChecked}
            isChecked={position.includes('法定代表人') && FilterUtil.isEdgeVisible(options.edges, 'officer')}
          />
          <Checkbox
            label='其他高管'
            name='其他高管'
            edge={{ parent: FilterUtil.findEdgeByClass(options.edges, 'officer'), sibling: position }}
            handleChecked={this.props.handleChecked}
            isChecked={position.includes('其他高管') && FilterUtil.isEdgeVisible(options.edges, 'officer')}
          />
        </div>
      </div>
    )
  }
}

BasicRelation.propTypes = {
  options: PropTypes.object,
  handleChecked: PropTypes.func,
  handleInputRange: PropTypes.func,
  handleSelect: PropTypes.func
}

class SueRelation extends React.Component {
  render () {
    const sue = this.props.options.filter.edge.sue.type
    const options = this.props.options

    return (
      <div className='filter-detail filter-detail-list'>
        <Checkbox
          label='原告'
          name='plaintiff'
          handleChecked={this.props.handleChecked}
          isChecked={sue.includes('原告')}
          edge={{ parent: FilterUtil.findEdgeByClass(options.edges, 'sue'), sibling: sue }}
        />
        <Checkbox
          label='当事人'
          name='party'
          handleChecked={this.props.handleChecked}
          isChecked={sue.includes('当事人')}
          edge={{ parent: FilterUtil.findEdgeByClass(options.edges, 'sue'), sibling: sue }}
        />
        <Checkbox
          label='被告'
          name='defendant'
          handleChecked={this.props.handleChecked}
          isChecked={sue.includes('被告')}
          edge={{ parent: FilterUtil.findEdgeByClass(options.edges, 'sue'), sibling: sue }}
        />
      </div>
    )
  }
}

SueRelation.propTypes = {
  options: PropTypes.object,
  handleChecked: PropTypes.func
}

class BidRelation extends React.Component {
  render () {
    const { options } = this.props

    return (
      <div className='filter-detail filter-detail-list'>
        <Checkbox
          label='中标'
          name='win_bid'
          handleChecked={this.props.handleChecked}
          isChecked={FilterUtil.isEdgeVisible(options.edges, 'win_bid')}
        />
        <Checkbox
          label='发布招标'
          name='publish_bid'
          handleChecked={this.props.handleChecked}
          isChecked={FilterUtil.isEdgeVisible(options.edges, 'publish_bid')}
        />
        <Checkbox
          label='代理招标'
          name='agent_bid'
          handleChecked={this.props.handleChecked}
          isChecked={FilterUtil.isEdgeVisible(options.edges, 'agent_bid')}
        />
      </div>
    )
  }
}

BidRelation.propTypes = {
  options: PropTypes.object,
  handleChecked: PropTypes.func
}

class InnerRelation extends React.Component {
  constructor(props) {
    super(props)
  }

  render () {
    const { options, belongBankRelation } = this.props

    return (
      <div className='filter-detail filter-detail-list'>
        {
          belongBankRelation && belongBankRelation.map((item, index) => {
            let checked = item.is_selected === 1
            return (item.is_show === 1 ? <Checkbox key={index} label={item.name} name={item.target_table}
              handleChecked={this.props.handleChecked}
              isChecked={FilterUtil.isEdgeVisible(options.edges, item.target_table, checked)} /> : null)
          })
        }
      </div>
    )
  }
}

class EventRelation extends React.Component {
  render () {
    const options = this.props.options

    return (
      <div className='filter-detail filter-detail-list'>
        <Checkbox
          label='甲方'
          name='party_bid_from'
          handleChecked={this.props.handleChecked}
          isChecked={FilterUtil.isEdgeVisible(options.edges, 'party_bid_from')}
        />
        <Checkbox
          label='乙方'
          name='party_bid_to'
          handleChecked={this.props.handleChecked}
          isChecked={FilterUtil.isEdgeVisible(options.edges, 'party_bid_to')}
        />
        <Checkbox
          label='起诉'
          name='sue_relate_from'
          handleChecked={this.props.handleChecked}
          isChecked={FilterUtil.isEdgeVisible(options.edges, 'sue_relate_from')}
        />
        <Checkbox
          label='被起诉'
          name='sue_relate_to'
          handleChecked={this.props.handleChecked}
          isChecked={FilterUtil.isEdgeVisible(options.edges, 'sue_relate_to')}
        />
        <Checkbox
          label='同为原告'
          name='plaintiff_relate'
          handleChecked={this.props.handleChecked}
          isChecked={FilterUtil.isEdgeVisible(options.edges, 'plaintiff_relate')}
        />
        <Checkbox
          label='同为被告'
          name='defendant_relate'
          handleChecked={this.props.handleChecked}
          isChecked={FilterUtil.isEdgeVisible(options.edges, 'defendant_relate')}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    FilterUIStatus: state.FilterUIStatus,
    reduxLocation: state.location,
    belongBankRelation: state.belongBankRelation
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeFilterTab: (filterUIStatus) => dispatch(changeFilterTab(filterUIStatus))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EdgeFilter)
