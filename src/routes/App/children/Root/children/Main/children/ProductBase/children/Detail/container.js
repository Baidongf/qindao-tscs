import { connect } from 'react-redux'
import { getProdDetail } from 'store/modules/productBase/prodMgt'
import Component from './component.js'
import { getCatList } from 'store/modules/productBase/catMgt/index'
const mapDispatchToProps = {
  getProdDetail,
  getCatList
}

const mapStateToProps = (state) => ({
  prodDetail: state.prodMgt.prodDetail,
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
