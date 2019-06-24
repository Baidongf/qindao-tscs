import { connect } from 'react-redux'
import { getRoleDetail } from 'store/modules/systemMgt/roleMgt/index'
import Component from './component'

const mapDispatchToProps = {
  getRoleDetail,
}

const mapStateToProps = (state) => ({
  roleDetail: state.roleMgt.roleDetail,
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
