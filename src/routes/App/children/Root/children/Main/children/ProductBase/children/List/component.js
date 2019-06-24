import React from 'react'
import './component.scss'
import {
  Input,
  Button,
  TreeSelect,
  Row,
  Col,
  Tree,
  Icon,
  Pagination
} from 'antd'
import HzLink from 'components/HzLink'

import HzBreadcrumb from 'components/HzBreadcrumb'

import {commonChangeHandler} from 'utils/antd'
import gou from './image/gou.png'
import productListIcon from './image/product-img.png'
import {Link} from "react-router-dom";
import {checkPermission} from "../../../../../../../../../../utils/permission";

const PAGE_SIZE = 10
const Search = Input.Search
const FILTER_INIT_VALUES = {
  "nameOrCode": undefined,
  "pageNo": 1,
  "pageSize": PAGE_SIZE,
  "productCategoryId": undefined,
  "type": undefined
}
const TreeNode = TreeSelect.TreeNode;


class List extends React.Component {

  // 成员属性、状态的声明，均在构造函数内部
  constructor(props) {
    super(props)

    this.state = {
      filterObj: {
        ...FILTER_INIT_VALUES
      },
      expandedKeys: [],
      categorySearchStr: '',
      current: 1,
      total: 10,
      cateList: []
    }


  }

  valueChangeHandler(key, value) {
    commonChangeHandler(this, 'filterObj', key, value)
  }

  searchHandler(pageNo = 1) {
    this.setState({
      current: pageNo,
      filterObj: Object.assign(this.state.filterObj, {pageNo: pageNo})
    })
    this.props.getCatList(this.state.filterObj)
    this.props.getProdList(this.state.filterObj)
  }

  resetHandler() {
    this.setState({
      filterObj: {
        ...FILTER_INIT_VALUES
      }
    })
  }

  onSelect = (selectedKeys, e) => {
    this.valueChangeHandler('nameOrCode', "")
    this.setState({
      filterObj: Object.assign(this.state.filterObj, {
        productCategoryId: parseInt(selectedKeys[0])
      })
    },()=>{
      this.searchHandler()
    })
  }

  categorySearch = (a, b) => {
    let str = a.target.value
    if (this.categorySearchTimer) {
      clearTimeout(this.categorySearchTimer)
    }
    this.categorySearchTimer = setTimeout(() => {
      let keys = []
      let step = (arr) => {
        arr.forEach(item => {
          if (item.name.indexOf(str) >= 0) {
            keys = [...keys, ...item.path.split(',')]
          }
          item.childrens && step(item.childrens)
        })
      }
      keys = keys.map(key => parseInt(key))
      step(this.props.catList.data)
      this.setState({
        expandedKeys: keys,
        categorySearchStr: str
      })
    }, 300)
  }

  renderTreeNodes(data) {
    let renderTitle = (item) => {
      const index = item.name.indexOf(this.state.categorySearchStr);
      const beforeStr = item.name.substr(0, index);
      const afterStr = item.name.substr(index + this.state.categorySearchStr.length);
      const title = index > -1 ? (
        <span>
          {beforeStr}
          <span style={{color: '#d24545'}}>{this.state.categorySearchStr}</span>
          {afterStr}
        </span>
      ) : <span>{item.name}</span>;
      return (<div className='tree-node-title clearfix'>
        <p>{title}</p>
        {this.state.filterObj.productCategoryId === item.id && <img src={gou}/>}
      </div>)
    }
    let step = (arr) => {
      return arr.map(item => {
        return (
          //{/*<TreeNode title={renderTitle(item)} key={item.id} selectable={!item.childrens || item.childrens.length === 0}>*/}
          <TreeNode title={renderTitle(item)} key={item.id}>
            {step(item.childrens)}
          </TreeNode>
        )
      })
    }
    return step(data)
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
    });
  }

  goAdd = () => {
    this.props.history.push('/root/main/productBase/createOrEdit?operation=create')
  }

  goDetail = (item) => {
    this.props.history.push('/root/main/productBase/detail?id=' + item.id)
  }

  getFirstCategoryName = (item) => {
    let first = this.state.cateList.filter(cate => {
      return cate.id == item.productCategoryId
    })
    first = first[0] || {}
    if (first.parentId) {
      first = this.state.cateList.filter(cate => {
        return cate.id == first.parentId
      })
    }
    first = first[0] || {}
    return first.name
  }

  componentWillMount() {
    this.props.getCatList()
    this.props.getProdList()
  }

  componentDidMount() {
    this.searchHandler()
  }

  componentWillReceiveProps({prodList, catList}) {
    if (this.props.prodList !== prodList) {
      prodList.data.forEach((item, index) => {
        item.key = index
      })
      this.setState({
        total: prodList.total
      })
    }

    if (catList !== this.props.catList) {
      let result = []
      let step = (arr) => {
        arr.forEach(item => {
          result.push(item)
          item.childrens && step(item.childrens)
        })
      }
      step(catList.data)
      this.setState({
        cateList: result
      })
    }

  }

  render() {
    let {catList, prodList} = this.props
    // const IS_CUSTOMER_MANAGER = parseInt(window.localStorage.getItem('IS_CUSTOMER_MANAGER'))
    return (
      <div className='product-mgt clearfix'>
        <HzBreadcrumb/>
        <div className='content clearfix'>
          {checkPermission("productCategory/query")&&<div className='left'>
            <div className='header clearfix'>
              <div className='label'>富滇银行产品目录</div>
              {checkPermission("productCategory/query")&&
              <HzLink className='btn' to={'/root/main/productBase/categoryMgt'}>管理</HzLink>}
            </div>
            <Search placeholder='请输入关键字搜索' onChange={this.categorySearch}></Search>
            <div className='tree-content'>
              <Tree
                onExpand={this.onExpand}
                switcherIcon={<Icon type="down"/>}
                onSelect={(selectedKeys, e) => {
                  this.onSelect(selectedKeys, e)
                }}
                expandedKeys={this.state.expandedKeys}
              >
                {this.renderTreeNodes(catList.data)}
              </Tree>
            </div>
          </div>}
          <div style={{
            width:checkPermission("productCategory/query")?764:1048
          }} className='right'>
            <div className='search-area clearfix'>
              <Input placeholder='请输入产品名称、代码' value={this.state.filterObj.nameOrCode} className='input' onChange={(value) => {
                this.valueChangeHandler('nameOrCode', value)
              }}/>
              <Button type='primary' className='button' onClick={() => {
                this.searchHandler(1)
              }}>搜索</Button>
            </div>
            <div className='product-list'>
              <div className='header clearfix'>
                <div className='total'>
                  共<span>{this.state.total}</span>个产品
                </div>
                {checkPermission("product/save")&&<Button type='primary' onClick={() => {
                  this.goAdd()
                }}>新建产品</Button>}
              </div>
              <div className='list-wrap'>
                {prodList.data && prodList.data.map(item => {
                  return (
                    <div className='item' key={item.id}>
                      <Row>
                        <Col span={12} className='item-left'>
                          <img src={productListIcon} className='product-img' alt=''/>
                          <div className='left-content'>
                            <div className='name' onClick={() => {
                              checkPermission("product/details")&&this.goDetail(item)
                            }}>{item.name}</div>
                            <div>产品代码：{item.code}</div>
                            <div>产品期限：{item.deadline}</div>
                            <div>发行时间：{item.sellTime}</div>
                          </div>
                        </Col>
                        <Col span={12} className='item-right'>
                          <div>一级分类：{this.getFirstCategoryName(item)}</div>
                          <div>发行规模：{item.issuingScale}</div>
                        </Col>
                      </Row>
                    </div>
                  )
                })}
              </div>
              <div className='page-wrap'>
                <Pagination current={this.state.current} pageSize={PAGE_SIZE} total={this.state.total}
                            onChange={(page) => {
                              this.searchHandler(page)
                            }}/>
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }
}

export default List
