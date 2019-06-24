import { connect } from 'react-redux'
import {
  getSubordinateList,
  getAllManagers,
} from 'store/modules/opportunityMgt/index'
import Component from './component.js'

const mapDispatchToProps = {
  getSubordinateList,
  getAllManagers,
}

const mapStateToProps = (state) => ({
  subordinateList: state.opportunityMgt.subordinateList,
  allManagers: state.opportunityMgt.allManagers,
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)

