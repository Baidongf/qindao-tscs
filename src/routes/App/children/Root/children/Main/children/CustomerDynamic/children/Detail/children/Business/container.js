import { connect } from 'react-redux'
import Component from './component'
import {
  getOpportunityList,
  relateBusinessWithDynamic,
  unRelateBusinessWithDynamic,
  getDynamicRelatedBusinessList,
} from 'store/modules/opportunityMgt/index'

const mapStateToProps = (state) => ({
  opportunityList: state.opportunityMgt.opportunityList,
  dynamicRelatedBusinessList: state.opportunityMgt.dynamicRelatedBusinessList,
})

const mapDispatchToProps = {
  getOpportunityList,
  relateBusinessWithDynamic,
  unRelateBusinessWithDynamic,
  getDynamicRelatedBusinessList,
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
