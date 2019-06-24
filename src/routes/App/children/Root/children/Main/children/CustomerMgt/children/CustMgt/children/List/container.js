import { connect } from 'react-redux'
import Component from './component'
import {
  getCustList,
  getInstitutionCustomerList,
  getMyCustomerList,

  deliverInstitutionIds,

  deliverOpenAccountTime,
  deliverIndustryCategory,
  deliverIndustryCategoryOptions,
  deliverOperateRange,
  deliverOperateStatus,
  deliverRegisterTime,
  deliverRegisterCapital,

  deliverSelectedProvince,
  deliverSelectedProvinceCode,
  deliverSelectedCity,
  deliverSelectedCityCode,
  deliverSelectedArea,
  deliverSelectedAreaCode,
} from 'store/modules/customerMgt/customerMgt'

const mapDispatchToProps = {
  getCustList,
  getInstitutionCustomerList,
  getMyCustomerList,

  deliverInstitutionIds,

  deliverOpenAccountTime,
  deliverIndustryCategory,
  deliverIndustryCategoryOptions,
  deliverOperateRange,
  deliverOperateStatus,
  deliverRegisterTime,
  deliverRegisterCapital,

  deliverSelectedProvince,
  deliverSelectedProvinceCode,
  deliverSelectedCity,
  deliverSelectedCityCode,
  deliverSelectedArea,
  deliverSelectedAreaCode,
}

const mapStateToProps = (state) => ({
  custList: state.customerMgt.custList,
  institutionCustomerList: state.customerMgt.institutionCustomerList,
  myCustomerList: state.customerMgt.myCustomerList,

  institutionIds: state.customerMgt.institutionIds,

  openAccountTime: state.customerMgt.openAccountTime,
  industryCategory: state.customerMgt.industryCategory,
  industryCategoryOptions: state.customerMgt.industryCategoryOptions,
  operateRange: state.customerMgt.operateRange,
  operateStatus: state.customerMgt.operateStatus,
  registerTime: state.customerMgt.registerTime,
  registerCapital: state.customerMgt.registerCapital,

  selectedProvinceCode: state.customerMgt.selectedProvinceCode,
  selectedCityCode: state.customerMgt.selectedCityCode,
  selectedAreaCode: state.customerMgt.selectedAreaCode,

})


export default connect(mapStateToProps, mapDispatchToProps)(Component)
