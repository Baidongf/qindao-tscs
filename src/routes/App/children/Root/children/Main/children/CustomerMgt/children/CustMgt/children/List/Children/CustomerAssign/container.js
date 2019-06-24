import { connect } from 'react-redux'
import Component from './component'

import {
  getManagerListById,
  distributeCustomer,
} from 'store/modules/customerMgt/customerMgt'
import { getAllManagers } from 'store/modules/opportunityMgt/index'

const mapStateToProps = (state) => ({
  managerTree: state.customerMgt.managerTree,
  allManagers: state.opportunityMgt.allManagers,
})

const mapDispatchToProps = {
  getManagerListById,
  distributeCustomer,
  getAllManagers,
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
