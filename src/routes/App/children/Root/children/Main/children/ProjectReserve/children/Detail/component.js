import React from 'react'
import {Form, Button, Radio} from 'antd'
import queryString from 'query-string'
import {commonChangeHandler} from 'utils/antd'
import HzBreadcrumb from 'components/HzBreadcrumb'
import styles from './component.scss'
import XLSX from 'xlsx'
import html2canvas from 'html2canvas'
import {checkPermission} from "../../../../../../../../../../utils/permission";

class CreateOrEditFrom extends React.Component {
  constructor(props) {

    super(props)

    this.state = {
      oneObj: {},
      twoObj: {},
      threeObj: {},
      fourObj: {},
      fiveObj: {},
      varietyEnum: []
    }

  }


  componentWillMount() {
    this.queryObj = queryString.parse(this.props.location.search)
    this.props.getQueryEnum()
    this.props.getOneDetail(this.queryObj.id, data => {
      this.setState({oneObj: data})
    })
    this.props.getTwoDetail(this.queryObj.id, data => {
      this.setState({twoObj: data})
    })
    this.props.getThreeDetail(this.queryObj.id, data => {
      this.setState({threeObj: data})
    })
    this.props.getFourDetail(this.queryObj.id, data => {
      this.setState({fourObj: data})
    })
    this.props.getFiveDetail(this.queryObj.id, data => {
      this.setState({fiveObj: data})
    })
  }

  split_array = (arr, len) => {
    let arr_length = arr.length;
    let newArr = [];
    for (let i = 0; i < arr_length; i += len) {
      newArr.push(arr.slice(i, i + len));
    }
    newArr.forEach(arr => {
      if (arr.length < len) {
        for (let i = 0; i <= len - arr.length; i++) {
          arr.push(null)
        }
      }
    })
    return newArr;
  }

  campsCheck = (index) => {
    let arr = []
    arr = this.state.twoObj.compCase && this.state.twoObj.compCase.split(',')
    return arr && arr.indexOf(index.toString())
  }

  goEdit = () => {
    this.props.history.push('/root/main/projectReserve/createOrEdit?operation=edit&id=' + this.queryObj.id)
  }

  download = () => {
    this.downloadXLSX() //下载为excel
   // this.downloadImage() //下载为图片
  }

  downloadXLSX = () => {
    let type = 'xlsx'
    let elt = document.getElementsByClassName('project-reserve-table')[0]
    let wb = XLSX.utils.table_to_book(elt, {sheet: `${this.state.oneObj.reportProName}`})
    let sheet = wb.Sheets[this.state.oneObj.reportProName]
    XLSX.writeFile(wb, (`${this.state.oneObj.reportProName}.` + (type || 'xlsx')))
  }

  downloadImage = () => {
    let table = document.getElementsByClassName('project-reserve-table')[0]
    let canvasBox = document.getElementsByClassName('canvas-box')[0]
    let fileName = this.state.oneObj.reportProName

    function _fixType(type) {
      type = type.toLowerCase().replace(/jpg/i, 'jpeg')
      let r = type.match(/png|jpeg|bmp|gif/)[0]
      return 'image/' + r
    }

    function fileDownload(downloadUrl) {
      let aLink = document.createElement('a')
      aLink.style.display = 'none'
      aLink.href = downloadUrl
      aLink.download = fileName + '.png'
      document.body.appendChild(aLink)
      aLink.click();
      document.body.removeChild(aLink)
    }

    html2canvas(table).then(canvas => {
      canvasBox.appendChild(canvas)
      setTimeout(() => {
        let type = 'png'
        let oCanvas = canvasBox.getElementsByTagName("canvas")[0];
        let imgData = oCanvas.toDataURL(type)
        imgData = imgData.replace(_fixType(type), 'image/octet-stream')
        fileDownload(imgData);
        canvasBox.removeChild(oCanvas)
      }, 0)
    })
  }

  componentDidMount() {
  }

  componentWillReceiveProps({queryEnum}) {
    if (queryEnum !== this.props.queryEnum) {
      let varietyEnum = []
      Object.keys(queryEnum.varietyEnum).forEach(key => {
        varietyEnum.push({
          label: queryEnum.varietyEnum[key],
          value: parseInt(key)
        })
      })
      varietyEnum = this.split_array(varietyEnum, 5)
      this.setState({varietyEnum: varietyEnum})
    }
  }

  render() {
    const {oneObj, twoObj, threeObj, fourObj, fiveObj} = this.state
    const {queryEnum} = this.props
    return (
      <div className='project-detail'>
        <HzBreadcrumb/>

        <div className='table-wrap'>
          <div className='btn-wrap clearfix'>
            {checkPermission("projectStore/update")&&<Button type={'primary'} className={'right'} onClick={() => {
              this.goEdit()
            }}>编辑</Button>}
            {checkPermission("projectStore/export")&&<Button type={'primary'} className={'left'} onClick={() => {
              this.download()
            }}>导出</Button>}
          </div>
          <table border={0} cellPadding={0} cellSpacing={0} width={905}
                 className={'project-reserve-table'}
          >
            <colgroup>
              <col width={122} style={{msoWidthSource: 'userset', msoWidthAlt: 4352, width: '92pt'}}/>
              <col width={100} style={{msoWidthSource: 'userset', msoWidthAlt: 3555, width: '75pt'}}/>
              <col width={92} style={{msoWidthSource: 'userset', msoWidthAlt: 3271, width: '69pt'}}/>
              <col width={122} style={{msoWidthSource: 'userset', msoWidthAlt: 4352, width: '92pt'}}/>
              <col width={104} style={{msoWidthSource: 'userset', msoWidthAlt: 3697, width: '78pt'}}/>
              <col width={130} style={{msoWidthSource: 'userset', msoWidthAlt: 4608, width: '97pt'}}/>
              <col width={122} style={{msoWidthSource: 'userset', msoWidthAlt: 4323, width: '91pt'}}/>
              <col width={113} style={{msoWidthSource: 'userset', msoWidthAlt: 4010, width: '85pt'}}/>
            </colgroup>
            <tbody>
            <tr height={19} style={{height: '14.4pt'}}>
              <td colSpan={8} height={19} className="xl114" width={905}
                  style={{height: '30pt', width: '679pt'}}>附件一：分支行授信项目储备附表
              </td>
            </tr>
            <tr height={19} style={{height: '30pt'}}>
              <td height={19} className="xl68" style={{height: '14.4pt'}}>一级分支机构：{oneObj.institutionName}</td>
              <td colSpan={3} style={{msoIgnore: 'colspan'}}/>
              <td className="xl68">项目编号：{oneObj.reportProCode}</td>
              <td colSpan={3} style={{msoIgnore: 'colspan'}}/>
            </tr>
            <tr height={26} style={{msoHeightSource: 'userset', height: '20.25pt'}}>
              <td height={26} className="xl66" width={122} style={{height: '20.25pt', width: '92pt'}}>申报项目名称</td>
              <td colSpan={7} className="xl87" width={783}
                  style={{borderRight: '.5pt solid black', borderLeft: 'none', width: '587pt'}}>
                {oneObj.reportProName}
              </td>
            </tr>
            <tr className="xl90" height={26} style={{msoHeightSource: 'userset', height: '20.25pt'}}>
              <td height={26} className="xl88" width={122}
                  style={{height: '20.25pt', borderTop: 'none', width: '92pt'}}>项目涉及重点领域
              </td>
              <td colSpan={7} className="xl94" width={783} style={{
                borderRight: '.5pt solid black',
                borderLeft: 'none',
                width: '587pt'
              }}>{oneObj.proMajorAreaFName}-{oneObj.proMajorAreaSName}
              </td>
            </tr>
            <tr height={26} style={{msoHeightSource: 'userset', height: '20.25pt'}}>
              <td height={26} className="xl66" width={122}
                  style={{height: '20.25pt', borderTop: 'none', width: '92pt'}}>项目入库时间
              </td>
              <td colSpan={7} className="xl87" width={783}
                  style={{borderRight: '.5pt solid black', borderLeft: 'none', width: '587pt'}}>
                {oneObj.putDate}
              </td>
            </tr>
            <tr height={26} style={{msoHeightSource: 'userset', height: '20.25pt'}}>
              <td height={26} className="xl66" width={122}
                  style={{height: '20.25pt', borderTop: 'none', width: '92pt'}}>申报项目状态
              </td>
              <td colSpan={7} className="xl115" width={783}
                  style={{borderRight: '.5pt solid black', borderLeft: 'none', width: '587pt'}}>
                {oneObj.reportProStatusName}
              </td>
            </tr>
            <tr height={26} style={{msoHeightSource: 'userset', height: '20.25pt'}}>
              <td height={26} className="xl66" width={122}
                  style={{height: '20.25pt', borderTop: 'none', width: '92pt'}}>项目支持行业
              </td>
              <td colSpan={7} className="xl115" width={783}
                  style={{borderRight: '.5pt solid black', borderLeft: 'none', width: '587pt'}}>
                {oneObj.proSupIndustryName}
              </td>
            </tr>
            <tr height={38} style={{height: '28.8pt'}}>
              <td height={38} className="xl66" width={122}
                  style={{height: '28.8pt', borderTop: 'none', width: '92pt'}}>项目储备责任领导
              </td>
              <td colSpan={2} className="xl87" width={192}
                  style={{borderRight: '.5pt solid black', borderLeft: 'none', width: '144pt'}}>
                {oneObj.proStoreLeader}
              </td>
              <td className="xl76" width={122} style={{borderTop: 'none', borderLeft: 'none', width: '92pt'}}>项目储备责任人
              </td>
              <td colSpan={4} className="xl87" width={469}
                  style={{borderRight: '.5pt solid black', borderLeft: 'none', width: '351pt'}}>
                {oneObj.proStorePrincipal}
              </td>
            </tr>
            <tr height={24} style={{msoHeightSource: 'userset', height: '18.0pt'}}>
              <td rowSpan={3} height={74} className="xl118" width={122}
                  style={{borderBottom: '.5pt solid black', height: '56.25pt', borderTop: 'none', width: '92pt'}}>项目储备金额
              </td>
              <td className="xl77" width={100} style={{borderTop: 'none', borderLeft: 'none', width: '75pt'}}>拟融资额度<span
                style={{msoSpacerun: 'yes'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              </td>
              <td colSpan={3} className="xl121" width={318}
                  style={{borderRight: '.5pt solid black', borderLeft: 'none', width: '239pt'}}>{oneObj.financingQuota}
              </td>
              <td className="xl77" width={130} style={{borderTop: 'none', borderLeft: 'none', width: '97pt'}}>期限</td>
              <td colSpan={2} className="xl124"
                  style={{borderRight: '.5pt solid black', borderLeft: 'none'}}>{oneObj.timeLimit}
              </td>
            </tr>
            <tr height={26} style={{msoHeightSource: 'userset', height: '20.25pt'}}>
              <td rowSpan={2} height={50} className="xl125" width={100}
                  style={{borderBottom: '.5pt solid black', height: '38.25pt', borderTop: 'none', width: '75pt'}}>融资品种
              </td>
              <td className="xl77" width={92} style={{borderTop: 'none', borderLeft: 'none', width: '69pt'}}>流贷<span
                style={{msoSpacerun: 'yes'}}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                {/*<Radio checked={oneObj.variety === 0}
                       disabled={true}/>*/}
                {oneObj.variety === 0 ? '√口' : '口'}
              </td>
              <td className="xl77" width={122} style={{borderTop: 'none', borderLeft: 'none', width: '92pt'}}>法人按揭<span
                style={{msoSpacerun: 'yes'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>
                {/*   <Radio checked={oneObj.variety === 1}
                       disabled={true}/>*/}
                {oneObj.variety === 1 ? '√' : '口'}
              </td>
              <td className="xl77" width={104} style={{borderTop: 'none', borderLeft: 'none', width: '78pt'}}>银团贷款<span
                style={{msoSpacerun: 'yes'}}>&nbsp;&nbsp; </span>
                {/*<Radio checked={oneObj.variety === 2}
                       disabled={true}/>*/}
                {oneObj.variety === 2 ? '√' : '口'}
              </td>
              <td className="xl77" width={130} style={{borderTop: 'none', borderLeft: 'none', width: '97pt'}}>并购贷款<span
                style={{msoSpacerun: 'yes'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>
                {/*<Radio checked={oneObj.variety === 3}
                       disabled={true}/>*/}
                {oneObj.variety === 3 ? '√' : '口'}
              </td>
              <td colSpan={2} className="xl127" style={{borderLeft: 'none'}}>国际贸易融资<span
                style={{msoSpacerun: 'yes'}}>&nbsp;&nbsp; </span>
                {/*<Radio checked={oneObj.variety === 7}
                       disabled={true}/>*/}
                {oneObj.variety === 7 ? '√' : '口'}
              </td>
            </tr>
            <tr height={24} style={{msoHeightSource: 'userset', height: '18.0pt'}}>
              <td height={24} className="xl77" width={92}
                  style={{height: '18.0pt', borderTop: 'none', borderLeft: 'none', width: '69pt'}}>保理<span
                style={{msoSpacerun: 'yes'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>
                {/*<Radio checked={oneObj.variety === 4}
                       disabled={true}/>*/}
                {oneObj.variety === 4 ? '√' : '口'}
              </td>
              <td className="xl77" width={122} style={{borderTop: 'none', borderLeft: 'none', width: '92pt'}}>票据融资<span
                style={{msoSpacerun: 'yes'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>
                {/*<Radio checked={oneObj.variety === 5}
                       disabled={true}/>*/}
                {oneObj.variety === 5 ? '√' : '口'}
              </td>
              <td className="xl77" width={104} style={{borderTop: 'none', borderLeft: 'none', width: '78pt'}}>项目贷款<span
                style={{msoSpacerun: 'yes'}}>&nbsp;&nbsp; </span>
                {/* <Radio checked={oneObj.variety === 6}
                       disabled={true}/>*/}
                {oneObj.variety === 6 ? '√' : '口'}
              </td>
              <td colSpan={3} className="xl128"
                  style={{borderRight: '.5pt solid black', borderLeft: 'none'}}>其它：{oneObj.varietyOther}
              </td>
            </tr>
            <tr height={19} style={{height: '14.4pt'}}>
              <td colSpan={8} height={19} className="xl105"
                  style={{borderRight: '.5pt solid black', height: '14.4pt'}}>一、项目基本情况
              </td>
            </tr>
            <tr height={19} style={{height: '14.4pt'}}>
              <td height={19} className="xl82" style={{height: '14.4pt', borderTop: 'none'}}>项目重要性</td>

              {queryEnum.weightNessEnum && Object.keys(queryEnum.weightNessEnum).map(key => {
                return (
                  <td colSpan={2} className="xl67" style={{borderLeft: 'none'}}
                      key={key}>{queryEnum.weightNessEnum[key]}<span
                    style={{msoSpacerun: 'yes'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
                    {/* <Radio checked={twoObj.weightiness === parseInt(key)}
                           disabled={true}
                    />*/}
                    {twoObj.weightiness === parseInt(key) ? '√' : '口'}
                  </td>
                )
              })}
            </tr>
            <tr height={38} style={{height: '28.8pt'}}>
              <td height={38} className="xl66" width={122}
                  style={{height: '28.8pt', borderTop: 'none', width: '92pt'}}>项目建设内容概述
              </td>
              <td colSpan={7} className="xl106" style={{borderRight: '.5pt solid black', borderLeft: 'none'}}>
                {twoObj.buildDesc}
              </td>
            </tr>
            <tr height={19} style={{height: '14.4pt'}}>
              <td height={19} className="xl66" width={122}
                  style={{height: '14.4pt', borderTop: 'none', width: '92pt'}}>项目建设进度
              </td>
              <td colSpan={7} className="xl102"
                  style={{borderRight: '.5pt solid black', borderLeft: 'none'}}>项目开工时间：{twoObj.startTime}<span
                style={{msoSpacerun: 'yes'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>项目竣工时间：{twoObj.endTime}<span
                style={{msoSpacerun: 'yes'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>建设周期：{twoObj.buildCircle}<span
                style={{msoSpacerun: 'yes'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>建设进度：{twoObj.buildProcess}
              </td>
            </tr>
            <tr height={32} style={{height: '24.0pt'}}>
              <td rowSpan={5} height={116} className="xl108" width={122} style={{
                borderBottom: '.5pt solid black',
                height: '87.0pt',
                borderTop: 'none',
                width: '92pt'
              }}>项目资金投资构成（万元）
              </td>
              <td className="xl72" width={100} style={{borderTop: 'none', borderLeft: 'none', width: '75pt'}}>总计（项目总投）
              </td>
              <td className="xl67" style={{borderTop: 'none', borderLeft: 'none'}}>{twoObj.totalMoney}</td>
              <td rowSpan={5} className="xl108" width={122}
                  style={{borderBottom: '.5pt solid black', borderTop: 'none', width: '92pt'}}>资金到位情况 （万元）
              </td>
              <td className="xl73" style={{borderTop: 'none', borderLeft: 'none'}}>总计</td>
              <td className="xl67" style={{borderTop: 'none', borderLeft: 'none'}}>{twoObj.totals}</td>
              <td rowSpan={5} className="xl113" width={122}
                  style={{borderTop: 'none', width: '91pt'}}>项目融资情况（包括但不限于政策性银行融资支持情况）
              </td>
              <td rowSpan={5} className="xl67" style={{borderTop: 'none'}}>{twoObj.financDesc}</td>
            </tr>
            <tr height={21} style={{msoHeightSource: 'userset', height: '15.75pt'}}>
              <td height={21} className="xl79" width={100}
                  style={{height: '15.75pt', borderTop: 'none', borderLeft: 'none', width: '75pt'}}>项目资本金
              </td>
              <td className="xl80" style={{borderTop: 'none', borderLeft: 'none'}}>{twoObj.principal}</td>
              <td className="xl79" width={104} style={{borderTop: 'none', borderLeft: 'none', width: '78pt'}}>政府补助</td>
              <td className="xl81" style={{borderTop: 'none', borderLeft: 'none'}}>{twoObj.govSubsidy}</td>
            </tr>
            <tr height={21} style={{msoHeightSource: 'userset', height: '15.75pt'}}>
              <td rowSpan={2} height={42} className="xl134" style={{height: '31.5pt'}}>其他类资金</td>
              <td rowSpan={2} className="xl116">{twoObj.otherMoney}</td>
              <td className="xl71" width={104} style={{borderLeft: 'none', width: '78pt'}}>自有资金</td>
              <td className="xl67" style={{borderLeft: 'none'}}>{twoObj.ownedFund}</td>
            </tr>
            <tr height={21} style={{msoHeightSource: 'userset', height: '15.75pt'}}>
              <td height={21} className="xl71" width={104}
                  style={{height: '15.75pt', borderTop: 'none', borderLeft: 'none', width: '78pt'}}>引进外资
              </td>
              <td className="xl67" style={{borderTop: 'none', borderLeft: 'none'}}>{twoObj.foreignCapital}</td>
            </tr>
            <tr height={21} style={{msoHeightSource: 'userset', height: '15.75pt'}}>
              <td height={21} className="xl78" style={{height: '15.75pt', borderTop: 'none', borderLeft: 'none'}}>融资
              </td>
              <td className="xl67" style={{borderTop: 'none', borderLeft: 'none'}}>{twoObj.raiseMoney}</td>
              <td className="xl71" width={104} style={{borderTop: 'none', borderLeft: 'none', width: '78pt'}}>其他资金</td>
              <td className="xl67" style={{borderTop: 'none', borderLeft: 'none'}}>{twoObj.otherFund}</td>
            </tr>
            <tr height={32} style={{height: '24.0pt'}}>
              <td rowSpan={2} height={64} className="xl108" width={122}
                  style={{height: '48.0pt', borderTop: 'none', width: '92pt'}}>项目合规要件情况
              </td>
              <td className="xl77" width={100} style={{borderTop: 'none', borderLeft: 'none', width: '75pt'}}>发改批复<span
                style={{msoSpacerun: 'yes'}}>&nbsp;&nbsp; </span>
                {/*  <Radio checked={this.campsCheck(0)}
                       disabled={true}/>*/}
                {this.campsCheck(0) ? '√' : '口'}
              </td>
              <td className="xl69" style={{borderTop: 'none', borderLeft: 'none'}}>土地<span
                style={{msoSpacerun: 'yes'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>
                {/*   <Radio checked={this.campsCheck(1)}
                       disabled={true}/>*/}
                {this.campsCheck(1) ? '√' : '口'}
              </td>
              <td className="xl69" style={{borderTop: 'none', borderLeft: 'none'}}>环评<span
                style={{msoSpacerun: 'yes'}}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                {/*<Radio checked={this.campsCheck(2)}
                       disabled={true}/>*/}
                {this.campsCheck(2) ? '√' : '口'}
              </td>
              <td className="xl77" width={104} style={{borderTop: 'none', borderLeft: 'none', width: '78pt'}}>矿压评估<span
                style={{msoSpacerun: 'yes'}}>&nbsp;&nbsp; </span>
                {/*<Radio checked={this.campsCheck(3)}
                       disabled={true}/>*/}
                {this.campsCheck(3) ? '√' : '口'}
              </td>
              <td className="xl77" width={130}
                  style={{borderTop: 'none', borderLeft: 'none', width: '97pt'}}>规划或建设许可<span
                style={{msoSpacerun: 'yes'}}>&nbsp;&nbsp; </span>
                {/*   <Radio checked={this.campsCheck(4)}
                       disabled={true}/>*/}
                {this.campsCheck(4) ? '√' : '口'}
              </td>
              <td className="xl78" style={{borderTop: 'none', borderLeft: 'none'}}>林地<span
                style={{msoSpacerun: 'yes'}}>&nbsp;&nbsp; </span>
                {/*<Radio checked={this.campsCheck(5)}
                       disabled={true}/>*/}
                {this.campsCheck(5) ? '√' : '口'}
              </td>
              <td className="xl78" style={{borderTop: 'none', borderLeft: 'none'}}>节能评估<span
                style={{msoSpacerun: 'yes'}}>&nbsp;&nbsp; </span>
                {/*<Radio checked={this.campsCheck(6)}
                       disabled={true}/>*/}
                {this.campsCheck(6) ? '√' : '口'}
              </td>
            </tr>
            <tr height={32} style={{height: '24.0pt'}}>
              <td height={32} className="xl77" width={100}
                  style={{height: '24.0pt', borderTop: 'none', borderLeft: 'none', width: '75pt'}}>水土保持<span
                style={{msoSpacerun: 'yes'}}>&nbsp;&nbsp;
                </span>
                {/*<Radio checked={this.campsCheck(7)}
                       disabled={true}/>*/}
                {this.campsCheck(7) ? '√' : '口'}
              </td>
              <td className="xl77" width={92} style={{borderTop: 'none', borderLeft: 'none', width: '69pt'}}>移民安置<span
                style={{msoSpacerun: 'yes'}}>&nbsp;&nbsp; </span>
                {/*<Radio checked={this.campsCheck(8)}
                       disabled={true}/>*/}
                {this.campsCheck(8) ? '√' : '口'}
              </td>
              <td colSpan={5} className="xl117" width={591}
                  style={{
                    borderRight: '.5pt solid black',
                    borderLeft: 'none',
                    width: '443pt'
                  }}>其他：{twoObj.compCaseOther}
              </td>
            </tr>
            <tr height={64} style={{msoHeightSource: 'userset', height: '48.0pt'}}>
              <td height={64} className="xl66" width={122} style={{height: '48.0pt', width: '92pt'}}>项目综合贡献度</td>
              <td colSpan={7} className="xl115" width={783}
                  style={{
                    borderRight: '.5pt solid black',
                    borderLeft: 'none',
                    width: '587pt'
                  }}>拉动对公负债: {twoObj.publicDept}<span
                style={{msoSpacerun: 'yes'}}>&nbsp;&nbsp; </span>万元，公私联动，拉动对私负债:{twoObj.privateLiability}<span
                style={{msoSpacerun: 'yes'}}>&nbsp;&nbsp;&nbsp;&nbsp; </span>万元，个人资产:{twoObj.personalCapital}<span
                style={{msoSpacerun: 'yes'}}>&nbsp;&nbsp;&nbsp; </span>万元，其他个人业务:{twoObj.otherPersonalBusiness}<span
                style={{msoSpacerun: 'yes'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>开立对公账户:{twoObj.openPubAccount}<span style={{msoSpacerun: 'yes'}}>&nbsp;&nbsp;&nbsp;
                </span>户，运用供应链产品情况：{twoObj.otherSupChainProd}
              </td>
            </tr>
            <tr height={19} style={{height: '14.4pt'}}>
              <td colSpan={8} height={19} className="xl132" width={905}
                  style={{borderRight: '.5pt solid black', height: '14.4pt', width: '679pt'}}>二、融资主体
              </td>
            </tr>
            <tr height={19} style={{height: '14.4pt'}}>
              <td height={19} className="xl66" width={122}
                  style={{height: '14.4pt', borderTop: 'none', width: '92pt'}}>客户名称
              </td>
              <td colSpan={2} className="xl87" width={192}
                  style={{borderRight: '.5pt solid black', borderLeft: 'none', width: '144pt'}}>
                {threeObj.cusName}
              </td>
              <td className="xl66" width={122} style={{borderTop: 'none', borderLeft: 'none', width: '92pt'}}>内外部评级</td>
              <td colSpan={4} className="xl87" width={469}
                  style={{borderRight: '.5pt solid black', borderLeft: 'none', width: '351pt'}}>
                {threeObj.grade}
              </td>
            </tr>
            <tr height={19} style={{height: '14.4pt'}}>
              <td height={19} className="xl66" width={122}
                  style={{height: '14.4pt', borderTop: 'none', width: '92pt'}}>合作情况
              </td>
              <td colSpan={2} className="xl115" width={192}
                  style={{borderRight: '.5pt solid black', borderLeft: 'none', width: '144pt'}}>新增客户<span
                style={{msoSpacerun: 'yes'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
                {/*  <Radio checked={threeObj.coopSituation === 0} disabled={true}/>*/}
                {threeObj.coopSituation === 0 ? '√' : '口'}
                <span
                  style={{msoSpacerun: 'yes'}}>&nbsp;&nbsp;</span></td>
              <td className="xl66" width={122} style={{borderTop: 'none', borderLeft: 'none', width: '92pt'}}>存量客户</td>
              <td className="xl70" width={104} style={{borderTop: 'none', borderLeft: 'none', width: '78pt'}}>1年<span
                style={{msoSpacerun: 'yes'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>
                {/*<Radio
                checked={threeObj.coopYear === 0} disabled={true}/>*/}
                {threeObj.coopYear === 0 ? '√' : '口'}
                <span
                  style={{msoSpacerun: 'yes'}}>&nbsp;&nbsp;</span></td>
              <td className="xl67" style={{borderTop: 'none', borderLeft: 'none'}}>1-3年<span
                style={{msoSpacerun: 'yes'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
                {/*<Radio checked={threeObj.coopYear === 1} disabled={true}/>*/}
                {threeObj.coopYear === 1 ? '√' : '口'}
                <span
                  style={{msoSpacerun: 'yes'}}>&nbsp;</span></td>
              <td colSpan={2} className="xl101" style={{borderRight: '.5pt solid black', borderLeft: 'none'}}>3年以上<span
                style={{msoSpacerun: 'yes'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
                {/*   <Radio checked={threeObj.coopYear === 2} disabled={true}/>*/}
                {threeObj.coopYear === 2 ? '√' : '口'}
                <span
                  style={{msoSpacerun: 'yes'}}>&nbsp;</span></td>
            </tr>
            <tr height={38} style={{height: '28.8pt'}}>
              <td height={38} className="xl83" width={122}
                  style={{height: '28.8pt', borderTop: 'none', width: '92pt'}}>股东构成情况及股权占比
              </td>
              <td colSpan={2} className="xl87" width={192}
                  style={{
                    borderRight: '.5pt solid black',
                    borderLeft: 'none',
                    width: '144pt'
                  }}>{threeObj.stockholder}</td>
              <td className="xl66" width={122} style={{borderTop: 'none', borderLeft: 'none', width: '92pt'}}>注册资金到位情况
              </td>
              <td colSpan={4} className="xl87" width={469}
                  style={{borderRight: '.5pt solid black', borderLeft: 'none', width: '351pt'}}>
                {/*注册资金<span
                style={{msoSpacerun: 'yes'}}>&nbsp;
                </span>{threeObj.fundsCase }万元、认缴资金到位<span style={{msoSpacerun: 'yes'}}>&nbsp; </span>万元，资金到位率<span
                style={{msoSpacerun: 'yes'}}>&nbsp;&nbsp; </span>%<span style={{msoSpacerun: 'yes'}}>&nbsp;</span>*/}
                {threeObj.fundsCase}
              </td>
            </tr>
            <tr height={58} style={{height: '43.2pt'}}>
              <td height={58} className="xl74" width={122}
                  style={{height: '43.2pt', borderTop: 'none', width: '92pt'}}>基本账户开立情况及主要资金结算行
              </td>
              <td colSpan={2} className="xl87" width={192}
                  style={{borderRight: '.5pt solid black', borderLeft: 'none', width: '144pt'}}>
                {threeObj.majorFund}
              </td>
              <td colSpan={2} className="xl100" width={226}
                  style={{borderRight: '.5pt solid black', borderLeft: 'none', width: '170pt'}}>有无授信逾期及涉诉
              </td>
              <td colSpan={3} className="xl101" style={{borderRight: '.5pt solid black', borderLeft: 'none'}}>
                {threeObj.lawsuit}
              </td>
            </tr>

            {threeObj.list && threeObj.list.map(item => {
              return [
                <tr height={37} style={{msoHeightSource: 'userset', height: '27.75pt'}}>
                  <td rowSpan={6} height={160} className="xl118" width={122}
                      style={{
                        borderBottom: '.5pt solid black',
                        height: '120.15pt',
                        borderTop: 'none',
                        width: '92pt'
                      }}>主要财务情况
                  </td>
                  <td colSpan={2} className="xl137" width={192} style={{borderLeft: 'none', width: '144pt'}}>
                      <span
                        style={{msoSpacerun: 'yes'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>科目<span
                    style={{msoSpacerun: 'yes'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>年度
                  </td>
                  <td className="xl70" width={122} style={{borderTop: 'none', borderLeft: 'none', width: '92pt'}}
                      colSpan={5}>{item.majorYear}</td>
                </tr>,
                <tr height={26} style={{msoHeightSource: 'userset', height: '19.5pt'}}>
                  <td colSpan={2} height={26} className="xl86" width={192}
                      style={{height: '19.5pt', borderLeft: 'none', width: '144pt'}}>资产
                  </td>
                  <td className="xl86" width={122} style={{borderTop: 'none', borderLeft: 'none', width: '92pt'}}
                      colSpan={5}>
                    {item.capital}
                  </td>

                </tr>,
                <tr height={26} style={{msoHeightSource: 'userset', height: '19.5pt'}}>
                  <td colSpan={2} height={26} className="xl86" width={192}
                      style={{height: '19.5pt', borderLeft: 'none', width: '144pt'}}>负债
                  </td>
                  <td className="xl86" width={122} style={{borderTop: 'none', borderLeft: 'none', width: '92pt'}}
                      colSpan={5}>
                    {item.liability}
                  </td>

                </tr>,
                <tr height={26} style={{msoHeightSource: 'userset', height: '19.5pt'}}>
                  <td colSpan={2} height={26} className="xl86" width={192}
                      style={{height: '19.5pt', borderLeft: 'none', width: '144pt'}}>营业收入
                  </td>
                  <td className="xl86" width={122} style={{borderTop: 'none', borderLeft: 'none', width: '92pt'}}
                      colSpan={5}>
                    {item.income}
                  </td>

                </tr>,
                <tr height={26} style={{msoHeightSource: 'userset', height: '19.5pt'}}>
                  <td colSpan={2} height={26} className="xl86" width={192}
                      style={{height: '19.5pt', borderLeft: 'none', width: '144pt'}}>净利润
                  </td>
                  <td className="xl86" width={122} style={{borderTop: 'none', borderLeft: 'none', width: '92pt'}}
                      colSpan={5}>
                    {item.netProfit}
                  </td>

                </tr>,
                <tr height={19} style={{height: '14.4pt'}}>
                  <td colSpan={3} height={19} className="xl135" width={314} style={{
                    borderRight: '.5pt solid black',
                    height: '14.4pt',
                    borderLeft: 'none',
                    width: '236pt'
                  }}>财务报表是否经过审计
                  </td>
                  <td className="xl87" width={104} style={{borderTop: 'none', borderLeft: 'none', width: '78pt'}}>是
                    {/*  <Radio checked={item.audit === 1} disabled={true}/>*/}
                    {item.audit === 1 ? '√' : '口'}
                  </td>
                  <td className="xl84" width={130} style={{borderTop: 'none', width: '97pt'}}>否
                    {/*  <Radio
                    checked={item.audit === 0} disabled={true}/>*/}
                    {item.audit === 0 ? '√' : '口'}
                  </td>
                  <td className="xl84" width={122} style={{borderTop: 'none', width: '91pt'}}/>
                  <td className="xl85" width={113} style={{borderTop: 'none', width: '85pt'}}/>
                </tr>
              ]
            })}


            <tr height={82} style={{msoHeightSource: 'userset', height: '62.25pt'}}>
              <td height={82} className="xl74" width={122}
                  style={{height: '62.25pt', borderTop: 'none', width: '92pt'}}>主要经营产品情况（勿以营业执照范围代替经营产品）
              </td>
              <td colSpan={7} className="xl115" width={783}
                  style={{borderRight: '.5pt solid black', borderLeft: 'none', width: '587pt'}}>
                {threeObj.majorProdCase}
              </td>
            </tr>
            <tr height={46} style={{msoHeightSource: 'userset', height: '34.5pt'}}>
              <td height={46} className="xl74" width={122}
                  style={{height: '34.5pt', borderTop: 'none', width: '92pt'}}>信贷系统测算授信业务限额（万元）
              </td>
              <td colSpan={7} className="xl115" width={783}
                  style={{borderRight: '.5pt solid black', borderLeft: 'none', width: '587pt'}}>
                {threeObj.businessLimit}
              </td>
            </tr>
            <tr height={78} style={{msoHeightSource: 'userset', height: '58.5pt'}}>
              <td height={78} className="xl66" width={122}
                  style={{height: '58.5pt', borderTop: 'none', width: '92pt'}}>还款来源（万元）
              </td>
              <td colSpan={7} className="xl115" width={783} style={{
                borderRight: '.5pt solid black',
                borderLeft: 'none',
                width: '587pt'
              }}>{threeObj.paymentSource}
              </td>
            </tr>
            <tr height={19} style={{height: '14.4pt'}}>
              <td colSpan={8} height={19} className="xl100" width={905}
                  style={{borderRight: '.5pt solid black', height: '14.4pt', width: '679pt'}}><span
                style={{msoSpacerun: 'yes'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>三、储备项目推动情况
              </td>
            </tr>
            <tr height={61} style={{msoHeightSource: 'userset', height: '45.75pt'}}>
              <td height={61} className="xl66" width={122}
                  style={{height: '45.75pt', borderTop: 'none', width: '92pt'}}>项目推进进度（推动记录留痕）
              </td>
              <td colSpan={7} className="xl131" width={783} style={{
                borderRight: '.5pt solid black',
                borderLeft: 'none',
                width: '587pt'
              }}>{fourObj.progress}
              </td>
            </tr>
            <tr height={20} style={{msoHeightSource: 'userset', height: '15.0pt'}}>
              <td height={20} className="xl66" width={122}
                  style={{height: '15.0pt', borderTop: 'none', width: '92pt'}}>预计上报时间
              </td>
              <td colSpan={7} className="xl91"
                  style={{borderRight: '.5pt solid black', borderLeft: 'none'}}>{fourObj.reportDate}
              </td>
            </tr>
            <tr height={19} style={{height: '14.4pt'}}>
              <td colSpan={8} height={19} className="xl132" width={905}
                  style={{borderRight: '.5pt solid black', height: '14.4pt', width: '679pt'}}>四、拟采取融资方案简述（含期限、利率）
              </td>
            </tr>
            <tr height={146} style={{msoHeightSource: 'userset', height: '109.5pt'}}>
              <td colSpan={8} height={146} className="xl132" width={905}
                  style={{borderRight: '.5pt solid black', height: '109.5pt', width: '679pt'}}>
                {fiveObj.description}
              </td>
            </tr>
            <tr height={20} style={{msoHeightSource: 'userset', height: '15.0pt'}}>
              <td height={20} className="xl66" width={122}
                  style={{height: '15.0pt', borderTop: 'none', width: '92pt'}}>出库时间<font
                className="font18">（项目已投放或不能继续推进方填写此项）</font></td>
              <td colSpan={7} className="xl91"
                  style={{borderRight: '.5pt solid black', borderLeft: 'none'}}>{fiveObj.outTime}
              </td>
            </tr>
            <tr className="xl89" height={20} style={{msoHeightSource: 'userset', height: '15.0pt'}}>
              <td height={20} className="xl88" width={122}
                  style={{height: '15.0pt', borderTop: 'none', width: '92pt'}}>出库理由（填写出库时间方需填写该项）
              </td>
              <td colSpan={7} className="xl97"
                  style={{
                    borderRight: '.5pt solid black',
                    borderLeft: 'none'
                  }}>{queryEnum.outBoundEnumMap && queryEnum.outBoundEnumMap[fiveObj.reason]}
              </td>
            </tr>
            <tr height={0} style={{display: 'none'}}>
              <td width={122} style={{width: '92pt'}}/>
              <td width={100} style={{width: '75pt'}}/>
              <td width={92} style={{width: '69pt'}}/>
              <td width={122} style={{width: '92pt'}}/>
              <td width={104} style={{width: '78pt'}}/>
              <td width={130} style={{width: '97pt'}}/>
              <td width={122} style={{width: '91pt'}}/>
              <td width={113} style={{width: '85pt'}}/>
            </tr>
            </tbody>
          </table>
        </div>
        <div className={'canvas-box'}></div>
      </div>
    )
  }
}

const CreateOrEdit = Form.create()(CreateOrEditFrom)
export default CreateOrEdit
