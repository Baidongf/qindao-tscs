import Component from './component'
import { connect } from 'react-redux'

const mapDispatchToProps = {}

const mapStateToProps = (state) => ({
  companyKey: state.customerMgt.companyKey,
  customerBasicInfo: state.customerMgt.customerBasicInfo,
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
