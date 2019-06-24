import React from 'react'
import Card from 'components/Card'
import Chart from 'components/Chart'
import Filter from 'components/Filter'
import ContextMenu from 'components/ContextMenu'
import { LP_PARAMS } from 'config'
import { Hint } from 'components/Hint'
import PropTypes from 'prop-types'

/**
 * 落地页
 */
class LandingPage extends React.Component {
  /**
   * constructor
   * @param {Object} props props
   */
  constructor (props) {
    super(props)

    this.query = this.props.reduxLocation.query
    this.params = LP_PARAMS
  }

  componentDidMount () {
    this.start()
    this.props.addBelongBankRelationToGlobal()
  }

  /**
   * 当初始中心点为企业时，设置初始企业名称，展示企业详情卡片
   * @param {Object} nextProps nextProps
   */
  componentWillReceiveProps (nextProps) {
    if (nextProps.operateChartStatus !== this.props.operateChartStatus) {
      if (nextProps.operateChartStatus.includes('expand_single') && this.query.id && this.query.id.includes('Company')) {
        const companyName = this.props.expandChartData.vertexes.find((v) => v._id === this.query.id).name
        this.props.setInitCompanyName(companyName)
        this.props.toggleCardType('Company')
      }
    }
  }

  /**
   * 根据配置更改filter options
   */
  changeFilterOptions () {
    this.options = this.props.filterOptions
    const params = this.params[this.query.lp_type]
    const { visibleEdges } = params
    if (visibleEdges) {
      this.options.edges.forEach((option) => {
        option.visible = visibleEdges.includes(option.class)
      })
    }

    if ('shareholder_type' in params) {
      this.options.filter.edge.invest['shareholder_type'] = params['shareholder_type']
    }
    if ('company' in params) {
      this.props.setInitCompanyName(params['company'])
    }
    this.props.changeFilterOptions(this.options)
  }

  /**
   * 根据URL展示不同落地页
   */
  start () {
    this.changeFilterOptions()
    const params = this.params[this.query.lp_type]
    const lpType = this.query.lp_type
    if (lpType === 'Edge_dig') {   // 图挖掘
      this.props.getChartData(this.options)
      this.props.getCompanyBrief(params.company)
    } else if (lpType === 'Relation') {    // 找关系
      sessionStorage.setItem('findRelationParams', JSON.stringify(params))
      this.props.toggleCardType('Relation')
    }
  }

  /**
   * render
   * @return {div} render LandingPage
   */
  render () {
    const { status } = this.props.renderChartStatus
    const isFilterOpen = this.query.lp_type === 'Edge_dig' ||
      (this.query.lp_type === 'Invest_and_officer' && this.query.id.includes('Company'))
    return (
      <div className='container text-center clearfix'>
        <Card />
        <Chart />
        {isFilterOpen ? <Filter /> : null}
        {/* 待开发 */}
        {/* <FullscreenButton /> */}
        <ContextMenu />
        {status === 'success' || status === 'fail' || status === '' ? null : <Hint.Loading status={status} />}
        {/* {status === 'fail' ? <Hint.Error msg={msg} /> : null} */}
      </div>
    )
  }
}

LandingPage.propTypes = {
  renderChartStatus: PropTypes.object,
  toggleCardType: PropTypes.func,
  getCompanyBrief: PropTypes.func,
  getChartData: PropTypes.func,
  changeFilterOptions: PropTypes.func,
  reduxLocation: PropTypes.object,
  filterOptions: PropTypes.object,
  expandChartData: PropTypes.object,
  setInitCompanyName: PropTypes.func,
  operateChartStatus: PropTypes.string,
  addBelongBankRelationToGlobal: PropTypes.func
}

export default LandingPage
