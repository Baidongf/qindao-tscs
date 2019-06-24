import {connect} from 'react-redux'
import {getManagerTree, getManagerListById} from 'store/modules/customerMgt/customerMgt/index'
import Component from './component.js'

const mapDispatchToProps = {
  getManagerTree,
  getManagerListById
}

const mapStateToProps = (state) => ({
  managerTree: state.customerMgt.managerTree,
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
