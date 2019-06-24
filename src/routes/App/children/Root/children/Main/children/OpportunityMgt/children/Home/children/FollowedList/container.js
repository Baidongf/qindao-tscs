import { connect } from 'react-redux'
import Component from './component'
import { getFollowedList } from 'store/modules/opportunityMgt/index'

const mapStateToProps = (state) => ({
  followedList: state.opportunityMgt.followedList,
})

const mapDispatchToProps = {
  getFollowedList
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
