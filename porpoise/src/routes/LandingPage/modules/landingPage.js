// ------------------------------------
// Constants
// ------------------------------------
export const CHANGE_FILTER_OPTIONS = 'CHANGE_FILTER_OPTIONS'

// ------------------------------------
// Actions
// ------------------------------------
export function changeFilterOptions (options) {
  return {
    type: CHANGE_FILTER_OPTIONS,
    options
  }
}

export const actions = {
  changeFilterOptions
}
