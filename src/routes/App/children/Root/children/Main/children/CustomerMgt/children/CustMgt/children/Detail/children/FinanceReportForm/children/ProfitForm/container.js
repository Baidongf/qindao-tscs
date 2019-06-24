import { connect } from 'react-redux'
import Component from './component'
import { getProfitList } from 'store/modules/customerMgt/customerMgt/index'

const mapStateToProps = (state) => ({
  customerProfitList: state.customerMgt.customerProfitList,
})

const mapDispatchToProps = {
  getProfitList
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
