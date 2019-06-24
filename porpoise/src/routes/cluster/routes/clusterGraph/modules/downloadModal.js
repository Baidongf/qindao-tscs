// ================= action types ==================
const TOGGLE_DOWNLOAD_MODAL = 'download_download_modal'

// ================== actions ======================
export function toggleDownloadModal (visible) {
  return {
    type: TOGGLE_DOWNLOAD_MODAL,
    visible
  }
}

// =================== reducers =====================
export function downloadModalStatus (state = {
  visible: false
}, action) {
  switch (action.type) {
    case TOGGLE_DOWNLOAD_MODAL:
      return Object.assign({}, state, {
        visible: action.visible
      })
    default:
      return state
  }
}
