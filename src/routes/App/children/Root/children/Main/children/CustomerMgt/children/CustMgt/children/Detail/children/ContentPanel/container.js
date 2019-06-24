import Component from './component'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
  isInner: state.customerMgt.customerBasicInfo.isInter,
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
