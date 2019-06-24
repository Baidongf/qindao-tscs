// We only need to import the modules necessary for initial render
import CoreLayout from '../layouts/CoreLayout'
import Home from './Home'
import LandingPage from './LandingPage'
import IndividualTransfer from './IndividualTransfer'
import Explain from './Explain'
import GuaranteeRisk from './GuaranteeRisk'
import BlacklistCheat from './BlacklistCheat'
import RiskAnalysis from './RiskAnalysis'
import Cluster from './cluster'
import ClusterGraph from './cluster/routes/clusterGraph'
import ClusterNav from './cluster/routes/clusterNav'
// import AntTest from './antTest'

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

/**
 * create routes
 * @param {Object} store store
 * @return {Object} routes
 */
export const createRoutes = (store) => ({
  path: '/graph',
  component: CoreLayout,
  indexRoute: Home,
  childRoutes: [
    LandingPage(store),
    IndividualTransfer(store),
    Explain(store),
    GuaranteeRisk(store),
    BlacklistCheat(store),
    RiskAnalysis(store),
    {
      path: 'cluster',
      component: Cluster,
      childRoutes: [
        ClusterGraph(store),
        ClusterNav(store)
      ]
    },
    // {
    //   path: 'ant',
    //   component: AntTest,
    //   childRoutes: [
    //   ]
    // }
  ]
})

/*  Note: childRoutes can be chunked or otherwise loaded programmatically
    using getChildRoutes with the following signature:

    getChildRoutes (location, cb) {
        require.ensure([], (require) => {
            cb(null, [
                // Remove imports!
                require('./Counter').default(store)
            ])
        })
    }

    However, this is not necessary for code-splitting! It simply provides
    an API for async route definitions. Your code splitting should occur
    inside the route `getComponent` function, since it is only invoked
    when the route exists and matches.
*/

export default createRoutes
