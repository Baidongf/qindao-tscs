import { connect } from 'react-redux'
import { deliverCompanyKeyToStore, getCustomerDetailBasic } from 'store/modules/customerMgt/customerMgt/index'
import Component from './component'

const mapDispatchToProps = {
  deliverCompanyKeyToStore,
  getCustomerDetailBasic,
}

const mapStateToProps = (state) => ({
  companyKey: state.customerMgt.companyKey,
  customerBasicInfo: state.customerMgt.customerBasicInfo,
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
