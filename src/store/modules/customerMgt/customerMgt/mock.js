const base = '/mock/gap/api/customer'


module.exports = function (router) {

  // 客户管理－客户列表
  router.post('/mock/crm-fd/api/customer/search', function(req, res, next) {
    res.json({
      "success": true,
      "payload": {
        "data": [
          {
            "id": "11111111",
            "cnName": "云南白药控股有限公司",
            "legalPerson": "陈发树",
            "openDate": "1997-09-01",
            "extCrdtLevel": "AAA",
            "industryType": "医药制造类",
            "regAddress": "云南省昆明市呈贡区云南白药街3686号",
            "operRange": "植物药原料基地的开发和经营： 药品生产、销售(限所投资企业凭许可证生产、经营)、研发。在整个过程中都能赶到好处，对不对啊。",
            "regCapital": "5,000.00",
            "openOrg": "官渡支行－张红",
            "isList": "上市公司",
            "holdType": "A股上市"
          },
          {
            "id": "22222222",
            "cnName": "云南白药控股有限公司",
            "legalPerson": "陈发树",
            "openDate": "1997-09-01",
            "extCrdtLevel": "AAA",
            "industryType": "医药制造类",
            "regAddress": "云南省昆明市呈贡区云南白药街3686号",
            "operRange": "植物药原料基地的开发和经营： 药品生产、销售(限所投资企业凭许可证生产、经营)、研发...",
            "regCapital": "5,000.00",
            "openOrg": "官渡支行－张红",
            "isList": "上市公司",
            "holdType": "A股上市"
          },
          {
            "id": "33333333",
            "cnName": "云南白药控股有限公司",
            "legalPerson": "陈发树",
            "openDate": "1997-09-01",
            "extCrdtLevel": "AAA",
            "industryType": "医药制造类",
            "regAddress": "云南省昆明市呈贡区云南白药街3686号",
            "operRange": "植物药原料基地的开发和经营： 药品生产、销售(限所投资企业凭许可证生产、经营)、研发...",
            "regCapital": "5,000.00",
            "openOrg": "官渡支行－张红",
            "isList": "上市公司",
            "holdType": "A股上市"
          },
          {
            "id": "44444444",
            "cnName": "云南白药控股有限公司",
            "legalPerson": "陈发树",
            "openDate": "1997-09-01",
            "extCrdtLevel": "AAA",
            "industryType": "医药制造类",
            "regAddress": "云南省昆明市呈贡区云南白药街3686号",
            "operRange": "植物药原料基地的开发和经营： 药品生产、销售(限所投资企业凭许可证生产、经营)、研发...",
            "regCapital": "5,000.00",
            "openOrg": "官渡支行－张红",
            "isList": "上市公司",
            "holdType": "A股上市"
          },
          {
            "id": "55555555",
            "cnName": "云南白药控股有限公司",
            "legalPerson": "陈发树",
            "openDate": "1997-09-01",
            "extCrdtLevel": "AAA",
            "industryType": "医药制造类",
            "regAddress": "云南省昆明市呈贡区云南白药街3686号",
            "operRange": "植物药原料基地的开发和经营： 药品生产、销售(限所投资企业凭许可证生产、经营)、研发...",
            "regCapital": "5,000.00",
            "openOrg": "官渡支行－张红",
            "isList": "上市公司",
            "holdType": "A股上市"
          },
          {
            "id": "66666666",
            "cnName": "云南白药控股有限公司",
            "legalPerson": "陈发树",
            "openDate": "1997-09-01",
            "extCrdtLevel": "AAA",
            "industryType": "医药制造类",
            "regAddress": "云南省昆明市呈贡区云南白药街3686号",
            "operRange": "植物药原料基地的开发和经营： 药品生产、销售(限所投资企业凭许可证生产、经营)、研发...",
            "regCapital": "5,000.00",
            "openOrg": "官渡支行－张红",
            "isList": "上市公司",
            "holdType": "A股上市"
          },
          {
            "id": "7777777",
            "cnName": "云南白药控股有限公司",
            "legalPerson": "陈发树",
            "openDate": "1997-09-01",
            "extCrdtLevel": "AAA",
            "industryType": "医药制造类",
            "regAddress": "云南省昆明市呈贡区云南白药街3686号",
            "operRange": "植物药原料基地的开发和经营： 药品生产、销售(限所投资企业凭许可证生产、经营)、研发...",
            "regCapital": "5,000.00",
            "openOrg": "官渡支行－张红",
            "isList": "上市公司",
            "holdType": "A股上市"
          },
          {
            "id": "88888888",
            "cnName": "云南白药控股有限公司",
            "legalPerson": "陈发树",
            "openDate": "1997-09-01",
            "extCrdtLevel": "AAA",
            "industryType": "医药制造类",
            "regAddress": "云南省昆明市呈贡区云南白药街3686号",
            "operRange": "植物药原料基地的开发和经营： 药品生产、销售(限所投资企业凭许可证生产、经营)、研发...",
            "regCapital": "5,000.00",
            "openOrg": "官渡支行－张红",
            "isList": "上市公司",
            "holdType": "A股上市"
          },
          {
            "id": "99999999",
            "cnName": "云南白药控股有限公司",
            "legalPerson": "陈发树",
            "openDate": "1997-09-01",
            "extCrdtLevel": "AAA",
            "industryType": "医药制造类",
            "regAddress": "云南省昆明市呈贡区云南白药街3686号",
            "operRange": "植物药原料基地的开发和经营： 药品生产、销售(限所投资企业凭许可证生产、经营)、研发...",
            "regCapital": "5,000.00",
            "openOrg": "官渡支行－张红",
            "isList": "上市公司",
            "holdType": "A股上市"
          },
          {
            "id": "45678231",
            "cnName": "云南白药控股有限公司",
            "legalPerson": "陈发树",
            "openDate": "1997-09-01",
            "extCrdtLevel": "AAA",
            "industryType": "医药制造类",
            "regAddress": "云南省昆明市呈贡区云南白药街3686号",
            "operRange": "植物药原料基地的开发和经营： 药品生产、销售(限所投资企业凭许可证生产、经营)、研发...",
            "regCapital": "5,000.00",
            "openOrg": "官渡支行－张红",
            "isList": "上市公司",
            "holdType": "A股上市"
          },
          {
            "id": "12345678",
            "cnName": "云南白药控股有限公司",
            "legalPerson": "陈发树",
            "openDate": "1997-09-01",
            "extCrdtLevel": "AAA",
            "industryType": "医药制造类",
            "regAddress": "云南省昆明市呈贡区云南白药街3686号",
            "operRange": "植物药原料基地的开发和经营： 药品生产、销售(限所投资企业凭许可证生产、经营)、研发...",
            "regCapital": "5,000.00",
            "openOrg": "官渡支行－张红",
            "isList": "上市公司",
            "holdType": "A股上市"
          },
        ],
        "total": 11
      }
    })
  })


  // 客户详情
  router.get(`${base}/basic/general`, function (req, res, next) {
    res.json({
      success: true,
      payload: {
        data: {
          acctMgerOrg: '管户员机构',// 管户员机构 ,
          accumulativeExport: '累计出口金额',//  累计出口金额,
          accumulativeImport: '累计进口金额',// 累计进口金额,
          advanCorp: '优势企业',//  优势企业,
          apprvDate: '核准日期',// 核准日期,
          basicOpenAcctBank: '基本户开户行',// 基本户开户行,
          belongBranch: '归属支行',//  归属支行,
          branchOrg: '分支机构',//  分支机构,
          businessLimit: '营业期限',// 营业期限,
          capital: '资产金额',//  资产金额,
          certCode: '证件号码',// 证件号码,
          certType: '证件类型',// 证件类型,
          cnName: '中文名称',//  中文名称,
          cnShortName: '中文简称',// 中文简称,
          code: '客户编号',//  客户编号,
          contMan: '联系人',// 联系人,
          contTel: '联系电话',//  联系电话,
          cooperationLimit: '与我行合作年限',//  与我行合作年限,
          crdtAcctMger: '信贷管户员',// 信贷管户员,
          ctyLimitCtrlCorp: '国家宏观调控限控行业',//  国家宏观调控限控行业,
          dataOrgNo: '数据归属机构号',//  数据归属机构号,
          dataUserNo: '数据归属客户经理号',//  数据归属客户经理号,
          employeeCnt: '企业人数',//  企业人数,
          enName: '英文名称',// 英文名称,
          enterpriseScale: '企业规模',// 企业规模,
          envmtAsesLevel: '环评等级',//  环评等级,
          extCrdtLevel: '外部信用等级',//  外部信用等级,
          groupCustType: '集团客户类型',// 集团客户类型,
          groupNo: '集团编号',// 集团编号,
          holdName: '股东名称',//  股东名称,
          holdType: '控股类型',// 控股类型,
          impExpInd: '进出口权标识',// 进出口权标识,
          industry: '客户行业',//  客户行业,
          industryType: '行业标签',//  行业标签,
          intCrdtLevel: '内部信用等级',// 内部信用等级,
          intRatingDate: '内部评级日期',//  内部评级日期,
          investMain: '投资主体',//  投资主体,
          isCrdt: '是否信贷户',//  是否信贷户,
          isCustomer: '客户属性',// 客户属性,
          isDiff: '行内外是否相同标识',// 行内外是否相同标识,
          isGoverFinPlat: '是否政府融资平台',// 是否政府融资平台,
          isGroup: '是否集团户',// 是否集团户,
          isInter: '行内外客户标识',//  行内外客户标识：1 行内，2行外 ,
          isInterStl: '是否国结户',// 是否国结户 ,
          isList: '是否上市',//  是否上市 ,
          isPotential: '是否是潜在客户',// 是否是潜在客户 ,
          isTallRemain: '是否两高一剩',//  是否两高一剩 ,
          legalPerson: '法定代表人',// 法定代表人 ,
          level: '客户级别',// 客户级别 ,
          lifecycle: '客户生命周期',//  客户生命周期 ,
          loanCardNo: '贷款卡编号',//  贷款卡编号 ,
          localTaxRegCd: '地税税务登记代码',// 地税税务登记代码 ,
          managerNo: '客户经理',//  客户经理 ,
          matureDate: '到期日期',//  到期日期 ,
          name: '名称',//  名称 ,
          nationTaxRegCd: '国税税务登记代码',// 国税税务登记代码 ,
          objectKey: '客户标识',// 客户标识，es搜索用，前端不用关心 ,
          openDate: '开户日期', //开户日期 ,
          openLics: '开户许可证',//开户许可证 ,
          openOrg: '开户机构',// 开户机构 ,
          openTellerNo: '开户柜员号',//  开户柜员号 ,
          operRange: '经营范围',//  经营范围 ,
          operStatus: '经营状态',//  经营状态 ,
          orgCode: '组织机构代码',//  组织机构代码 ,
          ownSys: '企业所有制',// 企业所有制 ,
          publicSector: '上市板块',// 上市板块 ,
          public_sector: '',// ,
          regAddress: '注册地址',//  注册地址 ,
          regCapital: '注册资本',//  注册资本 ,
          regCity: '注册城市',//  注册城市 ,
          regCurrency: '注册币种',// 注册币种 ,
          regDate: '注册日期',// 注册日期 ,
          regNo: '注册编号',//  注册编号 ,
          regOrg: '登记机关',//  登记机关 ,
          regProvince: '注册省份',//  注册省份 ,
          regStatus: '注册状态',//  注册状态 ,
          regType: '注册类型',//  注册类型 ,
          riskLevel: '风险等级',// 风险等级 ,
          shareholder: '股东类型',// 股东类型 ,
          status: '经营状况',//  经营状况 ,
          stockType: '股票类型',// 股票类型 ,
          suprSalaryCorp: '高薪企业',// 高薪企业 ,
          totalDeposit: '存款总额',//  存款总额 ,
          totalLoan: '贷款余额',//  贷款余额 ,
          unifiedSocialCode: '统一社会信用代码',// 统一社会信用代码 ,
          zoneImpCorp: '地区重点企业',//  地区重点企业
        }
      },
      message: {
        type: 'mock'
      }
    })
  })

  //搜索客户列表
  router.post(`${base}/search`, function (req, res, next) {
    res.json(
      {
        "message": {},
        "payload": {
          "data": [
            {
              "acctMgerOrg": "string", //管户员机构
              "accumulativeExport": "string",//累计出口金额
              "accumulativeImport": "string",//累计进口金额
              "advanCorp": "string",//优势企业
              "apprvDate": "string",//核准日期
              "basicOpenAcctBank": "string",//基本户开户行
              "belongBranch": "string",// 归属支行
              "branchOrg": "string",//分支机构
              "businessLimit": "string",//营业期限 ,
              "capital": "string",//资产金额 ,
              "certCode": "string",// 证件号码 ,
              "certType": "string",//证件类型 ,
              "cnName": "string",//中文名称 ,
              "cnShortName": "string",//中文简称 ,
              "code": "string",//客户编号 ,
              "contMan": "string",//联系人 ,
              "contTel": "string",//联系电话 ,
              "cooperationLimit": "string",// 与我行合作年限 ,
              "crdtAcctMger": "string",// 信贷管户员
              "ctyLimitCtrlCorp": "string",//国家宏观调控限控行业 ,
              "dataOrgNo": "string",//数据归属机构号 ,
              "dataUserNo": "string",//数据归属客户经理号 ,
              "employeeCnt": "string",//企业人数 ,
              "enName": "string",// 英文名称
              "enterpriseScale": "string",//企业规模 ,
              "envmtAsesLevel": "string",// 环评等级 ,
              "extCrdtLevel": "string",//外部信用等级 ,
              "groupCustType": "string",//集团客户类型 ,
              "groupNo": "string",// 集团编号 ,
              "holdName": "string",//股东名称 ,
              "holdType": "string",//控股类型 ,
              "impExpInd": "string",//进出口权标识 ,
              "industry": "string",//客户行业 ,
              "industryType": "string",//行业标签 ,
              "intCrdtLevel": "string",//内部信用等级 ,
              "intRatingDate": "string",// 内部评级日期 ,
              "investMain": "string",//投资主体
              "isCrdt": "string",//是否信贷户 ,
              "isCustomer": "string",// 客户属性 ,
              "isDiff": "string",//行内外是否相同标识 ,
              "isGoverFinPlat": "string",// 是否政府融资平台 ,
              "isGroup": "string",//是否集团户 ,
              "isInter": "string",//行内外客户标识：1行内，2行外 ,
              "isInterStl": "string",// 是否国结户 ,
              "isList": "string",//是否上市 ,
              "isPotential": "string",//是否是潜在客户 ,
              "isTallRemain": "string",//是否两高一剩 ,
              "legalPerson": "string",//法定代表人 ,
              "level": "string",// 客户级别 ,
              "lifecycle": "string",//客户生命周期 ,
              "loanCardNo": "string",//贷款卡编号 ,
              "localTaxRegCd": "string",//地税税务登记代码 ,
              "managerNo": "string",//客户经理 ,
              "matureDate": "string",// 到期日期 ,
              "name": "string",//名称
              "nationTaxRegCd": "string",//国税税务登记代码 ,
              "objectKey": "1234567890",//客户标识，es搜索用，前端不用关心 ,
              "openDate": "string",// 开户日期 ,
              "openLics": "string",//开户许可证 ,
              "openOrg": "string",//开户机构 ,
              "openTellerNo": "string",//开户柜员号 ,
              "operRange": "string",//经营范围 ,
              "operStatus": "string",//经营状态 ,
              "orgCode": "string",//组织机构代码 ,
              "ownSys": "string",//企业所有制 ,
              "publicSector": "string",//上市板块 ,
              "public_sector": "string",//
              "regAddress": "string",// 注册地址 ,
              "regCapital": "string",//注册资本 ,
              "regCity": "string",//注册城市 ,
              "regCurrency": "string",// 注册币种 ,
              "regDate": "string",//注册日期 ,
              "regNo": "string",//注册编号 ,
              "regOrg": "string",//登记机关 ,
              "regProvince": "string",//注册省份 ,
              "regStatus": "string",//注册状态 ,
              "regType": "string",//注册类型 ,
              "riskLevel": "string",//风险等级 ,
              "shareholder": "string",//股东类型 ,
              "status": "string",//经营状况 ,
              "stockType": "string",//股票类型 ,
              "suprSalaryCorp": "string",//高薪企业 ,
              "totalDeposit": "string",//存款总额 ,
              "totalLoan": "string",//贷款余额 ,
              "unifiedSocialCode": "string",// 统一社会信用代码 ,
              "zoneImpCorp": "string"//地区重点企业
            }
          ],
          "pageNo": 1,
          "pageSize": 10,
          "total": 100,
          "totalPages": 0
        },
        "success": true
      }
    )
  })

  //根据account获取分配的客户经理
  router.get(`${base}/allocationCustomer/findAccount/:account`, function (req, res, next) {
    res.json({
      "message": {},
      "payload": {
        "data": [
          {
            "account": "9090976",
            "companyKey": "MD5",
            "institutionId": 123,
            "institutionName": "富滇银行",
            "persent": "10%",
            "userId": 123,
            "userName": "赵强"
          }
        ]
      },
      "success": true
    })
  })

  //根据companyKey获取该公司所有分配的客户经理
  router.get(`${base}/allocationCustomer/findCustomer/:companyKey`, function (req, res, next) {
    res.json({
      "message": {},
      "payload": {
        "data": [
          {
            "companyKey": "MD5",
            "companyName": "富通公司",
            "institutionId": 123,
            "institutionName": "富滇银行",
            "userId": 123,
            "userName": "赵强"
          }
        ]
      },
      "success": true
    })
  })

  //分配账户给客户经理
  router.post(`${base}/allocationCustomer/updateAccount`, function (req, res, next) {
    res.json({
      "message": {},
      "payload": {
        "data": {}
      },
      "success": true
    })
  })

  //分配客户给客户经理
  router.post(`${base}/allocationCustomer/updateCustomer`, function (req, res, next) {
    res.json({
      "message": {},
      "payload": {
        "data": {}
      },
      "success": true
    })
  })

  // 客户详情-客户基本信息
  router.get('/mock/gap/api/customer/basic/general/:companyKey', function(req, res, next){
    res.json({
      message: {},
      payload: {
        data: {
          name: '客户名称',
          code: '客户编号',
          certType: '证件类型',
          certCode: '证件编号',
          extCrdtLevel: '外部信用等级',
          intCrdtLevel: '内部信用等级',
          overdueCreditInquiries: '征信逾期次数',
          regNo: '工商营业执照注册号码',
          regDate: '营业执照发证日期',
          regCurrency: '注册资本币种',
          regCapital: '注册资本(元)',
          establishmentDate: '企业成立日期',
          regProvince: '所在国家(地区)？',
          regAddress: '住所？',
          localTaxRegCd: '地税税务登记代码',
          nationTaxRegCd: '国税税务登记代码',
          regType: '登记注册类型',
          basicOpenAcctBank: '基本账户开户行',
          industry: '国标行业分类？',
          employeeCnt: '职工人数',
          officeAddress: '办公地址',
          officeZip: '办公地邮编',
          contTel: '联系电话',
          groupName: '所属集团名称',
          operRange: '经营范围',
          isInter: '0',
        },
      },
      success: true,
    })
  })

  // 客户详情-账户信息（账户列表）
  router.get('/mock/gap/api/customer/basic/account/:companyKey', function(req, res, next){
    res.json({
      message: {},
      payload: {
        data: [
          {
            'amount': '100.00',
            'code': '12345678',
            'companyKey': '32位md5',
            'objectKey': '32位md5',
            'status': '0',
            'type': '活期账户',
            'updateDate': '2019-01-10',
          }, {
            'amount': '777.00',
            'code': '123678',
            'companyKey': '32位md5',
            'objectKey': '32位md5',
            'status': '0',
            'type': '活期账户',
            'updateDate': '2019-01-10',
          }, {
            'amount': '222.00',
            'code': '12348',
            'companyKey': '32位md5',
            'objectKey': '32位md5',
            'status': '0',
            'type': '活期账户',
            'updateDate': '2019-01-10',
          },
        ]
      },
      success: true,
    })
  })

  // 客户信息-财务信息
  router.get('/mock/gap/api/finance/findAll/:companyKey', function(req, res, next){
    res.json({
      message: '',
      payload: {
        data: [
          {
            adjReason: '调整原因',
            auditCorp: '审计单位',
            auditResult: '审计结论',
            companyKey: '客户主键',
            idAdj: 1,
            isAudit: 0,
            objectKey: '主键',
            reptPeriod: '报表周期',
            reptTermMinor: '报表期次',
          },
        ]
      },
      success: true,
    })
  })
}

