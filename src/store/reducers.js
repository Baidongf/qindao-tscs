import {combineReducers} from 'redux'

import global from './modules/global'
import account from './modules/account'
import loginOut from './modules/loginOut'

import orgMgt from './modules/systemMgt/orgMgt'
import opportunityMgt from './modules/opportunityMgt/index'
import marketingActivity from './modules/marketingActivity/index'
import userMgt from './modules/systemMgt/userMgt'
import roleMgt from './modules/systemMgt/roleMgt'
import tagMgt from './modules/customerMgt/tagMgt'
import home from './modules/home'
import paramsMgt from './modules/systemMgt/paramsMgt'
import customerMgt from './modules/customerMgt/customerMgt/index'
import accountMgt from './modules/customerMgt/accountMgt'
import knowlMgt from './modules/knowledgeBase/knowlMgt'
import customerDynamic from './modules/customerDynamic'
import projectMonitor from './modules/projectMonitor'
import schedule from './modules/schedule'
import messageMgt from './modules/messageMgt'
import catMgt from './modules/productBase/catMgt'
import prodMgt from './modules/productBase/prodMgt'
import markResult from './modules/markResult'
import projectReserve from './modules/projectReserve'
import knowledgeImage from './modules/knowledgeImage'
export const injectReducer = (store, {key, reducer}) => {

  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export const makeRootReducer = (asyncReducers) => {
  const appReducer = combineReducers({
    account,
    loginOut,
    global,
    userMgt,
    orgMgt,
    roleMgt,
    tagMgt,
    home,
    paramsMgt,
    customerMgt,
    accountMgt,
    knowlMgt,
    customerDynamic,
    opportunityMgt,
    marketingActivity,
    projectMonitor,
    schedule,
    messageMgt,
    catMgt,
    prodMgt,
    markResult,
    projectReserve,
    ...asyncReducers
  })
  return (state, action) => {
    if (action.type === 'LOGOUT') {
      state = undefined
    }
    return appReducer(state, action)
  }
}

export default makeRootReducer
