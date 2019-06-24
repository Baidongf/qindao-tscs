import { connect } from 'react-redux'
import { getOrgDetail, saveOrg, updateOrg } from 'store/modules/systemMgt/orgMgt'
import { getParamsConfig } from 'store/modules/systemMgt/paramsMgt'
import { getProjectReserveList,
  getQueryEnum,
  saveOneDetail,
  saveTwoDetail,
  saveThreeDetail ,
  saveFourDetail,
  saveFiveDetail,
  getOneDetail,
  getTwoDetail,
  getThreeDetail,
  getFourDetail,
  getFiveDetail,
  updateOneDetail,
  updateTwoDetail,
  updateThreeDetail,
  updateFourDetail,
  updateFiveDetail,
} from 'store/modules/projectReserve'

import Component from './component.js'

const mapDispatchToProps = {
  getOrgDetail,
  updateOrg,
  getParamsConfig,
  saveOrg,
  getQueryEnum,
  saveOneDetail,
  saveTwoDetail,
  saveThreeDetail,
  saveFourDetail,
  saveFiveDetail,
  getOneDetail,
  getTwoDetail,
  getThreeDetail,
  getFourDetail,
  getFiveDetail,
  updateOneDetail,
  updateTwoDetail,
  updateThreeDetail,
  updateFourDetail,
  updateFiveDetail,
}

const mapStateToProps = (state) => ({
  orgDetail: state.orgMgt.orgDetail,
  paramsConfig: state.paramsMgt.paramsConfig,
  queryEnum:state.projectReserve.queryEnum
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
