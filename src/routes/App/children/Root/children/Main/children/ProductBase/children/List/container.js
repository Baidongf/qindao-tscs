import { connect } from 'react-redux'
import { getProdList, getProdCount, getProdDetail, saveProd, updateProd } from 'store/modules/productBase/prodMgt/index'
import { getCatList } from 'store/modules/productBase/catMgt/index'
import Component from './component.js'

const mapDispatchToProps = {
  getProdList,
  getProdCount,
  getProdDetail,
  saveProd,
  updateProd,
  getCatList
}

const mapStateToProps = (state) => ({
  catList: state.catMgt.catList,
  prodList: state.prodMgt.prodList,
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
