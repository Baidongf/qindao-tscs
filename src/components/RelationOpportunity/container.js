import { connect } from 'react-redux'
import Component from './component.js'
import {
  getOpportunityList
} from 'store/modules/schedule'

const mapDispatchToProps = {
  getOpportunityList
}

const mapStateToProps = (state) => ({
  opportunityList: state.schedule.opportunityList
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
