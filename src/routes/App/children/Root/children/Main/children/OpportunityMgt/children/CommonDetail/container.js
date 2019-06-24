import { connect } from 'react-redux'
import { getOpportunityDetail } from 'store/modules/opportunityMgt/index'
import Component from './component.js'

const mapDispatchToProps = {
  getOpportunityDetail,
}

const mapStateToProps = (state) => ({
  opportunityDetail: state.opportunityMgt.opportunityDetail
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
