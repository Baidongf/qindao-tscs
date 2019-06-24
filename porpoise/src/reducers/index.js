/**
 * @file reducers
 * @author haizhi
 */
import { combineReducers } from 'redux'
import locationReducer from '../store/location'
import { getBriefIsLoading, briefData, companyBriefData, cardType, relationSrcName,
  clusterItem, clusterNamesObj, centerClusterNode, centerTreeNode, personClusterNode, companyClusterId,
  selectedMergeData } from './Card'
import { renderChartStatus, expandChartData, curNode, curEdge, isTreeGraph, isPhotoGraph,
  clusterChartData, reRenderChart, mergeChartData, originChartData,
  displayChartData, operateChartStatus, expandAllModalStatus, undoableOriginChartData, nodeStatus } from './Chart'
import { searchSuggestedIsLoading, searchSuggested, clearSearchSuggested } from './SearchSuggested'
import { FilterOptions, FilterUIStatus, belongBankRelation } from './Filter'
import { initCompanyName } from './InitConfig'
import { setTheme, setGraphType, singleCompanyState, zoomStatus } from './InitOperateBtn'
import { companyListObj } from '../routes/cluster/routes/clusterGraph/modules/GroupRelationCard'
// import {AntData} from "./AntTest"

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    location: locationReducer,
    briefData,
    companyBriefData,
    getBriefIsLoading,
    cardType,
    relationSrcName,
    clusterItem,
    clusterNamesObj,
    centerClusterNode,
    centerTreeNode,
    personClusterNode,
    companyClusterId,
    selectedMergeData,
    renderChartStatus,
    expandChartData,
    curNode,
    curEdge,
    isTreeGraph,
    isPhotoGraph,
    clusterChartData,
    reRenderChart,
    mergeChartData,
    originChartData,
    displayChartData,
    undoableOriginChartData,
    nodeStatus,
    operateChartStatus,
    expandAllModalStatus,
    searchSuggestedIsLoading,
    searchSuggested,
    clearSearchSuggested,
    FilterUIStatus,
    FilterOptions,
    initCompanyName,
    belongBankRelation,
    companyListObj,
    setTheme,
    setGraphType,
    singleCompanyState,
    zoomStatus,
    // AntData,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
