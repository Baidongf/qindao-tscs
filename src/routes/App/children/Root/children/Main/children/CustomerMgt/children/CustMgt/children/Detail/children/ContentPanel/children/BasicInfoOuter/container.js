import Component from './component'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
  customerBasicInfo: state.customerMgt.customerBasicInfo,
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
