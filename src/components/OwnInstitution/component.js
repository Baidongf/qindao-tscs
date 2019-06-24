import React from 'react'
import './component.scss'
import Popup from 'components/Popup'
import {Button} from 'antd'
import SearchableTree from 'components/SearchableTree'
import institutionIcon from './images/institution-icon.svg'

/**
 * @desc 所属机构弹窗
 * @prop {buttonWording} [string] 按钮文案，默认为“所属机构”
 * @prop {btnStyle} [object] 按钮的样式
 * @prop {handlePopupConfirm} [function] 弹窗中点击“确认”的回调函数
 */
class OwnInstitution extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      popupVisible: false,

      treeData: [],

      // 点击结点树，动态将该结点树的 title 添加到右侧区域的数组定义
      dynamic: [],

      checkedKeys: [],
    }

    // 叶子结点的机构id
    this.leafNodeIds = []

    this.idMapOrg = {}

    this.managerMap = {}

    this.institutionMap = {}

    this.showCustomPopup = this.showCustomPopup.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
    this.handleCheck = this.handleCheck.bind(this)
    this.handleClear = this.handleClear.bind(this)
    this.getAllManagers = this.getAllManagers.bind(this)
  }

  showCustomPopup(institutionTree,ev) {
    if(institutionTree[0]&&institutionTree[0].data){
      return
    }
    ev.stopPropagation()
    this.setState({popupVisible: true})
  }

  handleCheck(checkedKeys) {
    console.log(checkedKeys)
    if (checkedKeys.checked) {
      this.setState({checkedKeys: [checkedKeys.checked[checkedKeys.checked.length - 1]]})
    } else {
      this.setState({checkedKeys})
    }
  }

  handleCancel(e) {
    e.stopPropagation()
    this.setState({popupVisible: false})
  }

  handleConfirm(e) {
    const {checkedKeys} = this.state
    e.stopPropagation()
    this.passCheckedKeysToParent(checkedKeys)
    this.setState({popupVisible: false})
  }

  /**
   * @desc 所属机构清空操作
   */
  handleClear(ev) {
    ev.stopPropagation();
    this.setState({
      checkedKeys: []
    })
    this.passCheckedKeysToParent([])
  }

  // 将 checkedKeys 传递给父组件(调用父组件的 handlePopupConfirm 方法)
  passCheckedKeysToParent(checkedKeys = []) {
    const fn = this.props.handlePopupConfirm
    if (!!fn && typeof fn === 'function') {
      fn(checkedKeys)
    }
  }


  /**
   * @desc 根据机构获取对应的客户经理
   */
  getAllManagers(managerTree) {
    Promise.all(
      this.leafNodeIds.map(orgId => {
        this.props.getManagerListById(orgId, data => {
          if (data.data) {
            data.data.forEach(item => {
              item.parentId = orgId
              item.title = item.name
              item.isPerson = true
              this.managerMap[`${item.id}`] = item.name
            })
            this.idMapOrg[orgId].children = data.data
          }
        })
      })
    ).then(() => {
      this.setState({
        treeData: [managerTree]
      })
    })
  }


  componentDidMount() {
    // 获取机构树
    this.props.getManagerTree()
  }


  componentWillReceiveProps({managerTree, managerList}) {
    if (managerTree !== this.props.managerTree) {
      // const finallyResult = managerTree
      // this.getCustomerManager(finallyResult)
      // this.getAllManagers(managerTree)
      this.generateNodeTitleForTree(managerTree)
    }
  }


  /**
   * @desc
   *  1.为树的每一个节点增加title字段，值和name字段相同，搜索树组件要用到
   *  2.生成全局机构map对象，结构为 id-name，单一层级
   * @param {Object} obj
   */
  generateNodeTitleForTree(obj) {
    obj.title = obj.name
    this.institutionMap[obj.id] = obj.title || obj.name
    if (obj.children) {
      obj.children.forEach((child) => {
        this.generateNodeTitleForTree(child)
      })
    }
  }

  /**
   * 1.找到机构数中所有叶子结点的id，push到 leafNodeIds 中
   * 2.创建映射关系，每个叶子结点的id都对应当前叶子结点
   * @param {Object} obj
   */
  getCustomerManager(obj) {
    obj.title = obj.name
    if (obj.children) {
      for (let j = 0; j < obj.children.length; j++) {
        if (!obj.children[j].isPerson) {
          this.getCustomerManager(obj.children[j])
        }
      }
    } else {
      if (!obj.isPerson) {
        this.leafNodeIds.push(obj.id)
        this.idMapOrg[obj.id] = obj
      }
    }
    return obj
  }

  shouldComponentUpdate({managerTree, managerList}, nextState) {

    if (
      managerTree !== this.props.managerTree ||
      nextState !== this.state
    ) {
      return true
    } else {
      return false
    }
  }

  render() {
    let visible = this.state.popupVisible
    const {treeData, checkedKeys,} = this.state
    const {
      institutionMap,
      handleCancel,
      handleConfirm,
      handleCheck,
      handleClear,
    } = this

    // 读取机构树(渲染列表用！只包含机构，这里不用管客户经理)
    const {managerTree} = this.props
    const institutionTree = [managerTree]

    return (
      <div
        className='organization-button-component'
        onClick={(ev)=>{this.showCustomPopup(institutionTree,ev)}}
        style={this.props._wrapStyle}
      >
        <Popup
          visible={visible}
          title={this.props._title || '所属机构'}
          width='530'
          onCancel={handleCancel}
          onOk={handleConfirm}
        >
          <div className='institution-object'>
            <div className='institution-list'>
              <SearchableTree
                treeData={institutionTree}
                checkedKeys={checkedKeys}
                onCheck={handleCheck}
                _checkStrictly={this.props._checkStrictly}
              />
            </div>
            <div className='institution-show'>
              <div className='finally-selected'>
                <span className='selected-objects'>已选对象</span>
                <span className='selected-number'>{checkedKeys.length}</span>
                <Button className="btn-itme" onClick={handleClear}>清空</Button>
              </div>
              <div className='selected-content-show'>
                {
                  checkedKeys.map((item, index) => {
                    const institutionId = item.split('-').pop()
                    const institutionName = institutionMap[institutionId]
                    return (
                      <div
                        className='dynamic-nodeTitle'
                        key={institutionId}
                        data-ins-id={institutionId}
                        data-tree-path={item}
                      >
                        {institutionName}
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </Popup>

        <Button className='organ-number' style={this.props.btnStyle}>
          <span>
            {
              checkedKeys.length
              ? (
                this.props._title||this.props.buttonWording
                ? '已选对象 ' + checkedKeys.length
                : '已选机构 ' + checkedKeys.length
              )
              : this.props._title||this.props.buttonWording || '所属机构'
          }</span>
          <img alt='' src={institutionIcon} className='img'/>
        </Button>
      </div>
    )
  }
}

export default OwnInstitution
