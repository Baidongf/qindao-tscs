import { authorizedFetch } from 'actions/Global'
import { API_ADDRESS } from '../../../../../../global_config'

const CLUSTER_LIST_PATH = `${API_ADDRESS}/api/graph/group_list`

const GET_CLUSTER_LIST_SUCCESS = 'GET_CLUSTER_LIST_SUCCESS'
const GET_CLUSTER_LIST_LOADING = 'GET_CLUSTER_LIST_LOADING'

function changeGetClusterListLoading (data) {
  return {
    type: GET_CLUSTER_LIST_LOADING,
    data
  }
}
/** actions */

export function getClusterList ({ name = '', offset = 0, pageSize = 10, entityOrder = 1, innerEntityOrder = 0 }) {
  return async (dispatch, getState) => {
    const params = {
      entityName: name,
      type: getState().location.query.type,
      pageSize,
      offset
    }
    if (name === '') {
      delete params.entityName
    }
    if (entityOrder) {  // 不为默认状态
      params.field = 'entity_count'
      params.sort = entityOrder > 0 ? 'desc' : 'asc'
    } else if (innerEntityOrder) {
      params.field = 'inner_entity_count'
      params.sort = innerEntityOrder > 0 ? 'desc' : 'asc'
    } else {
      params.field = 'entity_count'
      params.sort = 'desc'
    }
    let data = {}
    try {
      dispatch(changeGetClusterListLoading(true))
      data = await authorizedFetch(CLUSTER_LIST_PATH, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
      if (data.status !== 0) throw Error(data.msg)
      data = data.data
      dispatch({
        type: GET_CLUSTER_LIST_SUCCESS,
        data: data
      })
      dispatch(changeGetClusterListLoading(false))
    } catch (e) {
      console.error(e)
    }
  }
}

/** reducers */

export function clusterList (state = { total: 0, data: [] }, action) {
  return makeReducer(state, action, GET_CLUSTER_LIST_SUCCESS)
}

export function searchClusterListLoding (state = false, action) {
  return makeReducer(state, action, GET_CLUSTER_LIST_LOADING)
}

function makeReducer (state, action, name) {
  if (action.type === name) {
    return action.data
  } else {
    return state
  }
}
