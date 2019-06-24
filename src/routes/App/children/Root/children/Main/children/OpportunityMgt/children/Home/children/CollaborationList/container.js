import { connect } from 'react-redux'
import Component from './component'
import { getCollaborationList } from 'store/modules/opportunityMgt/index'

const mapStateToProps = (state) => ({
  collaborationList: state.opportunityMgt.collaborationList,
})

const mapDispatchToProps = {
  getCollaborationList,
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
