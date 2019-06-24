import React from 'react'

// 需要用withRouter包装当前组件，才能获取location路由信息
import {withRouter} from 'react-router-dom'
import {Breadcrumb} from 'antd'
import {getQueryObj} from 'utils/index.js'
import './index.scss'

class HzBreadcrumb extends React.Component {
  constructor(props) {
    super()

    this.routes = [
      {
        name: '',
        path: ['root'],
        children: [
          {
            name: '首页',
            path: ['main'],
            children: [
              {
                name: '系统管理',
                path: ['systemMgt'],
                hasHome: true,
                children: [
                  {
                    name: '',
                    path: ['orgMgt'],
                    children: [
                      {
                        name: '机构',
                        path: ['createOrEdit']
                      },
                      {
                        name: '机构详情',
                        path: ['detail']
                      }
                    ]
                  }, {
                    name: '',
                    path: ['userMgt'],
                    children: [
                      {
                        name: '用户',
                        path: ['createOrEdit']
                      },
                      {
                        name: '用户详情',
                        path: ['detail']
                      }
                    ]
                  }, {
                    name: '',
                    path: ['paramsMgt'],
                    children: [
                      {
                        name: '参数',
                        path: ['createOrEdit']
                      },
                      {
                        name: '参数详情',
                        path: ['detail']
                      }
                    ]
                  }, {
                    name: '',
                    path: ['roleMgt'],
                    children: [
                      {
                        name: '角色',
                        path: ['createOrEdit']
                      },
                      {
                        name: '角色详情',
                        path: ['detail']
                      }
                    ]
                  }
                ]
              },
              {
                name: '客户管理',
                path: ['customerMgt'],
                hasHome: true,
                children: [
                  {
                    name: '',
                    path: ['custMgt'],
                    children: [
                      {
                        name: '客户详情',
                        path: ['detail'],
                        children: [
                          {
                            name: '财务报表',
                            path: ['financeReportForm']
                          },
                        ]
                      },
                    ]
                  }, {
                    name: '',
                    path: ['tagMgt'],
                    children: [
                      {
                        name: '标签',
                        path: ['createOrEdit']
                      },
                      {
                        name: '标签详情',
                        path: ['detail']
                      }
                    ]
                  }
                ]
              },
              {
                name: '客户动态',
                path: ['customerDynamic'],
                hasHome: true,
                children: [
                  {
                    name: '动态详情',
                    path: ['detail']
                  }
                ]
              },
              {
                name: '营销活动',
                path: ['marketingActivity'],
                hasHome: true,
                children: [
                  {
                    name: '',
                    path: ['createActivity'],
                    children: [
                      {
                        name: '活动',
                        path: ['createOrEdit']
                      },
                      {
                        name: '活动详情',
                        path: ['detail']
                      }
                    ]
                  }, {
                    name: '',
                    path: ['receiveActivity'],
                    children: [
                      {
                        name: '活动',
                        path: ['createOrEdit']
                      },
                      {
                        name: '活动详情',
                        path: ['detail']
                      }
                    ]
                  },
                ]
              },
              {
                name: '营销成果',
                path: ['markResult'],
                hasHome: true,
                children: [
                  {
                  },
                ]
              },
              {
                name: '商机管理',
                path: ['opportunityMgt'],
                hasHome: true,
                children: [
                  {
                    name: '',
                    path: ['home'],
                    children: [
                      {
                        name: '商机',
                        path: ['createOrEdit']
                      },
                      {
                        name: '商机详情',
                        path: ['detail']
                      },
                      {
                        name: '商机详情',
                        path: ['commonDetail']
                      },
                      {
                        name: '商机详情',
                        path: ['addFollowRecord']
                      }
                    ]
                  }
                ]
              },
              {
                name: '消息中心',
                path: ['messageMgt'],
                hasHome: true,
                children: [
                  {
                    name: '',
                    path: ['home'],
                    children: [
                      {
                        name: '商机详情',
                        path: ['detail']
                      }
                    ]
                  }
                ]

              },
              {
                name: '项目监测',
                path: ['projectMonitor'],
                hasHome: true,
                children: [
                  {
                    name: '项目监测详情',
                    path: ['detail']
                  },
                  {
                    name: '项目',
                    path: ['createOrEdit']
                  },
                  {
                    name: '添加客户',
                    path: ['customerInsert']
                  },
                ]
              },
              {
                name: '知识库',
                path: ['customerKnowlMgt'],
                hasHome: true,
                children: [
                  {
                    name: '知识库详情',
                    path: ['detail']
                  },
                  {
                    name: '知识库详情',
                    path: ['managerdetail']
                  },
                  {
                    name: '知识库',
                    path: ['createOrEdit']
                  },
                ]
              },
              {
                name: '知识库',
                path: ['managerKnowlMgt'],
                hasHome: true,
                children: [
                  {
                    name: '知识库详情',
                    path: ['detail']
                  },
                  {
                    name: '信息',
                    path: ['createOrEdit']
                  },
                ]
              },
              {
                name: '项目储备',
                path: ['projectReserve'],
                hasHome: true,
                children: [
                  {
                    name: '项目储备详情',
                    path: ['detail']
                  },
                  {
                    name: '项目',
                    path: ['createOrEdit']
                  },
                ]
              },
              {
                name: '工作日程',
                hasHome: true,
                path: ['schedule'],
                children: [
                  {
                    name: '日程详情',
                    path: ['detail'],
                  },
                  {
                    name: '日程',
                    path: ['createOrEdit'],
                  },
                ]
              },
              {
                name: '产品目录',
                path: ['productBase'],
                hasHome: true,
                children: [
                  {
                    name: '产品管理',
                    path: ['categoryMgt']
                  },
                  {
                    name: '产品详情',
                    path: ['detail']
                  },
                  {
                    name: '新建产品',
                    path: ['addCategory']
                  },
                  {
                    name:'产品',
                    path:['createOrEdit']
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
    this.queryObj = getQueryObj(props.location.search)
    this.pathname = props.location.pathname
    this.pathArr = this.pathname.split('/')
    this.pathArr.shift()

    this.generateBreadItem = this.generateBreadItem.bind(this)
  }

  generateBreadItem(pathArr) {
    let breadItems = []
    let tempRoutes = this.routes
    let currentUrl = '/#'
    let operation_CN_Name = ''
    for (let pathNode of pathArr) {

      for (let pathObj of tempRoutes) {
        if (pathObj.path.indexOf(pathNode) > -1) {

          currentUrl += '/' + pathObj.path[0]
          if (pathObj.hasHome) {
            currentUrl += '/home'
          }
          if (pathObj.name) {
            if (pathNode === 'createOrEdit') {
              operation_CN_Name = this.queryObj.operation === 'create' ? '新建' : '编辑'
            } else {
              operation_CN_Name = ''
            }

            breadItems.push({
              name: operation_CN_Name + pathObj.name,
              url: currentUrl
            })
          }
          if (pathObj.children) {
            tempRoutes = pathObj.children
          }
          break
        } else {
          // console.info('%c路由路径配置有误或输入路由有误，请检查!', 'color: #d24545;')
        }
      }
    }
    return breadItems
  }

  componentDidMount() {
  }

  shouldComponentUpdate({location}) {
    return location !== this.props.location
  }

  render() {

    let breadItems = this.generateBreadItem(this.pathArr)
    return (
      <div className='hzBreadcrumb-component'>
        <span>您的位置：</span>
        <Breadcrumb separator='>' className='breadcrumb'>
          {
            breadItems.map((item, index) => {
              let innerHtml = null
              if(index===0&&item.name==='首页'){ // fix bug:290
                item.url='/#/root/main/home'
              }
              if (index !== breadItems.length - 1) {
                innerHtml = <a href={item.url}>{item.name}</a>
              } else {
                innerHtml = <span>{item.name}</span>
              }
              return <Breadcrumb.Item key={index}>{innerHtml}</Breadcrumb.Item>
            })
          }
        </Breadcrumb>
      </div>

    )
  }
}

export default withRouter(HzBreadcrumb)
