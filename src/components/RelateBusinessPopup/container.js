import { connect } from 'react-redux'
import Component from './component.js'
import {
  getOpportunityList,
  relateBusinessWithDynamic,
  getDynamicRelatedBusinessList,
} from 'store/modules/opportunityMgt/index'

const mapStateToProps = (state) => ({
  opportunityList: state.opportunityMgt.opportunityList,
  dynamicRelatedBusinessList: state.opportunityMgt.dynamicRelatedBusinessList,
})

const mapDispatchToProps = {
  getOpportunityList,
  relateBusinessWithDynamic,
  getDynamicRelatedBusinessList,
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
