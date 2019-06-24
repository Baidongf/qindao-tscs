import React from 'react'
import './component.scss'
import { Table } from 'antd'
import Loadable from 'react-loadable'
import RouteLoading from 'components/RouteLoading'

const RelateBusinessPopup = Loadable({
  loader: () => import('components/RelateBusinessPopup'),
  loading: RouteLoading
})

class Business extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: [{
        title: '商机名称',
        className: 'first-column',
        key: 'name',
        dataIndex: 'name',
      }, {
        title: '客户名称',
        key: 'customerName',
        dataIndex: 'customerName',
      }, {
        title: '客户类型',
        key: 'type',
        dataIndex: 'type',
      }, {
        title: '商机状态',
        key: 'status',
        dataIndex: 'status',
      }, {
        title: '跟进人',
        key: 'follower',
        dataIndex: 'follower',
      }]
    }

    this.isCustomerManager = null

    this.showBusinessPopup = this.showBusinessPopup.bind(this)
    this.getRelatedBusinessList = this.getRelatedBusinessList.bind(this)
  }

  componentWillMount() {
    const { columns } = this.state
    const isCustomerManager = localStorage.getItem('IS_CUSTOMER_MANAGER')
    this.isCustomerManager = isCustomerManager

    if (isCustomerManager === '1') {
      this.setState({
        columns: [...columns, {
          title: '操作',
          render: (text, record, index) => {
            return (
              <span
                className='delete-btn'
                onClick={() => {
                  const { relateKey } = this.props
                  const { id } = record
                  this.props.unRelateBusinessWithDynamic({
                    companyDynamicKey: relateKey,
                    businessChanceId: id,
                  }, () => {
                    this.getRelatedBusinessList()
                  })
                }}
              ></span>
            )
          }
        }]
      })
    }
  }

  getRelatedBusinessList() {
    const { relateKey } = this.props
    this.props.getDynamicRelatedBusinessList(relateKey)
  }

  componentDidMount() {
    this.getRelatedBusinessList()
  }

  showBusinessPopup() {
    this.businessRef.showPopup()
  }

  render() {
    const { isCustomerManager } = this
    const { columns } = this.state
    const { relateKey, dynamicRelatedBusinessList } = this.props

    return (
      <div className='business-component'>
        <div className='panel-title'>
          <span>关联商机</span>
          {
            isCustomerManager === '1' ?
            <span
              className='relate-button'
              onClick={this.showBusinessPopup}
            >关联商机</span> : null
          }
        </div>

        {
          isCustomerManager === '1' ?
          <RelateBusinessPopup
            onRef={(ref) => { this.businessRef = ref }}
            relateKey={relateKey}
            confirmCallback={this.getRelatedBusinessList}
          /> : null
        }

        <div className='content'>
          <Table
            rowKey='id'
            columns={columns}
            dataSource={dynamicRelatedBusinessList.data}
            pagination={false}
          />
        </div>
      </div>
    )
  }
}

export default Business
