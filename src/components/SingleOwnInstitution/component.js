import React from 'react'
import { TreeSelect } from 'antd'

const TreeNode = TreeSelect.TreeNode;

// 单选的所属机构 select 组件
class SingleOwnInstitution extends React.Component {

  static defaultProps = {
    onChange: () => {},
    onLoad: () => {}, // 机构数据加载完成的事件勾子
    placeholder: '所属机构',
    value: '',
    multiple: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      institutionTree: []
    }
  }

  componentDidMount() {
    this.props.getManagerTree()
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


  componentWillReceiveProps({ managerTree }) {
    if (managerTree !== this.props.managerTree) {
      const institutionTree = [managerTree]
      this.generateKeyForTree(institutionTree)
      this.setState({ institutionTree }, () => {
        this.props.onLoad()
      })
    }
  }

  render() {

    const renderTreeNodes = (tree, field = 'name') => tree.map(node => {
      if (node.children) {
        return (
          <TreeNode
            key={node.key}
            title={node.name}
            value={`${node.name}===${node.key}`}
          >
            { renderTreeNodes(node.children) }
          </TreeNode>
        )
      } else {
        return (
          <TreeNode
            key={node.key}
            title={node.name}
            value={`${node.name}===${node.key}`}
          ></TreeNode>
        )
      }
    })

    const { placeholder, onChange, value, multiple } = this.props
    const { institutionTree } = this.state

    return (
      <TreeSelect
        showSearch
        style={{ width: '100%' }}
        value={value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder={placeholder}
        allowClear
        treeDefaultExpandAll
        onChange={onChange}
        multiple={multiple}
      >
        {
          renderTreeNodes(institutionTree)
        }
      </TreeSelect>
    );
  }
}

export default SingleOwnInstitution
