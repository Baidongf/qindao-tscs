import React from 'react'
import './component.scss'
import Popup from 'components/Popup'

import OpenAccountTime from './children/OpenAccountTime'
import ProvinceArea from './children/ProvinceArea'
import Category from './children/Category'
import OperateRange from './children/OperateRange'
import OperateStatus from './children/OperateStatus'
import RegisterTime from './children/RegisterTime'
import RegisterCapital from './children/RegisterCapital'
import SelectedTags from './children/SelectedTags'

class AdvancedFilter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      popupVisible: false,
    }

    this.showCustomPopup = this.showCustomPopup.bind(this)

    this.handleCancel = this.handleCancel.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
  }

  showCustomPopup() {
    this.setState({ popupVisible: true })
  }

  handleCancel(e) {
    e.stopPropagation()
    this.setState({ popupVisible: false })
  }

  handleConfirm(e) {
    e.stopPropagation()
    this.setState({ popupVisible: false })
  }

  render() {
    const {
      popupVisible,
    } = this.state

    return (
      <div className='custMgt-button-component'>
        <Popup
          visible={popupVisible}
          title={'高级筛选'}
          width={824}
          onCancel={this.handleCancel}
          onOk={this.handleConfirm}
          className='advanced-filter-popup'
        >
          <div className='advancedFilter-content'>

            <div className='select-area'>
              {/* 开户时间 */}
              <OpenAccountTime />

              {/* 省份地区 */}
              <ProvinceArea />

              {/* 行业分类 */}
              <Category />

              {/* 经营范围 */}
              <OperateRange />

              {/* 经营状态 */}
              <OperateStatus />

              {/* 注册时间 */}
              <RegisterTime />

              {/* 注册资本 */}
              <RegisterCapital />

            </div>

            {/* 已选条件 */}
            <SelectedTags />
          </div>
        </Popup>
        <div onClick={this.showCustomPopup} className='wording'>
          <span>高级筛选</span>
          <span className='triangle'></span>
        </div>
      </div>
    )
  }
}

export default AdvancedFilter
