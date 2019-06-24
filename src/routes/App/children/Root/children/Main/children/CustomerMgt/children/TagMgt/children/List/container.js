import { connect } from 'react-redux'
import { getTagList } from 'store/modules/customerMgt/tagMgt/index'
import Component from './component.js'

const mapDispatchToProps = {
  getTagList
}

const mapStateToProps = (state) => ({
  tagList: state.tagMgt.list,
  userPermission: state.account.userPermission
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
