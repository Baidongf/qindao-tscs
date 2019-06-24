import { connect } from 'react-redux'
import Component from './component'
import {
  deliverOpenAccountTime,
  deliverIndustryCategory,
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

const mapStateToProps = (state) => ({
  openAccountTime: state.customerMgt.openAccountTime,
  industryCategory: state.customerMgt.industryCategory,
  operateRange: state.customerMgt.operateRange,
  operateStatus: state.customerMgt.operateStatus,
  registerTime: state.customerMgt.registerTime,
  registerCapital: state.customerMgt.registerCapital,

  selectedProvince: state.customerMgt.selectedProvince,
  selectedProvinceCode: state.customerMgt.selectedProvinceCode,
  selectedCity: state.customerMgt.selectedCity,
  selectedCityCode: state.customerMgt.selectedCityCode,
  selectedArea: state.customerMgt.selectedArea,
  selectedAreaCode: state.customerMgt.selectedAreaCode,
})

const mapDispatchToProps = {
  deliverOpenAccountTime,
  deliverIndustryCategory,
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

export default connect(mapStateToProps, mapDispatchToProps)(Component)
