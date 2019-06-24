import { injectReducer } from '../../reducers'
import { guaranteeRiskClusterNames, guaranteeClusterItem, guaranteeClusterChartData, clusterNameRes,
  guaranteePaths, highlightLinkIds, pathTypeMap, guaranteePathCount } from './modules/guaranteeRisk'

export default (store) => ({
  path: 'guarantee_risk',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const guaranteeRisk = require('./containers/guaranteeRiskContainer').default

      injectReducer(store, { key: 'guaranteeRiskClusterNames', reducer: guaranteeRiskClusterNames })
      injectReducer(store, { key: 'guaranteeClusterItem', reducer: guaranteeClusterItem })
      injectReducer(store, { key: 'guaranteeClusterChartData', reducer: guaranteeClusterChartData })
      injectReducer(store, { key: 'clusterNameRes', reducer: clusterNameRes })
      injectReducer(store, { key: 'guaranteePaths', reducer: guaranteePaths })
      injectReducer(store, { key: 'highlightLinkIds', reducer: highlightLinkIds })
      injectReducer(store, { key: 'pathTypeMap', reducer: pathTypeMap })
      injectReducer(store, { key: 'guaranteePathCount', reducer: guaranteePathCount })
      cb(null, guaranteeRisk)
    }, 'guaranteeRisk')
  }
})
