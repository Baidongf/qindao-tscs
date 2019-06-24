import { API_ADDRESS } from '../global_config'

/*
* TODO:上线时修改crmPort
* */
const crmPort = ''
const crmPortStr = crmPort ? ':' + crmPort : ''
export const BIG_DATA_ADDRESS = 'http://' + location.host.split(':')[0] + crmPortStr
export const COMPANY_BRIEF_PATH = API_ADDRESS + '/api/graph/brief'
export const PERSON_BRIEF_PATH = API_ADDRESS + '/api/graph/familiars'
export const SEARCH_SUGGESTED_PATH = API_ADDRESS + '/api/search/es_search'
export const CHART_COMPANY_PATH = API_ADDRESS + '/api/graph/company'
export const FIND_RELATION_PATH = API_ADDRESS + '/api/graph/relation'
export const FIND_GUARANTEE_PATH = API_ADDRESS + '/api/graph/guarantee_circle'
export const EXPAND_PATH = API_ADDRESS + '/api/graph/by_id'
export const PERSON_FAMILIARS_PATH = API_ADDRESS + '/api/graph/familiar'
export const PERSON_MERGE_SUGGESTED = API_ADDRESS + '/api/graph/person_merge_suggested'
export const PERSON_MERGE_SUGGESTED_LIST = API_ADDRESS + '/api/graph/person_merge_suggested_list'
export const CASE_BRIEF_PATH = API_ADDRESS + '/api/graph/case_detail'
export const CLUSTER_PATH = API_ADDRESS + '/api/graph/clusters'
export const CLUSTER_ITEM_PATH = API_ADDRESS + '/api/graph/group_info'
export const CLUSTER_CID_PATH = API_ADDRESS + '/api/graph/find_group'
export const INDIV_TRANSFER_CHART_PATH = API_ADDRESS + '/api/graph/getPathBySingleCollection'
export const GET_DETAIL_LIST_PARH = API_ADDRESS + '/api/graph/getDetailList'
export const FILTER_EDGE_DETAIL_PATH = API_ADDRESS + '/api/config/graph/query'
export const GET_RELATION_LIST_PATH = API_ADDRESS + '/api/config/graph/list'

/** ------------- 前端维护的 node 接口 --------------- */
export const EXPORT_RELATION_PATH = '/api/export_relation'
/** ------------- node 接口 end -------------------- */

/** 行内企业字段 */
export const BELONG_BANK = 'is_belong'

/**
 * 落地页配置
 */

// 找关系
// url: ${host}/lp/?lp_type=Relation&origin=bigdata_lp
const LP_FIND_RELATION = {
  'companyNames': {
    'src': '长沙天辰电讯实业有限公司',
    'dst': '长沙银行股份有限公司'
  },
  'traceDepth': 10
}

// 图挖掘
// url: ${host}/lp/?lp_type=Edge_dig&origin=bigdata_lp
const LP_EDGE_DIG = {
  'visibleEdges': ['invest', 'shareholder', 'officer', 'concert', 'actual_controller', 'tradable_share',
    'control_shareholder', 'person_merge', 'family']
}

// 全况图
// url: ${host}/lp/?lp_type=Company_cluster&origin=bigdata_lp
const LP_COMPANY_CLUSTER = {
  belongBank: BELONG_BANK,
  domain_name: 'haizhi',
}

export const LP_PARAMS = {
  'Relation': LP_FIND_RELATION,
  'Edge_dig': LP_EDGE_DIG,
  'Company_cluster': LP_COMPANY_CLUSTER,
}

/** 落地页配置 end */

/**
 * 图谱解释
 */

// 股东的对外投资及任职 & 高管的对外投资及任职
// ${companyName} 用于获取公司名称，以查询是否为上市公司
// url: ${host}/explain?type=invest_and_officer&id=${id}&company=${companyName}
const LP_INVEST_AND_OFFICER = {
  'visibleEdges': ['invest', 'officer', 'person_merge', 'tradable_share'],
  'shareholder_type': []
}

// 企业派系图谱解释
// url: ${host}/explain?type=company_faction&from=${当前企业名称}&to=${派系企业名称}
const COMPANY_FACTION = {
  'visibleEdges': ['actual_controller', 'concert', 'control_shareholder', 'person_merge'],
  'traceDepth': 5
}

// 实际控制人图谱解释
// url: ${host}/explain?type=actual_controller&rule=${rule1 or rule2}&from_list=${fromId1},${fromId2}&to=${toId}
// rule === '有限公司或自然人持股超过一半，不使用亲属关系以及一致行动关系合并' 时, rule = 'rule1'
// rule === '有限公司或自然人持股超过一半，使用亲属关系及一致行动关系合并' 时, rule = 'rule2'
// rule === '个体企业以法人作为疑似实际控制人' 时, rule = 'rule3'
const ACTUAL_CTRL = {
  visibleEdges: ['invest', 'officer', 'shareholder', 'person_merge', 'tradable_share', 'actual_controller']
}

// 一致行动关系图谱解释
// url: ${host}/explain?type=concert&rule=${rule}&from=${fromId}&to=${toId}&target=${targetId}
// id 如果为空，不加相应参数

export const EXPLAIN_PARAMS = {
  'invest_and_officer': LP_INVEST_AND_OFFICER,
  'company_faction': COMPANY_FACTION,
  'actual_controller': ACTUAL_CTRL
}

/** 图谱解释 end */
