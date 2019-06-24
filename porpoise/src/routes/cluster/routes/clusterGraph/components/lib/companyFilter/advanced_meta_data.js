/**
 * @file 高级筛选配置
 * @author xieyuzhong@haizhi.com
 */

var province = require('./province').province;
var city = require('./city').city;
var area = require('./area').area;

// key是省份中文，value是省份对象
var provinceObj = {}
province.forEach(function (item) {
    provinceObj[item.name] = item;
})

var cityName_areas = {}
for(var key in area) {
    if (area[key] && area[key][0]) {
        cityName_areas[area[key][0].city] = area[key]
    }
}

var year = {
    '1年内': {to: 1},
    '1-3年': {from: 1, to: 3},
    '4-10年': {from: 4, to: 10},
    '10年以上': {from: 10}
}

var count = {
    '0个': {from: 0, to: 0},
    '1-5个': {from: 1, to: 5},
    '6-10个': {from: 6, to: 10},
    '10个以上': {from: 10}
}

var times = {
    '0次': {from: 0, to: 0},
    '1次': {from: 1, to: 1},
    '2次': {from: 2, to: 2},
    '2次以上': {from: 2}
}
var timesRange = {
    '0次': {from: 0, to: 0},
    '1-3次': {from: 1, to: 3},
    '4-10次': {from: 4, to: 10},
    '10次以上': {from: 10}
}

var oneMillion = 1000000
var money = {
    '0': {from: 0, to: 0},
    '0-10万': {from: 0, to: 0.1 * oneMillion},
    '10万-50万': {from: 0.1 * oneMillion, to: 0.5 * oneMillion},
    '50万-100万': {from: 0.5 * oneMillion, to: oneMillion},
    '100万以上': {from: oneMillion}
}

var registerMoney = {
    '100万以下': {to: oneMillion},
    '100-500万': {from: oneMillion, to: 5 * oneMillion},
    '500-1000万': {from: 5 * oneMillion, to: 10 * oneMillion},
    '1000-3000万': {from: 10 * oneMillion, to: 30 * oneMillion},
    '3000-5000万': {from: 30 * oneMillion, to: 50 * oneMillion},
    '5000万-1亿': {from: 50 * oneMillion, to: 100 * oneMillion},
    '1亿-3亿': {from: 100 * oneMillion, to: 300 * oneMillion},
    '3亿-5亿': {from: 300 * oneMillion, to: 500 * oneMillion},
    '5亿-10亿': {from: 500 * oneMillion, to: 1000 * oneMillion},
    '10亿以上': {from: 1000 * oneMillion}
}

var industry = ['农业', '林业', '畜牧业', '渔业', '农、林、牧、渔服务业', '煤炭开采和洗选业', '石油和天然气开采业',
    '黑色金属矿采选业', '有色金属矿采选业', '非金属矿采选业', '开采辅助活动', '其他采矿业', '农副食品加工业', '食品制造业',
    '酒、饮料和精制茶制造业', '烟草制品业', '纺织业', '纺织服装、服饰业', '皮革、毛皮、羽毛及其制品和制鞋业', '木材加工和木、竹、藤、棕、草制品业',
    '家具制造业', '造纸和纸制品业', '印刷和记录媒介复制业', '文教、工美、体育和娱乐用品制造业', '石油加工、炼焦和核燃料加工业',
    '化学原料和化学制品制造业', '医药制造业', '化学纤维制造业', '橡胶和塑料制品业', '非金属矿物制品业', '黑色金属冶炼和压延加工业',
    '有色金属冶炼和压延加工业', '金属制品业', '通用设备制造业', '专用设备制造业', '汽车制造业', '铁路、船舶、航空航天和其他运输设备制造业',
    '电气机械和器材制造业', '计算机、通信和其他电子设备制造业', '仪器仪表制造业', '其他制造业', '废弃资源综合利用业', '金属制品、机械和设备修理业',
    '电力、热力生产和供应业', '燃气生产和供应业', '水的生产和供应业', '房屋建筑业', '土木工程建筑业', '建筑安装业', '建筑装饰和其他建筑业', '批发业',
    '零售业', '铁路运输业', '道路运输业', '水上运输业', '航空运输业', '管道运输业', '装卸搬运和运输代理业', '仓储业', '邮政业', '住宿业', '餐饮业',
    '电信、广播电视和卫星传输服务', '互联网和相关服务', '软件和信息技术服务业', '货币金融服务', '资本市场服务', '保险业', '其他金融业', '房地产业',
    '租赁业', '商务服务业', '研究和试验发展', '专业技术服务业', '科技推广和应用服务业', '水利管理业', '生态保护和环境治理业', '公共设施管理业', '居民服务业',
    '机动车、电子产品和日用产品修理业', '其他服务业', '教育', '卫生', '社会工作', '新闻和出版业', '广播、电视、电影和影视录音制作业', '文化艺术业', '体育',
    '娱乐业', '中国共产党机关', '国家机构', '人民政协、民主党派', '社会保障', '群众团体、社会团体和其他成员组织', '基层群众自治组织', '国际组织']

var industryObj = {}
industry.forEach(function (v) {
    industryObj[v] = {
        name: v
    }
})

var businessStatus = {
    '营业中': ['在业', '存续', '在册', '开业', '在营'],
    '清算': '清算',
    '注销': '注销',
    '迁出': '迁出',
    '迁入': '迁入',
    '撤销': '撤销',
    '停业': '停业',
    '筹建': '筹建'
}

var companyTypeObj = {
  '行内信贷客户': {
    name: 'is_belong'
  },
  '行外企业': {
    name: 'not_belong'
  }
}

/**
 * 配置说明
 * is_precondition: 是其他筛选条件的前置条件
 * precondition_key: 前置条件，当选中前置条件的某个值时，才会出现当前筛选项
 * precondition_value: 需要选中的前置条件值
 * canMultiChoose: 能否多选
 */
let filterDataTree = {
    // '工商注册信息': {
    //     '省份地区': {data: provinceObj, cityName_areas: cityName_areas, name: 'location_map', hasMultiStage: true, canMultiChoose: true},
    //     '注册资本': {data: registerMoney, unit: '万', name: 'registered_capital', canSelfDefine: true},
    //     '主营行业': {data: industryObj, name: 'industries', canMultiChoose: true},
    //     '注册时间': {data: year, unit: '年', name: 'registered_time', canSelfDefine: true},
    //     '经营状态': {data: businessStatus, name: 'business_status', canMultiChoose: true},
    //     '对外投资数目': {data: count, unit: '个', name: 'investment_num', canSelfDefine: true},
    //     '企业股东数目': {data: count, unit: '个', name: 'shareholders_num', canSelfDefine: true},
    //     '分支机构总数': {data: count, unit: '个', name: 'branch_num', canSelfDefine: true},
    //     '股东是否上市': {data: {'是': true, '否': false}, name: 'shareholder_listed'}
    // },
    // '近一年变更信息': {
    //     '股东变更': {data: times, unit: '次', name: 'shareholders_change', canSelfDefine: true},
    //     '公司名变更': {data: times, unit: '次', name: 'company_name_change', canSelfDefine: true},
    //     '法定代表人变更': {data: times, unit: '次', name: 'legal_man_change', canSelfDefine: true},
    //     '地址变更': {data: times, unit: '次', name: 'address_change', canSelfDefine: true},
    //     '成员变更': {data: times, unit: '次', name: 'member_change', canSelfDefine: true},
    //     '章程变更': {data: times, unit: '次', name: 'rule_change', canSelfDefine: true},
    //     '经营范围变更': {data: times, unit: '次', name: 'scope_change', canSelfDefine: true}
    // },
    // '专利信息': {
    //     '专利总数': {data: count, unit: '个', name: 'pattern_num', canSelfDefine: true}
    // },
    // '近一年招中标信息': {
    //     '中标次数': {data: count, unit: '个', name: 'win_bid_num', canSelfDefine: true},
    //     '代理招标次数': {data: count, unit: '个', name: 'acting_bid_num', canSelfDefine: true},
    //     '发布招标次数': {data: count, unit: '个', name: 'bid_num', canSelfDefine: true}
    // },
    // '近一年欠税信息': {
    //     '欠税次数': {data: timesRange, unit: '次', name: 'tax_arrears_num', canSelfDefine: true},
    //     '欠税金额': {data: money, unit: '万', name: 'tax_arrears', canSelfDefine: true}
    // },
    // '近三年纳税等级': {
    //     'A级纳税次数': {data: times, unit: '次', name: 'a_tax_num', canSelfDefine: true}
    // },
    // '上市公司信息': {
    //     '是否上市': {data: {'上市': true, '非上市': false}, name: 'is_listed', is_precondition: true},
    //     '上市状态': {data: {'正常上市': 'nor', '拟上市': 'ni', '暂停上市': 'pend', '终止上市': 'de'}, name: 'list_status',
    //         precondition_key: 'is_listed', precondition_value: '上市', canMultiChoose: true},
    //     '上市时间': {data: year, unit: '年', name: 'list_time', precondition_key: 'is_listed', precondition_value: '上市'},
    //     '上市板块': {data: {'沪市A股': '沪市A股', '沪市B股': '沪市B股', '深市A股': '深市A股', '深市B股': '深市B股', '创业板': '创业板',
    //         '中小板': '中小板'}, name: 'list_sector', precondition_key: 'is_listed', precondition_value: '上市', canMultiChoose: true}
    // },
    // '近一年涉诉信息': {
    //     '原告涉案次数': {data: timesRange, unit: '次', name: 'plaintiff_num', canSelfDefine: true},
    //     '被告涉案次数': {data: timesRange, unit: '次', name: 'defendant_num', canSelfDefine: true}
    // },
    // '近一年失信信息': {
    //     '被执行次数': {data: timesRange, unit: '次', name: 'executed_count', canSelfDefine: true},
    //     '被执行金额': {data: money, unit: '万', name: 'executed_money', canSelfDefine: true}
    // },
    // '近一年受处罚情况': {
    //     '行政处罚次数': {data: timesRange, unit: '次', name: 'punish_num', canSelfDefine: true}
    // },
    // '营销和风险系数': {
    //     '营销指数': {data: {'优': '优', '中': '中', '差': '差'}, name: 'market_coefficient', canMultiChoose: true},
    //     '风险评级': {data: {'高': '高', '中': '中', '低': '低'}, name: 'risk_coefficient', canMultiChoose: true}
    // },
    '公司筛选': {
      // '企业类型': { data: companyTypeObj, name: 'company_type' },
      // '省份地区': { data: provinceObj, cityName_areas: cityName_areas, name: 'location_map', canMultiChoose: true },
      // '主营行业': { data: industryObj, name: 'industries', canMultiChoose: true },
      // '经营状态': { data: businessStatus, name: 'business_status' },
      // '注册时间': { data: year, unit: '年', name: 'registered_time' },
      // '注册资本': { data: registerMoney, unit: '万', name: 'registered_capital' },
      // '是否上市': { data: { '上市': true, '非上市': false }, name: 'is_listed' },
      '实体类型': { data: { '企业': 'company', '个人': 'person' }, name: 'entityType' },
      '是否是行内客户': { data: { '行内': 0, '行外': 1 }, name: 'belongInner' }
    }
}

module.exports = {
  filterDataTree
}
