import { connect } from 'react-redux'
import Component from './component'

const mapDispatchToProps = { }

const mapStateToProps = (state) => ({
  companyKey: state.customerMgt.companyKey,
  customerBasicInfo: state.customerMgt.customerBasicInfo,
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
