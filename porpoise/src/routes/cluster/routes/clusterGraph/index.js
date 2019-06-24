import { injectReducer } from '../../../../reducers'
import { companyListObj, singleCompanyChart, riskListObj, singleCompanyRiskListObj,
  groupFeatureObj, newRegisterObj, singleCompanyRelativeChart, findGroupMembers,
  capitalCircleList, capitalCircleDetail, mutualGuaraList, mutualGuaraDetail, blockTradeList, expireBusinessList, innerCreditTotal, creditOverLimitlist
 } from './modules/GroupRelationCard'
import { clusterCompanyFilter } from './modules/filterModal'
import { downloadModalStatus } from './modules/downloadModal'

export default (store) => ({
  path: 'detail',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const ClusterGraph = require('./containers/clusterGraph').default
      injectReducer(store, { key: 'companyListObj', reducer: companyListObj })
      injectReducer(store, { key: 'riskListObj', reducer: riskListObj })
      injectReducer(store, { key: 'singleCompanyRiskListObj', reducer: singleCompanyRiskListObj })
      injectReducer(store, { key: 'singleCompanyChart', reducer: singleCompanyChart })
      injectReducer(store, { key: 'groupFeatureObj', reducer: groupFeatureObj })
      injectReducer(store, { key: 'newRegisterObj', reducer: newRegisterObj })
      injectReducer(store, { key: 'singleCompanyRelativeChart', reducer: singleCompanyRelativeChart })
      injectReducer(store, { key: 'findGroupMembers', reducer: findGroupMembers })
      injectReducer(store, { key: 'clusterCompanyFilter', reducer: clusterCompanyFilter })
      injectReducer(store, { key: 'capitalCircleList', reducer: capitalCircleList })
      injectReducer(store, { key: 'capitalCircleDetail', reducer: capitalCircleDetail })
      injectReducer(store, { key: 'mutualGuaraList', reducer: mutualGuaraList })
      injectReducer(store, { key: 'mutualGuaraDetail', reducer: mutualGuaraDetail })
      injectReducer(store, { key: 'downloadModalStatus', reducer: downloadModalStatus })
      injectReducer(store, { key: 'blockTradeList', reducer: blockTradeList })
      injectReducer(store, { key: 'expireBusinessList', reducer: expireBusinessList })
      injectReducer(store, { key: 'innerCreditTotal', reducer: innerCreditTotal })
      injectReducer(store, { key: 'creditOverLimitlist', reducer: creditOverLimitlist })

      /*  Return getComponent   */
      cb(null, ClusterGraph)

      /* Webpack named bundle   */
    }, 'cluster')
  }
})
