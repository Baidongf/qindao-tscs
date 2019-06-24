import { connect } from 'react-redux'
import { getKnowlList, deleteKnowl,getKnowlParams ,getALLKnowList,deleteKnowlItem} from 'store/modules/knowledgeBase/knowlMgt/index'
import { saveKnowl, updateKnowl } from 'store/modules/knowledgeBase/knowlMgt/index'
import { collectKnowl,collectDelKnowl,getCollectionList } from 'store/modules/knowledgeBase/myCollection/index'
import Component from './component.js'

const mapDispatchToProps = {
  getKnowlList,
  deleteKnowl,
  updateKnowl,
  saveKnowl,
  collectKnowl,
  collectDelKnowl,
  getCollectionList,
  getKnowlParams,
  getALLKnowList,
  deleteKnowlItem
}

const mapStateToProps = (state) => ({
  knowlList: state.knowlMgt.knowlList,
  knowlParams:state.knowlMgt.knowlParams,
  knowlAllList:state.knowlMgt.knowlAllList
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
