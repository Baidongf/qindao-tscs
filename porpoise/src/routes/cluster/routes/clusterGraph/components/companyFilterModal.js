import React from 'react'
import { connect } from 'react-redux'
import './filterCard.scss'

class CompanyFilterModal extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      expandList:[],
      itemVal: '',
      filterObj:{}, // 筛选对象
      filterParams: {} // 筛选参数
    }
    this.toggle = this.toggle.bind(this)
    this.selectItem = this.selectItem.bind(this)
    this.getIndexOf = this.getIndexOf.bind(this)
    this.selectAll = this.selectAll.bind(this)
    this.onClose = this.onClose.bind(this)
    this.onCancel = this.onCancel.bind(this)
  }
  componentWillMount () {
    let { filterObj, filterParams } = this.props
    this.setState({
      filterObj,
      filterParams
    })
  }
  onClose () {
    let { filterParams } = this.state
    this.props.onClose(false)
    this.props.getResultItem(filterParams)
  }
  onCancel () {
    this.props.initFilterObj()
    this.props.onClose(false)
  }
  toggle (key) {
    const { expandList } = this.state
    if (expandList.includes(key)) {
      let idx = this.getIndexOf(expandList, key)
      expandList.splice(idx, 1)
    } else {
      expandList.push(key)
    }
    this.setState({
      expandList
    })
  }
  selectAll (key) {
    let { filterParams } = this.state
    let resultItem = filterParams[key]
    filterParams[key] = typeof resultItem === 'string' ? { value: 'all' } : { value: [] }
    this.setState({
      filterParams
    })
  }
  selectItem (e) {
    let { desc, canmultichoose, name } = e.target.dataset
    let { filterParams } = this.state
    if (canmultichoose) {
      let idx = this.getIndexOf(filterParams[name].value, desc)
      idx === -1 ? filterParams[name].value.push(desc) : filterParams[name].value.splice(idx, 1)
    } else {
      filterParams[name].value = desc
    }
    this.setState({
      filterParams
    })
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
  render () {
    let { filterParams, filterObj } = this.state
    return (
      <div className='filter-group'>
        <h2 className='filter-title'>高级筛选</h2>
        <div className='item-wrap'>
        {
          Object.keys(filterObj).map((key) => (
            <div key={key} className={this.state.expandList.includes(key) ? 'filter-item clearfix expand' : 'filter-item clearfix'}>
              <div className='item-label'>
                <span className='jq_label_text'>{key}：</span>
              </div>
              <div className='item-values jq_item_values' >
                {
                  typeof filterParams[filterObj[key]['name']]['value'] === 'string' ? (
                    <span className={filterParams[filterObj[key]['name']]['value'] === 'all' ? 'item-value selected' : 'item-value'} onClick={() => this.selectAll(filterObj[key]['name'])}>全部</span>
                  ) : (
                    <span className={filterParams[filterObj[key]['name']]['value'].length === 0 ? 'item-value selected' : 'item-value'} onClick={() => this.selectAll(filterObj[key]['name'])}>全部</span>
                  )
                }
                {
                  Object.keys(filterObj[key]['data']).map((val) => (
                    typeof filterParams[filterObj[key]['name']]['value'] === 'string' ? (
                      <span className={filterParams[filterObj[key]['name']]['value'] === val ? 'item-value selected' : 'item-value'}
                        key={val}
                        data-canMultiChoose={filterObj[key]['canMultiChoose']}
                        data-desc={val}
                        data-name={filterObj[key]['name']}
                        data-parent={key}
                        onClick={(e) => {
                          this.selectItem(e)
                        }}
                        >{val}</span>
                    ) : (
                      <span className={this.getIndexOf(filterParams[filterObj[key]['name']]['value'], val) === -1 ? 'item-value' : 'item-value selected'}
                        key={val}
                        data-canMultiChoose={filterObj[key]['canMultiChoose']}
                        data-desc={val}
                        data-name={filterObj[key]['name']}
                        data-parent={key}
                        onClick={(e) => {
                          this.selectItem(e)
                        }}
                        >{val}</span>
                    )
                  ))
                }
              </div>
              {
                Object.keys(filterObj[key]['data']).length > 10 ? (
                  <div className='expand-collapse-btn'>
                    <span className='expand-collapse-text' onClick={() => { this.toggle(key) }}>
                      { this.state.expandList.includes(key) ? '收缩' : '展开' }
                    </span>
                    <span className='arrow icon-arrow-down' />
                  </div>
                ) : (
                  ''
                )
              }
            </div>
          ))
        }
        </div>
        <div className='filter-btn filter-sub' onClick={this.onClose}>确认</div>
        <div className='filter-btn filter-cancel' onClick={this.onCancel}>取消</div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapDispatchToProps)(CompanyFilterModal)
