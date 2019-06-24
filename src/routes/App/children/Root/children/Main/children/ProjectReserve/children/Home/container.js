import { connect } from 'react-redux'
import { getProjectReserveList,getQueryEnum,delProjectReserve } from 'store/modules/projectReserve'
import { getManagerTree } from 'store/modules/customerMgt/customerMgt'
import Component from './component.js'

const mapDispatchToProps = {
  getProjectReserveList,
  getQueryEnum,
  getManagerTree,
  delProjectReserve
}

const mapStateToProps = (state) => ({
  projectReserveList:state.projectReserve.projectReserveList,
  queryEnum:state.projectReserve.queryEnum,
  managerTreeToSelect: treeToSelect(state.customerMgt.managerTree),
})

function treeToSelect(tree) {
  if(tree&&tree.children) {
    return tree.children
  }
  else
    return []
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
