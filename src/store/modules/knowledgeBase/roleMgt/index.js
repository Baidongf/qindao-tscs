// import { hashHistory } from 'react-router'
import { message } from 'antd'
import { combineReducers } from 'redux'
import { get, post } from 'utils/dataAccess/axios'


const IS_MOCK = 0 ? '/mock' : ''
const GET_ROLE_LIST = 'GET_ROLE_LIST'
const GET_ROLE_COUNT = 'GET_ROLE_COUNT'
const DELETE_ROLE = 'DELETE_ROLE'
const GET_ROLE_DETAIL = 'GET_ROLE_DETAIL'
const SAVE_ROLE = 'SAVE_ROLE'
const UPDATE_ROLE = 'UPDATE_ROLE'
const GET_PERMISSION_TREE = 'GET_PERMISSION_TREE'


// actions

// 获取角色列表
export const getRoleList = (filterObj = {}) => {
  let bodyData = {
    roleName: filterObj.roleName,
    pageNo: filterObj.pageNo,
    pageSize: filterObj.pageSize
  }

  const postConfig = {
    url: `${IS_MOCK}/crm-fd/api/auth/RoleResource/findAll`,
    actionType: GET_ROLE_LIST,
    bodyData: bodyData,
    successConfig: {
      callback: (payload) => {

      }
    },
    failConfig: {
      message: '获取角色列表失败'
    }
  }
  return post(postConfig)
}

// 获取角色总数
export const getRoleCount = (queryObj) => {
  var filtersObj = queryObj.filtersObj
  let bodyData = {
    filter: {
      logicConnector: 'AND',  // AND, OR
      filters: []
    }
  }

  /* 组装查询数据 START */
  bodyData.page = queryObj.page
  // bodyData.page.sortOrders = [
  //   {
  //     direction: 'DESC',
  //     property: 'roleId'
  //   }
  // ]
  for (var key in filtersObj) {
    if (key === 'searchKey') {
      if (filtersObj[key]) {
        bodyData.filter.filters.push({
          logicConnector: "OR",
          filters: [
            {
              field: "employeeId",
              value: filtersObj[key],
              operator: "LIKE"
            },
            {
              field: "roleName",
              value: filtersObj[key],
              operator: "LIKE"
            }
          ]
        })
      }
    } else {
      if (filtersObj[key]) {
        bodyData.filter.filters.push({
          field: key,
          value: filtersObj[key],
          operator: 'EQ'
        })
      }
    }
  }
  // /* 组装查询数据 END */

  // // 检验查询数据


  const postConfig = {
    url: '${IS_MOCK}/crm-fd/api/role/findRoleCount',
    actionType: GET_ROLE_COUNT,
    bodyData: bodyData,
    successConfig: {
      callback: (payload) => {

      }
    },
    failConfig: {
      message: '获取角色列表失败'
    }
  }

  return post(postConfig)
}

// 删除角色
export const deleteRole = (id) => {
  return get({
    url: `${IS_MOCK}/crm-fd/api/role/delete?id=${id}`,
    actionType: DELETE_ROLE,
    successConfig: {
      message: '删除角色成功',
      callback: (data) => {

      }
    },
    failConfig: {
      message: '删除角色失败'
    }
  })
}

// 获取角色详情
export const getRoleDetail = (id) => {
  return get({
    url: `${IS_MOCK}/crm-fd/api/role/details/${id}`,
    actionType: GET_ROLE_DETAIL,
    successConfig: {
      callback: (data) => {

      }
    },
    failConfig: {
      message: '获取角色失败'
    }
  })
}

// 新增（保存）角色
export const saveRole = (roleObj) => {
  return post({
    url: `${IS_MOCK}/crm-fd/api/role/save`,
    bodyData: roleObj,
    actionType: SAVE_ROLE,
    successConfig: {
      message: '新增角色成功',
      callback: (data) => {

      }
    },
    failConfig: {
      message: '新建角色失败'
    }
  })
}

// 编辑（更新）角色
export const updateRole = (roleObj) => {
  return post({
    url: `${IS_MOCK}/crm-fd/api/role/update`,
    bodyData: roleObj,
    actionType: UPDATE_ROLE,
    successConfig: {
      message: '更新角色成功',
      callback: (data) => {

      }
    },
    failConfig: {
      message: '更新角色失败'
    }
  })
}

// 获取权限树
export const getPermissionTree = () => {
  return get({
    url: `${IS_MOCK}/crm-fd/api/auth/resource/findAll`,
    actionType: GET_PERMISSION_TREE,
    successConfig: { message: '获取权限树成功' },
    failConfig: { message: '获取权限树失败' }
  })
}



// ============ reducers ===============

// 系统管理 - 角色列表
const roleList = (previousState = [], action) => {
  if (action.type === GET_ROLE_LIST) {
    console.log('kkp')
    console.log(action)
    return action.data
  } else {
    return previousState
  }
}

// 系统管理 - 角色详情
const roleDetail = (previousState = { data: [] }, action) => {
  if (action.type === GET_ROLE_DETAIL) {
    return action.data
  } else {
    return previousState
  }
}

// 系统管理 - 角色数量？
const roleCount = (previousState = { data: 0 }, action) => {
  if (action.type === GET_ROLE_COUNT) {
    return action.data
  } else {
    return previousState
  }
}

// 系统管理 - 权限树
const permissionTree = (previousState = [], action) => {
  if (action.type === GET_PERMISSION_TREE) {
    return action.data
  } else {
    return previousState
  }
}


const roleMgt = combineReducers({
  roleList,
  roleDetail,
  roleCount,
  permissionTree,
})
export default roleMgt
