import { connect } from 'react-redux'
import Component from './component.js'
import { getManagerTree, getManagerListById } from 'store/modules/customerMgt/customerMgt'

const mapDispatchToProps = {
  getManagerTree,
  getManagerListById
}

const mapStateToProps = (state) => ({
  managerTree: state.customerMgt.managerTree,
  managerList: state.customerMgt.managerList
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
