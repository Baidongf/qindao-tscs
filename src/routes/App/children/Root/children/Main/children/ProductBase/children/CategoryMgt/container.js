import { connect } from 'react-redux'
import { getProdDetail, saveProd, updateProd ,getKnowledgeList,saveCategory,updateCategory,deleteCategory} from 'store/modules/productBase/prodMgt'
import {getCatList}  from 'store/modules/productBase/catMgt'
import Component from './component.js'

const mapDispatchToProps = {
  getProdDetail,
  saveProd,
  updateProd,
  getCatList,
  getKnowledgeList,
  saveCategory,
  updateCategory,
  deleteCategory
}

const mapStateToProps = (state) => ({
  prodDetail: state.prodMgt.prodDetail,
  catList:state.catMgt.catList,
  knowledgeList:state.prodMgt.knowledgeList
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
