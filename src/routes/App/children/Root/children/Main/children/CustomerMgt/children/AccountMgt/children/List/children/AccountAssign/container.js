import { connect } from 'react-redux'
import Component from './component'

// import { } from 'store/modules/customerMgt/accountMgt'

import { getManagerListById, getManagerTree } from 'store/modules/customerMgt/customerMgt'
import { distributeAccount } from 'store/modules/customerMgt/accountMgt'
import { getAllManagers } from 'store/modules/opportunityMgt/index'

const mapStateToProps = (state) => ({
  managerTree: state.customerMgt.managerTree,
  allManagers: state.opportunityMgt.allManagers,
  managerByAccount: state.accountMgt.managerByAccount
})

const mapDispatchToProps = {
  getManagerListById,
  getManagerTree,
  distributeAccount,
  getAllManagers,
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
