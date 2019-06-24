import { connect } from 'react-redux'
import { toggleCardType } from 'actions/Card'
import BlacklistCheat from '../components/BlacklistCheat'

/**
 * dispatch to props
 * @param {Object} dispatch dispatch
 * @return {Object} actions
 */
const mapDispatchToProps = (dispatch) => ({
  toggleCardType: (type) => dispatch(toggleCardType(type))
})

/**
 * state to props
 * @param {Object} state state
 * @return {Object} state
 */
const mapStateToProps = (state) => ({
  renderChartStatus: state.renderChartStatus
})

export default connect(mapStateToProps, mapDispatchToProps)(BlacklistCheat)
