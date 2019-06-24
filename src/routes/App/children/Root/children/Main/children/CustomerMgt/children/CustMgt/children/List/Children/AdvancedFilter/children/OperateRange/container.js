import { connect } from 'react-redux'
import Component from './component'
import { deliverOperateRange } from 'store/modules/customerMgt/customerMgt'

const mapDispatchToProps = {
  deliverOperateRange,
}

const mapStateToProps = (state) => ({
  operateRange: state.customerMgt.operateRange,
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
