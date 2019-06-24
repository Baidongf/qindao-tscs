import { connect } from 'react-redux'
import Component from './component'
import { getDynamicDetail } from 'store/modules/customerDynamic'

const mapStateToProps = (state) => ({
  dynamicDetail: state.customerDynamic.dynamicDetail,
})

const mapDispatchToProps = {
  getDynamicDetail,
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
