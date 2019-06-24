import React from 'react'
import Card from 'components/Card'
import Chart from 'components/Chart'
import { Hint } from 'components/Hint'
import PropTypes from 'prop-types'

/**
 * 基于黑名单客户的关联欺诈识别
 * for 广东农信
 */
class BlacklistCheat extends React.Component {
  componentDidMount () {
    this.props.toggleCardType('blacklist_relation')
  }
  /**
   * render
   * @return {div} render blacklist
   */
  render () {
    const { status, msg } = this.props.renderChartStatus
    return (
      <div className='container text-center clearfix'>
        <Card />
        <Chart />
        {status === 'success' || status === 'fail' || status === '' ? null : <Hint.Loading status={status} />}
        <Hint.Error show={status === 'fail'} msg={msg} />}
      </div>
    )
  }
}

BlacklistCheat.propTypes = {
  renderChartStatus: PropTypes.object,
  toggleCardType: PropTypes.func
}

export default BlacklistCheat
