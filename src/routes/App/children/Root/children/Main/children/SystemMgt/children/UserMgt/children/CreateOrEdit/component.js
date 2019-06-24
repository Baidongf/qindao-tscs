import React from 'react'
import './component.scss'
import { Form, Row, Col, Select, Input, Button, Tree } from 'antd'
import queryString from 'query-string'
import { commonChangeHandler } from 'utils/antd'
import Popup from 'components/Popup'
import HzBreadcrumb from 'components/HzBreadcrumb'

const { Search } = Input
const { TreeNode } = Tree
const FormItem = Form.Item
const Option = Select.Option
const labelProps = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
}

class CreateOrEditFrom extends React.Component {
  constructor(props) {

    super(props)
    this.state = {

      userObj: {},

      // 是否显示机构弹窗
      popupVisible: false,

      // 树形选择器相关 state
      orgTreeData: [],
      expandedKeys: ['0-237'],
      autoExpandParent: true,
      selectedKeys: [],
      searchValue: '',

    }

    // 用于实现搜索功能的一维数组，保存的是树的节点数据
    this.dataList = []

    // 用于实现编辑前的数据填充
    this.savedDataList = []

    this.queryObj = queryString.parse(props.location.search)
    this.operation = this.queryObj.operation
    switch (this.operation) {
      case 'create': this.state.operationCnName = '添加'; break
      case 'edit': this.state.operationCnName = '编辑'; break
      default:
    }

    this.id = this.queryObj.id

    this.initStatus = this.queryObj.operation === 'edit'
    this.fieldsValidateStatus = {
      name: this.initStatus,
      sex: this.initStatus,

      userNo: this.initStatus,
      idNumber: this.initStatus,

      institutionName: this.initStatus,
      institutionId: this.initStatus,

      emplyPost: this.initStatus,
      status: this.initStatus,

      // groupName: this.initStatus,
      // firstBusiness: this.initStatus,


      phone: this.initStatus,
      // email: this.initStatus,
      roleIds: this.initStatus
    }

    // 在所属机构弹窗中预选择的项目（未点击确定键）
    this.selectedInstitutionName = ''
    this.selectedInstitutionId = 0

    this.searchOrgNameHandler = this.searchOrgNameHandler.bind(this)

    this.treeSearchHandler = this.treeSearchHandler.bind(this)
    this.treeExpandHandler = this.treeExpandHandler.bind(this)
    this.treeSelectHandler = this.treeSelectHandler.bind(this)
    this.popupCancelHandler = this.popupCancelHandler.bind(this)
    this.popupConfirmHandler = this.popupConfirmHandler.bind(this)
    this.institutionFocusHandler = this.institutionFocusHandler.bind(this)

  }

  searchOrgNameHandler(orgName) {
    const queryObj = {
      nameOrNo: orgName,
      pageNo: 1,
      pageSize: 1000
    }
    this.props.getOrgList(queryObj)
  }

  submitHandler() {
    const userObj = Object.assign({}, this.state.userObj)
    userObj.roleIds = !!userObj.roleIds ? `${userObj.roleIds}` : ''
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }
      if (this.operation === 'create') {
        this.props.saveUser(userObj, () => {
          this.props.history.goBack()
        })
      } else {
        this.props.updateUser(userObj, () => {
          this.props.history.goBack()
        })
      }
    })
  }

  valueChangeHandler(key, value) {
    commonChangeHandler(this, 'userObj', key, value)
    setTimeout(() => {
      this.validate(key)
    })
  }

  validate(fieldName) {
    this.props.form.validateFields([fieldName], { first: true }, (err, values) => {
      if (!err) {
        for (let key in values) {
          this.fieldsValidateStatus[key] = true
        }
      } else {
        for (let key in values) {
          this.fieldsValidateStatus[key] = false
        }
      }
      this.updateSubmitStatus(this.fieldsValidateStatus, 'canSubmit')
    })
  }

  updateSubmitStatus(fieldsValidateStatus, stateKey) {
    for (let key in fieldsValidateStatus) {
      if (!fieldsValidateStatus[key]) {
        this.setState({
          [stateKey]: false
        })
        // console.error(key + ': 验证未通过')
        // console.log(fieldsValidateStatus)
        return
      }
    }
    this.setState({
      [stateKey]: true
    })
  }

  componentWillMount() {

    this.props.getRoleList({ pageNo: 1, pageSize: 1000 })

    if (this.operation === 'edit') {
      this.props.getUserDetail(this.id)
    }

    this.props.getOrgList()

    this.props.getOrgTree()
  }

  componentDidMount() {
    if (this.operation === 'edit') {
    }
  }

  componentWillReceiveProps({ userDetail, orgList, orgTree, roleList }) {

    if (userDetail !== this.props.userDetail) {

      if (userDetail.roles) {
        userDetail.roleIds = []
        userDetail.roles.forEach((item, index) => {
          userDetail.roleIds.push(item.id)
        })
      }

      this.setState({
        userObj: { ...userDetail }
      })
    }

    if (orgList !== this.props.orgList) { }

    // 从后端获取到包含机构数据的树型结构
    if (orgTree !== this.props.orgTree) {
      const orgTreeArr = [orgTree]
      const orgTreeData = [...orgTreeArr]
      this.generateKeyForTree(orgTreeData)
      this.generateList(orgTreeData)
      this.setState({ orgTreeData })
    }

  }

  // 用户点击所属机构输入框
  institutionFocusHandler(ev) {
    ev.stopPropagation()
    ev.target.blur()
    this.setState({
      popupVisible: true
    })
  }

  // 树形选择器相关方法
  // 搜索
  treeSearchHandler(ev) {
    const that = this
    const searchValue = ev.target.value
    const dataList = this.dataList
    const treeData = this.state.orgTreeData
    const expandedKeys = dataList.map((item) => {
      if (searchValue && item.name.indexOf(searchValue) > -1) {
        return that.getParentKey(item.key, treeData)
      }
      return null
    }).filter((item, i, self) => item && self.indexOf(item) === i)

    // FIXME:自动定位到符合条件的第一个元素
    if (expandedKeys.length > 0) {
      const element = document.querySelector(`#node-${expandedKeys[0]}`)
    }

    this.setState({
      expandedKeys,
      searchValue,
      autoExpandParent: true,
    })
  }

  // 获取树中某个节点的父节点
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

  // 展开树
  treeExpandHandler(expandedKeys) {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    })
  }

  // 选择树节点
  treeSelectHandler(selectedKeys, info) {
    this.selectedInstitutionName = info.node.props.nodeName
    this.selectedInstitutionId = info.node.props.nodeId
    this.setState({ selectedKeys })
  }

  // 根据树形结构生成数据列表（一维数组），用于实现搜索功能
  generateList(data, type = '') {
    for (let i = 0; i < data.length; i++) {
      const node = data[i]
      const { key, name, id, } = node
      if (type === '') {
        this.dataList.push({ key, name, id, })
      } else {
        this.savedDataList.push({ key, name, id, })
      }

      if (node.children) {
        this.generateList(node.children, type)
      }
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
      data.key = preKey === '' ?
        `${data.parentId}-${data.id}` :
        `${preKey}-${data.id}`
      if (Array.isArray(data.children) && data.children.length > 0) {
        this.generateKeyForTree(data.children, data.key)
      }
    }
  }

  // 弹窗取消按钮
  popupCancelHandler() {
    this.setState({
      popupVisible: false
    })
  }

  // 弹窗确定按钮
  popupConfirmHandler() {
    const that = this
    const { selectedInstitutionName, selectedInstitutionId } = this
    const userObj = Object.assign({}, this.state.userObj, {
      institutionName: selectedInstitutionName,
      institutionId: selectedInstitutionId,
    })
    this.setState({
      userObj,
      popupVisible: false,
    })

    setTimeout(() => {
      if (selectedInstitutionName && selectedInstitutionId) {
        that.fieldsValidateStatus.institutionName = true
        that.fieldsValidateStatus.institutionId = true
      } else {
        that.fieldsValidateStatus.institutionName = true
        that.fieldsValidateStatus.institutionId = true
      }
      that.updateSubmitStatus(that.fieldsValidateStatus, 'canSubmit')
    }, 0)
  }


  render() {
    const { getFieldDecorator } = this.props.form

    const { roleList } = this.props
    const roleListData = roleList.data ? roleList.data : []

    const {
      popupVisible,
      orgTreeData,
      expandedKeys,
      autoExpandParent,
      selectedKeys,
      searchValue,
    } = this.state


    // 渲染树节点（机构树）
    const renderTreeNodes = (data) => data.map((item) => {
      const index = item.name.indexOf(searchValue)
      const beforeStr = item.name.substr(0, index)
      const afterStr = item.name.substr(index + searchValue.length)
      const title = index > -1 ? (
        <span>
          {beforeStr}
          <span style={{ color: '#f50' }}>{searchValue}</span>
          {afterStr}
        </span>
      ) : <span>{item.name}</span>

      if (item.children) {
        return (
          <TreeNode
            key={item.key}
            id={`node-${item.key}`}
            title={title}
            nodeId={item.id}
            nodeName={item.name}
          >
            {renderTreeNodes(item.children)}
          </TreeNode>
        )
      } else {
        return (
          <TreeNode
            id={`node-${item.key}`}
            key={item.key}
            title={title}
            nodeId={item.id}
            nodeName={item.name}
          />
        )
      }

    })


    return (
      <div className='userMgt-createOrEdit-component'>
        <div className='breadcrumb-rea'>
          <HzBreadcrumb />
        </div>
        <div className='main-body'>
          <Form className='form'>
            <div className='form-content'>
              <div className='form-title'>
                <span className='text'>{this.state.operationCnName}用户</span>
              </div>
              <div className='form-body'>
                <Row gutter={8}>
                  <Col span={12}>
                    <FormItem label='姓名' {...labelProps}>
                      {getFieldDecorator('name', {
                        rules: [
                          { required: true, message: '请输入姓名' },
                          { max: 20, message: '不能超过20字' },
                          { whitespace: true, message: '内容不能为空' },
                        ],
                        initialValue: this.state.userObj.name
                      })(
                        <Input placeholder='请输入姓名'
                          span={12}
                          onChange={this.valueChangeHandler.bind(this, 'name')}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label='性别' {...labelProps}>
                      {getFieldDecorator('sex', {
                        rules: [{ required: true, message: '请选择性别' }],
                        initialValue: this.state.userObj.sex
                      })(
                        <Select placeholder='请选择性别'
                          onChange={this.valueChangeHandler.bind(this, 'sex')}
                        >
                          <Option key={'1'}>男</Option>
                          <Option key={'2'}>女</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label='工号' {...labelProps}>
                      {getFieldDecorator('userNo', {
                        rules: [
                          { required: true, message: '请输入工号' },
                          { max: 20, message: '不能超过20字' },
                          { whitespace: true, message: '内容不能为空' },
                        ],
                        initialValue: this.state.userObj.userNo
                      })(
                        <Input placeholder='请输入工号'
                          onChange={this.valueChangeHandler.bind(this, 'userNo')}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label='身份证号' {...labelProps}>
                      {getFieldDecorator('idNumber', {
                        rules: [
                          { required: true, message: '请输入身份证号' },
                          { max: 18, message: '请输入18位身份证号' },
                          { min: 18, message: '请输入18位身份证号' },
                          { whitespace: true, message: '内容不能为空' },
                        ],
                        initialValue: this.state.userObj.idNumber
                      })(
                        <Input placeholder='请输入身份证号'
                          type='number'
                          onChange={this.valueChangeHandler.bind(this, 'idNumber')}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <div className='row-line-gap'></div>
                <Row>
                  <Col span={12}>
                    <FormItem label='所属机构' {...labelProps}>
                      {getFieldDecorator('institutionName', {
                        rules: [{ required: true, message: '请选择所属机构' }],
                        initialValue: this.state.userObj.institutionName
                      })(
                        <Input
                          placeholder='请选择所属机构'
                          onFocus={this.institutionFocusHandler}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label='状态' {...labelProps}>
                      {getFieldDecorator('status', {
                        rules: [{ required: true, message: '请选择状态' }],
                        initialValue: this.state.userObj.status
                      })(
                        <Select placeholder='请选择状态'
                          onChange={this.valueChangeHandler.bind(this, 'status')}
                        >
                          <Option key={'1'}>有效</Option>
                          <Option key={'0'}>无效</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>

                <Row>
                  <Col span={12}>
                    <FormItem label='岗位' {...labelProps}>
                      {getFieldDecorator('emplyPost', {
                        rules: [
                          { required: true, message: '请输入岗位' },
                          { whitespace: true, message: '内容不能为空' },
                        ],
                        initialValue: this.state.userObj.emplyPost
                      })(
                        <Input placeholder='请输入岗位'
                          onChange={this.valueChangeHandler.bind(this, 'emplyPost')}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label='擅长业务' {...labelProps}>
                      {getFieldDecorator('firstBusiness', {
                        rules: [
                          { whitespace: true, message: '内容不能为空' },
                        ],
                        initialValue: this.state.userObj.firstBusiness
                      })(
                        <Input placeholder='请输入擅长业务'
                          onChange={this.valueChangeHandler.bind(this, 'firstBusiness')}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label='所属团队' {...labelProps}>
                      {getFieldDecorator('groupName', {
                        rules: [
                          { max: 20, message: '不能超过20字' },
                          { whitespace: true, message: '内容不能为空' },
                        ],
                        initialValue: this.state.userObj.groupName
                      })(
                        <Input placeholder='请输入所属团队'
                          onChange={this.valueChangeHandler.bind(this, 'groupName')}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label='邮箱' {...labelProps}>
                      {getFieldDecorator('email', {
                        rules: [
                          { type: 'email', message: '邮箱格式有误!' },
                          { whitespace: true, message: '内容不能为空' },
                        ],
                        initialValue: this.state.userObj.email
                      })(
                        <Input placeholder='请输入邮箱'
                          onChange={this.valueChangeHandler.bind(this, 'email')}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <div className='row-line-gap'></div>
                <Row>
                  <Col span={12}>
                    <FormItem label='手机' {...labelProps}>
                      {getFieldDecorator('phone', {
                        rules: [
                          { required: true, message: '请输入手机' },
                          { max: 11, message: '请输入11位手机号' },
                          { min: 11, message: '请输入11位手机号' },
                          { whitespace: true, message: '内容不能为空' },
                        ],
                        initialValue: this.state.userObj.phone
                      })(
                        <Input placeholder='请输入手机'
                          onChange={this.valueChangeHandler.bind(this, 'phone')}
                          type='number'
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label='所属角色' {...labelProps}>
                      {getFieldDecorator('roleIds', {
                        rules: [{ required: true, message: '请输入所属角色' }],
                        initialValue: this.state.userObj.roleIds
                      })(
                        <Select placeholder='请输入所属角色'
                          // mode='multiple'
                          onChange={this.valueChangeHandler.bind(this, 'roleIds')}
                        >
                          {
                            roleListData.map(roleObj => {
                              return <Option key={roleObj.id} value={roleObj.id}>{roleObj.name}</Option>
                            })
                          }
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </div>
            </div>
          </Form>
          <div className='btns-area clearfix'>

            <Button
              className='btn-submit  '
              type='primary'
              onClick={this.submitHandler.bind(this)}
              // disabled={!this.state.canSubmit}
            >
              {(!this.operation || this.operation === 'create') ? '确定' : '保存'}
            </Button>

            <Button className='btn-cancel'
                    style={{marginRight:8}}
              onClick={() => { this.props.history.goBack() }}
            >取消</Button>


          </div>

          <div>
            <Popup
              className='institution-popup'
              visible={popupVisible}
              title='所属机构'
              width='360'
              bodyStyle={{ width: '360px' }}
              onCancel={this.popupCancelHandler}
              onOk={this.popupConfirmHandler}
            >
              <Search
                placeholder='请输入机构名搜索'
                onChange={this.treeSearchHandler}
              />
              <div className='tree-container' id='treeContainer'>
                {
                  orgTreeData.length > 0 ?
                    (<Tree
                      multiple={false}
                      expandedKeys={expandedKeys}
                      autoExpandParent={autoExpandParent}
                      defaultExpandAll={true}
                      selectedKeys={selectedKeys}
                      onExpand={this.treeExpandHandler}
                      onSelect={this.treeSelectHandler}
                    >
                      {renderTreeNodes(orgTreeData)}
                    </Tree>) : <span>机构加载中...</span>
                }
              </div>
            </Popup>
          </div>

        </div>
      </div>
    )
  }
}
const CreateOrEdit = Form.create()(CreateOrEditFrom)
export default CreateOrEdit
