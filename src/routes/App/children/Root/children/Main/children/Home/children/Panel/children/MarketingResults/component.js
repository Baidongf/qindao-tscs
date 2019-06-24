import React from 'react'
import './component.scss'
import MarketingResult from './children/MarketingResult'

/**
 * MarketingResults
 * @desc 首页营销成果面板
 */

class MarketingResults extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      moduleName: 'marketingResults',
      results: [
        {
          key: 'deposit',
          title: '日均存款',
        },
        {
          key: 'balance',
          title: '存款余额',
        }, {
          key: 'loan',
          title: '贷款余额',
        },
      ],
      homeMarketingResults: {data: [{},{},{}]},
    }
  }

  componentDidMount() {
    const moduleName = this.state.moduleName

    const { loginUserInfo } = this.props
    const { id, institutionId, isCustomerManager } = loginUserInfo

    this.props.getHomeModuleData(moduleName, {
      isCustomerManager: `${isCustomerManager}`,
      userId: id,
      institutionId
    })
  }

  componentWillReceiveProps({ homeMarketingResults }) {
    if (homeMarketingResults !== this.props.homeMarketingResults) {
      this.setState({ homeMarketingResults })
    }
  }

  render() {

    const list = this.state.results
    const data = this.state.homeMarketingResults.data.slice(0, 3)

    return (
      <div className='marketing-results'>
        <div className='results-area'>
          {
            data.length === 3 &&
            list.map((item, index) => {
              let itemData = data[index]

              itemData.isArrowUp = itemData.up >= 0 ? true : false
              itemData.amount = parseInt(itemData.value) + ''
              itemData.percent = itemData.up
              itemData.title = itemData.reportName

              return (
                <div className='result-item' key={item.key}>
                  <MarketingResult
                    iconType={item.key}
                    title={itemData.title}
                    amount={itemData.amount}
                    isArrowUp={itemData.isArrowUp}
                    desc={itemData.percent}
                  />
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

export default MarketingResults
