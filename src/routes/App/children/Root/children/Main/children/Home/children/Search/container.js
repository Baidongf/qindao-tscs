import { connect } from 'react-redux'
import Component from './component'
import { search } from 'store/modules/home/index'

const mapDispatchToProps = {
  search,
}

const mapStateToProps = (state) =>({
  customerList: state.home.customerList
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
