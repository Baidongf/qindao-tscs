import React from 'react'
import './component.scss'

import {Tabs} from 'antd'


import HzBreadcrumb from 'components/HzBreadcrumb'
import Loadable from 'react-loadable'
import RouteLoading from 'components/RouteLoading'
import {checkPermission} from "../../../../../../../../../../utils/permission";

const AllList = Loadable({
  loader: () => import('../children/List'),
  loading: RouteLoading
})

const CollectionList = Loadable({
  loader: () => import('../children/CollectionList'),
  loading: RouteLoading
})
const ManageList = Loadable({
  loader: () => import('../children/ManageList'),
  loading: RouteLoading
})
const TabPane = Tabs.TabPane

class Home extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  allListHandler = () => {
    this.collectionList.searchHandler()
  }

  collectionListHandler = () => {
    this.allList.searchHandler()
  }
  changeTab = (activityKey) => {
    this.props.setTabKey(activityKey)
  }

  render() {
    // 根据用户的权限情况生成保存所有 tabKey 的数组，以便取到第一个存在的标签页的 key
    const tabPaneKeys = []
    if (checkPermission("knowledge/organization")) {
      tabPaneKeys.push('1')
    }
    if (checkPermission("knowledge/individual")) {
      tabPaneKeys.push('2')
    }
    if (checkPermission("knowledge/mycollect")) {
      tabPaneKeys.push('3')
    }
    return (
      <div className='knowledge-home-component'>
        <HzBreadcrumb/>
        <div className='hz-tabs'>
          <Tabs onChange={this.changeTab.bind(this)} animated={false} defaultActiveKey={tabPaneKeys[0]}>
            {checkPermission("knowledge/organization") && <TabPane tab="机构知识库" key="1">
              <ManageList/>
            </TabPane>}
            {checkPermission("knowledge/individual") && <TabPane tab="个人知识库" key="2">
              <AllList
                onRef={(ref) => {
                  this.allList = ref
                }}
                allListHandler={this.allListHandler}
              ></AllList>
            </TabPane>}
            {checkPermission("knowledge/mycollect") && <TabPane tab="我的收藏" key="3">
              <CollectionList
                onRef={(ref) => {
                  this.collectionList = ref
                }}
                collectionListHandler={this.collectionListHandler}
              ></CollectionList>
            </TabPane>}
            {/*<TabPane tab="知识库" key="1">*/}
            {/*  <AllList*/}
            {/*    onRef={(ref) => {*/}
            {/*      this.allList = ref*/}
            {/*    }}*/}
            {/*    allListHandler={this.allListHandler}*/}
            {/*  ></AllList>*/}
            {/*</TabPane>*/}
            {/*<TabPane tab="我的收藏" key="2">*/}
            {/*  <CollectionList*/}
            {/*    onRef={(ref) => {*/}
            {/*      this.collectionList = ref*/}
            {/*    }}*/}
            {/*    collectionListHandler={this.collectionListHandler}*/}
            {/*  ></CollectionList>*/}
            {/*</TabPane>*/}
          </Tabs>
        </div>
      </div>
    )
  }
}

export default Home
