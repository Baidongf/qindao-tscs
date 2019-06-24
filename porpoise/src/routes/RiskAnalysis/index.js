import { injectReducer } from '../../reducers'
import { guaranteeRiskClusterNames, getCompanyClusterItemNames, getClusterChartNames, getCreditCardNames,
  getRiskNodeDetailNames, getCreditDataNames } from './modules/riskAnalysis'

export default (store) => ({
  path: 'risk_analysis',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const riskAnalysis = require('./containers/riskAnalysis').default
      injectReducer(store, { key: 'clusterNames', reducer: guaranteeRiskClusterNames })
      injectReducer(store, { key: 'clusterItem', reducer: getCompanyClusterItemNames })
      injectReducer(store, { key: 'clusterChartData', reducer: getClusterChartNames })
      injectReducer(store, { key: 'companyBriefData', reducer: getRiskNodeDetailNames })
      injectReducer(store, {key: 'creditData', reducer: getCreditDataNames })
      injectReducer(store, {key: 'cardType', reducer: getCreditCardNames })
      cb(null, riskAnalysis)
    }, 'riskAnalysis')
  }
})
