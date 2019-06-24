import React from 'react'
import './component.scss'
import { Table } from 'antd'

class AssetForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}

    this.columns = [
      {
        title: '资产',
        dataIndex: 'itemName',
        key: 'itemName',
        className: 'first-column',
        render: (value) => {
          return (
            <span
              dangerouslySetInnerHTML={{ __html: value }}
            ></span>
          )
        }
      }, {
        title: '行次',
        dataIndex: 'itemLineMinor',
        key: 'itemLineMinor',
      }, {
        title: '年初余额',
        dataIndex: 'termBeginVal',
        key: 'termBeginVal',
      }, {
        title: '期末余额',
        dataIndex: 'termEndVal',
        key: 'termEndVal',
      }
    ]
  }

  componentDidMount() {
    const { companyKey, term, period } = this.props
    this.props.getAssetList(companyKey, period, term)
  }

  render() {
    const { columns } = this
    const { customerAssetList } = this.props

    return (
      <div className='asset-form-component'>
        <Table
          rowKey='objectKey'
          className='asset-form-table'
          columns={columns}
          dataSource={customerAssetList}
          pagination={false}
        />
      </div>
    )
  }
}

export default AssetForm
