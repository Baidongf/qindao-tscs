import { connect } from 'react-redux'
import { changeFilterOptions } from '../modules/landingPage'
import { getCompanyBrief, toggleCardType } from 'actions/Card'
import { getChartData, expand, addBelongBankRelationToGlobal } from 'actions/Chart'
import { setInitCompanyName } from 'actions/InitConfig'

import LandingPage from '../components/LandingPage'

const mapDispatchToProps = (dispatch) => ({
  changeFilterOptions: (options) => dispatch(changeFilterOptions(options)),
  getCompanyBrief: (companyName) => dispatch(getCompanyBrief(companyName)),
  getChartData: (companyName, options) => dispatch(getChartData(companyName, options)),
  toggleCardType: (cardType) => dispatch(toggleCardType(cardType)),
  expand: (vertex, options) => dispatch(expand(vertex, options)),
  setInitCompanyName: (companyName) => dispatch(setInitCompanyName(companyName)),
  addBelongBankRelationToGlobal: () => dispatch(addBelongBankRelationToGlobal())
})

const mapStateToProps = (state) => ({
  filterOptions: state.FilterOptions,
  renderChartStatus: state.renderChartStatus,
  reduxLocation: state.location,
  curNode: state.curNode,
  expandChartData: state.expandChartData,
  initCompanyName: state.initCompanyName,
  operateChartStatus: state.operateChartStatus
})

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage)
