import { connect } from 'react-redux'
import Component from './component.js'
import {getParamsDetail,upDateParams} from 'store/modules/systemMgt/paramsMgt'
const mapDispatchToProps = {
  getParamsDetail,
  upDateParams
}

const mapStateToProps = (state) => ({
  paramsDetail: state.paramsMgt.paramsDetail
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
