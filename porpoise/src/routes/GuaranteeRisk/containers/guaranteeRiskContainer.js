import { connect } from 'react-redux'
import { getCompanyBrief } from 'actions/Card'
import { getChartData, expand } from 'actions/Chart'

import GuaranteeRisk from '../components/GuaranteeRisk'

/**
 * dispatch to props
 * @param {Object} dispatch dispatch
 * @return {Object} actions
 */
const mapDispatchToProps = (dispatch) => ({
  getCompanyBrief: (companyName) => dispatch(getCompanyBrief(companyName)),
  getChartData: (companyName, options) => dispatch(getChartData(companyName, options)),
  expand: (vertex, options) => dispatch(expand(vertex, options))
})

/**
 * state to props
 * @param {Object} state state
 * @return {Object} state
 */
const mapStateToProps = (state) => ({
  filterOptions: state.FilterOptions,
  renderChartStatus: state.renderChartStatus,
  reduxLocation: state.location,
  curNode: state.curNode,
  expandChartData: state.expandChartData,
  initCompanyName: state.initCompanyName
})

export default connect(mapStateToProps, mapDispatchToProps)(GuaranteeRisk)
