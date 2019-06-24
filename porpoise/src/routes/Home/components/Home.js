import React from 'react'
import { connect } from 'react-redux'
import Card from 'components/Card'
import Filter from 'components/Filter'
import Chart from 'components/Chart'
import GraphTransformButton from 'components/GraphTransformButton'
import NavigateBtn from 'components/navigateBtn'
import { OperateBtnGroup, OperateBtnContainer, Btns } from 'components/operateBtns'
import SnapshotButton from 'components/SnapshotButton'
import ContextMenu from 'components/ContextMenu'
import { Hint } from 'components/Hint'
import PropTypes from 'prop-types'

import { graphPostBody } from 'graph.config'
import { changeFilterOptions } from 'actions/Filter'

class Home extends React.Component {
  componentWillMount () {
    if (this.props.reduxLocation.query.operation === 'snapshot') {
      const { options } = graphPostBody
      options.edges.forEach((e) => {
        if (['invest', 'officer', 'control_shareholder', 'actual_controller', 'person_merge',
          'tradable_share'].includes(e.class)) {
          e.visible = true
        } else {
          e.visible = false
        }
      })
      this.props.changeFilterOptions(options)
    }
  }

  getOperateBtns () {
    return (
      <OperateBtnContainer>
        {/* <OperateBtnGroup>
          <Btns.ZoomInBtn />
          <Btns.ZoomOutBtn />
        </OperateBtnGroup> */}
        <OperateBtnGroup>
          <Btns.BackBtn />
        </OperateBtnGroup>
      </OperateBtnContainer>
    )
  }

  render () {
    const { status, msg } = this.props.renderChartStatus
    return (
      <div className='container text-center clearfix'>
        <Card />
        {this.props.reduxLocation.query.type === 'Graph' ? <Filter /> : null}
        <Chart />
        {/* <GraphTransformButton /> */}
        {this.props.reduxLocation.query.operation === 'snapshot' ? <SnapshotButton /> : null}
        {this.props.isPhoto ? <Hint.Snapshot /> : null }
        {/* <NavigateBtn /> */}
        <div className='home-operate-btns'>
          { this.getOperateBtns() }
        </div>
        <ContextMenu />
        {status === 'success' || status === 'fail' || status === '' ? null : <Hint.Loading status={status} />}
        <Hint.Error show={status === 'fail'} msg={msg} />
        <Hint.ExpandAllModal />
      </div>
    )
  }
}

Home.propTypes = {
  renderChartStatus: PropTypes.object,
  reduxLocation: PropTypes.object,
  changeFilterOptions: PropTypes.func
}

const mapStateToProps = (state) => ({
  renderChartStatus: state.renderChartStatus,
  reduxLocation: state.location,
  isPhoto: state.isPhotoGraph
})

const mapDispatchToProps = (dispatch) => ({
  changeFilterOptions: (name, changeItem) => dispatch(changeFilterOptions(name, changeItem)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
