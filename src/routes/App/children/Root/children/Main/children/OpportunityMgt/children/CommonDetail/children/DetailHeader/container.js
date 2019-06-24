import { connect } from 'react-redux'
import Component from './component'
import { updateOpportunity , followOpportunity} from 'store/modules/opportunityMgt/index'

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {
  updateOpportunity,
  followOpportunity
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
