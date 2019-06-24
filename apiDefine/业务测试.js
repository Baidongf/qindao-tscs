
/**
 * @desc 搜索(获取业务测试结果)
 *
*/
url: /api/businessTest/search
method: post,
body: {
    graph: {
      "direction": "ANY", //若为空，默认'ANY'
      "id": 1, //graphId, 若为空，则默认获取用户唯一的graphId，建议传，为了应对后续可能的扩展——一个用户多个graph。
      "maxDepth": 2, //若为空，默认为1
      "maxStartVertices": 0, //起始点最多有几个，默认为200
      "offset": 0, //图谱搜索结果分页，默认为0
      "size": 0 //图谱搜索结果分页，默认为500
    },
    start: {
        entityType: ['Company', 'Person', ...],
        edgeType: ['Invest', 'Phone', ...],
        entityProps: [
            {
                schema: 'Company',
                fieldName: 'operation_startdate',
                fieldType: 'DATETIME', // STRING, NUMBER
                operation: '>',
                values: ['2012-10-02 20:00:00']
            },
            ...
        ],
        edgeProps: [
            {

            },
            ...
        ]
    },
    end: {
        // 同上
    }
},

payload: {
    name: '业务模块xxx',
    result: {
        nodes: [
            {name: '公司', total: 323},
            {name: '人', total: 23, subs: [ //表
                {name: '名字', total: 23, subs: [ //字段
                    {name: '张三', total: 10, subs: null}, //字段的值
                    {name: '李四', total: 23, subs: null}
                ]}
            ]}
        ],
        edges: [
            {name: '同事', total: 323},
            {name: '朋友', total: 33},
            {name: '高管', total: 20, subs: [
                {
                  name: '职位', total: 20, subs: [
                    {name: '董事', total: 14},
                    {name: '经理', total: 6}
                  ]
                }
            ]},
        ]
    }
}

/**
 * @desc 保存模版
 *
 *
*/
url: /api/businessTest/template/save
method: post
body: {
    graphId: 4, //若为空，则默认获取用户唯一的graphId，建议传，为了应对后续可能的扩展——一个用户多个graph。
    name: '业务模块xxx',
    template: '{"start":{"entityType":{"values":[{"name":"企业","id":"Company","selected":false},{"name":"自然人","id":"Person","selected":true}],"selectedCount":1,"selectedAll":false},"entityProps":{"values":[
        {"values":[{"fieldRules":[{"fieldName":"object_key","values":["ewew"],"schema":"Account","fieldType":"STRING","operator":"==","field":"object_key"}],"ruleName":"qqq","ruleId":null ,"name":"qqq"}]}, ...
    ]},"edgeType":{"values":[{"name":"投资","id":"Invest","selected":true},{"name":"电话","id":"Phone","selected":true}],"selectedCount":2,"selectedAll":false},"edgeProps":{"values":[]}},"end":{"entityType":{"values":[{"name":"企业","id":"Company"},{"name":"自然人","id":"Person"}],"selectedCount":0,"selectedAll":true},"entityProps":{"values":[]}}}'
}

/**
 * @desc 获取模版列表
*/
url: /api/businessTest/template/list
method: get,
query: {
    graphId: 4, //若为空，则默认获取用户唯一的graphId，建议传，为了应对后续可能的扩展——一个用户多个graph。
    name: '零售' // 不传时表示搜索全部
    page: 0, //若为空，默认为0
    size: 10 //若为空，默认为10
}
payload: {
    data: [
            {name: xxx, id: xxx, createdTime: xxx, createdUser: xxxx,
                template: '{"start":{"entityType":{"values":[{"name":"企业","id":"Company","selected":false},{"name":"自然人","id":"Person","selected":true}],"selectedCount":1,"selectedAll":false},"entityProps":{"values":[]},"edgeType":{"values":[{"name":"投资","id":"Invest","selected":true},{"name":"电话","id":"Phone","selected":true}],"selectedCount":2,"selectedAll":false},"edgeProps":{"values":[]}},"end":{"entityType":{"values":[{"name":"企业","id":"Company"},{"name":"自然人","id":"Person"}],"selectedCount":0,"selectedAll":true},"entityProps":{"values":[]}}}'
            }},
            ......
    ],
    total: 60,
    size: 10,
    page: 0
}

/**
 * @desc 获取模版详情
 *
*/
url: /api/businessTest/template/details
method: get,
query: {
    id: xxxx //模板id
}
payload: {
        id: xxxx,
        name: '业务模块xxx',
        template: '{"start":{"entityType":{"values":[{"name":"企业","id":"Company","selected":false},{"name":"自然人","id":"Person","selected":true}],"selectedCount":1,"selectedAll":false},"entityProps":{"values":[
            {"values":[{"fieldRules":[{"fieldName":"object_key","values":["ewew"],"schema":"Account","fieldType":"STRING","operator":"==","field":"object_key"}],"ruleName":"qqq","ruleId":null ,"name":"qqq"}]}, ...
        ]},"edgeType":{"values":[{"name":"投资","id":"Invest","selected":true},{"name":"电话","id":"Phone","selected":true}],"selectedCount":2,"selectedAll":false},"edgeProps":{"values":[]}},"end":{"entityType":{"values":[{"name":"企业","id":"Company"},{"name":"自然人","id":"Person"}],"selectedCount":0,"selectedAll":true},"entityProps":{"values":[]}}}'
    },
    
}


// {"graphId":"1","filterRules":[{"fieldRuleId":337,"schema":"Company","fieldName":"city","fieldCnName":"城市","fieldType":"STRING","operator":"<","values":["43434"],"field":"city"}],"ruleName":"股东-占比","ruleId":109}
