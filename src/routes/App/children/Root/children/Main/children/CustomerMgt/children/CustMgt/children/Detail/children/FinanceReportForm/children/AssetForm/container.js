import { connect } from 'react-redux'
import Component from './component'
import { getAssetList } from 'store/modules/customerMgt/customerMgt/index'

const mapStateToProps = (state) => ({
  customerAssetList: state.customerMgt.customerAssetList,
})

const mapDispatchToProps = {
  getAssetList
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
