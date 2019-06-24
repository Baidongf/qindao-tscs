import React from 'react'
import PropTypes from 'prop-types'
import { Tree, Input} from 'antd'

const { Search } = Input
const { TreeNode } = Tree

/**
 * SearchableTree 支持搜索功能的树形选择器
 * 对 ant-design 的 Tree 组件进行二次封装，实现可搜索树节点
 * 注意：不要在这里增加样式！已经预留了 className，在父组件使用的时候写样式即可，不要污染全局组件样式
 */
class SearchableTree extends React.Component {

  static propTypes = {
    treeData: PropTypes.array,
    checkedKeys: PropTypes.array,
    selectedKeys: PropTypes.array,
    expandedKeys: PropTypes.array,
    onCheck: PropTypes.func,
    onSelect: PropTypes.func,
    onExpand: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      expandedKeys: [],       // 展开的节点
      autoExpandParent: true, // 是否自动展开父节点
      checkedKeys: [],        // 已勾选的节点
      selectedKeys: [],       // 单击选择的节点
      searchValue: '',        // 搜索的值

      treeData: [],           // 树的数据
    }

    this.dataList = []        // 通过树的数据生成的一维数组，用来实现搜索功能

    this.expandHandler = this.expandHandler.bind(this)
    this.selectHandler = this.selectHandler.bind(this)
    this.checkHandler = this.checkHandler.bind(this)
    this.searchChangeHandler = this.searchChangeHandler.bind(this)
  }


  // 折叠树
  expandHandler(expandedKeys) {
    const that = this
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    })
    setTimeout(function(){
      if (that.props.onExpand) {
        that.props.onExpand(that.state.expandedKeys)
      }
    }, 0)
  }

  // 勾选树节点
  checkHandler(checkedKeys) {
    const that = this
    this.setState({ checkedKeys })
    setTimeout(function(){
      if (that.props.onCheck) {
        that.props.onCheck(that.state.checkedKeys)
      }
    }, 0)
  }

  // 选择树节点
  selectHandler(selectedKeys) {
    const that = this
    this.setState({ selectedKeys })
    setTimeout(function(){
      if (that.props.onSelect) {
        that.props.onSelect(that.state.selectedKeys)
      }
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

  // 搜索
  searchChangeHandler(ev, field = 'title') {
    const that = this
    const searchValue = ev.target.value
    const treeData = this.state.treeData
    const dataList = this.dataList
    const expandedKeys = dataList.map((item) => {
      if (searchValue && item[field].indexOf(searchValue) > -1) {
        return that.getParentKey(item.key, treeData)
      }
      return null
    }).filter((item, i, self) => item && self.indexOf(item) === i)
    this.setState({
      expandedKeys,
      searchValue,
      autoExpandParent: true,
    })
  }

  // 根据树形结构生成数据列表（一维数组），用于实现搜索功能
  generateList(data) {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key, title, id, parentId, checked } = node
      this.dataList.push({ key, title, id, parentId, checked, })

      if (node.children) {
        this.generateList(node.children)
      }
    }
  }

  /**
   * 给权限树的每一项增加 key ，提供给 Tree 组件使用
   * key 形如 `${parentId}-${id}` ，parentId 可有多个
   * 直接在数据源对象上增加 key，不返回新的对象
   * @param {Array} tree 树的数据
   * @param {String} preKey 内部递归时用到，调用时不传
   */
  generateKeyForTree(tree, preKey = '') {
    for (let data of tree) {
      data.key = preKey === '' ? `${data.parentId}-${data.id}` : `${preKey}-${data.id}`
      if (Array.isArray(data.children) && data.children.length > 0) {
        this.generateKeyForTree(data.children, data.key)
      }
    }
  }

  componentWillMount() {
    const treeData = this.props.treeData
    const _treeData = Object.assign([], treeData)
    this.generateKeyForTree(_treeData)
    this.generateList(_treeData)
    this.setState({ treeData: _treeData })
  }

  componentWillReceiveProps({ expandedKeys, selectedKeys, checkedKeys, treeData }) {
    if (expandedKeys !== this.props.expandedKeys) {
      this.setState({ expandedKeys })
    }

    if (selectedKeys !== this.props.selectedKeys) {
      this.setState({ selectedKeys })
    }

    if (checkedKeys !== this.props.checkedKeys) {
      this.setState({ checkedKeys })
    }

    if (treeData !== this.props.treeData) {
      const _treeData = Object.assign([], treeData)
      this.generateKeyForTree(_treeData)
      this.generateList(_treeData)
      this.setState({ treeData: _treeData })
    }
  }


  render() {
    const {
      treeData,
      searchValue,
      expandedKeys,
      autoExpandParent,
      checkedKeys,
      selectedKeys,
    } = this.state

    const renderTreeNodes = (data, field = 'title') => data.map((item) => {
      const index = item[field].indexOf(searchValue)
      const beforeStr = item[field].substr(0, index)
      const afterStr = item[field].substr(index + searchValue.length)
      const title = index > -1 ? (
        <span>
          {beforeStr}
          <span style={{ color: '#d24545' }}>{searchValue}</span>
          {afterStr}
        </span>
      ) : <span>{item[field]}</span>

      if (item.children) {
        return (
          <TreeNode key={item.key} title={title}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        )
      } else {
        return <TreeNode key={item.key} title={title} />
      }
    })
    return (
      <div className='searchable-tree-component'>

        {/* 搜索输入区 start */}
        <div className='search-input-container'>
          <Search
            placeholder='请输入关键词搜索'
            onChange={this.searchChangeHandler}
            className='search-input'
          />
        </div>
        {/* 搜索输入区 end */}

        {/* tree start */}
        <div className='tree-container'>
          <Tree
            checkable
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            checkedKeys={checkedKeys}
            selectedKeys={selectedKeys}
            onExpand={this.expandHandler}
            onCheck={this.checkHandler}
            onSelect={this.selectHandler}
            checkStrictly={this.props._checkStrictly}
          >
            {renderTreeNodes(treeData)}
          </Tree>
        </div>
        {/* tree end */}
      </div>
    )
  }

}

export default SearchableTree
