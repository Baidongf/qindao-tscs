import { connect } from 'react-redux'

import ClusterGraph from '../components/clusterGraph'
import { getCompanyList } from '../modules/GroupRelationCard'
import { getClusterChart, setRenderChartStatus } from 'actions/Chart'
import { selectCenterClusterNode } from 'actions/Card'

const mapDispatchToProps = {
  getCompanyList,
  getClusterChart,
  setRenderChartStatus,
  selectCenterClusterNode
}

const mapStateToProps = (state) => ({
  companyListObj: state.companyListObj,
  clusterChartData: state.clusterChartData,
  renderChartStatus: state.renderChartStatus,
  singleCompanyChart: state.singleCompanyChart,
  centerTreeNode: state.centerTreeNode,
  reduxLocation: state.location
})

export default connect(mapStateToProps, mapDispatchToProps)(ClusterGraph)
