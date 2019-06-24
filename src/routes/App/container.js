import { connect } from 'react-redux'

import Component from './component'
import { setReduxStore } from 'store/modules/global'

const mapDispatchToProps = {
  setReduxStore
}

const mapStateToProps = (state) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
