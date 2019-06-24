// 不存储用户的配置，因此手动设置肤色主题的默认值
window.localStorage.setItem('theme', 'light')
export function setTheme (state = window.localStorage.getItem('theme') || 'light', action) {
  if (action.type === 'SET_THEME') {
    return action.theme
  } else {
    return state
  }
}

// 不存储用户的配置，因此手动设置展示的图谱类型默认值
window.localStorage.setItem('graphType', 'grid')
export function setGraphType (state = window.localStorage.getItem('graphType') || 'grid', action) {
  if (action.type === 'SET_GRAPH_TYPE') {
    return action.graphType
  } else {
    return state
  }
}

export function singleCompanyState (state = false, action) {
  if (action.type === 'SET_SINGLE_COMPANY_STATE') {
    return action.isSingleCompany
  } else {
    return state
  }
}

// 获取放大倍数范围值
// function _getScale(scale) {
//   let validScale
//   if (scale < 0.5) {
//     validScale = 0.5
//   } else if (scale >= 0.5 && scale < 0.75) {
//     validScale = 0.5
//   } else if (scale >= 0.75 && scale < 1) {
//     validScale = 0.75
//   } else if (scale >= 1 && scale < 1.25) {
//     validScale = 1
//   } else if (scale >= 1.25 && scale < 1.5) {
//     validScale = 1.25
//   } else if (scale >= 1.5 && scale < 1.75) {
//     validScale = 1.5
//   } else if (scale >= 1.75 && scale < 2) {
//     validScale = 1.75
//   } else {
//     validScale = 2
//   }
//   return validScale
// }

// 将放大倍数转换为对应宽度百分比
function _getScaleWidth(scale) {
  // scale = _getScale(scale)
  let scaleWidth = scale / 2 * 100 + '%'
  // switch (scale) {
  //   case 0.5: scaleWidth = '25%'; break;
  //   case 0.75: scaleWidth = '37.5%'; break;
  //   case 1: scaleWidth = '50%'; break;
  //   case 1.25: scaleWidth = '62.5%'; break;
  //   case 1.5: scaleWidth = '75%'; break;
  //   case 1.75: scaleWidth = '87.5%'; break;
  //   case 2: scaleWidth = '100%'; break;
  //   default: scaleWidth = '50%';
  // }
  // scale:      0.5  0.75  1   1.25  1.5  1.75   2
  // scaleWidth:  0    25   50  62.5   75  87.5  100 %
  // 滚动条
  if (scale < 1) {
    scale -= 0.5
    scaleWidth = scale / 2 * 100 + '%'
  }
  return scaleWidth
}

export function zoomStatus (state = { scale: 1, scaleWidth: '50%', isMinScale: false, isMaxScale: false }, action) {
  if (action.type === 'SET_ZOOM_STATUS') {
    let scaleWidth = _getScaleWidth(action.zoomStatus.scale)
    return { ...state, ...(action.zoomStatus), scaleWidth: scaleWidth }
  } else {
    return state
  }
}
