import React from 'react'
import Card from 'components/Card/riskAnalysis/CompanyCard'
import { connect } from 'react-redux'
import RiskIndex from 'components/Card/riskAnalysis/RiskIndex'
import CompanyCluster from 'components/Card/riskAnalysis/riskCluster'
import { Hint } from 'components/Hint'
import Chart from 'components/Chart'
import PropTypes from 'prop-types'
import { toggleCardType } from 'actions/Card'

class RiskAnalysis extends React.Component {
    constructor (props) {
        super(props)
    }
    render () {
        const status = this.props.renderChartStatus.status
        const cardType = this.props.cardType
        let card = [null, null]
        if (cardType === 'hide_type') {
            card[0] = null
            card[1] = null
        } else if (cardType.includes('risk_index')) {
            card[1] = <RiskIndex />
        } else if (cardType === 'Credit') {
            card[0] = <Card />
            card[1] = <RiskIndex />
        }
        return (
            <div className='container text-center clearfix'>
                <div className="clearfix card-wrap" >
                    {card[0]}
                </div>
                <div className="clearfix card-wrap right-more-card">
                    <CompanyCluster />
                    {card[1]}
                </div>
                <Chart />
                {status === 'success' || status === 'fail' || status === '' ? null : <Hint.Loading status={status} />}
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
  renderChartStatus: state.renderChartStatus,
  cardType: state.cardType
})
const mapDispatchToProps = (dispatch) => {
  return {
    toggleCardType: (cardType) => dispatch(toggleCardType(cardType))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(RiskAnalysis)