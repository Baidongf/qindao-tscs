import {connect} from 'react-redux'
import Component from './component.js'
import {getParamsList} from 'store/modules/systemMgt/paramsMgt/index'

const mapDispatchToProps = {
  getParamsList
}

const mapStateToProps = (state) => ({
  paramsList: state.paramsMgt.paramsList
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
