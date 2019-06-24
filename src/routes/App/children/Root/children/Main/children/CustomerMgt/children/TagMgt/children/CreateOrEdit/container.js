import { connect } from 'react-redux'
import { createTag, uploadFile } from 'store/modules/customerMgt/tagMgt/index'
import Component from './component.js'

const mapDispatchToProps = {
  createTag,
  uploadFile,
}

const mapStateToProps = (state) => ({
  // orgDetail: state.orgMgt.orgDetail
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
