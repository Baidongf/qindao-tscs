import { injectReducer } from '../../reducers'

export default (store) => ({
  path: 'lp',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const LandingPage = require('./containers/landingPageContainer').default

      /*  Return getComponent   */
      cb(null, LandingPage)

      /* Webpack named bundle   */
    }, 'landingPage')
  }
})
