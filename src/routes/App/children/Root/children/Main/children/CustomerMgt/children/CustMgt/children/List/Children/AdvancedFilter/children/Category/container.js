import { connect } from 'react-redux'
import Component from './component'
import { deliverIndustryCategory, deliverIndustryCategoryOptions } from 'store/modules/customerMgt/customerMgt'

const mapStateToProps = (state) => ({
  industryCategory: state.customerMgt.industryCategory,
  industryCategoryOptions: state.customerMgt.industryCategoryOptions,
})

const mapDispatchToProps = {
  deliverIndustryCategory,
  deliverIndustryCategoryOptions,
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
