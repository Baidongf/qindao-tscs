module.exports = function(router) {

  // 客户管理——账户列表
  router.post('/mock/crm-fd/api/customer/account/getList', function(req, res, next) {
    res.json({
      "success": true,
      "payload": {
        "data": [
          {
            "code": "123456",
            "companyKey": "云南白药集团有限公司",
            "type": "存款账户",
            "openDate": "2018-12-05",
            "amount": "1,000,000.00",
            "accountManager": "张三、李四、王五"
          },
          {
            "code": "1234560",
            "companyKey": "云南白药集团有限公司",
            "type": "存款账户",
            "openDate": "2018-12-05",
            "amount": "1,000,000.00",
            "accountManager": "张三、李四、王五"
          },
          {
            "code": "1234561",
            "companyKey": "云南白药集团有限公司",
            "type": "存款账户",
            "openDate": "2018-12-05",
            "amount": "1,000,000.00",
            "accountManager": "张三、李四、王五"
          },
          {
            "code": "1234562",
            "companyKey": "云南白药集团有限公司",
            "type": "存款账户",
            "openDate": "2018-12-05",
            "amount": "1,000,000.00",
            "accountManager": "张三、李四、王五"
          },
          {
            "code": "1234563",
            "companyKey": "云南白药集团有限公司",
            "type": "存款账户",
            "openDate": "2018-12-05",
            "amount": "1,000,000.00",
            "accountManager": "张三、李四、王五"
          },
          {
            "code": "1234564",
            "companyKey": "云南白药集团有限公司",
            "type": "存款账户",
            "openDate": "2018-12-05",
            "amount": "1,000,000.00",
            "accountManager": "张三、李四、王五"
          },
          {
            "code": "1234565",
            "companyKey": "云南白药集团有限公司",
            "type": "存款账户",
            "openDate": "2018-12-05",
            "amount": "1,000,000.00",
            "accountManager": "张三、李四、王五"
          },
          {
            "code": "1234566",
            "companyKey": "云南白药集团有限公司",
            "type": "存款账户",
            "openDate": "2018-12-05",
            "amount": "1,000,000.00",
            "accountManager": "张三、李四、王五"
          },
          {
            "code": "1234567",
            "companyKey": "云南白药集团有限公司",
            "type": "存款账户",
            "openDate": "2018-12-05",
            "amount": "1,000,000.00",
            "accountManager": "张三、李四、王五"
          },
          {
            "code": "1234568",
            "companyKey": "云南白药集团有限公司",
            "type": "存款账户",
            "openDate": "2018-12-05",
            "amount": "1,000,000.00",
            "accountManager": "张三、李四、王五"
          },
          {
            "code": "1234569",
            "companyKey": "云南白药集团有限公司",
            "type": "存款账户",
            "openDate": "2018-12-05",
            "amount": "1,000,000.00",
            "accountManager": "张三、李四、王五"
          },
        ],
        "total": 11
      }
    })
  })

}
