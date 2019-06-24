import React from 'react'
import Card from 'components/Card'
import Chart from 'components/Chart'
import { Hint } from 'components/Hint'
import PropTypes from 'prop-types'

/**
 * 担保风险分析
 * for 广东农信
 */
class GuaranteeRisk extends React.Component {
  /**
   * render
   * @return {div} render LandingPage
   */
  render () {
    const { status, msg } = this.props.renderChartStatus
    return (
      <div className='container text-center clearfix'>
        <Card />
        <Chart />
        {status === 'success' || status === 'fail' || status === '' ? null : <Hint.Loading status={status} />}
        <Hint.Error show={status === 'fail'} msg={msg} />
      </div>
    )
  }
}

GuaranteeRisk.propTypes = {
  renderChartStatus: PropTypes.object
}

export default GuaranteeRisk
