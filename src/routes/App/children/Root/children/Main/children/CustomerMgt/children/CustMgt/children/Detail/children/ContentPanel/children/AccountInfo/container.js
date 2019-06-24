import { connect } from 'react-redux'
import { getCustomerDetailAccount } from 'store/modules/customerMgt/customerMgt/index'
import Component from './component'

const mapDispatchToProps = {
  getCustomerDetailAccount,
}

const mapStateToProps = (state) => ({
  companyKey: state.customerMgt.companyKey,
  customerAccountInfo: state.customerMgt.customerAccountInfo,
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
