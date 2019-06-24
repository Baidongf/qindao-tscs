import { connect } from 'react-redux'
import Component from './component'
import {
  deliverSelectedProvince,
  deliverSelectedCity,
  deliverSelectedArea,
  deliverSelectedProvinceCode,
  deliverSelectedCityCode,
  deliverSelectedAreaCode,
} from 'store/modules/customerMgt/customerMgt'

const mapStateToProps = (state) => ({
  selectedProvince: state.customerMgt.selectedProvince,
  selectedCity: state.customerMgt.selectedCity,
  selectedArea: state.customerMgt.selectedArea,

  selectedProvinceCode: state.customerMgt.selectedProvinceCode,
  selectedCityCode: state.customerMgt.selectedCityCode,
  selectedAreaCode: state.customerMgt.selectedAreaCode,
})

const mapDispatchToProps = {
  deliverSelectedProvince,
  deliverSelectedCity,
  deliverSelectedArea,

  deliverSelectedProvinceCode,
  deliverSelectedCityCode,
  deliverSelectedAreaCode,
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
