import React from 'react'
import { connect } from 'react-redux'
import SearchSuggested from 'components/SearchSuggested'
import doraemon from 'services/utils'
import { selectCenterClusterNode, selectPersonClusterNode, selectCenterTreeNode } from '../../../../../actions/Card'
import { getSingleCompanyChart } from '../modules/GroupRelationCard'

class NeturePersonList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      persons: [],  // 自然人列表
      isCardSelect: false
    }

    this.naturePersonData = []
    this.naturePersonDataCach = []
    this.noContentText = '暂无数据'
    this.searchHandler = this.searchHandler.bind(this)
    this.selectCenterNode = this.selectCenterNode.bind(this)
    // this.selectCenterClusterNode = this.selectCenterClusterNode.bind(this)
    this.selectPersonClusterNode = this.selectPersonClusterNode.bind(this)
  }

  componentWillMount () {
    this.naturePersonDataCach = this.props.singleCompany ? this.props.personList : this.props.naturePersonData
    this.setState({
      persons: this.naturePersonDataCach
    })
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.naturePersonData !== nextProps.naturePersonData) {
      this.setState({
        persons: nextProps.naturePersonData
      })
    }
    if (this.props.singleCompany !== nextProps.singleCompany) {
      this.naturePersonDataCach = nextProps.singleCompany ? nextProps.personList : nextProps.naturePersonData
      this.setState({
        persons: this.naturePersonDataCach
      })
    }
    if (this.props.curNode !== nextProps.curNode) {
      this.getCurPerson(nextProps.curNode._id)
    }
  }

  searchHandler (value = '') {
    this.value = value

    this.searchNaturePerson(value)
    this.setState({
      persons: this.naturePersonData
    })
  }

  searchNaturePerson (name) {
    if (name.value !== '') {
      this.naturePersonData = this.naturePersonData.filter((item) => item.name.indexOf(name.value) > -1)
      this.total = this.naturePersonData.length
      if (!this.naturePersonData.length) {
        this.noContentText = '未能找到该自然人'
      }
    } else {
      this.naturePersonData = this.naturePersonDataCach
      this.total = this.naturePersonDataCach.length
    }
  }

  selectCenterNode (d) {
    if (!this.props.singleCompany) {
      this.props.selectCenterClusterNode(d.person_id)
    } else {
      this.props.selectCenterTreeNode(d)
    }
  }
  // selectCenterClusterNode (id) {
  //   this.props.selectCenterClusterNode(id)
  // }

  selectPersonClusterNode (e, id, showType) {
    e.stopPropagation()
    this.props.selectPersonClusterNode(id, showType)
  }

  getCurPerson (id) {
    if (this.naturePersonData.length) {
      const body = document.querySelector('.result-body')
      const card = body.querySelectorAll('.nature-person-card')
      let height = 0
      let curIndex = 0
      this.naturePersonData.forEach((element, index) => {
        if (element.person_id === id) {
          curIndex = index
        }
      })
      for (let i = 0; i < card.length; i++) {
        card[i].className = 'relation-card nature-person-card'
        if (i < curIndex) {
          height += card[i].clientHeight + 12
        }
      }
      card[curIndex].className = 'relation-card nature-person-card active'
      body.scrollTop = height
    }
  }

  getResultList () {
    const resultList = this.naturePersonData.length ? (
        this.naturePersonData.map((d) => {
          const belongInner = d.belong_inner === 'true' ? (<span className='special belong-inner'>授信客户</span>) : ''
          const blackList = doraemon.isBlacklist(d) ? (<span className='special black-list'>黑名单</span>) : ''
          const listedPlate = (d.is_listed_enterprise && d.is_listed_enterprise === 'true') ? (<span className='special listed-plate'>上市板块</span>) : ''
          const exceptionCompany = (d.is_abnormal_status && d.is_abnormal_status === 'true') ? (<span className='special bexception-company'>异常经营</span>) : ''
          const _id = this.props.singleCompany ? d._id : d.person_id
          return (
            <div className='relation-card nature-person-card'
              key={_id}
              onClick={() => this.selectCenterNode(d)}>
              {/* onClick={() => this.selectCenterClusterNode(_id)}> */}
              <div className='relation-name'>
                <span className='name'>{d.name}</span>
                {belongInner}
                {blackList}
                {listedPlate}
                {exceptionCompany}
              </div>
              {
                d.actual_controller_total > 0 ? (
                  <div className='relation-info nature-person-info'>
                    投资关联 {d.actual_controller_total } 家企业
                    <a onClick={(e) => this.selectPersonClusterNode(e, d.person_id, 'actual_controller')}> 图中查看</a>
                  </div>
                ) : ''
              }
              {
                d.officer_share_total > 0 ? (
                  <div className='relation-info nature-person-info'>
                    任职关联 {d.officer_share_total} 家企业
                    <a onClick={(e) => this.selectPersonClusterNode(e, d.person_id, 'officer')}> 图中查看</a>
                  </div>
                ) : ''
              }
              {
                this.props.singleCompany ? (
                  <div className='relation-info nature-person-info'>
                    {this.props.singleCompany}的{d.stock_type}，持股比例{(d.ratio * 100).toFixed(2)}%
                  </div>
                ) : ''
              }
            </div>
          )
        })
      ) : (
        <div className='no-content'>{this.noContentText}</div>
      )

    return resultList
  }

  render () {
    const { persons } = this.state
    this.naturePersonData = persons

    return (
      <div className='tab-list scroll-style'>
        <SearchSuggested
          selectSuggest={(value) => this.searchHandler({ value })}
          placeholder='输入自然人名进行查询'
          searchHandler={(value) => this.searchHandler({ value })}
        />
        <div className='result-list'>
          <div className='result-body scroll-style' >
            {this.getResultList()}
          </div>
        </div>
      </div>
    )
  }
}

/**
 * map state to props
 * @param {Object} state state
 * @return {Object} state
 */
const mapStateToProps = function (state) {
  return {
    curNode: state.curNode
  }
}

/**
 * map dispatch to props
 * @param {Object} dispatch dispatch
 * @return {Object} action
 */
const mapDispatchToProps = (dispatch) => {
  return {
    getSingleCompanyChart: (id) => dispatch(getSingleCompanyChart(id)),
    selectCenterClusterNode: (id) => dispatch(selectCenterClusterNode(id)),
    selectCenterTreeNode: (id) => dispatch(selectCenterTreeNode(id)),
    selectPersonClusterNode: (id, showType) => dispatch(selectPersonClusterNode(id, showType)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NeturePersonList)
