export default (store) => ({
  path: 'indiv_transfer',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const IndivTrans = require('./containers/individualTransfer').default
      cb(null, IndivTrans)
    }, 'individualTransfer')
  }
})
