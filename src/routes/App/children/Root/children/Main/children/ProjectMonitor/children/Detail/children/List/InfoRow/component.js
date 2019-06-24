import React from 'react'
import './component.scss'

class InfoRow extends React.Component {

  toMoney(num){
    try{
      num = num.toFixed(2);
      num = parseFloat(num)
      num = num.toLocaleString();
    }catch (e) {
      num=0
    }
    return num;
  }
  render() {
    const {
      data
    } = this.props

    return (
      <div className='info-row-component'>
        <div className="row-header">
          <div className="row-header-title">
            {data.customerName} {data.customerCode}
          </div>
          <div className="row-header-info">
            <div className="header-info-item">
              开户时间：{data.openDate}
            </div>
            <div className="header-info-item">
              行业类型：{data.industryType }
            </div>
            <div className="header-info-item">
              一级行：{data.firstOrgId }
            </div>
            <div className="header-info-item">
              开户机构：{data.openOrgId  }
            </div>
            <div className="header-info-item">
              有效账户数：{data.activeAccount }
            </div>
          </div>
        </div>
        <div className="detail-warp">
          <div className="detail-item">
            <div className="item-row">
              <div className="item-col text">存款余额：</div>
              <div className="item-col">{this.toMoney(data.depositBalance)}</div>
            </div>
            <div className="item-row">
              <div className="item-col text">贷款余额：</div>
              <div className="item-col">{this.toMoney(data.loanBalance)}</div>
            </div>
            <div className="item-row">
              <div className="item-col text">授信额度：</div>
              <div className="item-col">{this.toMoney(data.lineOfCredit)}</div>
            </div>
            <div className="item-row">
              <div className="item-col text">授信余额：</div>
              <div className="item-col">{this.toMoney(data.creditBalance)}</div>
            </div>
            <div className="item-row">
              <div className="item-col text">活期存款：</div>
              <div className="item-col">{this.toMoney(data.loanBalance )}</div>
            </div>
            <div className="item-row">
              <div className="item-col text">保本理财：</div>
              <div className="item-col">{this.toMoney(data.bblc)}</div>
            </div>
          </div>
          <div className="detail-item">
            <div className="item-row">
              <div className="item-col text">非保本理财：</div>
              <div className="item-col">{this.toMoney(data.fbblc)}</div>
            </div>
            <div className="item-row">
              <div className="item-col text">大额存单：</div>
              <div className="item-col">{this.toMoney(data.certificateOfDeposit  )}</div>
            </div>
            <div className="item-row">
              <div className="item-col text">流动性贷款：</div>
              <div className="item-col">{this.toMoney(data.shortTerLoan)}</div>
            </div>
            <div className="item-row">
              <div className="item-col text">固定资产贷款：</div>
              <div className="item-col">{this.toMoney(data.fixedAssetLoan  )}</div>
            </div>
            <div className="item-row">
              <div className="item-col text">票据贴现：</div>
              <div className="item-col">{this.toMoney(data.notesDiscounted  )}</div>
            </div>
            <div className="item-row">
              <div className="item-col text">贸易融资：</div>
              <div className="item-col">{this.toMoney(data.tradeFinancing  )}</div>
            </div>
          </div>
          <div className="detail-item">
            <div className="item-row">
              <div className="item-col text">逾期贷款：</div>
              <div className="item-col">{this.toMoney(data.pastDueLoans  )}</div>
            </div>
            <div className="item-row">
              <div className="item-col text">中间业务收入：</div>
              <div className="item-col">{this.toMoney(data.income  )}</div>
            </div>
            <div className="item-row">
              <div className="item-col text">代发工资金额：</div>
              <div className="item-col">{this.toMoney(data.payrollCreditBalance  )}</div>
            </div>
            <div className="item-row">
              <div className="item-col text">代发工资人数：</div>
              <div className="item-col">{this.toMoney(data.payrollCreditQty  )}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default InfoRow
