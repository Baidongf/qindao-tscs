import { injectReducer } from '../../../../reducers'
import { clusterList, searchClusterListLoding } from './modules/clusterNav'

export default (store) => ({
  path: 'nav',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const ClusterNav = require('./containers/clusterNav').default

      injectReducer(store, { key: 'clusterList', reducer: clusterList })
      injectReducer(store, { key: 'searchClusterListLoding', reducer: searchClusterListLoding })
      /*  Return getComponent   */
      cb(null, ClusterNav)

      /* Webpack named bundle   */
    }, 'cluster')
  }
})
