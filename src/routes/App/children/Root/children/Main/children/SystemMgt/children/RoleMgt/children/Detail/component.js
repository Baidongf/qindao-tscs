import React from 'react'
import './component.scss'
import { Tree, Button } from 'antd'
import HzBreadcrumb from 'components/HzBreadcrumb'
const { TreeNode } = Tree

class Detail extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      expandedKeys: [],
      autoExpandParent: true,

      roleName: '',
      roleStatus: '',
      roleRemark: '',
      rolePermissionTree: [],
    }

    this.expandHandler = this.expandHandler.bind(this)
    this.filterTree = this.filterTree.bind(this)
  }

  expandHandler(expandedKeys) {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    })
  }

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

  // 过滤掉 Tree 中 checked 为 'false' 的项目（注意，后端定义这里是 String， 不是 Boolean）
  filterTree(item) {
    const that = this
    if (item.children && item.children.length > 0) {
      item.children = item.children.filter(that.filterTree)
      return true
    } else if (item.checked) {
      return item.checked === 'true'
    } else {
      return false
    }
  }

  componentWillMount() {
    const roleId = this.props.match.params.roleId
    this.props.getRoleDetail(roleId)
  }

  componentWillReceiveProps({ roleDetail }) {
    const that = this
    if (roleDetail !== this.props.roleDetail) {

      const treeData = roleDetail.resoList
      this.generateKeyForTree(treeData)
      const rolePermissionTree = treeData.filter(that.filterTree)

      this.setState({
        roleName: roleDetail.name,
        roleStatus: roleDetail.enabledFlag,
        roleRemark: roleDetail.remark,
        rolePermissionTree,
      })
    }
  }

  render() {
    const {
      roleName,
      roleStatus,
      roleRemark,
      rolePermissionTree,
    } = this.state


    // 渲染树的子节点
    const renderTreeNodes = (data) => data.map((item) => {
      const title = item.title
      if (item.children) {
        return (
          <TreeNode key={item.key} title={title}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      } else {
        return <TreeNode key={item.key} title={title} />;
      }
    })


    return (
      <div className='role-detail-component'>
        <HzBreadcrumb />

        <div className='role-detail-container'>
          <div className='item input-container'>
            <div className='title'>角色详情</div>
            <div className='content'>
              <span className='content-item input-title'>角色名称</span>
              <span className='content-item input-content'>{roleName}</span>
            </div>
            <div className='content'>
              <span className='content-item input-title'>角色状态</span>
              <span className='content-item input-content'>
                {parseInt(roleStatus) === 1 ? '有效' : '无效'}
              </span>
            </div>
            <div className='content'>
              <span className='content-item input-title'>角色备注</span>
              <span className='content-item input-content'>{roleRemark}</span>
            </div>
          </div>

          <div className='item tree-select-container'>
            <div className='tree-title'>角色已配置权限</div>

            <div className='tree-container'>
              {rolePermissionTree && rolePermissionTree.length > 0 ?
                <Tree
                  defaultExpandAll={true}
                >
                  {renderTreeNodes(rolePermissionTree)}
                </Tree>
                : ''
              }
            </div>
          </div>

          <div className='button-container'>
            <Button
              onClick={() => { this.props.history.goBack() }}
            >返回</Button>
          </div>
        </div>
      </div>

    )
  }
}


export default Detail
