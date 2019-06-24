import { connect } from 'react-redux'
import Component from './component'
import { getCommonList } from 'store/modules/opportunityMgt'


const mapStateToProps = (state) => ({
  commonList: state.opportunityMgt.commonList,
})

const mapDispatchToProps = {
  getCommonList
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
