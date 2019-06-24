import { connect } from 'react-redux'
import { getReceiveActivityList } from 'store/modules/marketingActivity/index'
import Component from './component.js'

const mapDispatchToProps = {
  getReceiveActivityList
}

const mapStateToProps = (state) => ({
  receiveActivityList: state.marketingActivity.receiveActivityList,
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
