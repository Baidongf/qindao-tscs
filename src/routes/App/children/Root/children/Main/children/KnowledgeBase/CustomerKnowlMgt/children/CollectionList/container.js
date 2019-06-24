import { connect } from 'react-redux'
import { getKnowlList, deleteKnowl,saveKnowl, updateKnowl,getKnowlParams,getCollectionKnowlList ,setCollectionListFilter} from 'store/modules/knowledgeBase/knowlMgt/index'
import { collectKnowl,collectDelKnowl } from 'store/modules/knowledgeBase/myCollection/index'
import Component from './component.js'

const mapDispatchToProps = {
  getKnowlList,
  deleteKnowl,
  updateKnowl,
  saveKnowl,
  collectKnowl,
  collectDelKnowl,
  getKnowlParams,
  getCollectionKnowlList,
  setCollectionListFilter
}

const mapStateToProps = (state) => ({
  knowlList: state.knowlMgt.knowlList,
  knowlParams:state.knowlMgt.knowlParams,
  knowlCollectionList:state.knowlMgt.knowlCollectionList,
  collectionListFilter:state.knowlMgt.collectionListFilter
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
