import {connect} from 'react-redux'

import Component from './component.js'
import {
  getOrgTree,
  findCustomerManagertList,
  allByOrgId,
  allByCustomerManagerId,
  getReportTypes,
  getTopTenListByOrg,
  getTopTenListByUser,
  getSingleByOrg,
  getSingleByUser,
  allByUserId
} from 'store/modules/markResult'

const mapDispatchToProps = {
  getOrgTree,
  findCustomerManagertList,
  allByCustomerManagerId,
  getReportTypes,

  getSingleByOrg,
  getTopTenListByOrg,
  allByOrgId,
  getSingleByUser,
  getTopTenListByUser,
  allByUserId,
}

const mapStateToProps = (state) => ({
  orgTree: state.markResult.orgTree,
  customerManagerList: state.markResult.customerManagerList,
  reportTypes: state.markResult.reportTypes,
  topTenList: state.markResult.topTenList,
  singleList:state.markResult.singleList
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
