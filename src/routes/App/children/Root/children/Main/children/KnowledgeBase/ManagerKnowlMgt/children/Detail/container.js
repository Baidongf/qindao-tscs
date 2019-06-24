import { connect } from 'react-redux'
import { getKnowlDetail, updateKnowl } from 'store/modules/knowledgeBase/knowlMgt/index'

import Component from './component.js'

const mapDispatchToProps = {
  getKnowlDetail,
  updateKnowl
}

const mapStateToProps = (state) => ({
  knowlDetail: state.knowlMgt.knowlDetail
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
