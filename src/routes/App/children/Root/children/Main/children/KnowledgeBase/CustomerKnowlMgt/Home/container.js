import { connect } from 'react-redux'
import { setTabKey } from 'store/modules/knowledgeBase/knowlMgt/index'
import Component from './component.js'

const mapDispatchToProps = {
    setTabKey
}

const mapStateToProps = (state) => ({
    knowlTabKey: state.knowlMgt.knowlTabKey.tabkey
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
