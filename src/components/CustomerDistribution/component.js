import React from 'react'
import {Modal, Button, Select, Input, Icon} from 'antd';
import './component.scss'
import {isEmptyValue} from 'utils/common.js'

let Option = Select.Option

class CustomerDistribution extends React.Component {
  state = {
    visible: false,
    customerList: [
      {
        orgId: undefined,
        manageId: undefined,
        managerList: [],
        ratio: undefined
      },
    ],
    orgList: [],
    totalRatio: 0, //比例总和
  }


  componentDidMount() {
    // this.props.onRef(this)
    this.props.getManagerTree((data) => {
      this.setState({
        orgList: this.managerTreeToArr(data)
      })
    })
  }

  /* TODO: 提供初始化 客户经理列表方法(根据账户或者公司)*/
  initCustomerList = () => {

  }

  reset = () => { //重置组件
    this.setState({
      visible: false,
      customerList: [
        {
          orgId: undefined,
          manageId: undefined,
          managerList: [],
          ratio: undefined
        },
      ],
      totalRatio: 0, //比例总和
    })
  }

  managerTreeToArr = (root) => {
    let result = []
    result.push(root)
    let step = (arr) => {
      arr.forEach(item => {
        result.push(item)
        item.children && step(item.children)
      })
    }
    root.children && step(root.children)
    return result
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = (e) => {
    this.setState({
      visible: false,
    });
    this.props.handleOk && this.props.handleOk(this.state.customerList) // 回调暴露用户经理list
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
    this.props.handleCancel && this.props.handleCancel()
  }


  handleOrgChange = (value, index, key) => { // 选择机构
    this.props.getManagerListById(value, (data) => {
      let preCustomerList = this.state.customerList.slice()
      preCustomerList[index]['managerList'] = data.data
      preCustomerList[index].orgId = value
      this.setState({
        customerList: preCustomerList
      })
    })
  }

  handleSearch = (value, option) => { //下拉框搜索处理
    return option.props.children.indexOf(value) >= 0
  }

  handleManagerChange = (value, index, key) => { //选择客户经理
    let preCustomerList = this.state.customerList.slice()
    preCustomerList[index].manageId = value
    this.setState({
      customerList: preCustomerList
    })
  }

  handleRatio = (value, index) => {
    let preCustomerList = this.state.customerList.slice()
    preCustomerList[index].ratio = value.target.value
    let total = 0
    this.state.customerList.forEach((item) => {
      total += parseInt(item.ratio)
    })
    this.setState({
      customerList: preCustomerList,
      totalRatio: total
    })
  }

  handleAddManage = () => {
    this.setState({
      customerList: this.state.customerList.concat({
        orgId: undefined,
        manageId: undefined,
        managerList: [],
        ratio: undefined
      },)
    })
  }

  handleDleManage = (index) => { //删除
    if (this.state.customerList.length === 1) return
    let preCustomerList = this.state.customerList.slice()
    preCustomerList.splice(index, 1)
    let total = 0
    preCustomerList.forEach((item) => {
      total += parseInt(item.ratio)
    })
    this.setState({
      customerList: preCustomerList,
      totalRatio: total
    })
  }

  render() {
    return (
      <div>
        <Modal
          title={this.props.type === 'account' ? '账户分配' : '客户分配'}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          className='customer-distribution'
        >
          <div className='customer-info'>
            <div className='item'>
              <span className='label'>客户名称</span>
              <Input className='name' value={this.props.customerName} disabled></Input>
            </div>
            <div className='item'>
              <span className='label'>客户编号</span>
              <Input className='name' disabled value={this.props.customerNo}></Input>
            </div>
          </div>

          <div className='manager'>
            <div className='left'>客户经理</div>
            <div className='right'>
              {this.state.customerList.map((item, index) => {
                return (
                  <div className='select-item' key={index}>
                    <Select
                      placeholder='请选择机构'
                      onChange={(value) => {
                        this.handleOrgChange(value, index, 'orgId')
                      }}
                      value={item.orgId}
                      showSearch
                      filterOption={this.handleSearch}
                    >
                      {this.state.orgList.map((org) => {
                        return (
                          <Option value={org.id} key={org.id}>{org.name}</Option>
                        )
                      })}
                    </Select>
                    <Select placeholder='请选择客户经理'
                            onChange={(value) => {
                              this.handleManagerChange(value, index, 'manageId')
                            }}
                            disabled={item.managerList.length <= 0}
                            value={item.manageId}
                            showSearch
                            filterOption={this.handleSearch}
                    >
                      {item.managerList.map(manage => {
                        return (
                          <Option value={manage.id} key={manage.id}>{manage.name}</Option>
                        )
                      })}
                    </Select>
                    <Input type='number'
                           value={item.ratio}
                           placeholder='请输入分配比例'
                           onChange={(value) => {
                             this.handleRatio(value, index,)
                           }}
                           style={{display: this.props.type === 'account' ? 'inline-block' : 'none'}}
                    />
                    <p className='close'
                       style={{display: this.state.customerList.length > 1 ? 'block' : 'none'}}
                       onClick={(index) => {
                         this.handleDleManage(index)
                       }}
                    />

                  </div>
                )
              })}
              <div className='ratio-err' style={{display: this.state.totalRatio > 100 ? 'block' : 'none'}}>
                比例总和超过100%，请重新输入
              </div>
              <div className='add-btn' onClick={this.handleAddManage}>
                <p className='add-img'></p>
                <span className='add-label'>添加客户经理</span>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default CustomerDistribution
