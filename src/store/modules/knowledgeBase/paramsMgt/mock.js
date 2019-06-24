module.exports = function (router) {

    // 参数管理—— 列表  TODO:后台入参待修改
  router.post('/mock/crm-fd/api/para/query', function (req, res, next) {
    res.json({
      "success": true,
      "payload": [
        {
          "name": "大额资金变动金额",
          "key": "bigCapitalChange",
          "value": "6",
          "enabledFlag": "1",
          "id": 1,
          "createdDt": "2018-08-27 22:24:40",
          "updatedDt": "2018-11-16 16:52:39",
          "createdById": "2",
          "updateById": "1"
        },
        {
          "name": "大额存款金额",
          "key": "bigDeposit",
          "value": "15655",
          "enabledFlag": "1",
          "id": 2,
          "createdDt": "2018-08-27 22:25:07",
          "updatedDt": "2018-11-16 16:52:39",
          "createdById": "2",
          "updateById": "1"
        },
        {
          "name": "对公存款有效户判定金额",
          "key": "publicValidDeposit",
          "value": "10",
          "enabledFlag": "1",
          "id": 3,
          "createdDt": "2018-08-27 22:31:36",
          "updatedDt": "2018-11-16 16:52:39",
          "createdById": "2",
          "updateById": "1"
        },
        {
          "name": "对公客户存款变化情况表金额",
          "key": "publicDepostiChange",
          "value": "113",
          "enabledFlag": "1",
          "id": 4,
          "createdDt": "2018-08-27 22:32:03",
          "updatedDt": "2018-11-16 16:52:39",
          "createdById": "2",
          "updateById": "1"
        },
        {
          "name": "短期贷款到期提前提醒天数",
          "key": "shortLoanEndDay",
          "value": "10",
          "enabledFlag": "1",
          "id": 5,
          "createdDt": "2018-08-27 22:32:51",
          "updatedDt": "2018-11-16 16:52:39",
          "createdById": "2",
          "updateById": "1"
        },
        {
          "name": "中长期贷款到期提前提醒天数",
          "key": "longLoanEndDay",
          "value": "10",
          "enabledFlag": "1",
          "id": 6,
          "createdDt": "2018-08-27 22:33:18",
          "updatedDt": "2018-11-16 16:52:39",
          "createdById": "2",
          "updateById": "1"
        },
        {
          "name": "理财到期提前提醒天数",
          "key": "financeEndDay",
          "value": "5",
          "enabledFlag": "1",
          "id": 7,
          "createdDt": "2018-08-27 22:33:48",
          "updatedDt": "2018-11-16 16:52:39",
          "createdById": "2",
          "updateById": "1"
        },
        {
          "name": "银行承兑到期提醒天数",
          "key": "bankAcceptanceEndDay",
          "value": "0",
          "enabledFlag": "1",
          "id": 8,
          "createdDt": "2018-08-27 22:34:23",
          "updatedDt": "2018-11-16 16:52:39",
          "createdById": "2",
          "updateById": "1"
        },
        {
          "name": "远期信用证承兑到期提前提醒天数",
          "key": "usanceLetterEndDay",
          "value": "1",
          "enabledFlag": "1",
          "id": 9,
          "createdDt": "2018-08-27 22:34:52",
          "updatedDt": "2018-11-16 16:52:39",
          "createdById": "2",
          "updateById": "1"
        },
        {
          "name": "即期信用证交单提醒天数",
          "key": "sightLetterEndDay",
          "value": "0",
          "enabledFlag": "1",
          "id": 10,
          "createdDt": "2018-08-27 22:35:19",
          "updatedDt": "2018-11-16 16:52:39",
          "createdById": "2",
          "updateById": "1"
        },
        {
          "name": "大金额存款到期提醒天数",
          "key": "bigDepositEndDay",
          "value": "10",
          "enabledFlag": "1",
          "id": 11,
          "createdDt": "2018-08-27 22:35:39",
          "updatedDt": "2018-11-16 16:52:39",
          "createdById": "2",
          "updateById": "1"
        },
        {
          "name": "一般循环授信到期提醒天数",
          "key": "generalRevolvingEndDay",
          "value": "0",
          "enabledFlag": "1",
          "id": 12,
          "createdDt": "2018-08-27 22:36:02",
          "updatedDt": "2018-11-16 16:52:39",
          "createdById": "2",
          "updateById": "1"
        },
        {
          "name": "国业循环授信到期提醒天数",
          "key": "stateRevolvingEndDay",
          "value": "0",
          "enabledFlag": "1",
          "id": 13,
          "createdDt": "2018-08-27 22:36:28",
          "updatedDt": "2018-11-16 16:52:39",
          "createdById": "2",
          "updateById": "1"
        },
        {
          "name": "客户经理商机有效期天数",
          "key": "opportunityValidDay",
          "value": "1",
          "enabledFlag": "1",
          "id": 14,
          "createdDt": "2018-08-27 22:36:57",
          "updatedDt": "2018-11-16 16:52:39",
          "createdById": "2",
          "updateById": "1"
        },
        {
          "name": "新任务任务提前提醒天数",
          "key": "newTaskBeginDay",
          "value": "222",
          "enabledFlag": "1",
          "id": 15,
          "createdDt": "2018-08-27 23:20:20",
          "updatedDt": "2018-11-16 16:52:39",
          "createdById": "2",
          "updateById": "1"
        },
        {
          "name": "任务到期提前提醒天数",
          "key": "taskEndDay",
          "value": "10",
          "enabledFlag": "1",
          "id": 16,
          "createdDt": "2018-09-18 21:52:53",
          "updatedDt": "2018-11-16 16:52:39",
          "createdById": "2",
          "updateById": "2"
        },
        {
          "name": "商机有效天数",
          "key": "businessValidDay",
          "value": "20",
          "enabledFlag": "1",
          "id": 17,
          "createdDt": "2018-10-30 11:13:14",
          "updatedDt": "2018-11-16 16:52:39",
          "createdById": "2",
          "updateById": null
        },
        {
          "name": "市场份额下降比率",
          "key": "rate",
          "value": "20",
          "enabledFlag": "1",
          "id": 18,
          "createdDt": null,
          "updatedDt": "2018-11-16 16:52:39",
          "createdById": "2",
          "updateById": null
        }
      ]
    })
  })

  // 参数管理—— 更新参数 入参 [ {"key":"1","value": "2000"},{"key":"2","value": "3000"}]
  router.post('/mock/crm-fd/api/para/update', function (req, res, next) {
    res.json({
      "success": true
    })
  })

}
