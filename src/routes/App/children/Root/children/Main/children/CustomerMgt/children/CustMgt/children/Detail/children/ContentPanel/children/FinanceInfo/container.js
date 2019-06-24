import { connect } from 'react-redux'
import { getCustomerDetailFinance } from 'store/modules/customerMgt/customerMgt/index'
import Component from './component'

const mapDispatchToProps = {
  getCustomerDetailFinance,
}

const mapStateToProps = (state) => ({
  companyKey: state.customerMgt.companyKey,
  customerFinanceInfo: state.customerMgt.customerFinanceInfo,
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
