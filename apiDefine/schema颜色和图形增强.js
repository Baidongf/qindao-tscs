
schemas: [{
	schemaId: 132,

    // 新增字段
    shapeConfig: {
	    shape: ‘circle’,
        size: 'small' // 'ex-small'、'small'、'normal'、'large'、'ex-large'
    }

    usedFields: [
        {

            schemaFieldName: 'location',

            // 新增字段
            colorConfig: {

                // 以后可能有多字段配置，但仅能有一个生效，故增加isValid设置属性
                isValid: true,
                configs:[
                    {color: ‘#000’, value: ‘北京’},
                    {color: ‘#fff’, value: ‘上海’}
                ]
            }
        }, ...
    ] 
}, ...]