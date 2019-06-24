import { connect } from 'react-redux'
import { getKnowlDetail, saveKnowl, updateKnowl,getKnowlParams } from 'store/modules/knowledgeBase/knowlMgt/index'
import Component from './component.js'

const mapDispatchToProps = {
  getKnowlDetail,
  updateKnowl,
  saveKnowl,
  getKnowlParams
}

const mapStateToProps = (state) => ({
  knowlDetail: state.knowlMgt.knowlDetail,
  knowlParams:state.knowlMgt.knowlParams
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
