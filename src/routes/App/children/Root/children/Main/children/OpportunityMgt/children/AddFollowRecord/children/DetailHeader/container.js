import { connect } from 'react-redux'
import Component from './component'
import { updateOpportunity } from 'store/modules/opportunityMgt/index'

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {
  updateOpportunity,
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
