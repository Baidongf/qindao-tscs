import Component from './component'
import { connect } from 'react-redux'

const mapDispatchToProps = {}

const mapStateToProps = (state) => ({
  customerBasicInfo: state.customerMgt.customerBasicInfo,
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
