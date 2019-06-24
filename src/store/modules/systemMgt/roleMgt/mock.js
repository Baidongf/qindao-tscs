module.exports = function(router) {

  // 角色管理——角色列表 入参 {
  //   "pageNo": 1,
  //   "pageSize": 10,
  //   "roleName": ""
  // }
  router.post('/mock/crm-fd/api/auth/RoleResource/findAll', function (req, res, next) {
    res.json(
      {
        "success": true,
        "payload": {
          "content": [
            {
              "id": 139,
              "name": "客户经理",
              "remark": "customer",
              "enabledFlag": "1",
              "resoList": null,
              "createdDt": "2018-10-17 03:36:19"
            },
            {
              "id": 140,
              "name": "总行管理员",
              "remark": "",
              "enabledFlag": "1",
              "resoList": null,
              "createdDt": "2018-10-17 03:36:42"
            },
            {
              "id": 141,
              "name": "总行操作员",
              "remark": "",
              "enabledFlag": "1",
              "resoList": null,
              "createdDt": "2018-10-17 03:36:59"
            },
            {
              "id": 142,
              "name": "分行管理员",
              "remark": "",
              "enabledFlag": "1",
              "resoList": null,
              "createdDt": "2018-10-17 03:37:14"
            },
            {
              "id": 143,
              "name": "分行操作员",
              "remark": "",
              "enabledFlag": "1",
              "resoList": null,
              "createdDt": "2018-10-17 03:37:33"
            },
            {
              "id": 144,
              "name": "支行管理员",
              "remark": "",
              "enabledFlag": "1",
              "resoList": null,
              "createdDt": "2018-10-17 03:37:49"
            },
            {
              "id": 145,
              "name": "支行操作员",
              "remark": "",
              "enabledFlag": "1",
              "resoList": null,
              "createdDt": "2018-10-17 03:39:51"
            },
            {
              "id": 146,
              "name": "测试管理",
              "remark": "12234",
              "enabledFlag": "1",
              "resoList": null,
              "createdDt": "2018-10-17 10:06:50"
            },
            {
              "id": 147,
              "name": "超级管理员",
              "remark": "admin",
              "enabledFlag": "1",
              "resoList": null,
              "createdDt": "2018-10-17 18:48:23"
            },
            {
              "id": 157,
              "name": "测试全部权限角色",
              "remark": "测试全部权限角色",
              "enabledFlag": "1",
              "resoList": null,
              "createdDt": "2018-11-02 15:02:23"
            }
          ],
          "total": 16,
          "totalPages": 2,
          "last": false,
          "size": 10,
          "number": 0,
          "sort": null,
          "first": true,
          "numberOfElements": 10
        }
      }
    )
  })

  // 角色管理——角色详情 入参 roleID
  router.get('/mock/crm-fd/api/auth/RoleResource/queryDetail', function (req, res, next) {
    res.json({
      "success": true,
      "payload": {
        "id": 139,
        "name": "客户经理",
        "remark": "customer",
        "enabledFlag": "1",
        "resoList": [{
          "id": 15,
          "name": "首页",
          "remark": null,
          "parentId": 0,
          "checked": "true",
          "rrpId": null,
          "isShow": "",
          "icon": "1111",
          "subs": [
            {
              "id": 16,
              "name": "基础应用",
              "remark": null,
              "parentId": 15,
              "checked": "true",
              "rrpId": null,
              "isShow": "",
              "icon": null,
              "subs": [],
              "roleResourcePermissionDao": null
            },
            {
              "id": 18,
              "name": "公告信息",
              "remark": null,
              "parentId": 15,
              "checked": "true",
              "rrpId": null,
              "isShow": "",
              "icon": null,
              "subs": [],
              "roleResourcePermissionDao": null
            },
            {
              "id": 19,
              "name": "拜访管理",
              "remark": null,
              "parentId": 15,
              "checked": "false",
              "rrpId": null,
              "isShow": "",
              "icon": null,
              "subs": [],
              "roleResourcePermissionDao": null
            },
            {
              "id": 20,
              "name": "任务管理",
              "remark": null,
              "parentId": 15,
              "checked": "true",
              "rrpId": null,
              "isShow": "",
              "icon": null,
              "subs": [],
              "roleResourcePermissionDao": null
            },
            {
              "id": 21,
              "name": "商机管理",
              "remark": null,
              "parentId": 15,
              "checked": "true",
              "rrpId": null,
              "isShow": "",
              "icon": null,
              "subs": [],
              "roleResourcePermissionDao": null
            },
            {
              "id": 22,
              "name": "排行榜",
              "remark": null,
              "parentId": 15,
              "checked": "true",
              "rrpId": null,
              "isShow": "",
              "icon": null,
              "subs": [],
              "roleResourcePermissionDao": null
            }
          ],
          "roleResourcePermissionDao": null
        },],
        "createdDt": null
      }
    })
  })

  // 角色管理——删除角色 入参 roleID
  router.get('/mock/crm-fd/api/auth/RoleResource/delRole', function (req, res, next) {
    res.json({
      "success": false,
      "message": {
        "code": 10033,
        "desc": "当前角色存在参数,无法直接删除"
      }
    })
  })


  //角色管理——添加角色 入参{
  //   "name": "test角色",
  //   "remark": "string",
  //   "resources": [
  //     {
  //       "checked": "string",
  //       "id": 15
  //     },
  //     {
  //       "checked": "string",
  //       "id": 16
  //     }
  //   ]
  // }
  router.post('/mock/crm-fd/api/auth/RoleResource/save', function (req, res, next) {
    res.json(
      {
        "success": true
      }
    )
  })
}


