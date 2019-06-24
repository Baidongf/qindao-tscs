import { connect } from 'react-redux'
import Component from './component'
import { getHomeModuleData } from 'store/modules/home/index'

const mapDispatchToProps = {
  getHomeModuleData,
}

const mapStateToProps = (state) =>({
  homeKnowledgeBase: state.home.homeKnowledgeBase,
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
