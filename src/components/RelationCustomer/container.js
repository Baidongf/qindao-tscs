import { connect } from 'react-redux'
import Component from './component.js'
import {
  getCustomerList
} from 'store/modules/schedule'


const mapDispatchToProps = {
  getCustomerList
}

const mapStateToProps = (state) => ({
  customerList: state.schedule.customerList
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
