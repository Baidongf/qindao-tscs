import { connect } from 'react-redux'

import Component from './component'
import { login } from 'store/modules/loginOut/index'
import { setRole } from 'store/modules/account/index'

const mapDispatchToProps = {
  login,
  setRole,
}

const mapStateToProps = (state) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
