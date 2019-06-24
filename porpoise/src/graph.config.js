/**
 * state配置文件
 */
/**
 * 初始化图谱post请求参数 post body
 * - 决定筛选器的状态
 * - 不在 graphPostBody.options.edges 中的为行内数据
 */
export const graphPostBody = {
  'options': {
    'edges': [
      {
        'class': 'invest',       //  投资
        'visible': true,
        'trace_depth': 1,
        cn_name: '投资'
      },
      {
        'class': 'shareholder',  //  股东
        'visible': true,
        'trace_depth': 1,
        cn_name: '股东'
      },
      {
        'class': 'officer',      //  高管
        'visible': true,
        'trace_depth': 1,
        cn_name: '高管'
      },
      {
        'class': 'family',      //  亲属
        'visible': false,
        'trace_depth': 1,
        cn_name: '亲属'
      },
      {
        'class': 'concert',      //  一致行动人
        'visible': false,
        'trace_depth': 1,
        cn_name: '一致行动人'
      },
      {
        'class': 'control_shareholder', // 控股股东
        'visible': false,
        'trace_depth': 1,
        cn_name: '控股股东'
      },
      {
        'class': 'actual_controller', // 疑似实际控制人
        'visible': false,
        'trace_depth': 1,
        cn_name: '疑似实际控制人'
      },
      {
        'class': 'person_merge', // 可融合
        'visible': true,
        'trace_depth': 1,
        cn_name: '可融合'
      },
      {
        'class': 'tradable_share',
        'visible': true,
        'trace_depth': 1,
        cn_name: '股东'
      },
      {
        class: 'party_bid_from',
        visible: false,
        trace_depth: 1,
        cn_name: '甲方'
      },
      {
        class: 'party_bid_to',
        visible: false,
        trace_depth: 1,
        cn_name: '乙方'
      },
      {
        class: 'sue_relate_from',
        visible: false,
        trace_depth: 1,
        cn_name: '起诉'
      },
      {
        class: 'sue_relate_to',
        visible: false,
        trace_depth: 1,
        cn_name: '被起诉'
      },
      {
        class: 'plaintiff_relate',
        visible: false,
        trace_depth: 1,
        cn_name: '同为原告'
      },
      {
        class: 'defendant_relate',
        visible: false,
        trace_depth: 1,
        cn_name: '同为被告'
      },
    ],
    'min_weight': 0,
    'max_length': 10,
    'filter': {
      'edge': {                    //  主题筛选
        'invest': {
          // 投资金额
          'invest_amount': {},
          // 投资占比
          'invest_ratio': {},
          // {min: '10', max: '100'}
        },
        'shareholder': {
          // 股东占比
          'shareholder_ratio': {},
          'shareholder_type': ['Person', 'Company']
        },
        'tradable_share': {
          'tradable_type': ['Person', 'Company']  // 与shareholder.shareholder_type一致
        },
        'officer': {
          // 'position': ['厂长', '董事', '董事长', '法人', '理事', '总经理','独立董事', '副董事长', '副经理',
          // '副总经理', '负责人', '股东', '监事', '监事长', '经理', '理事长', '其他高管', '清算组成员',
          // '清算组负责人', '首席代表', '投资', '执行常务董事', '执行董事', '执行监事', '执行理事',
          // '职工董事', '职工监事', ]
          'position': ['董事', '监事', '法定代表人', '其他高管']
        },
        'sue': {
          // 'type': ['当事人', '原告', '被告']
          'type': []
        },
        'guarantee': {
          // 担保日期
          'guarantee_date': {},
          // { 'min': '1977-03-31', 'max': '1997-03-31' }

          // 担保金额
          'guarantee_amount': {}
          // {min: '10', max: '100'}
        },
        'money_flow': {
          // 转账日期
          'money_flow_date': {},
          // {min: '10', max: '100'}

          // 转账金额
          'money_flow_amount': {}
          // { 'min': '1977-03-31', 'max': '1997-03-31' }
        }
      },
      'vertex': {                  //  实体筛选
        'Company': {
          'capital': {},
          'company_type': [],
          'operation_startdate': {}
          // 'capital': { 'min': 200, 'max': 2000000 },
          // 'company_type': ['股份有限公司', '其他有限责任公司'],
          // 'operation_startdate': { 'min': '1977-03-31', 'max': '1997-03-31' }
        },
        'Bid_detail': {
          'publish_time': {}
        },
        'Judgement_wenshu': {
          'case_date': {}
        },
        'Court_bulletin_doc': {
          'court_time': {}
        },
        'Judge_process': {
          'filing_date': {}
        },
        'Court_announcement_doc': {
          'bulletin_date': {}
        }
      }
    },
    'expand': [],
    'exclude': []
  },
  'positionMapRaw': {
    'factory_director': '厂长',
    'board_director': '董事',
    'board_chairman': '董事长',
    'independent_director': '独立董事',
    'legal_man': '法人',
    'vice_chairman': '副董事长',
    'vice_manager': '副经理',
    'vice_general_manager': '副总经理',
    'principal': '负责人',
    'shareholder': '股东',
    'supervisor': '监事',
    'supervisory_chairman': '监事长',
    'manager': '经理',
    'syndic': '理事',
    'syndic_chairman': '理事长',
    'other_executive': '其他高管',
    'liquidation_group_member': '清算组成员',
    'liquidation_group_leader': '清算组负责人',
    'chief_representative': '首席代表',
    'invest': '投资',
    'admin_executive_director': '执行常务董事',
    'executive_director': '执行董事',
    'executive_supervisor': '执行监事',
    'employee_director': '职工董事',
    'employee_supervisor': '职工监事',
    'general_manager': '总经理'
  },
  'officerMap': {
    '董事': 'director',
    '监事': 'supervisor',
    '法定代表人': 'legal_man',
    '其他高管': 'manager'
  },
  'originEdges': {
    'invest': { edge: 'invest', direction: '_from', label: '投资' },
    'shareholder': { edge: 'invest', direction: '_to', label: '股东' },
    'officer': { edge: 'officer', direction: '_to', label: '高管' },
    'tradable_share': { edge: 'tradable_share', direction: '_from', label: '投资' },
    'agent_bid': { edge: 'tradable_share', direction: '_from', label: '代理竞标' },
    'win_bid': { edge: 'agent_bid', direction: '_from', label: '中标' },
    'publish_bid': { edge: 'publish_bid', direction: '_from', label: '招标' },
    'sue': { edge: 'sue', direction: '_from', label: '涉诉' },
    'actual_controller': { edge: 'actual_controller', direction: '_to', label: '疑似实际控制人' },
    'family': { edge: 'family', direction: 'all', label: '家属' },
    'person_merge_suggest': { edge: 'person_merge_suggest', direction: 'all', label: '疑似可融合' },
    'person_merge': { edge: 'person_merge', direction: 'all', label: '可融合' },
    'concert': { edge: 'concert', direction: 'all', label: '一致行动人' },
    'guarantee': { edge: 'guarantee', direction: '_from', label: '担保' },
    'upstream': { edge: 'upstream', direction: '_to', label: '上游' }
  },
  'sueMap': {
    'defendant': '被告',
    'plaintiff': '原告',
    'party': '当事人'
  },
  'shareholderMap': {
    'Person': '自然人股东',
    'Company': '法人股东'
  }
}

/**
 * 筛选器tab的状态
 */

export let filterUIStatus = {
  '主题筛选': {   // edge
    'show': false,
    'subtab': {
      '基本关系': true,
      // '涉诉关系': false,
      // '招中标关系': false,
      '事件关系': false,
      '行内关系': false
    }

  },
  '实体筛选': {   // vertex
    'show': false,
    'subtab': {
      '公司': true,
      // '案件': false,
      // '标书': false
    }
  },
  '关系挖掘': {   // mining edge
    'show': false,
    'subtab': {}
  }
}

/**
 * 图的状态(全屏，非全屏)
 */

/**
 * 图的状态(图树转换)
 */

/**
 * 虚拟节点 map
 */
export const groupIconMap = {
  invest: { icon: 'invest', name: '投资' },
  tradable_share: { icon: 'invest', name: '投资' },
  officer: { icon: 'officer', name: '高管' },
  control_shareholder: { icon: 'shareholder', name: '控股股东' },
  concert: { icon: 'edgeDig', name: '一致行动关系' },
  family: { icon: 'edgeDig', name: '亲属' },
  sue: { icon: 'sue', name: '涉诉关系' },
  actual_controller: { icon: 'edgeDig', name: '疑似实际控制人' },
  guarantee: { icon: 'edgeDig', name: '担保关系' },
  upstream: { icon: 'edgeDig', name: '上下游关系' },
  win_bid: { icon: 'bid', name: '中标' },
  publish_bid: { icon: 'bid', name: '发布招标' },
  agent_bid: { icon: 'bid', name: '代理招标' }
}

export const riskStatus = ['吊销', '注销', '清算', '停业', '撤销']

// 找关系需要开启的 edge option
export const findRelationEdges = ['invest', 'shareholder', 'officer', 'concert', 'actual_controller', 'tradable_share',
  'control_shareholder', 'person_merge', 'family', 'guarantee', 'money_flow']

// 图挖掘边
export const edgeDigRelations = ['concert', 'actual_controller', 'control_shareholder', 'family']

// 事件关系边
export const eventRelations = ['sue_relate', 'plaintiff_relate', 'defendant_relate']

export const objTypes = ['Person', 'Company', 'Court_bulletin_doc', 'Court_announcement_doc', 'Judge_process',
  'Bid_detail', 'Judgement_wenshu', 'Family_id']

// 不同颜色的边类型
export const edgeColorTypes = ['invest', 'shareholder', 'officer', 'concert', 'actual_controller',
  'control_shareholder', 'family', 'guarantee']

// 群体关系配置
export const mainRelationThreshold = 30
export const digRelationThreshold = 20
export const mergeEdgeMap = {
  'invest': { label: '对外投资对象', tableTitle: '投资关系', threshold: mainRelationThreshold },
  'officer': { label: '高管', tableTitle: '高管关系', threshold: mainRelationThreshold },
  'shareholder': { label: '股东', tableTitle: '股东关系', threshold: mainRelationThreshold },      // 以上为基本关系, 阈值为 30
  'concert': { label: '一致行动人', tableTitle: '一致行动关系', threshold: digRelationThreshold }, // 以下为图挖掘关系, 阈值为 20
  'guarantee': { label: '担保', tableTitle: '担保关系', threshold: digRelationThreshold },
  'money_flow': { label: '转账', tableTitle: '转账关系', threshold: digRelationThreshold },
  'sue': { label: '涉诉', tableTitle: '涉诉关系', threshold: digRelationThreshold },
  'bid': { label: '招中标', tableTitle: '招中标关系', threshold: 10 },
  'out_actual_controller': { label: '对外实际控制', tableTitle: '对外实际控制关系', threshold: digRelationThreshold },
  'out_control_shareholder': { label: '对外控股', tableTitle: '对外控股关系', threshold: digRelationThreshold },
  'in_party_bid': { label: '乙方', tableTitle: '乙方关系', threshold: digRelationThreshold },
  'out_party_bid': { label: '甲方', tableTitle: '甲方关系', threshold: digRelationThreshold },
  'out_sue_relate': { label: '起诉', tableTitle: '起诉关系', threshold: digRelationThreshold },
  'in_sue_relate': { label: '被起诉', tableTitle: '被起诉关系', threshold: digRelationThreshold },
  'plaintiff_relate': { label: '同为原告', tableTitle: '同为原告关系', threshold: digRelationThreshold },
  'defendant_relate': { label: '同为被告', tableTitle: '同为被告关系', threshold: digRelationThreshold }
}
