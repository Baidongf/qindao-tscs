import { connect } from 'react-redux'
import { getTagDetail, exportCustomers } from 'store/modules/customerMgt/tagMgt/index'
import Component from './component.js'

const mapDispatchToProps = {
  getTagDetail,
  exportCustomers,
}

const mapStateToProps = (state) => ({
  tagDetail: state.tagMgt.tagDetail
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
