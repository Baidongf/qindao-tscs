module.exports = function(router) {

  // 客户管理——标签列表
  router.post('/mock/crm-fd/api/customer/tag/getList', function(req, res, next) {
    res.json({
      "success": true,
      "payload": {
        "data": [
          {
            "id": 1,
            "name": "高新企业",
            "labelSource": "系统标签",
            "tagType": "关系属性",
            "labelDescription": "而维吾尔而温热我",
            "createDate": "2019-01-08"
          },
          {
            "id": 2,
            "name": "朝阳企业",
            "labelSource": "自定义标签",
            "tagType": "业务属性",
            "labelDescription": "奋斗奋斗放松放松",
            "createDate": "2019-01-01"
          },
          {
            "id": 3,
            "name": "XX企业",
            "labelSource": "系统标签",
            "tagType": "",
            "labelDescription": "而维吾尔而温热我",
            "createDate": "2019-01-02"
          },
          {
            "id": 4,
            "name": "朝阳企业",
            "labelSource": "自定义标签",
            "tagType": "群体特征属性",
            "labelDescription": "奋斗奋斗放松放松",
            "createDate": "2019-01-03"
          },
          {
            "id": 5,
            "name": "MM企业",
            "labelSource": "系统标签",
            "tagType": "关系属性",
            "labelDescription": "而维吾尔而温热我",
            "createDate": "2019-01-04"
          },
          {
            "id": 6,
            "name": "朝阳企业",
            "labelSource": "自定义标签",
            "tagType": "业务属性",
            "labelDescription": "奋斗奋斗放松放松",
            "createDate": "2019-01-05"
          },
          {
            "id": 7,
            "name": "XX企业",
            "labelSource": "系统标签",
            "tagType": "",
            "labelDescription": "而维吾尔而温热我",
            "createDate": "2019-01-06"
          },
          {
            "id": 8,
            "name": "朝阳企业",
            "labelSource": "自定义标签",
            "tagType": "群体特征属性",
            "labelDescription": "奋斗奋斗放松放松",
            "createDate": "2019-01-07"
          },
          {
            "id": 9,
            "name": "MM企业",
            "labelSource": "系统标签",
            "tagType": "关系属性",
            "labelDescription": "而维吾尔而温热我",
            "createDate": "2019-01-08"
          },
          {
            "id": 10,
            "name": "XX企业",
            "labelSource": "系统标签",
            "tagType": "基本属性",
            "labelDescription": "而维吾尔而温热我",
            "createDate": "2019-01-09"
          },
          {
            "id": 11,
            "name": "朝阳企业",
            "labelSource": "自定义标签",
            "tagType": "基本属性",
            "labelDescription": "奋斗奋斗放松放松",
            "createDate": "2019-01-10"
          }
        ],
        "totalElements": 11
      }
    })
  })

  // 客户管理－标签详情 入参 id
  router.get('/mock/crm-fd/api/customer/tag/details', function(req, res, next) {
    res.json({
      "success": true,
      "payload": {
        "name": "大型国央企业",
        "labelSource": "自定义标签",
        "tagType": "基本属性",
        "createDate": "2018-12-31",
        "labelDescription": "国有企业，是指国家对其资本拥有所有权或者控制权，政府的意志和利益决定了国有企业的行为。",
        "coverCompany": "2342"
      }

    })
  })

}
