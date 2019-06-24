import React from 'react'
import './component.scss'
import { Input, Tree, Button, Select, message } from 'antd'
import HzBreadcrumb from 'components/HzBreadcrumb'
const { TextArea, Search } = Input
const { TreeNode } = Tree
const { Option } = Select


class CreateOrEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      roleNameInput: '',
      roleRemarkInput: '',
      roleStatus: '',

      roleAddInput: {},
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      searchValue: '',

      showTreeAutoExpandParent: true,
      showTreeExpandedKeys: [],
      isUseShowTreeExpandedKeys: false,

      canSubmit: false, // 是否可点击“确定”

      treeData: [],
    }

    this.urlParams = {}

    this.dataList = [] // 用来提供搜索功能

    this.savedDataList = []  // 用来实现编辑时的二次填充

    this.checkHandler = this.checkHandler.bind(this)
    this.expandHandler = this.expandHandler.bind(this)
    this.selectHandler = this.selectHandler.bind(this)
    this.getParentKey = this.getParentKey.bind(this)
    this.searchChangeHandler = this.searchChangeHandler.bind(this)
    this.generateList = this.generateList.bind(this)
    this.showTreeExpandHandler = this.showTreeExpandHandler.bind(this)
    this.roleNameInputHandler = this.roleNameInputHandler.bind(this)
    this.roleRemarkInputHandler = this.roleRemarkInputHandler.bind(this)
    this.submitButtonHandler = this.submitButtonHandler.bind(this)
    this.optionChangeHandler = this.optionChangeHandler.bind(this)

  }

  // 树形选择 伸展
  expandHandler(expandedKeys) {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }

  showTreeExpandHandler(showTreeExpandedKeys) {
    this.setState({
      showTreeExpandedKeys,
      showTreeAutoExpandParent: false,
      isUseShowTreeExpandedKeys: true,
    })
  }

  // 勾选树节点
  checkHandler(checkedKeys, ev) {
    this.setState({
      checkedKeys,
      isUseShowTreeExpandedKeys: false,
    })

    // 校验必填项
    setTimeout(() => {
      this.toggleCanSubmit()
    }, 0)
  }

  // 点击树节点
  selectHandler(selectedKeys, info) {
    this.setState({ selectedKeys })
  }

  // 角色状态 select change 事件
  optionChangeHandler(value) {
    this.setState({
      roleStatus: value,
    })

    setTimeout(() => {
      this.toggleCanSubmit()
    }, 0)
  }


  // 查询父节点
  getParentKey(key, tree) {
    let parentKey
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i]
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key
        } else if (this.getParentKey(key, node.children)) {
          parentKey = this.getParentKey(key, node.children)
        }
      }
    }
    return parentKey
  }

  searchChangeHandler(ev) {
    const that = this
    const searchValue = ev.target.value
    const treeData = this.state.treeData
    const dataList = this.dataList
    const expandedKeys = dataList.map((item) => {
      if (searchValue && item.title.indexOf(searchValue) > -1) {
        return that.getParentKey(item.key, treeData)
      }
      return null
    }).filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys,
      searchValue,
      autoExpandParent: true,
    });
  }

  // 根据树形结构生成数据列表（一维数组），用于实现搜索功能
  generateList(data, type = '') {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key, title, id, parentId, checked } = node
      if (type === '') {
        this.dataList.push({ key, title, id, parentId, checked, })
      } else {
        this.savedDataList.push({ key, title, id, parentId, checked, })
      }

      if (node.children) {
        this.generateList(node.children, type)
      }
    }
  }

  // 获取 url query
  getSearchParams() {
    const search = this.props.location.search.substr(1).split('&')
    const operation = search[0].substr(10)
    const roleId = search[1] ? search[1].substr(3) : ''
    return {
      operation,
      roleId,
    }
  }

  componentDidMount() {
    this.props.getPermissionTree().then(() => {
      const { operation, roleId } = this.getSearchParams()
      this.urlParams = { operation, roleId }
      if (operation === 'edit') {
        // 获取对应 id 的角色信息
        this.props.getRoleDetail(parseInt(roleId))
      }
    })
  }

  componentWillReceiveProps({ permissionTree, roleDetail }) {
    let roleNameInput = ''
    let roleRemarkInput = ''
    let roleStatus = ''
    let checkedKeys = JSON.parse(JSON.stringify(this.state.checkedKeys))
    let originTreeData = JSON.parse(JSON.stringify(this.state.treeData))

    // 从后端拉取权限树
    if (permissionTree !== this.props.permissionTree) {
      originTreeData = [...permissionTree] // 保存原始数据，再做 key 值加工
      this.dataList = []
      this.savedDataList = []
      this.generateKeyForTree(originTreeData)
      this.generateList(originTreeData)
      this.setState({ treeData: originTreeData })
    }

    // 获取角色编辑信息
    if (roleDetail !== this.props.roleDetail) {
      roleNameInput = roleDetail.name
      roleRemarkInput = roleDetail.remark
      roleStatus = roleDetail.enabledFlag
      this.dataList = []
      this.savedDataList = []
      // 找出之前勾选了的 key
      let savedTreeData = [...roleDetail.resoList]
      this.generateKeyForTree(savedTreeData)
      this.generateList(savedTreeData, 'EDIT')
      checkedKeys = []
      this.savedDataList.forEach((data) => {
        if (data.checked === 'true') {
          checkedKeys.push(data.key)
        }
      })
      this.setState({
        roleNameInput,
        roleRemarkInput,
        roleStatus,
        checkedKeys,
      })
    }
  }

  /**
   * 给权限树的每一项增加 key ，提供给 Tree 组件使用
   * key 形如 `${parentId}-${id}` ，parentId 可有多个
   * 直接在数据源对象上增加 key，不返回新的对象
   * @param {Array} tree
   * @param {String} preKey
   */
  generateKeyForTree(tree, preKey = '') {
    for (let data of tree) {
      data.title = data.name
      data.children = JSON.parse(JSON.stringify(data.subs))
      data.key = preKey === '' ? `${data.parentId}-${data.id}` : `${preKey}-${data.id}`
      if (Array.isArray(data.children) && data.children.length > 0) {
        this.generateKeyForTree(data.children, data.key)
      }
    }
  }


  // 根据用户是否填写/勾选了必填项，改变“确定”按钮的可点击状态
  toggleCanSubmit() {
    // 1. 填写了角色名称
    // 2. 至少勾选了一个权限
    let canSubmit = false
    const { roleNameInput, checkedKeys, roleStatus, } = this.state
    if (
      roleNameInput !== '' &&
      checkedKeys.length > 0 &&
      roleStatus !== ''
    ) {
      canSubmit = true
    }
    this.setState({ canSubmit })
  }

  // 角色名称输入事件
  roleNameInputHandler(ev) {
    ev.stopPropagation()
    const roleNameInput = ev.target.value.trim()
    this.setState({ roleNameInput })

    // 校验必填项
    setTimeout(() => {
      this.toggleCanSubmit()
    }, 0)
  }

  // 角色备注输入事件
  roleRemarkInputHandler(ev) {
    ev.stopPropagation()
    const roleRemarkInput = ev.target.value.trim()
    this.setState({ roleRemarkInput })

    setTimeout(() => {
      this.toggleCanSubmit()
    }, 0)
  }


  // 拼装提交时的数据
  makeSubmitData() {
    /**
     * 角色创建时的请求传参结构如下
     * {
     *   id: [number] - 角色 id，修改角色时必填
     *   name: [string] - 角色名称
     *   remark: [string] - 角色备注
     *   enabledFlag: [string] - 角色状态 1有效 0无效
     *   resources: [
     *     {
     *       checked: [boolean] - 始终传 true
     *       id: [number] - 勾选的权限的 id
     *     }
     *   ]
     * }
     * 注意：当勾选了子节点时，需将父节点也 push 到 resources 数组中（顺序无所谓）
     *
     */
    const { roleNameInput, roleRemarkInput, checkedKeys, roleStatus, } = this.state
    const { operation, roleId } = this.urlParams
    const checked = true
    let resources = []
    let idArr = []
    for (let key of checkedKeys) {
      let arrange = key.split('-')
      for (let id of arrange) {
        idArr.push(parseInt(id))
      }
    }
    idArr = Array.from(new Set(idArr))
    for (let id of idArr) {
      resources.push({ checked, id })
    }
    const postData = {
      name: roleNameInput,
      remark: roleRemarkInput,
      enabledFlag: roleStatus,
      resources,
    }
    // 是否为更新角色
    if (operation === 'edit') {
      postData.id = parseInt(roleId)
    }
    return postData
  }


  // 点击“确定”，角色添加
  submitButtonHandler() {
    const postData = this.makeSubmitData()
    const { operation } = this.urlParams

    // 非空检验
    if (postData.name === '') {
      message.info('请输入角色名称')
      return false
    } else if (postData.enabledFlag === '') {
      message.info('请选择角色状态')
      return false
    } else if (postData.resources.length === 0) {
      message.info('请配置角色权限')
      return false
    }

    if (operation === 'edit') {
      this.props.updateRole(postData).then(() => {
        this.props.history.goBack()
      })
    } else {
      this.props.saveRole(postData).then(() => {
        this.props.history.goBack()
      })
    }
  }


  render() {

    const {
      roleNameInput,
      roleRemarkInput,
      roleStatus,
      treeData,
      searchValue,
      expandedKeys,
      autoExpandParent,
      checkedKeys,
      selectedKeys,
      showTreeAutoExpandParent,
      isUseShowTreeExpandedKeys,
      showTreeExpandedKeys,
      canSubmit,
    } = this.state


    let newCheckedKeys = [].concat(checkedKeys) // 剔除checkedKeys里面的父节点

    const spliceParant = (data) => {
      data.forEach((item, index) => {
        if(item.children && item.children.length > 0){
          for(let i = 0; i < newCheckedKeys.length; i++){
            if(newCheckedKeys[i] === item.key){
              newCheckedKeys.splice(i,1)
              break
            }
          }
          spliceParant(item.children)
        }
      })
    }
    const renderTreeNodes = (data, isForDisplay = false) => data.map((item) => {
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchValue.length);
      const title = index > -1 ? (
        <span>
          {beforeStr}
          <span style={{ color: '#f50' }} >{searchValue}</span>
          {afterStr}
        </span>
      ) : <span>{item.title}</span>;

      if (isForDisplay && !isShowNode(item.key)) {
        // isForDisplay 为 true，说明渲染的是右侧的展示型树结构
        // 若不满足条件，则不展示
        return []
      }

      if (item.children) {
        return (
          <TreeNode key={item.key} title={title}>
            {renderTreeNodes(item.children, isForDisplay)}
          </TreeNode>
        );
      } else {
        return <TreeNode key={item.key} title={title} />;
      }
    });

    // 收否在右边的展示树形结构中显示节点(根据 key)
    const isShowNode = (key) => {
      for (let item of this.state.checkedKeys) {
        if (item.indexOf(key) === 0) {
          return true
        }
      }
      return false
    }

    newCheckedKeys.length > 0 && spliceParant(treeData)

    return (
      <div className='create-edit-component'>
        <HzBreadcrumb />

        <div className='role-create-edit-container'>
          <div className='item input-container'>
            <div className='title'>角色{this.urlParams.operation === 'edit' ? '编辑' : '添加'}</div>
            <div className='line-input-area name-input-area'>
              <span className='must-fill-icon'>*</span>
              <span className='input-title'>角色名称</span>
              <Input
                placeholder='请输入角色名称'
                className='name-input'
                onChange={this.roleNameInputHandler}
                value={roleNameInput}
              />
            </div>
            <div className='line-input-area select-input-area'>
              <span className='must-fill-icon'>*</span>
              <span className='input-title'>角色状态</span>
              <Select
                placeholder='请选择角色状态'
                className='name-input'
                onChange={this.optionChangeHandler}
                value={roleStatus}
              >
                <Option value='1'>有效</Option>
                <Option value='0'>无效</Option>
              </Select>
            </div>
            <div className='remark-input-area'>
              <span className='input-title'>角色备注</span>
              <TextArea
                className='remark-input'
                onChange={this.roleRemarkInputHandler}
                value={roleRemarkInput}
              />
            </div>
          </div>

          {/* 树形选择面板 */}
          <div className='item tree-select-container'>
            <Search
              placeholder='请输入权限关键词搜索'
              onChange={this.searchChangeHandler}
              className='search-input'
            />
            <div className='tree-title'>
              <span className='color-red'>*</span>
              <span>角色权限配置选项</span>
            </div>
            <div className='tree-container'>
              <Tree
                checkable
                onExpand={this.expandHandler}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                onCheck={this.checkHandler}
                checkedKeys={newCheckedKeys}
                onSelect={this.selectHandler}
                selectedKeys={selectedKeys}
              >
                {renderTreeNodes(treeData)}
              </Tree>
            </div>
          </div>

          {/* 树形展示面板 */}
          <div className='item tree-display-container'>
            <div className='tree-container'>
              <Tree
                autoExpandParent={showTreeAutoExpandParent}
                expandedKeys={isUseShowTreeExpandedKeys ? showTreeExpandedKeys : checkedKeys}
                onExpand={this.showTreeExpandHandler}
              >
                {renderTreeNodes(treeData, true)}
              </Tree>
            </div>

            <div className='button-container'>
              <Button
                style={{marginRight:8}}
                onClick={() => { this.props.history.goBack() }}
              >取消</Button>
              <Button
                className='btn-submit'
                type='primary'
                // disabled={!canSubmit}
                onClick={this.submitButtonHandler}
              >确定</Button>


            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default CreateOrEdit
