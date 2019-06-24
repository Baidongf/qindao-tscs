import { connect } from 'react-redux'
import Component from './component'
import { getCashList } from 'store/modules/customerMgt/customerMgt/index'

const mapStateToProps = (state) => ({
  customerCashList: state.customerMgt.customerCashList,
})

const mapDispatchToProps = {
  getCashList
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
