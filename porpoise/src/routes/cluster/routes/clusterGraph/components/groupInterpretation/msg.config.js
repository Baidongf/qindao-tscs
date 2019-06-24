/**
 * @file Describe the file
 * @author haizhi
 *
 */
export const configObj = {
  risk: {
    'court_ktgg': {
      name: '开庭公告',
      cols: [{
        en: 'case_id',
        cn: '案件编号'
      }, {
        en: 'court',
        cn: '法院'
      }, {
        en: 'litigants',
        cn: '当事人'
      }, {
        en: 'case_cause',
        cn: '案由'
      }, {
        en: 'content',
        cn: '公告内容'
      }]
    },
    'bulletin': {
      name: '法院公告',
      cols: [{
        en: 'bulletin_date',
        cn: '公告时间'
      }, {
        en: 'bulletin_type',
        cn: '公告类型'
      }, {
        en: 'litigants',
        cn: '当事人'
      }, {
        en: 'court',
        cn: '法院'
      }, {
        en: 'province',
        cn: '省份'
      }, {
        en: 'norm_bulletin_content',
        cn: '公告内容'
      }]
    },
    'judge_process': {
      name: '审判流程',
      cols: [{
        en: 'filing_date',
        cn: '立案日期'
      }, {
        en: 'court_time',
        cn: '开庭时间'
      }, {
        en: 'case_id',
        cn: '案件编号'
      }, {
        en: 'status',
        cn: '案件状态'
      }, {
        en: 'plaintiff_list',
        cn: '上诉人/原告'
      }, {
        en: 'defendant_list',
        cn: '被上诉人/被告'
      }]
    },
    'judgement_wenshu': {
      name: '判决结果',
      cols: [{
        en: 'case_date',
        cn: '裁判日期'
      }, {
        en: 'case_name',
        cn: '案件名称'
      }, {
        en: 'case_id',
        cn: '案件编号'
      }, {
        // boolean 无该字段
        en: 'case_type',
        cn: '案件类型'
      }, {
        en: 'case_cause',
        cn: '案由'
      }, {
        en: 'plaintiff_list',
        cn: '原告'
      }, {
        en: 'defendant_list',
        cn: '被告'
      }, {
        en: 'judge_content',
        cn: '判决结果'
      }]
    },

    'shixin_info': {
      name: '失信被执行',
      cols: [{
        en: 'publish_date',
        cn: '发布日期'
      }, {
        en: 'reg_date',
        cn: '立案日期'
      }, {
        en: 'court',
        cn: '执行法院'
      }, {
        en: 'performance',
        cn: '被执行人履行情况'
      }, {
        en: 'case_id',
        cn: '案件编号'
      }, {
        en: 'gist_id',
        cn: '执行依据文号'
      }, {
        en: 'duty',
        cn: '生效法律文书确定的义务'
      }, {
        en: 'disrupt_type_name',
        cn: '失信被执行人行为具体情形'
      }]
    },
    'owing_tax': {
      name: '欠税公告',
      cols: [{
        en: 'tax_item',
        cn: '欠税项目'
      }, {
        en: 'legal_man',
        cn: '法人'
      }, {
        en: 'taxpayer_id',
        cn: '纳税人登记号'
      }]
    },
    'penalty': {
      name: '行政处罚',
      cols: [{
        en: 'penalty_time',
        cn: '处罚时间'
      }, {
        en: 'title',
        cn: '原因'
      }, {
        en: 'publish_time',
        cn: '发布时间'
      }, {
        en: 'penalty_id',
        cn: '处罚编号'
      }, {
        en: 'execute_authority',
        cn: '处罚部门'
      }, {
        en: 'penalty_result',
        cn: '处罚详情'
      }]
    },
    'business_status_change': {
      name: '经营状态变更',
      cols: [{
        en: 'before',
        cn: '变更前的状态'
      }, {
        en: 'after',
        cn: '变更后的状态'
      }]
    },
    'legal_man_change': {
      name: '法定代表人频繁变更',
      cols: [{
        en: 'change_date',
        cn: '变更日期'
      }, {
        en: 'change_item',
        cn: '变更事项'
      }, {
        en: 'before_content',
        cn: '变更前'
      }, {
        en: 'after_content',
        cn: '变更后'
      }]
    },
    'senior_executive_change': {
      name: '高管频繁变更',
      cols: [{
        en: 'change_date',
        cn: '变更日期'
      }, {
        en: 'change_item',
        cn: '变更事项'
      }, {
        en: 'before_content',
        cn: '变更前'
      }, {
        en: 'after_content',
        cn: '变更后'
      }]
    },
    'registor_capital_change': {
      name: '企业注册资本频繁变更',
      cols: [{
        en: 'change_date',
        cn: '变更日期'
      }, {
        en: 'change_item',
        cn: '变更事项'
      }, {
        en: 'before_content',
        cn: '变更前'
      }, {
        en: 'after_content',
        cn: '变更后'
      }]
    },
    'shareholder_change': {
      name: '股东频繁变更',
      cols: [{
        en: 'change_date',
        cn: '变更日期'
      }, {
        en: 'change_item',
        cn: '变更事项'
      }, {
        en: 'before_content',
        cn: '变更前'
      }, {
        en: 'after_content',
        cn: '变更后'
      }]
    },
    'place_change': {
      name: '经营地址频繁变更',
      cols: [{
        en: 'change_date',
        cn: '变更日期'
      }, {
        en: 'change_item',
        cn: '变更事项'
      }, {
        en: 'before_content',
        cn: '变更前'
      }, {
        en: 'after_content',
        cn: '变更后'
      }]
    }
  },
  marketing: {
    'new_listed_shareholder': {
      name: '新增上市企业股东',
      showType: 'list',
      cols:[]
    },
    '102': {
      name: 'A级纳税人',
      cols: [{
        en: 'year',
        cn: '年份'
      },
      {
        en: 'level',
        cn: '纳税等级'
      },
      ]
    },
    'bid_info': {
      name: '招标',
      cols: [{
        en: 'title',
        cn: '项目名称'
      },
      {
        en: 'public_bid_company',
        cn: '招标公司'
      },
      {
        en: 'publish_time',
        cn: '发布日期'
      },
      {
        en: 'bid_id',
        cn: '中标编号'
      },
      {
        en: 'city',
        cn: '所属城市'
      },
      {
        en: 'bid_budget',
        cn: '中标金额'
      },
      {
        en: 'bid_content',
        cn: '中标详情'
      },
      ]
    },
    '104': {
      name: '中标公告',
      cols: [{
        en: 'title',
        cn: '项目名称'
      },
      {
        en: 'public_bid_company',
        cn: '招标公司'
      },
      {
        en: 'publish_time',
        cn: '发布日期'
      },
      {
        en: 'bid_id',
        cn: '中标编号'
      },
      {
        en: 'city',
        cn: '所属城市'
      },
      {
        en: 'bid_budget',
        cn: '中标金额'
      },
      {
        en: 'bid_content',
        cn: '中标详情'
      },
      ]
    },
    '105': {
      name: '新设立分支机构',
      showType: 'list',
      cols:[]
    },

    'new_invested_company': {
      name: '新增对外投资',
      showType: 'list',
      cols:[]
    },
  },
  unknown: {
    'unknown': {
      cols: [{
        en: 'des',
        cn: '事件描述'
      }]
    }
  }
}
