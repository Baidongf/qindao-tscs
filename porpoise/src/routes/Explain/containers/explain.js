import { connect } from 'react-redux'
import { changeFilterOptions, getConcertChart, getCompanyFactionChart,
  getInvestAndOfficerChart, getActualCtrlChart } from '../modules/explain'
import { addBelongBankRelationToGlobal } from 'actions/Chart'

import Explain from '../components/Explain'

const mapDispatchToProps = (dispatch) => ({
  changeFilterOptions: (queryObj) => dispatch(changeFilterOptions(queryObj)),
  getConcertChart: (paramsObj) => dispatch(getConcertChart(paramsObj)),
  getCompanyFactionChart: (paramsObj) => dispatch(getCompanyFactionChart(paramsObj)),
  getInvestAndOfficerChart: (nodeObj) => dispatch(getInvestAndOfficerChart(nodeObj)),
  getActualCtrlChart: () => dispatch(getActualCtrlChart()),
  addBelongBankRelationToGlobal: () => dispatch(addBelongBankRelationToGlobal())
})

const mapStateToProps = (state) => ({
  renderChartStatus: state.renderChartStatus,
  reduxLocation: state.location,
})

export default connect(mapStateToProps, mapDispatchToProps)(Explain)
