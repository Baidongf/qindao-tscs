/**
 * @desc 图计算查询（使用原有接口，新增部分参数）
 *
*/
{
    url: '/api/search/graph/expand',
    method: 'post',
    body: {
        options: {

            // 查询深度
            queryDepth: 3
        }

    },
    payload: {
        // 同以前
    }
}

/**
 * @desc 自定义规则（使用原有接口，传递的规则格式有修改）
 *
*/
{
    url: '/api/filter_rule/save',
    method: 'post',
    body: {
        rules: {
            operators: ['and', 'or', 'and'],
            rules: [{
                    operators: ['and', 'and', 'and'],
                    rules: [{id: 1}, {id: 2,}, {id: 3}, {id: 4}]
                }, {
                    operators: ['or', 'or', 'or'],
                    rules: [{id: 5}, {id: 6,}, {id: 7}, {id: 8}]
                }, {
                    operators: ['and', 'or', 'and'],
                    rules: [{id: 9}, {id: 10}, {id: 11}, {id: 12}]
                }
            ]
        }
    },
    payload: {
        // 同以前
    }
}
