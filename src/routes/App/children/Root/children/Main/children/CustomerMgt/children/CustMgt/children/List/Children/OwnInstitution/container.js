import { connect } from 'react-redux'
import Component from './component.js'
import { getManagerTree, getManagerListById, deliverInstitutionIds } from 'store/modules/customerMgt/customerMgt'

const mapDispatchToProps = {
  getManagerTree,
  getManagerListById,
  deliverInstitutionIds,
}

const mapStateToProps = (state) => ({
  institutionIds: state.customerMgt.institutionIds,
  managerTree: state.customerMgt.managerTree,
  managerList: state.customerMgt.managerList
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
