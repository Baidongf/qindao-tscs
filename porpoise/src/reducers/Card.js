export function getBriefIsLoading (state = false, action) {
  switch (action.type) {
    case 'GET_BRIEF_IS_LOADING':
      return action.isLoading
    default:
      return state
  }
}

export function briefData (state = {}, action) {
  switch (action.type) {
    case 'GET_BRIEF_SUCCESS':
      return action.data
    default:
      return state
  }
}

export function companyBriefData (state = {}, action) {
  switch (action.type) {
    case 'GET_COMPANY_BRIEF_SUCCESS':
      return action.data
    default:
      return state
  }
}

export function cardType (state = '', action) {
  switch (action.type) {
    case 'TOGGLE_CARD_TYPE':
      return action.cardType
    default:
      return state
  }
}

export function relationSrcName (state = '', action) {
  if (action.type === 'SET_RELATION_SRC_NAME') {
    return action.companyName
  } else {
    return state
  }
}

export function clusterItem (state = {}, action) {
  if (action.type === 'GET_CLUSTER_ITEM_SUCCESS') {
    return {
      id: action.clusterItem.cid,
      data: action.clusterItem.data.vertexes.filter(v => v._id.includes('Company'))
    }
  } else {
    return state
  }
}

/**
 * 族谱群名称列表
 * @param {Object} state state
 * @param {Object} action action
 * @return {Object} state
 */
export function clusterNamesObj (state = { clusterNames: [], total: 0 }, action) {
  if (action.type === 'GET_COMPANY_CLUSTER_SUCCESS') {
    return {
      clusterNames: action.clusterNames,
      total: action.total
    }
  } else {
    return state
  }
}

export function centerTreeNode (state = '', action) {
  if (action.type === 'SELECT_CENTER_TREE_NODE') {
    return {
      vertex: action.vertex
    }
  } else {
    return state
  }
}

/**
 * 显示在中间的族谱点
 * @param {String} state center id
 * @param {Object} action action
 * @return {String} id
 */
export function centerClusterNode (state = '', action) {
  if (action.type === 'SELECT_CENTER_CLUSTER_NODE') {
    return {
      id: action.id
    }
  } else {
    return state
  }
}

/**
 * 显示在中间的族谱点
 * @param {String} state center id
 * @param {Object} action action
 * @return {String} id
 */
export function personClusterNode (state = '', action) {
  if (action.type === 'SELECT_PERSON_CLUSTER_NODE') {
    return {
      id: action.id,
      showType: action.showType
    }
  } else {
    return state
  }
}

/**
 * 通过企业名称获取族谱群中心企业 id
 * @param {String} state center id
 * @param {Object} action action
 * @return {String} id
 */
export function companyClusterId (state = '', action) {
  if (action.type === 'GET_CLUSTER_ID_SUCCESS') {
    return action.id
  } else {
    return state
  }
}

/**
 * 从群体卡片中选出的一条记录，在图中展示
 * @param {Object} state selected merge data
 * @param {Object} action action
 * @return {Object} chart data
 */
export function selectedMergeData (state = { vertexes: [], edges: [] }, action) {
  if (action.type === 'SELECT_MERGE_DATA') {
    return Object.assign({}, action.chartData)
  } else {
    return state
  }
}
