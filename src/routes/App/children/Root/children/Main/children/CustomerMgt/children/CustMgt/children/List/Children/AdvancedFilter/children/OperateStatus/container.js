import { connect } from 'react-redux'
import Component from './component'
import { deliverOperateStatus } from 'store/modules/customerMgt/customerMgt'

const mapStateToProps = (state) => ({
  operateStatus: state.customerMgt.operateStatus
})

const mapDispatchToProps = {
  deliverOperateStatus,
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
