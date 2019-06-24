import { connect } from 'react-redux'
import Component from './component'
import {
  getDynamicList,
  getInstitutionDynamicList,
  getMyDynamicList,
  getDynamicType,
  deliverDynamicFilter,
  deliverInstitutionDynamicFilter,
  deliverMyDynamicFilter,
} from 'store/modules/customerDynamic/index'


const mapStateToProps = (state) => ({
  dynamicList: state.customerDynamic.dynamicList,
  institutionDynamicList: state.customerDynamic.institutionDynamicList,
  myDynamicList: state.customerDynamic.myDynamicList,
  dynamicType: state.customerDynamic.dynamicType,
})

const mapDispatchToProps = {
  getDynamicList,
  getInstitutionDynamicList,
  getMyDynamicList,
  getDynamicType,
  deliverDynamicFilter,
  deliverInstitutionDynamicFilter,
  deliverMyDynamicFilter,
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
