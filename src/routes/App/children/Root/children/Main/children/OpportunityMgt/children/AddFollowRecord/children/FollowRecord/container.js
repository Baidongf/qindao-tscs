import { connect } from 'react-redux'
import Component from './component'
import { addFollowRecord, getFollowedRecordList } from 'store/modules/opportunityMgt'

const mapStateToProps = (state) => ({
  followedRecordList: state.opportunityMgt.followedRecordList
})

const mapDispatchToProps = {
  addFollowRecord,
  getFollowedRecordList,
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
