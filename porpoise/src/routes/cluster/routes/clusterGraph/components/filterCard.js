import React from 'react'
import { connect } from 'react-redux'
import { Rodal } from './rodal'
import CompanyFilterModal from './companyFilterModal'
import filterDataTree from './lib/companyFilter/advanced_meta_data'
import './filterCard.scss'
import PropTypes from 'prop-types'

class FilterCard extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      showCard: false,
      hasFilter: false,
      showRodal: false,
      resultObj: {},
      filterObj:{}, // 筛选对象
      filterParams: {} // 筛选参数
    }
    this.toggleList = this.toggleList.bind(this)
    this.toggleRodal = this.toggleRodal.bind(this)
    this.getResultItem = this.getResultItem.bind(this)
    this.deleteFilterItem = this.deleteFilterItem.bind(this)
    this.getIndexOf = this.getIndexOf.bind(this)
    this.emptyFilterObj = this.emptyFilterObj.bind(this)
    this.initFilterObj = this.initFilterObj.bind(this)
  }
  componentWillMount () {
    this.initFilterObj()
  }
  initFilterObj () {
    let filterObj = JSON.parse(JSON.stringify(filterDataTree['filterDataTree']['公司筛选']))
    let filterParams = {}
    for (let key in filterObj) {
      let item = filterObj[key]
      filterParams[item['name']] = item.canMultiChoose ? { value: [] } : { value: 'all' }
      filterParams[item['name']]['name'] = key
      filterParams[item['name']]['canMultiChoose'] = item.canMultiChoose ? item.canMultiChoose : false
    }
    this.setState({
      filterObj,
      filterParams,
      hasFilter: false
    })
  }
  deleteFilterItem (key, val) {
    let { resultObj, hasFilter } = this.state
    if (val) {
      let idx = this.getIndexOf(resultObj[key]['value'], val)
      resultObj[key]['value'].splice(idx, 1)
    } else {
      resultObj[key]['value'] = 'all'
    }
    hasFilter = !this.emptyFilterObj(resultObj)
    this.setState({
      resultObj,
      hasFilter
    })
  }
  emptyFilterObj (obj) {
    for (let key in obj) {
      if (!obj[key]['canMultiChoose']) {
        if (obj[key]['value'] !== 'all') {
          return false
        }
      } else {
        if (obj[key]['value'].length > 0) {
          return false
        }
      }
    }
    return true
  }
  getIndexOf (arr, ele) {
    if (arr.length < 1) {
      return -1
    }
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === ele) {
        return i
      }
    }
    return -1
  }
  toggleList () {
    this.setState({
      showCard: true
    })
  }
  toggleRodal (bol) {
    this.setState({
      showRodal:bol
    })
  }
  getResultItem (resultObj) {
    this.setState({
      hasFilter: true,
      resultObj,
      filterParams: resultObj
    })
  }
  render () {
    let resultObj = this.state.filterParams
    return (
      <div className='filterCard-box'>
        <div className='filterCard-box-top' onClick={() => this.toggleList()}>
          <span className='filterCard-tit'>
            筛选条件
          </span>
          <i className={this.state.showCard ? 'i-arrow-up' : 'i-arrow-up i-arrow-down'}></i>
        </div>
        {
          this.state.showCard ? (
        <div className='filterCard-box-bottom'>
          {
            this.state.hasFilter ? (
              <div className='has-filter-condition'>
                {
                  Object.keys(resultObj).map((key) => (
                    !resultObj[key]['canMultiChoose'] ? (
                      resultObj[key]['value'] !== 'all' ? (
                        <span className='deletable-selected-item' key={key}>
                          {resultObj[key]['name']}：{resultObj[key]['value']}
                          <span className='icon-close' onClick={() => this.deleteFilterItem(key)} />
                        </span>
                      ) : (
                        ''
                      )
                    ) : (
                      resultObj[key]['value'].length > 0 ? (
                        resultObj[key]['value'].map((val) => (
                          <span key={val} className='deletable-selected-item'>
                            {resultObj[key]['name']}：{val}
                            <span className='icon-close' onClick={() => this.deleteFilterItem(key, val)} />
                          </span>
                        ))
                      ) : (
                        ''
                      )
                    )
                    ))
                  }
                <span className='add-filter-condition' onClick={() => this.toggleRodal(true)}>继续添加</span>
              </div>
            ) : (
              <div className='none-filter-condition'>
                <span>
                  未添加筛选条件，
                </span>
                <span className='filterCard-btn-add' onClick={() => this.toggleRodal(true)}>添加</span>
              </div>
            )
          }
          <button className='filterCard-btn-confirm filter-card-btn'>确定</button>
          <button className='filterCard-btn-reset filter-card-btn' onClick={this.initFilterObj}>重置</button>
        </div>
         ) : ''
        }
        {
          this.state.showRodal ? (
            <Rodal visible={this.state.showRodal}
              closeMaskOnClick={false}
              showCloseButton={true}
              width={400} height={222}
              onClose={() => this.toggleRodal(false)}>
              <CompanyFilterModal
                onClose={this.toggleRodal}
                getResultItem={this.getResultItem}
                initFilterObj={this.initFilterObj}
                filterObj={this.state.filterObj}
                filterParams={this.state.filterParams}
                />
            </Rodal>
          ) : (
            ''
          )
        }
      </div>
    )
  }
}
FilterCard.propTypes = {
}
const mapDispatchToProps = (dispatch) => {
  return {
  }
}
export default connect(mapDispatchToProps)(FilterCard)
