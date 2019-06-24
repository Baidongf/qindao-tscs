import { connect } from 'react-redux'
import {
  getAccountList,
  getInstitutionAccountList,
  getMyAccountList,
  getAllManagers,
} from 'store/modules/customerMgt/accountMgt/index'
import Component from './component.js'

const mapDispatchToProps = {
  getAccountList,
  getInstitutionAccountList,
  getMyAccountList,
  getAllManagers,
}

const mapStateToProps = (state) => ({
  accountList: state.accountMgt.accountList,
  institutionAccountList: state.accountMgt.institutionAccountList,
  myAccountList: state.accountMgt.myAccountList,
  allManagers: state.accountMgt.allManagers,
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
