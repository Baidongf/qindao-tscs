import { connect } from 'react-redux'
import { standardAtlasExpand } from 'store/modules/knowledgeImage/index'
import Component from './component'

const mapDispatchToProps = {
  standardAtlasExpand
}

const mapStateToProps = (state) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
