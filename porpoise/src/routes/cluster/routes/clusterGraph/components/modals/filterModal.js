/**
 * @desc: {企业列表，高级筛选弹窗}
 * @author: xieyuzhong
 * @Date: 2019-01-09 14:47:59
 * @Last Modified by: zhengyiqiu
 * @Last Modified time: 2019-02-25 17:18:07
 */

import React from 'react'
import { Rodal } from 'components/rodal'
import { connect } from 'react-redux'
import { toggleCompanyFilterModal, changeClusterCompanyFilter, startFilter } from '../../modules/filterModal'
import './filterModal.scss'
import SelectFilterOption from './components/selectFilterOption'
import InputFilterOption from './components/inputFilterOption'
import LocationSelectOption from './components/locationSelectOption'
import IndustrySelectOption from './components/IndustrySelectOption'
import SelectedFilters from './components/selectedFilters'
import doraemon from 'services/utils'

class FilterModal extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      filters: doraemon.deepClone(this.props.clusterCompanyFilter.filters)
    }

    this.COMPANY_TYPES = ['全部', '行内信贷客户', '行外企业']
    this.BUSINESS_STATUS = ['全部', '营业中', '清算', '注销', '迁出', '迁入', '撤销', '停业', '筹建']
    this.YES_OR_NO = ['全部', '是', '否']
    // this.INDUSTRY = ['全部', '农业', '林业', '畜牧业', '渔业', '农、林、牧、渔服务业', '煤炭开采和洗选业', '石油和天然气开采业',
    //   '黑色金属矿采选业', '有色金属矿采选业', '非金属矿采选业', '开采辅助活动', '其他采矿业', '农副食品加工业', '食品制造业',
    //   '酒、饮料和精制茶制造业', '烟草制品业', '纺织业', '纺织服装、服饰业', '皮革、毛皮、羽毛及其制品和制鞋业', '木材加工和木、竹、藤、棕、草制品业',
    //   '家具制造业', '造纸和纸制品业', '印刷和记录媒介复制业', '文教、工美、体育和娱乐用品制造业', '石油加工、炼焦和核燃料加工业',
    //   '化学原料和化学制品制造业', '医药制造业', '化学纤维制造业', '橡胶和塑料制品业', '非金属矿物制品业', '黑色金属冶炼和压延加工业',
    //   '有色金属冶炼和压延加工业', '金属制品业', '通用设备制造业', '专用设备制造业', '汽车制造业', '铁路、船舶、航空航天和其他运输设备制造业',
    //   '电气机械和器材制造业', '计算机、通信和其他电子设备制造业', '仪器仪表制造业', '其他制造业', '废弃资源综合利用业', '金属制品、机械和设备修理业',
    //   '电力、热力生产和供应业', '燃气生产和供应业', '水的生产和供应业', '房屋建筑业', '土木工程建筑业', '建筑安装业', '建筑装饰和其他建筑业', '批发业',
    //   '零售业', '铁路运输业', '道路运输业', '水上运输业', '航空运输业', '管道运输业', '装卸搬运和运输代理业', '仓储业', '邮政业', '住宿业', '餐饮业',
    //   '电信、广播电视和卫星传输服务', '互联网和相关服务', '软件和信息技术服务业', '货币金融服务', '资本市场服务', '保险业', '其他金融业', '房地产业',
    //   '租赁业', '商务服务业', '研究和试验发展', '专业技术服务业', '科技推广和应用服务业', '水利管理业', '生态保护和环境治理业', '公共设施管理业', '居民服务业',
    //   '机动车、电子产品和日用产品修理业', '其他服务业', '教育', '卫生', '社会工作', '新闻和出版业', '广播、电视、电影和影视录音制作业', '文化艺术业', '体育',
    //   '娱乐业', '中国共产党机关', '国家机构', '人民政协、民主党派', '社会保障', '群众团体、社会团体和其他成员组织', '基层群众自治组织', '国际组织']
    this.LINKED_TYPES = ['全部', '股东', '疑似实际控制人', '一度投资对象', '二度间接投资对象', '三度间接投资对象', '疑似同一企业', '共控股股东', '共核心高管']
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.clusterCompanyFilter !== nextProps.clusterCompanyFilter) {
      this.setState({
        filters: doraemon.deepClone(nextProps.clusterCompanyFilter.filters)
      })
    }
  }

  reset = () => {
    this.props.changeClusterCompanyFilter({})
    setTimeout(this.props.startFilter)
  }

  close = () => {
    this.props.toggleCompanyFilterModal(false)
    document.querySelector('.filter-option-container').scrollTop = 0
    this.setState({
      filters: doraemon.deepClone(this.props.clusterCompanyFilter.filters)
    })
  }

  ensure = () => {
    this.props.changeClusterCompanyFilter(this.state.filters)
    setTimeout(this.props.startFilter)
    this.close()
  }

  onChangeFilter = (newFilters) => {
    delete newFilters.condition
    for (let key in newFilters) {
      if ((newFilters[key] instanceof Array && newFilters[key][0] === '全部') ||
        newFilters[key]['全部']) { // delete “全部”
        delete newFilters[key]
        continue
      }
      if (!Object.keys(newFilters[key]).length) { // delete empty object
        delete newFilters[key]
        continue
      }
    }
    this.setState({
      filters: newFilters
    })
  }

  render () {
    const filterOptionProps = {
      filters: this.state.filters,
      onChange: this.onChangeFilter
    }

    return (
      <div className='filter-modal modal'>
        <Rodal visible={this.props.visible}
          closeMaskOnClick
          showCloseButton
          width={862} height={625}
          onClose={this.close} >
          <h3 className='modal-header'>高级筛选</h3>
          <div className='modal-body scroll-style'>
            <div className='filter-option-container'>
              {
                this.props.singleCompanyState ? (
                  <SelectFilterOption isMulti title='关联方式' selections={this.LINKED_TYPES}
                    {...filterOptionProps}
                  />
                ) : null
              }
              <SelectFilterOption title='企业类型' selections={this.COMPANY_TYPES}
                {...filterOptionProps}
              />
              <LocationSelectOption isMulti title='省份地区'
                showExpandBtn
                {...filterOptionProps}
              />
              <p className='no-use-line' />
              <IndustrySelectOption isMulti title='行业门类'
                showExpandBtn
                {...filterOptionProps}
              />
              <SelectFilterOption isMulti title='经营状态' selections={this.BUSINESS_STATUS}
                {...filterOptionProps}
              />
              <p className='no-use-line' />
              <InputFilterOption title='成立年限' unit='年' {...filterOptionProps} />
              <InputFilterOption title='注册资本' unit='万' unitValue={10000} {...filterOptionProps} />
              <SelectFilterOption title='是否上市' selections={this.YES_OR_NO}
                {...filterOptionProps}
              />
            </div>
          </div>
          <p className='no-use-line' style={{ margin : '0 16px 25px 16px' }}/>
          <div className='filter-result-container'>
            <SelectedFilters {...filterOptionProps} />
          </div>
          <p className='modal-btns'>
            <button className='cancel-btn btn' onClick={this.reset}>重置</button>
            <button className='ok-btn btn' onClick={this.ensure}>筛选</button>
          </p>
        </Rodal>
      </div>
    )
  }
}

const mapState2Props = (state) => ({
  clusterCompanyFilter: state.clusterCompanyFilter,
  singleCompanyState: state.singleCompanyState
})

const mapDispatch2Props = {
  toggleCompanyFilterModal,
  changeClusterCompanyFilter,
  startFilter
}

export default connect(mapState2Props, mapDispatch2Props)(FilterModal)
