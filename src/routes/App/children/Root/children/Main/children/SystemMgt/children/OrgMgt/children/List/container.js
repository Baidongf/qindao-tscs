import { connect } from 'react-redux'
import { getOrgList, deleteOrg, updateOrg } from 'store/modules/systemMgt/orgMgt/index'
import Component from './component.js'

const mapDispatchToProps = {
  getOrgList,
  deleteOrg,
  updateOrg,
}

const mapStateToProps = (state) => ({
  orgList: state.orgMgt.orgList,
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
