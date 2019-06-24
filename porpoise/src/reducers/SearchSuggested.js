export function searchSuggestedIsLoading(state = false, action) {
    switch (action.type) {
        case 'GET_BRIEF_IS_LOADING':
            return action.isLoading
        default:
            return state;
    }
}

export function searchSuggested(state = {}, action) {
    switch (action.type) {
        case 'FETCH_SEARCH_SUGGESTED_SUCCESS':
            return action.data
        case 'CLEAR_SEARCH_SUGGESTED':
            return {}
        default:
            return state;
    }
}

export function clearSearchSuggested (state = false, action) {
    if (action.type === 'CLEAR_SEARCH_SUGGESTED') {
        return action.isClear
    } else {
        return state
    }
}