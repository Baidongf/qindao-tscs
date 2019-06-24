import { connect } from 'react-redux'
import Component from './component'

import {
  getDynamicList,
  getInstitutionDynamicList,
  getMyDynamicList,
} from 'store/modules/customerDynamic/index'

const mapStateToProps = (state) => ({
  dynamicList: state.customerDynamic.dynamicList,
  institutionDynamicList: state.customerDynamic.institutionDynamicList,
  myDynamicList: state.customerDynamic.myDynamicList,
  dynamicFilter: state.customerDynamic.dynamicFilter,
  institutionDynamicFilter: state.customerDynamic.institutionDynamicFilter,
  myDynamicFilter: state.customerDynamic.myDynamicFilter,
})

const mapDispatchToProps = {
  getDynamicList,
  getInstitutionDynamicList,
  getMyDynamicList,
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
