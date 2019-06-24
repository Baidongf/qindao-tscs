import { connect } from 'react-redux'
import { getCreateActivityList } from 'store/modules/marketingActivity/index'
import Component from './component.js'

const mapDispatchToProps = {
  getCreateActivityList,
}

const mapStateToProps = (state) => ({
  createActivityList: state.marketingActivity.createActivityList,
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
