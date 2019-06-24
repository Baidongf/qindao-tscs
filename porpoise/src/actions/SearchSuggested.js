import { SEARCH_SUGGESTED_PATH } from '../config'
import { authorizedFetch } from './Global'

export function searchSuggestedIsLoading (bool) {
  return {
    type: 'SEARCH_SUGGESTED_IS_LOADING',
    isLoading: bool
  }
}

export function fetchSearchSuggestedSuccess (data) {
  return {
    type: 'FETCH_SEARCH_SUGGESTED_SUCCESS',
    data
  }
}

export function fetchSearchSuggested (keyWord) {
  return (dispatch, getState) => {
    dispatch({
      type: 'CLEAR_SEARCH_SUGGESTED',
      isClear: false
    })
    dispatch(searchSuggestedIsLoading(true))
    let url = `${SEARCH_SUGGESTED_PATH}?`
      + `key_word=${encodeURIComponent(keyWord)}`
      + `&count=20`
      + `&type=name`
    authorizedFetch(url).then((data) => {
      dispatch(searchSuggestedIsLoading(false))
      if (getState().clearSearchSuggested) {
        dispatch(fetchSearchSuggestedSuccess({}))
      } else {
        dispatch(fetchSearchSuggestedSuccess(data.data))
      }
    })
  }
}

export function clearSearchSuggested () {
  return {
    type: 'CLEAR_SEARCH_SUGGESTED',
    isClear: true
  }
}