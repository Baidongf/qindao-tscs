import { connect } from 'react-redux'
import Component from './component'
import { search } from 'store/modules/home/index'

const mapStateToProps = (state) => ({
  customerList: state.home.customerList,
})

const mapDispatchToProps = {
  search,
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
