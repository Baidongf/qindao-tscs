import { connect } from 'react-redux'
import { getOneDetail,getTwoDetail,getThreeDetail,getFourDetail,getFiveDetail,getQueryEnum, } from 'store/modules/projectReserve'

import Component from './component.js'

const mapDispatchToProps = {
  getOneDetail,
  getTwoDetail,
  getThreeDetail,
  getFourDetail,
  getFiveDetail,
  getQueryEnum,
}

const mapStateToProps = (state) => ({
  queryEnum:state.projectReserve.queryEnum
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
