import { injectReducer } from '../../reducers'
import { originChartData, relationPathList, startEndId } from './modules/blacklistCheat'

export default (store) => ({
  path: 'blacklist_cheat',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const blacklistCheat = require('./containers/blacklistCheat').default

      injectReducer(store, { key: 'originChartData', reducer: originChartData })
      injectReducer(store, { key: 'relationPathList', reducer: relationPathList })
      injectReducer(store, { key: 'startEndId', reducer: startEndId })

      cb(null, blacklistCheat)
    }, 'blacklistCheat')
  }
})
