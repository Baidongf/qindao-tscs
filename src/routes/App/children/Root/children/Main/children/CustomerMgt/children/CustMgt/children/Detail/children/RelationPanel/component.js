import React from 'react'
import './component.scss'
import sanjiao from './images/sanjiao.png'
import gou from './images/gou.png'
import {Force, Tree, Structure, Bubble} from 'utils/graph'
//import {Force, Tree, Structure, Bubble} from 'star-graph'
import guquanData from './testData/guquanData'
import kongzhiren from './testData/kongzhirenData'


// TODO:还剩余几种关系没数据还没做
/**
 * 客户详情-关联关系面板
 */
class RelationPanel extends React.Component {
  constructor(props) {
    super(props)
    this.testMap = {
      HOLD_SHARES: '79B80C42353269B7AC156C5BE6AF72D8',
      GUARANTEEE: 'FAEEC55DCFD8AE86882611E444CC2966',
      INVEST: '789C02AE2B8FF9E1AF940F8C2BF1A090',
      OFFICER: '4848CEC3A499FB2FB5894C85B508A7D5',
      ACTUAL_CONTROLLER: '9492B25FFCCBDAE990B7A3B6F0CF7864',
      CONCERT: '24767C4514BD824B0A259731769B56F1'
    }
    this.state = {
      relationMap: [
        {
          label: '基础关系',
          id: 1,
          children: [
            {
              label: '股权结构',
              id: 'HOLD_SHARES'
            },
            {
              label: '公司高管',
              id: 'OFFICER'
            },
            {
              label: '投资图谱',
              id: 'INVEST'
            },

          ]
        },
        {
          label: '行内关系',
          id: 2,
          children: [
            {
              label: '行内授信关系',
              id: 'CREDIT'
            },
            {
              label: '担保关系',
              id: 'GUARANTEEE'
            },
            {
              label: '资金往来',
              id: 'TRANSFER'
            },
            {
              label: '银行借贷',
              id: 'BANK_LOAN'
            },
          ]
        },
        {
          label: '挖掘关系',
          id: 3,
          children: [
            {
              label: '一致行动人',
              id: 'CONCERT'
            },
            {
              label: '实际控制人',
              id: 'ACTUAL_CONTROLLER'
            },
            {
              label: '上下游关系',
              id: 'UP_DOWN_STREAM'
            },
          ]
        },
      ],
      currentFirst: {
        label: '基础关系',
        id: 1,
        children: [
          {
            label: '股权结构',
            id: 'HOLD_SHARES'
          },
          {
            label: '公司高管',
            id: 'OFFICER'
          },
          {
            label: '投资图谱',
            id: 'INVEST'
          },

        ]
      },
      currentFirstId: 1,
      currentRelationId: 'HOLD_SHARES',
      showDown: false,
      fullScreen:false
    }

    this.resultData = null

  }


  switchShowDown = () => {
    this.setState({
      showDown: !this.state.showDown
    })
  }

  btnClick = (item) => {
    this.setState({currentFirst: item, currentFirstId: item.id})
  }

  relationClick = (item) => {
    this.setState({
      currentRelationId: item.id,
    }, () => {
      this.getRelation(item.id, this.props.companyKey)
    })
  }

  /*TODO: this.testMap[type]是测试数据源  需切换为 this.props.companyKey*/
  getRelation = (type, id) => {
    this.props.standardAtlasExpand({
      "atlasType": type,
      // "vertexId": "Company/" +this.testMap[type]
      "vertexId": "Company/" +this.props.companyKey
    }, (data) => {
      this[type](data)
    })
  }

  switchFullSceen=()=>{
    this.setState({fullScreen:!this.state.fullScreen})
  }

  /*基本关系Start*/
  HOLD_SHARES = (data) => { //股权结构
    data = data.treeData
    let resultData = this.parseTree(data,false)
    let el = document.getElementById('svg-js')
    this.resultData = resultData
    let structure = new Structure({
      data: resultData,
      el: '#svg-js',
      width: el.offsetWidth,
      height: el.offsetHeight,
      collapseAll: false
    })
    structure.init()
  }

  OFFICER = (data) => { //公司高管
    data = data.treeData
    let resultData = this.parseTree(data,true)
    let el = document.getElementById('svg-js')
    this.resultData = resultData
    let tree = new Tree({
      data: resultData,
      el: '#svg-js',
      width: el.offsetWidth,
      height: el.offsetHeight,
    })
    tree.init()
  }

  INVEST=(data)=>{ //投资族谱
    data = data.treeData
    let resultData = this.parseTree(data,true)
    let el = document.getElementById('svg-js')
    this.resultData = resultData
    let tree = new Tree({
      data: resultData,
      el: '#svg-js',
      width: el.offsetWidth,
      height: el.offsetHeight,
    })
    tree.init()
  }

  /*基本关系End*/

  /*行内关系Start*/
  GUARANTEEE = (data) => { //担保关系
    /*let resultData = {
      properties: data.vertex,
      children: this.parseTree(data.children)
    }*/
    let el = document.getElementById('svg-js')
    this.resultData = data
    let tree = new Force({
      data: data,
      el: '#svg-js',
      width: el.offsetWidth,
      height: el.offsetHeight,
    })
    tree.init()

  }

  /*行内关系End*/

  /*挖掘关系Start*/

  CONCERT=(data)=>{ //一致行动人
    /*let resultData = {
    properties: data.vertex,
    children: this.parseTree(data.children)
  }*/
    let el = document.getElementById('svg-js')
    this.resultData = data
    let tree = new Force({
      data: data,
      el: '#svg-js',
      width: el.offsetWidth,
      height: el.offsetHeight,
    })
    tree.init()
  }

  ACTUAL_CONTROLLER=(data)=>{ //实际控制人
    data = data.treeData
    let resultData = this.parseTree(data,true)
    let el = document.getElementById('svg-js')
    this.resultData = resultData
    let tree = new Tree({
      data: resultData,
      el: '#svg-js',
      width: el.offsetWidth,
      height: el.offsetHeight,
    })
    tree.init()
  }

  /*挖掘关系End*/

  CREDIT = (data)=>{ // 行内授信关系
    let resultData = data
    let el = document.getElementById('svg-js')
    this.resultData = resultData
    let force = new Force({
      data: resultData,
      el: '#svg-js',
      width: el.offsetWidth,
      height: el.offsetHeight,
    })
    force.init()
  }


  parseTree(treeData, withRelation = false) {
    let result = {}
    result.properties = treeData.vertex
    if (withRelation) {
      let step = (arr, cb) => {
        arr.forEach(item => {
          cb(item)
          item.children && step(item.children)
        })
      }
      let findEdgName = (item) => {
        let name
        treeData.allEdges.forEach(edge => {
          if (item._id === edge._from) {
            name = edge._label || edge.shareholder_type
          }
        })
        return name
      }
      result.children = treeData.edges.map(edge => {
        edge.name = edge._label || edge.shareholder_type
        return {
          children: [],
          properties: edge
        }
      })
      step(treeData.children, (item) => {
        result.children.forEach(edge => {
          if ((edge.properties._label || edge.properties.shareholder_type) === findEdgName(item.vertex)) {
            edge.children.push({
              properties: item.vertex
            })
          }
        })
      })

    } else {
      result.children = treeData.children
      let step = (arr) => {
        arr.forEach(item => {
          item.properties = item.vertex
          item.children && step(item.children)
        })
      }
      step(result.children)
    }
    return result
  }

  componentWillMount() {
  }

  componentDidMount() {
    this.getRelation(this.state.currentRelationId, this.props.companyKey)
  }

  componentWillReceiveProps({}) {

  }

  render() {
    return (
      <div className={this.state.fullScreen?'relation-panel-component full-screen-wrap':'relation-panel-component'}>

        <div className='content-title' id='relationship'>
          <span className='panel-flag'></span>
          关联关系
          <span className='addition'>
            <span className='icon-button org'></span>
            <span className='icon-button list'></span>
            <span className='icon-button full-screen' onClick={this.switchFullSceen}></span>
          </span>
        </div>

        <div className='btn-group-g clearfix'>
          <div className='btn-wrap-g'>
            {this.state.relationMap.map(item => {
              return (<div
                className={item.id === this.state.currentFirstId ? 'active' : ''}
                key={item.id}
                onClick={() => {
                  this.btnClick(item)
                }}
              >{item.label}</div>)
            })}

          </div>
          <div className='down'>
            <div className='title' onClick={this.switchShowDown}>
              <p>{this.state.currentFirst.label}</p>
              <img src={sanjiao} className={this.state.showDown ? 'active' : ''}/>
            </div>
            {this.state.showDown && <div className='content'>
              {this.state.currentFirst.children.map(item => {
                return (<div className={item.id === this.state.currentRelationId ? 'active' : ''}
                             onClick={() => {
                               this.relationClick(item)
                             }}
                             key={item.id}
                >
                  <p>{item.label}</p>
                  <img alt="图片" src={gou}/>
                </div>)
              })}
            </div>}


          </div>
        </div>

        <div className='content-body'>
          <div className='content-content ' id='svg-js'></div>
        </div>
      </div>
    )
  }
}

export default RelationPanel
