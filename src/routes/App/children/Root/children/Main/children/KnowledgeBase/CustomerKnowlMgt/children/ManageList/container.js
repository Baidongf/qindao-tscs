import { connect } from 'react-redux'
import { getKnowlList, deleteKnowl,getKnowlParams ,getALLKnowList,deleteKnowlItem} from 'store/modules/knowledgeBase/knowlMgt/index'
import { saveKnowl, updateKnowl, publishKnowl, setManageListFilter} from 'store/modules/knowledgeBase/knowlMgt/index'
import { collectKnowl,collectDelKnowl,getCollectionList } from 'store/modules/knowledgeBase/myCollection/index'
import Component from './component.js'

const mapDispatchToProps = {
  getKnowlList,
  deleteKnowl,
  updateKnowl,
  saveKnowl,
  publishKnowl,
  collectKnowl,
  collectDelKnowl,
  getCollectionList,
  getKnowlParams,
  getALLKnowList,
  deleteKnowlItem,
  setManageListFilter
}

const mapStateToProps = (state) => ({
  knowlList: state.knowlMgt.knowlList,
  knowlParams:state.knowlMgt.knowlParams,
  knowlAllList:state.knowlMgt.knowlAllList,
  manageListFilter:state.knowlMgt.manageListFilter
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
