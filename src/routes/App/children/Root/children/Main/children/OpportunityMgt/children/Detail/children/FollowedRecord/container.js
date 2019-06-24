import { connect } from 'react-redux'
import Component from './component'
import { getFollowedRecordList } from 'store/modules/opportunityMgt/index'

const mapStateToProps = (state) => ({
  followedRecordList: state.opportunityMgt.followedRecordList,
})

const mapDispatchToProps = {
  getFollowedRecordList,
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
