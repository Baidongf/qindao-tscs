import React from 'react'
import {Row, Col, Button} from 'antd'
import HzBreadcrumb from 'components/HzBreadcrumb'
import queryString from 'query-string'
import './component.scss'
import moment from 'moment'
import HzLink from "../../../../../../../../../../components/HzLink/component";
import {checkPermission} from "../../../../../../../../../../utils/permission";


class Detail extends React.Component {
  constructor(props) {

    super(props)
    this.state = {
      prodObj: {},
      categoryArr: []
    }


    this.queryObj = queryString.parse(props.location.search)
    this.id = this.queryObj.id
  }

  goEdit = () => {
    this.props.history.push('/root/main/productBase/createOrEdit?operation=edit&id=' + this.id)
  }

  parseTree = (data, callback) => {
    const result = []
    const step = function (arr) {
      arr.forEach(item => {
        result.push(item)
        item.childrens && step(item.childrens)
      })
    }
    step(data)
    this.setState({categoryArr: result}, () => {
      callback && callback()
    })
    return result
  }

  findCategory = (id) => {
    const l = this.state.categoryArr.length
    for (let i = 0; i < l; i++) {
      if (this.state.categoryArr[i].id == id) {
        return this.state.categoryArr[i]
      }
    }
  }

  componentWillMount() {
    this.props.getProdDetail(this.id, (data) => {
      this.props.getCatList({}, (data) => {
        this.parseTree(data.data, () => {
          const category = this.findCategory(this.state.prodObj.productCategoryId)

          let firstCategory = null
          let secondCategory = null
          if (category) {
            let path = category.path.split(',')
            firstCategory = path[0] ? this.findCategory(path[0]).name : ''
            secondCategory = path[1] ? this.findCategory(path[1]).name : ''
          }
          else {
            firstCategory = ''
            secondCategory = ''
          }

          this.setState({prodObj: Object.assign(this.state.prodObj, {firstCategory, secondCategory})})
        })
      })
    })
  }

  componentDidMount() {
  }

  componentWillReceiveProps({prodDetail}) {
    if (prodDetail !== this.props.prodDetail) {
      this.setState({
        prodObj: {...prodDetail}
      })
    }
  }

  render() {
    const {prodObj} = this.state
    let {prodDetail} = this.props
    const IS_CUSTOMER_MANAGER = parseInt(window.localStorage.getItem('IS_CUSTOMER_MANAGER'))

    return (
      <div className='prodDetail-component'>
        <HzBreadcrumb/>
        <div className='base-info'>
          <div className='title'>{prodDetail.name}</div>
          <div className='user-name clearfix'>
            <div className='label'>{prodDetail.concat}</div>
            {checkPermission("product/update")&& <Button type="primary" onClick={this.goEdit}>编辑</Button>
            }

          </div>
          <div className='sub-title'>产品简介</div>
          <div className='base-info-content'>
            <Row>
              <Col span={12} className='left-col'>
                <div className='item'>
                  <div className='left'>一级分类</div>
                  <div className='right'>{prodObj.firstCategory}</div>
                </div>
                <div className='item'>
                  <div className='left'>产品代码</div>
                  <div className='right'>{prodDetail.code}</div>
                </div>
                <div className='item'>
                  <div className='left'>期限</div>
                  {prodDetail.deadline &&
                  <div
                    //产品期限为月份的整数，而不是具体日期，不需要在展示的时候进行格式化 20190613 GWS
                    //className='right'>{typeof prodDetail.deadline === 'string' ? prodDetail.deadline : prodDetail.deadline.format('YYYY-MM-DD')}</div>
                    className='right'>{prodDetail.deadline}</div>
                  }
                </div>
                <div className='item'>
                  <div className='left'>发行规模 (万元)</div>
                  <div className='right'>{prodDetail.issuingScale}</div>
                </div>
                {/* <div className='item'>
                  <div className='left'>已发售额度 (万元)</div>
                  <div className='right'>{prodDetail.selledBalance}</div>
                </div> */}
                <div className='item'>
                  <div className='left'>联系电话</div>
                  <div className='right'>{prodDetail.concatTel}</div>
                </div>
              </Col>
              <Col span={12} className='right-col'>
                <div className='item'>
                  <div className='left'>二级分类</div>
                  <div className='right'>{prodObj.secondCategory}</div>
                </div>
                <div className='item'>
                  <div className='left'>利率</div>
                  <div className='right'>{prodDetail.rate}</div>
                </div>
                <div className='item'>
                  <div className='left'>发行时间</div>
                  {prodDetail.sellTime &&
                  <div
                    className='right'>{typeof prodDetail.sellTime === 'string' ? prodDetail.sellTime : prodDetail.sellTime.format('YYYY-MM-DD')}</div>
                  }
                </div>
                {/* <div className='item'>
                  <div className='left'>更新时间</div>
                  <div className='right'>{prodDetail.updateTime}</div>
                </div> */}
                <div className='item'>
                  <div className='left'>联系人</div>
                  <div className='right'>{prodDetail.concat}</div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <div className='description'>
          <div className='title'>产品描述</div>
          <div className='content'>{prodDetail.description}</div>
        </div>
        <div className='description'>
          <div className='title'>附件列表</div>
          <div className='content'>
            {
              prodDetail.attachments?(<div>
                {
                  prodDetail.attachments.map((item,index)=>{
                    return(
                      <a className="file-item" download={item.name} href={item.url} key={index}>{item.name}</a>
                    )
                  })
                }
              </div>):'暂无附件'
            }
          </div>
        </div>
        <div className='link-wrap'>
          <div className='title'>关联知识库</div>
          <div className='links'>
            {prodDetail.knowledges && prodDetail.knowledges.map(item => {
              return (<HzLink className='item'
                              to={'/root/main/customerKnowlMgt/detail?id=' + item.id}
                              key={item.id}
              >{item.joinType}</HzLink>)
            })}
          </div>
        </div>
      </div>
    )
  }
}

export default Detail
