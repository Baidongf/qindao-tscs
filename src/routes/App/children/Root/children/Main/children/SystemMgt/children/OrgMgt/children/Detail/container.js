import { connect } from 'react-redux'
import { getOrgDetail, saveOrg, updateOrg } from 'store/modules/systemMgt/orgMgt/index'
import Component from './component.js'

const mapDispatchToProps = {
  getOrgDetail,
  updateOrg,
  saveOrg
}

const mapStateToProps = (state) => ({
  orgDetail: state.orgMgt.orgDetail
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
