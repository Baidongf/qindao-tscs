import React from 'react'
import echarts from 'echarts'

class GroupFeaturesList extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      radioValue: 'city',
      fearTuresGroup: false,
      fearTuresArea: false,
      groupFeatureObj: this.props.groupFeatureObj.featureData,
      featuresColors:['#F6C575', '#F68C75', '#F45F7D', '#64C680', '#4FA2F1'],
      areaColors:['#4FA2F1', '#0087DA', '#40C6DB', '#008C84', '#64C680']
    }
    this.radioClick = this.radioClick.bind(this)
    this.toggleGroup = this.toggleGroup.bind(this)
    this.toggleArea = this.toggleArea.bind(this)
    this.drawPie = this.drawPie.bind(this)
    this.sliceStr = this.sliceStr.bind(this)
  }
  drawPie (ele, data, colors) {
    let dom = echarts.init(ele)
    let option = {
      tooltip: {
        formatter: function (data) {
          return '共' + data.data.count + '家企业<br/>占比' + data.data.proportion
        }
      },
      series : [
        {
          type: 'pie',
          radius : '60%',
          center: ['50%', '50%'],
          data: data
          .sort(function (a, b) {
            return b.value - a.value
          }),
          color: colors,
          label: {
            color: '#767676',
            fontSize: 10,
            formatter: (data) => {
              console.log(data)
              const Len = 8
              let name = data.data.name
              let str = this.sliceStr(name, '', Len)
              const afterValue = data.data.proportion
              if (name.length <= 8) {
                str += '\n'
              }
              str += afterValue
              return str
            }
          },
          labelLine: {
            lineStyle: {
              color: '#E3E3E3'
            }
          },
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
    dom.setOption(option, true)
  }
  componentDidMount () {
    this.drawPie(this.refs.groupFeatures, this.state.groupFeatureObj[0].data, this.state.featuresColors)
    this.toggleArea()
  }
  sliceStr (str, strParams, num) {
    let arr = []
    let strSave = strParams
    if (str.length > num) {
      arr.push(str.slice(0, num))
      arr.push(str.slice(num))
      strSave += arr[0] + '\n'
      if (arr[1].length > num) {
        strSave += this.sliceStr(arr[1], strSave, num)
      } else {
        strSave += arr[1]
      }
      return strSave
    } else {
      strSave += str
      return strSave
    }
  }
  toggleGroup () {
    let bol = this.state.fearTuresGroup
    this.setState({
      fearTuresGroup: !bol,
    }, () => {
      if (this.state.fearTuresGroup) {
        this.drawPie(this.refs.groupFeatures, this.state.groupFeatureObj[0].data, this.state.featuresColors)
      }
    })
  }
  toggleArea () {
    let bol = this.state.fearTuresArea
    let radioValue = this.state.radioValue
    this.setState({
      fearTuresArea: !bol,
      radioValue: radioValue === 'city' ? 'province' : 'city'
    }, () => {
      if (this.state.fearTuresArea) {
        this.radioClick()
      }
    })
  }
  radioClick () {
    let radioValue = this.state.radioValue
    let topValue = this.state.radioValue === 'city' ? this.state.groupFeatureObj[2].data : this.state.groupFeatureObj[1].data
    this.setState({
      radioValue: radioValue === 'city' ? 'province' : 'city'
    })
    this.drawPie(this.refs.groupAddress, topValue, this.state.areaColors)
  }
  render () {
    // console.log(111)
    return (
        this.props.singleCompany ? (
          <div className='no-content'>
            暂无数据
          </div>
        ) : (
          <div className='result-list insight-list'>
            <div className='result-item'>
            {/* onClick={this.toggleGroup} */}
              <div className='result-header features-header'>
                <span>集团行业分布</span>
                <span className='features-label'>行业统计(TOP5）</span>
                {/* <i className={this.state.fearTuresGroup ? 'i-arrow-up' : 'i-arrow-up i-arrow-down'} /> */}
              </div>
              <div>
                <div className='pie-wrap'>
                  <div id='groupFeatures' ref='groupFeatures' className='groupFeatures' />
                  {/* <div className='features-center'> */}
                    {/* 行业统计 （TOP5）
                  </div> */}
                </div>
                {/* : (
                {
                this.state.fearTuresGroup ? (
                  ''
                )
                } */}
              </div>
            </div>
            <div className='result-item'>
            {/* onClick={this.toggleArea} */}
              <div className='result-header features-header' >
                <span>集团地域分布</span>
                <span className='features-label'>区域统计(TOP5）</span>
                {/* <i className={this.state.fearTuresArea ? 'i-arrow-up' : 'i-arrow-up i-arrow-down'} /> */}
              </div>
              {
                <div className='result-bot'>
                  <div className='radio-item'>
                    <input name='classType' value='city' type='radio' checked={this.state.radioValue === 'city'} onChange={this.radioClick} />按城市统计
                    <input name='classType' value='province' type='radio' checked={this.state.radioValue === 'province'} onChange={this.radioClick} />按省份统计
                  </div>
                  <div className='pie-wrap'>
                    <div id='groupAddress' ref='groupAddress' className='groupAddress' />
                    {/* <div className='features-center'>
                      区域统计 （TOP5）
                    </div> */}
                  </div>
                </div>
                // this.state.fearTuresArea ? (
                // ) : (
                  // ''
                // )
              }
            </div>
          </div>
        )
    )
  }
}

export default GroupFeaturesList
