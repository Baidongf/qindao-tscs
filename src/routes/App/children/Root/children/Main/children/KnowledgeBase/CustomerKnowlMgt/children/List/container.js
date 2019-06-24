import { connect } from 'react-redux'
import { getKnowlList, deleteKnowl,saveKnowl, updateKnowl,getKnowlParams,setAllListFilter ,getCollectionKnowlList} from 'store/modules/knowledgeBase/knowlMgt/index'
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
  setAllListFilter,
  getCollectionKnowlList
}

const mapStateToProps = (state) => ({
  knowlList: state.knowlMgt.knowlList,
  knowlParams:state.knowlMgt.knowlParams,
  allListFilter:state.knowlMgt.allListFilter
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
