import { connect } from 'react-redux'
import Component from './component'
import {
  getAllManagers,
  getInstitutionManagers,
  searchCustomers,
  createOpportunity,
  updateOpportunity,
  getOpportunityDetail,
} from 'store/modules/opportunityMgt/index'


const mapStateToProps = (state) => ({
  allManagers: state.opportunityMgt.allManagers,
  institutionManagers: state.opportunityMgt.institutionManagers,
  searchedCustomers: state.opportunityMgt.searchedCustomers,
  opportunityDetail: state.opportunityMgt.opportunityDetail,
})

const mapDispatchToProps = {
  getAllManagers,
  getInstitutionManagers,
  searchCustomers,
  createOpportunity,
  updateOpportunity,
  getOpportunityDetail,
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
