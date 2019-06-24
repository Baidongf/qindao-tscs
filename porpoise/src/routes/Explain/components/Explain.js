import React from 'react'
import Card from 'components/Card'
import Chart from 'components/Chart'
import ContextMenu from 'components/ContextMenu'
import { Hint } from 'components/Hint'
import PropTypes from 'prop-types'

/**
 * 图谱解释页
 */
class Explain extends React.Component {
  /**
   * constructor
   * @param {Object} props props
   */
  constructor (props) {
    super(props)

    this.query = this.props.reduxLocation.query
  }

  /**
   * 根据图谱解释类型更新 options 参数
   */
  componentWillMount () {
    this.props.changeFilterOptions(this.query)
  }

  /**
   * - 获取图数据
   * - 获取行内配置，更新全局options
   */
  componentDidMount () {
    this.getChartData(this.query.type)
    this.props.addBelongBankRelationToGlobal()
  }

  /**
   * 根据URL指定的图谱解释类型获取图数据
   * @param {String} type 图谱解释类型
   */
  getChartData (type) {
    const getChartDataMethod = {
      'concert': () => {
        const { from, to, target, rule } = this.query
        this.props.getConcertChart({ from, to, target, rule })
      },
      'company_faction': () => {
        const { from, to } = this.query
        this.props.getCompanyFactionChart({ from, to })
      },
      'invest_and_officer': () => {
        const { id, company } = this.query
        this.props.getInvestAndOfficerChart({ _id: id, name: company })
      },
      'actual_controller': () => {
        this.props.getActualCtrlChart()
      }
    }

    getChartDataMethod[type] && getChartDataMethod[type]()
  }

  /**
   * render
   * @return {div} render Explain
   */
  render () {
    const { status } = this.props.renderChartStatus
    return (
      <div className='container text-center clearfix'>
        <Card />
        <Chart />
        <ContextMenu />
        {status === 'success' || status === 'fail' || status === '' ? null : <Hint.Loading status={status} />}
      </div>
    )
  }
}

Explain.propTypes = {
  renderChartStatus: PropTypes.object,
  reduxLocation: PropTypes.object,
  getConcertChart: PropTypes.func,
  getCompanyFactionChart: PropTypes.func,
  changeFilterOptions: PropTypes.func,
  getInvestAndOfficerChart: PropTypes.func,
  getActualCtrlChart: PropTypes.func,
  addBelongBankRelationToGlobal: PropTypes.func
}

export default Explain
