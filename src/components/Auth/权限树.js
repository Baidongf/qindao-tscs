// 简易权限树(删掉无关字段)
var data = [
  {
      name: "首页",
      subs: [
          {
              name: "基础应用",
              subs: []
          },
          {
              name: "公告信息"
          },
          {
              name: "拜访管理"
          },
          {
              name: "任务管理"
          },
          {
              name: "商机管理"
          },
          {
              name: "排行榜"
          }
      ]
  },
  {
      name: "客户管理",
      subs: [
          {
              name: "客户分配"
          },
          {
              name: "批量分配"
          },
          {
              name: "客户导出"
          }
      ]
  },
  {
      name: "知识图谱",
      subs: [
          {
              name: "客户概览"
          },
          {
              name: "客户业绩"
          },
          {
              name: "基本信息"
          },
          {
              name: "关联关系"
          },
          {
              name: "客户价值"
          },
          {
              name: "已开展业务"
          },
          {
              name: "风险预警"
          },
          {
              name: "拜访管理"
          },
          {
              name: "客户认领"
          },
          {
              name: "行内动态",
              subs: [
                  {
                      name: "添加商机",
                      subs: []
                  },
                  {
                      name: "添加拜访",
                      subs: []
                  }
              ]
          },
          {
              name: "行外事件",
              subs: [
                  {
                      name: "添加商机",
                      subs: []
                  },
                  {
                      name: "添加拜访",
                      subs: []
                  }
              ]
          }
      ]
  },
  {
      name: "产品目录",
      subs: [
          {
              name: "查看详情",
              subs: []
          }
      ]
  },
  {
      name: "日程",
      subs: []
  },
  {
      name: "客户动态",
      subs: []
  },
  {
      name: "商机管理",
      subs: [
          {
              name: "商机导出",
              subs: []
          },
          {
              name: "商机新建",
              subs: []
          },
          {
              name: "商机修改",
              subs: []
          },
          {
              name: "商机认领",
              subs: []
          },
          {
              name: "商机导入",
              subs: []
          }
      ]
  },
  {
      name: "营销活动",
      subs: [
          {
              name: "任务创建",
              subs: []
          },
          {
              name: "任务批量导入",
              subs: []
          },
          {
              name: "查看任务进度",
              subs: []
          },
          {
              name: "任务批量导出",
              subs: []
          },
          {
              name: "任务修改/终止",
              subs: []
          }
      ]
  },
  {
      name: "项目监测 ",
      subs: [
          {
              name: "对公客户明细查询",
              subs: []
          },
          {
              name: "对公共存款变化情况表",
              subs: []
          },
          {
              name: "报表查询",
              subs: []
          }
      ]
  },
  {
      name: "项目储备",
      subs: [
          {
              name: "拜访新建",
              subs: []
          },
          {
              name: "拜访修改",
              subs: []
          }
      ]
  },
  {
      name: "营销成果"
  },
  {
      name: "系统管理",
      subs: [
          {
              name: "用户管理"
          },
          {
              name: "角色管理"
          },
          {
              name: "数据上传",
              subs: []
          },
          {
              name: "参数配置",
              subs: []
          }
      ]
  },
  {
      name: "知识库",
      subs: []
  },
  {
      name: "大客户",
      subs: [
          {
              name: "公告发布"
          }
      ]
  },
  {
      name: "零售客户"
  },
  {
      name: "反洗钱收益人"
  },
  {
      name: "消息推送"
  },
  {
      name: "认领审批日志"
  }
]


// 原始数据
var  originData = {
  "success": true,
  "payload": {
    "data": [
      {
        "id": 15,
        "name": "首页",
        "remark": null,
        "parentId": 0,
        "checked": "true",
        "rrpId": null,
        "isShow": "0",
        "icon": "1111",
        "subs": [
          {
            "id": 16,
            "name": "基础应用",
            "remark": null,
            "parentId": 15,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          },
          {
            "id": 18,
            "name": "公告信息",
            "remark": null,
            "parentId": 15,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          },
          {
            "id": 19,
            "name": "拜访管理",
            "remark": null,
            "parentId": 15,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          },
          {
            "id": 20,
            "name": "任务管理",
            "remark": null,
            "parentId": 15,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          },
          {
            "id": 21,
            "name": "商机管理",
            "remark": null,
            "parentId": 15,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          },
          {
            "id": 22,
            "name": "排行榜",
            "remark": null,
            "parentId": 15,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          }
        ],
        "roleResourcePermissionDao": null
      },
      {
        "id": 24,
        "name": "客户管理",
        "remark": null,
        "parentId": 0,
        "checked": "true",
        "rrpId": null,
        "isShow": "1",
        "icon": "customerManage",
        "subs": [
          {
            "id": 25,
            "name": "客户分配",
            "remark": null,
            "parentId": 24,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          },
          {
            "id": 26,
            "name": "批量分配",
            "remark": null,
            "parentId": 24,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          },
          {
            "id": 27,
            "name": "客户导出",
            "remark": null,
            "parentId": 24,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          }
        ],
        "roleResourcePermissionDao": null
      },
      {
        "id": 28,
        "name": "知识图谱",
        "remark": null,
        "parentId": 0,
        "checked": "true",
        "rrpId": null,
        "isShow": "1",
        "icon": "knowledgeImage",
        "subs": [
          {
            "id": 29,
            "name": "客户概览",
            "remark": null,
            "parentId": 28,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          },
          {
            "id": 30,
            "name": "客户业绩",
            "remark": null,
            "parentId": 28,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          },
          {
            "id": 31,
            "name": "基本信息",
            "remark": null,
            "parentId": 28,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          },
          {
            "id": 32,
            "name": "关联关系",
            "remark": null,
            "parentId": 28,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          },
          {
            "id": 33,
            "name": "客户价值",
            "remark": null,
            "parentId": 28,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          },
          {
            "id": 34,
            "name": "已开展业务",
            "remark": null,
            "parentId": 28,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          },
          {
            "id": 35,
            "name": "风险预警",
            "remark": null,
            "parentId": 28,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          },
          {
            "id": 37,
            "name": "拜访管理",
            "remark": null,
            "parentId": 28,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          },
          {
            "id": 38,
            "name": "客户认领",
            "remark": null,
            "parentId": 28,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          },
          {
            "id": 39,
            "name": "行内动态",
            "remark": null,
            "parentId": 28,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [
              {
                "id": 40,
                "name": "添加商机",
                "remark": null,
                "parentId": 39,
                "checked": "true",
                "rrpId": null,
                "isShow": "",
                "icon": null,
                "subs": [],
                "roleResourcePermissionDao": null
              },
              {
                "id": 41,
                "name": "添加拜访",
                "remark": null,
                "parentId": 39,
                "checked": "true",
                "rrpId": null,
                "isShow": "",
                "icon": null,
                "subs": [],
                "roleResourcePermissionDao": null
              }
            ],
            "roleResourcePermissionDao": null
          },
          {
            "id": 42,
            "name": "行外事件",
            "remark": null,
            "parentId": 28,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [
              {
                "id": 43,
                "name": "添加商机",
                "remark": null,
                "parentId": 42,
                "checked": "true",
                "rrpId": null,
                "isShow": "",
                "icon": null,
                "subs": [],
                "roleResourcePermissionDao": null
              },
              {
                "id": 44,
                "name": "添加拜访",
                "remark": null,
                "parentId": 42,
                "checked": "true",
                "rrpId": null,
                "isShow": "",
                "icon": null,
                "subs": [],
                "roleResourcePermissionDao": null
              }
            ],
            "roleResourcePermissionDao": null
          }
        ],
        "roleResourcePermissionDao": null
      },
      {
        "id": 45,
        "name": "产品目录",
        "remark": null,
        "parentId": 0,
        "checked": "true",
        "rrpId": null,
        "isShow": "1",
        "icon": "productList",
        "subs": [
          {
            "id": 46,
            "name": "查看详情",
            "remark": null,
            "parentId": 45,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          }
        ],
        "roleResourcePermissionDao": null
      },
      {
        "id": 47,
        "name": "日程",
        "remark": null,
        "parentId": 0,
        "checked": "true",
        "rrpId": null,
        "isShow": "1",
        "icon": "schedule",
        "subs": [],
        "roleResourcePermissionDao": null
      },
      {
        "id": 48,
        "name": "客户动态",
        "remark": null,
        "parentId": 0,
        "checked": "true",
        "rrpId": null,
        "isShow": "1",
        "icon": "customerDynamic",
        "subs": [],
        "roleResourcePermissionDao": null
      },
      {
        "id": 56,
        "name": "商机管理",
        "remark": null,
        "parentId": 0,
        "checked": "true",
        "rrpId": null,
        "isShow": "1",
        "icon": "opportunityManage",
        "subs": [
          {
            "id": 57,
            "name": "商机导出",
            "remark": null,
            "parentId": 56,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          },
          {
            "id": 58,
            "name": "商机新建",
            "remark": null,
            "parentId": 56,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          },
          {
            "id": 59,
            "name": "商机修改",
            "remark": null,
            "parentId": 56,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          },
          {
            "id": 60,
            "name": "商机认领",
            "remark": null,
            "parentId": 56,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          },
          {
            "id": 61,
            "name": "商机导入",
            "remark": null,
            "parentId": 56,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          }
        ],
        "roleResourcePermissionDao": null
      },
      {
        "id": 62,
        "name": "营销活动",
        "remark": null,
        "parentId": 0,
        "checked": "true",
        "rrpId": null,
        "isShow": "1",
        "icon": "marketingActivity",
        "subs": [
          {
            "id": 63,
            "name": "任务创建",
            "remark": null,
            "parentId": 62,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          },
          {
            "id": 64,
            "name": "任务批量导入",
            "remark": null,
            "parentId": 62,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          },
          {
            "id": 65,
            "name": "查看任务进度",
            "remark": null,
            "parentId": 62,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          },
          {
            "id": 66,
            "name": "任务批量导出",
            "remark": null,
            "parentId": 62,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          },
          {
            "id": 67,
            "name": "任务修改/终止",
            "remark": null,
            "parentId": 62,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          }
        ],
        "roleResourcePermissionDao": null
      },
      {
        "id": 68,
        "name": "项目监测 ",
        "remark": null,
        "parentId": 0,
        "checked": "true",
        "rrpId": null,
        "isShow": "1",
        "icon": "projectWatch",
        "subs": [
          {
            "id": 69,
            "name": "对公客户明细查询",
            "remark": null,
            "parentId": 68,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          },
          {
            "id": 70,
            "name": "对公共存款变化情况表",
            "remark": null,
            "parentId": 68,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          },
          {
            "id": 71,
            "name": "报表查询",
            "remark": null,
            "parentId": 68,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          }
        ],
        "roleResourcePermissionDao": null
      },
      {
        "id": 72,
        "name": "项目储备",
        "remark": null,
        "parentId": 0,
        "checked": "true",
        "rrpId": null,
        "isShow": "1",
        "icon": "projectReserve",
        "subs": [
          {
            "id": 74,
            "name": "拜访新建",
            "remark": null,
            "parentId": 72,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          },
          {
            "id": 75,
            "name": "拜访修改",
            "remark": null,
            "parentId": 72,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          }
        ],
        "roleResourcePermissionDao": null
      },
      {
        "id": 76,
        "name": "营销成果",
        "remark": null,
        "parentId": 0,
        "checked": "true",
        "rrpId": null,
        "isShow": "1",
        "icon": "marketingResult",
        "subs": [],
        "roleResourcePermissionDao": null
      },
      {
        "id": 79,
        "name": "系统管理",
        "remark": null,
        "parentId": 0,
        "checked": "true",
        "rrpId": null,
        "isShow": "1",
        "icon": "systemSettng",
        "subs": [
          {
            "id": 80,
            "name": "用户管理",
            "remark": null,
            "parentId": 79,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          },
          {
            "id": 81,
            "name": "角色管理",
            "remark": null,
            "parentId": 79,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          },
          {
            "id": 82,
            "name": "数据上传",
            "remark": null,
            "parentId": 79,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          },
          {
            "id": 83,
            "name": "参数配置",
            "remark": null,
            "parentId": 79,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          }
        ],
        "roleResourcePermissionDao": null
      },
      {
        "id": 85,
        "name": "知识库",
        "remark": null,
        "parentId": 0,
        "checked": "true",
        "rrpId": null,
        "isShow": "1",
        "icon": "knowledgeLibrary",
        "subs": [],
        "roleResourcePermissionDao": null
      },
      {
        "id": 86,
        "name": "大客户",
        "remark": null,
        "parentId": 0,
        "checked": "true",
        "rrpId": null,
        "isShow": "1",
        "icon": "",
        "subs": [
          {
            "id": 87,
            "name": "公告发布",
            "remark": null,
            "parentId": 86,
            "checked": "true",
            "rrpId": null,
            "isShow": "",
            "icon": null,
            "subs": [],
            "roleResourcePermissionDao": null
          }
        ],
        "roleResourcePermissionDao": null
      },
      {
        "id": 92,
        "name": "零售客户",
        "remark": null,
        "parentId": 0,
        "checked": "true",
        "rrpId": null,
        "isShow": "1",
        "icon": null,
        "subs": [],
        "roleResourcePermissionDao": null
      },
      {
        "id": 93,
        "name": "反洗钱收益人",
        "remark": null,
        "parentId": 0,
        "checked": "true",
        "rrpId": null,
        "isShow": "1",
        "icon": null,
        "subs": [],
        "roleResourcePermissionDao": null
      },
      {
        "id": 94,
        "name": "消息推送",
        "remark": null,
        "parentId": 0,
        "checked": "true",
        "rrpId": null,
        "isShow": "1",
        "icon": null,
        "subs": [],
        "roleResourcePermissionDao": null
      },
      {
        "id": 95,
        "name": "认领审批日志",
        "remark": null,
        "parentId": 0,
        "checked": "true",
        "rrpId": null,
        "isShow": "1",
        "icon": null,
        "subs": [],
        "roleResourcePermissionDao": null
      }
    ]
  }
}
