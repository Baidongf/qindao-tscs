export function setTheme (theme) {
  return {
    type: 'SET_THEME',
    theme
  }
}

export function setSingleCompanyState (isSingleCompany) {
  return {
    type: 'SET_SINGLE_COMPANY_STATE',
    isSingleCompany
  }
}

export function setGraphType (graphType) {
  return {
    type: 'SET_GRAPH_TYPE',
    graphType
  }
}

export function setZoomStatus (zoomStatus) {
  return {
    type: 'SET_ZOOM_STATUS',
    zoomStatus
  }
}
