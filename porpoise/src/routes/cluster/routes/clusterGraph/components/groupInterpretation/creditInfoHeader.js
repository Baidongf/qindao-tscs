import React from 'react'
import * as d3 from 'd3'
import './creditInfoHeader.scss'

class CreditInfoHeader extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.drawCircle()
  }

  drawCircle () {
    const width = 100
    const height = 100

    const data = Number(this.props.data.creditPercent.slice(0, -1))
    const dataset = [data, 100 - data]

    const iR = 32
    const oR = 47

    let svg = d3.select('#creditInfoCircle')
      .append('svg')
      .attr('width', width)
      .attr('height', height)

    let pie = d3.pie().startAngle(2 * Math.PI).endAngle(0)
    let pieData = pie(dataset)

    let arc = d3.arc()
      .innerRadius(iR)
      .outerRadius(oR)

    let colors = ['#F2F2F2', '#4FA2F1']
    let arcs = svg.selectAll('g')
      .data(pieData)
      .enter()
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`)

    arcs.append('path')
      .attr('fill', (d, i) => {
        return colors[i]
      })
      .attr('d', (d) => arc(d))

    // svg
      // .append('circle')
      // .attr('r', 32)
      // .attr('cx', width / 2)
      // .attr('cy', height / 2)
      // .attr('fill', '#fceaea')

    let fontSize = 18
    if (String(data).length === 5) {
      fontSize = 15
    }
    svg.append('text')
      .text(data + '%')
      .attr('fill', '#4FA2F1')
      .attr('font-size', fontSize)
      .attr('transform', `translate(${width / 2}, ${height / 2})`)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
  }

  render () {
    return (
      <div className='credit_info_header'>
        <div className='credit_info_circle' id='creditInfoCircle' />
        {/* <div className='credit_info_circle'>{this.props.data.creditPercent}</div> */}
        <div className='credit_info_header_right'>
          <p>集团成员授信总金额：<span className='header_count_right'>{this.props.data.innerTotal}万元</span></p>
          <p>集团授信集中度：<span className='header_count_right'>{this.props.data.creditPercent}</span></p>
        </div>
      </div>
    )
  }
}

export default CreditInfoHeader
