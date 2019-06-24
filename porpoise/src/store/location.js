import hashHistory from 'react-router/lib/browserHistory'

// ------------------------------------
// Constants
// ------------------------------------
export const LOCATION_CHANGE = 'LOCATION_CHANGE'

// ------------------------------------
// Actions
// ------------------------------------

function getQueryObj(hash) {
  let queryString = hash.split('?')[1]
  let queryObj = {}
  if (queryString) {
    let queryArr = queryString.split('&')
    queryArr.forEach(item => {
      let keyValues = item.split('=')
      queryObj[keyValues[0]] = window.decodeURI(keyValues[1])
    })
  }

  return queryObj
}

export function locationChange(location = '/') {
  location.query = getQueryObj(location.hash)
  return {
    type: LOCATION_CHANGE,
    payload: location
  }
}

// ------------------------------------
// Specialized Action Creator
// ------------------------------------
export const updateLocation = ({dispatch}) => {
  return (nextLocation) => dispatch(locationChange(nextLocation))
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = hashHistory.getCurrentLocation()
export default function locationReducer(state = initialState, action) {
  initialState.query=getQueryObj(initialState.hash)
  return action.type === LOCATION_CHANGE
    ? action.payload
    : state
}
