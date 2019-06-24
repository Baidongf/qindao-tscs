import Component from './component'
import { connect } from 'react-redux'

const mapDispatchToProps = {}

const mapStateToProps = (state) => ({
  projectDetail: state.projectMonitor.projectDetail,
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
