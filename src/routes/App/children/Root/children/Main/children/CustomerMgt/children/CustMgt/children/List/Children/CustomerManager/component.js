import React from 'react'
import '../OwnInstitution/component.scss'
import Popup from 'components/Popup'
import SearchableTree from 'components/SearchableTree'
import { Button } from 'antd'

class CustomerManager extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }


  render() {

    return (
      <div className='organ-button-component'>
        <Popup
          visible={false}
          title='客户经理'
          width='530'
        >
          <div className='institution-object'>
            <div className='institution-list'>
              <SearchableTree
                treeData={[]}
              />
            </div>

            {/* 已选择项展示区域 */}
            <div className='institution-show'>
              <div className='finally-selected'>
                <span className='selected-objects'>已选对象</span>
                <span className='selected-number'>123</span>
                <span className='selected-clear'>清空</span>
              </div>

              <div className='selected-content-show'>
                <div className='dynamic-nodeTitle'>kkkyrieliu</div>
                <div className='dynamic-nodeTitle'>kyrieliu02</div>
              </div>
            </div>

          </div>
        </Popup>

        <Button>客户经理</Button>

      </div>
    )
  }

}

export default CustomerManager
