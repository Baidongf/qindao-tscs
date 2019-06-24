import { connect } from 'react-redux'
import {
  getActivityDetail,
  finishActivity,
  suspendActivity,
  confirmActivity,
} from 'store/modules/marketingActivity/index'
import Component from './component.js'

const mapDispatchToProps = {
  getActivityDetail,
  finishActivity,
  suspendActivity,
  confirmActivity,
}

const mapStateToProps = (state) => ({
  actDetail: state.marketingActivity.actDetail
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
