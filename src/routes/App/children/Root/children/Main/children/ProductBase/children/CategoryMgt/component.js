import React from 'react'
import {Form, Input, message, Modal, Tree} from 'antd'
import {commonChangeHandler} from 'utils/antd'
import HzBreadcrumb from 'components/HzBreadcrumb'
import './component.scss'
import {checkPermission} from "../../../../../../../../../../utils/permission";

const {TreeNode} = Tree;

const PAGE_SIZE = 10

class CreateOrEditFrom extends React.Component {
  constructor(props) {

    super(props)
    this.state = {
      categoryObj: {
        "name": "",
        "parentId": undefined,
      },
      allList: [],
      currentList: [],
      currentEdit: null,
      treeData: [],
      visible: false,
      updateParams: {
        id: '',
        name: '',
        parentId: ''
      }
    }

    this.columns = [
      {
        title: '一级分类',
        dataIndex: 'parentName',
        width: 190,
        render: (value, row, index) => {
          return (<span title={value}>{value}</span>)
        }
      },
      {
        title: '二级分类',
        dataIndex: 'name',
        width: 190,
        render: (value, row, index) => {
          return (<span title={value}>{value}</span>)
        }
      },
      {
        title: '操作',
        width: 190,
        render: (value, row, index) => {
          return (<div className='operation'>
            {checkPermission("productCategory/update") && <span onClick={() => {
              this.edit(row)
            }}>编辑</span>}
            {checkPermission("productCategory/delete") && <span onClick={() => {
              this.deleteHandler(row)
            }}>删除</span>}
          </div>)
        }
      },
    ]

    this.pagination = {
      showQuickJumper: true,
      total: 0,
      current: 1,
      pageSize: PAGE_SIZE,
      onChange: (page, pageSize) => {
        this.pagination.current = page
        this.setState({currentList: this.state.allList.slice(PAGE_SIZE * (page - 1), PAGE_SIZE * page)})
      }
    }

  }

  valueChangeHandler(key, value) {
    commonChangeHandler(this, 'categoryObj', key, value)
  }

  submitHandler = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }
      this.props.saveCategory(this.state.categoryObj, () => {
        message.success('新建二级分类成功')
      })
    })
  }

  confirm = () => {
    this.props.updateCategory(this.state.updateParams, () => {
      message.success('更新成功')
      this.state.currentEdit.name = this.state.updateParams.name
      let treeData = []
      Object.assign(treeData, this.state.treeData)
      treeData.map((pItem, index) => {
        let res = pItem.childrens.map(cItem => {
          if (cItem.id === this.state.updateParams.id) {
            cItem.name = this.state.updateParams.name
          }
          return cItem
        })
        treeData[index].childrens = res
      })
      this.setState({
        visible: false,
        currentList: [...this.state.currentList],
        treeData
      })
    })
  }

  hideModal = () => {
    this.setState({
      visible: false
    })
  }

  edit = (item, parentName) => {
    this.setState({
      currentEdit: {...item, parentName},
      visible: true,
      updateParams: {name: item.name, id: item.id, parentId: item.parentId}
    })
  }

  deleteHandler = (item) => {

    message.success('删除成功')
    this.props.deleteCategory(item.id, () => {
      let treeData = []
      Object.assign(treeData, this.state.treeData)
      treeData.map((pItem, index) => {
        let res = pItem.childrens.filter(cItem => {
          return cItem.id !== item.id
        })
        treeData[index].childrens = res
      })
      this.setState({
        treeData
      })
    })
  }

  secondChange = e => {
    let str = e.target.value
    this.setState({
      updateParams: {id: this.state.currentEdit.id, name: str, parentId: this.state.currentEdit.parentId}
    })
  }

  componentWillMount() {
    this.props.getCatList()
  }

  componentDidMount() {
  }

  componentWillReceiveProps({catList}) {
    if (this.props.catList !== catList) {
      // let result = []
      // catList.data.forEach(parent => {
      //   parent.childrens.forEach(child => {
      //     child.parentName = parent.name
      //     result.push(child)
      //   })
      // })
      //
      // this.setState({ allList: result })
      // this.setState({ currentList: result.slice(0, PAGE_SIZE) })
      // this.pagination.total = result.length

      this.setState({
        treeData: catList.data
      })
    }
  }

  render() {
    const {getFieldDecorator} = this.props.form
    const {treeData} = this.state

    return (
      <div className='category-mgt'>
        <HzBreadcrumb/>
        <div className='breadcrumb-rea'></div>
        <div className='main-body'>
          {checkPermission("productCategory/save") && <div className='form-title'>
            <span className='text'>新增产品目录</span>
            <div className='btn' onClick={() => {
              this.props.history.push('/root/main/productBase/addCategory')
            }}>目录管理
            </div>
          </div>}
          {treeData.length > 0 && <Tree
            defaultExpandAll
          >
            {
              treeData.map((item) => {
                // item.childrens
                return (<TreeNode title={item.name} key={item.path}>
                  {
                    item.childrens.map((itemc) => {
                      return (
                        <TreeNode title={
                          <div style={{width: 700, display: "flex", justifyContent: "space-between"}}>
                            <span>{itemc.name}</span>
                            <div className='operation'>
                              {checkPermission("productCategory/update") && <span onClick={() => {
                                this.edit(itemc, item.name)
                              }}>编辑</span>}
                              {checkPermission("productCategory/delete") && <span onClick={() => {
                                this.deleteHandler(itemc)
                              }}>删除</span>}
                            </div>
                          </div>
                        } key={itemc.path}/>
                      )
                    })
                  }
                </TreeNode>)
              })
            }
          </Tree>}


          {/*<Table*/}
          {/*  columns={this.columns}*/}
          {/*  bordered*/}
          {/*  dataSource={this.state.currentList}*/}
          {/*  pagination={this.pagination.total > 1 ? this.pagination : false}*/}
          {/*/>*/}

          <Modal
            title="编辑二级分类"
            visible={this.state.visible}
            onOk={this.confirm}
            onCancel={this.hideModal}
            okText="确认"
            cancelText="取消"
          >
            <div className='modal-item clearfix'>
              <span className='label'>一级分类</span>
              <Input value={this.state.currentEdit && this.state.currentEdit.parentName} disabled={true}
                     className='input'/>
            </div>
            <div className='modal-item clearfix'>
              <span className='label'>二级分类</span>
              <Input value={this.state.updateParams.name}
                     placeholder='请输入二级分类名称'
                     className='input'
                     onChange={(e) => {
                       this.secondChange(e)
                     }}
              />

            </div>

          </Modal>
        </div>
      </div>
    )
  }
}

const CreateOrEdit = Form.create()(CreateOrEditFrom)
export default CreateOrEdit
