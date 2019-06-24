module.exports = function(router) {
  /** 系统-用户管理-START **/

  //用户管理—— 用户列表  入参  { "belongOrg": "", "nameOrNo": "admin", "pageNo": 1, "pageSize": 1 }
  router.post('/mock/crm-fd/api/user/queryUser', function (req, res, next) {
    res.json(
      {
        "success": true,
        "payload": {
          "content": [
            {
              "id": 1,
              "institutionId": null,
              "orgNo": null,
              "userNo": "admin2",
              "password": "SHA-1$1000$ECl5CfE6$f4e40fb6266983c5ca6c68ab1ccb50af9e3d3306",
              "name": "admin2",
              "sex": "",
              "status": "",
              "emplyPost": null,
              "idNumber": null,
              "phone": null,
              "email": null,
              "birthDt": "2018-10-08",
              "cont_addr": null,
              "enabledFlag": null,
              "groupName": null,
              "firstBusiness": null,
              "updatedBy": "2",
              "createdBy": null,
              "updatedDt": "2018-11-13 18:57:16",
              "createdDt": null,
              "shname": null,
              "roleNames": null
            }
          ],
          "totalPages": 8,
          "total": 8,
          "last": false,
          "size": 1,
          "number": 0,
          "sort": [
            {
              "direction": "DESC",
              "property": "updatedDt",
              "ignoreCase": false,
              "nullHandling": "NATIVE",
              "descending": true,
              "ascending": false
            }
          ],
          "first": true,
          "numberOfElements": 1
        }
      }
    )
  })
  //用户管理 —— 重置密码  密码重置后 新密码为身份证后6位
  router.get('/mock/crm-fd/api/user/resetPassword', function (req, res, next) {
    res.json({
      "success": true
    })
  })

  //用户管理 —— 角色设置  入参{"userId": 1,"roleIds": "27,44"}
  router.post('/mock/crm-fd/api/user/distributionRole', function (req, res, next) {
    res.json({
      "success": true
    })
  })

  //用户管理 —— 新增用户
  // 入参{
  //   "birthDt": "2019-01-02",
  //   "cont_addr": "string",
  //   "email": "string",
  //   "emplyPost": "string",
  //   "enabledFlag": 1,
  //   "firstBusiness": "string",
  //   "groupName": "string",
  //   "idNumber": "123456",
  //   "institutionId": 237,
  //   "name": "string",
  //   "phone": "string",
  //   "sex": 1,
  //   "status": 0,
  //   "userNo": "string",
  //   "roleIds":139
  // }
  router.post('/mock/crm-fd/api/user/save', function (req, res, next) {
    res.json(
      {
        "success": true,
        "payload": {
          "id": 10221,
          "institutionId": 237,
          "orgNo": "0",
          "userNo": "string",
          "password": "SHA-1$1000$I8ElNfhS$e238a397f4d39c2cb1c7e1de91b850b20f008a2b",
          "name": "string",
          "sex": "1",
          "status": "0",
          "emplyPost": "string",
          "idNumber": "123456",
          "phone": "string",
          "email": "string",
          "birthDt": "2019-01-02",
          "cont_addr": "string",
          "enabledFlag": "1",
          "groupName": "string",
          "firstBusiness": "string",
          "updatedBy": null,
          "createdBy": null,
          "updatedDt": null,
          "createdDt": null,
          "shname": null,
          "roleNames": null
        }
      }
    )
  })
  //用户管理 —— 更新用户
  // 入参{
  //   "id":10221
  //   "birthDt": "2019-01-02",
  //   "cont_addr": "string",
  //   "email": "string",
  //   "emplyPost": "string",
  //   "enabledFlag": 1,
  //   "firstBusiness": "string",
  //   "groupName": "string",
  //   "idNumber": "123456",
  //   "institutionId": 237,
  //   "name": "string",
  //   "phone": "string",
  //   "sex": 1,
  //   "status": 0,
  //   "userNo": "string",
  //   "roleIds":139
  // }
  router.post('/mock/crm-fd/api/user/update', function (req, res, next) {
    res.json(
      {
        "success": true
      }
    )
  })
}


