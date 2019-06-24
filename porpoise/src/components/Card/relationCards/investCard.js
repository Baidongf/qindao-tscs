import React from 'react'
import { connect } from 'react-redux'
import Layout from '../Layout'

class InvestCard extends React.PureComponent {
  render () {
    const { curEdge, originChartData } = this.props
    const vertexes = originChartData.vertexes
    const from = vertexes.find((v) => v._id === curEdge._from) || {}
    const to = vertexes.find((v) => v._id === curEdge._to) || {}

    const moneyRegList = /投资（(.*)）/.exec(curEdge.label)
    const percentRegList = /占比(\d+\.\d+%)/.exec(curEdge.label)
    const money = moneyRegList ? moneyRegList[1] : '--'
    const percent = percentRegList ? percentRegList[1] : '--'

    const CardBody = (
      <div className='clearfix'>
        <dl className='description-list-2 scroll-style'>
          <dt className='double-list-label'>投资者:</dt>
          <dd className='double-list-value' title={from.name}>{from.name}</dd>
          <dt className='double-list-label'>被投资者:</dt>
          <dd className='double-list-value' title={to.name}>{to.name}</dd>
          <br />
          <dt className='double-list-label'>投资金额:</dt>
          <dd className='double-list-value'>{money}</dd>
          <dt className='double-list-label'>投资占比:</dt>
          <dd className='double-list-value'>{percent}</dd>
        </dl>
      </div>
    )

    return (
      <Layout
        cardBody={CardBody}
        name='投资详情'
        customClass='money-flow-card' />
    )
  }
}

const mapStateToProps = (state) => ({
  curEdge: state.curEdge,
  originChartData: state.originChartData
})

export default connect(mapStateToProps, null)(InvestCard)
