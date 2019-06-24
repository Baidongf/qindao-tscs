import { connect } from 'react-redux'
import Component from './component'
import { deliverOpenAccountTime } from 'store/modules/customerMgt/customerMgt'

const mapDispatchToProps = {
  deliverOpenAccountTime,
}

const mapStateToProps = (state) => ({
  openAccountTime: state.customerMgt.openAccountTime,
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
