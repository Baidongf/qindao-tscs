import React from 'react'
import { connect } from 'react-redux'
import Layout from '../Layout'

class OfficerCard extends React.PureComponent {
  render () {
    const { curEdge, originChartData } = this.props
    const vertexes = originChartData.vertexes
    const from = vertexes.find((v) => v._id === curEdge._from) || {}
    const to = vertexes.find((v) => v._id === curEdge._to) || {}

    const positionRegList = /高管（(.*)）/.exec(curEdge.label)
    const position = positionRegList ? positionRegList[1] : '--'

    const CardBody = (
      <div className='clearfix'>
        <dl className='description-list-2 scroll-style'>
          <dt className='double-list-label'>任职企业:</dt>
          <dd className='double-list-value' title={to.name}>{to.name}</dd>
          <dt className='double-list-label'>任职人:</dt>
          <dd className='double-list-value' title={from.name}>{from.name}</dd>
          <br />
          <dt className='double-list-label'>职位:</dt>
          <dd className='double-list-value'>{position}</dd>
        </dl>
      </div>
    )

    return (
      <Layout
        cardBody={CardBody}
        name='任职详情'
        customClass='money-flow-card' />
    )
  }
}

const mapStateToProps = (state) => ({
  curEdge: state.curEdge,
  originChartData: state.originChartData
})

export default connect(mapStateToProps, null)(OfficerCard)
