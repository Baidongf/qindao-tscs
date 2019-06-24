import React from 'react'
import Card from 'components/Card'
import Chart from 'components/Chart'
import ContextMenu from 'components/ContextMenu'
import { Hint } from 'components/Hint'
import PropTypes from 'prop-types'

/**
 * 落地页
 */
class IndividualTransfer extends React.Component {
  /**
   * render
   * @return {div} render IndividualTransfer
   */
  render () {
    const { status, msg } = this.props.renderChartStatus
    return (
      <div className='container clearfix'>
        <Card />
        <Chart />
        <ContextMenu />
        {status === 'success' || status === 'fail' || status === '' ? null : <Hint.Loading status={status} />}
        <Hint.Error show={status === 'fail'} msg={msg} />}
      </div>
    )
  }
}

IndividualTransfer.propTypes = {
  renderChartStatus: PropTypes.object
}

export default IndividualTransfer
