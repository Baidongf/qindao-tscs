import { connect } from 'react-redux'
import { getOrgDetail, saveOrg, updateOrg } from 'store/modules/systemMgt/orgMgt'
import { getParamsConfig } from 'store/modules/systemMgt/paramsMgt'
import Component from './component.js'

const mapDispatchToProps = {
  getOrgDetail,
  updateOrg,
  getParamsConfig,
  saveOrg
}

const mapStateToProps = (state) => ({
  orgDetail: state.orgMgt.orgDetail,
  paramsConfig: state.paramsMgt.paramsConfig
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
