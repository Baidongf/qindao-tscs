import React from 'react'
import { withRouter } from 'react-router-dom'
import { Form, Row, Col, Select, Input, Button, DatePicker, Radio, Upload, Icon, InputNumber, message } from 'antd'
import { Table } from 'antd';
import queryString from 'query-string'
import moment from 'moment'
import { commonChangeHandler } from 'utils/antd'
import HzBreadcrumb from 'components/HzBreadcrumb'
//import SingleOwnInstitution from 'components/SingleOwnInstitution'   //选择执行方的树形select组件
import styles from './component.module.scss'
import EditableFormRow from './children/editableFormRow'
import EditableCell from './children/editableCell'
const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group;
const labelProps = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
}

class CreateOrEditForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activityObj: {
        remindFlag: 1,
        executorType: 1,
        code: undefined,
      },
      activityNumber: '',
      isNumber: true,
      uploadedFileList: [],

      remainingHouseholds: 0, // 分配时，还未分配的户数
      remainingAmount: 0, // 分配时，还未分配的金额

      distributeOptions: {}, // 分配时的用户输入数据集合
      managerTree:[],
      institutionId:localStorage.INSTITUTION_ID,
      institutionManagers:[],
      shouldShowInstitutionManagers:false,
      selectedItems:[]
    }
    
    this.distributeUploadFile = false // 分配任务时是否上传了文件

    // 已上传的文件列表
    this.uploadedFileList = []

    this.queryObj = queryString.parse(props.location.search)
    this.operation = this.queryObj.operation
    switch (this.operation) {
      case 'create': this.state.operationCnName = '新建'; break
      case 'distribution': this.state.operationCnName = '分配'; break
      default:
    }

    this.id = this.queryObj.id

    this.distributeOptions = {} // 分配时的用户输入数据集合

    this.initType = this.queryObj.operation === 'distribution'
    this.fieldsValidateType = {
      name: this.initType, // 机构全称

      executorInstitutionId: this.initType, // 上级机构

      type: this.initType, // 机构状态

      effectiveDate: this.initType, // 生效日期
      // expiryDate: this.initType, // 失效日期
    }

    this.uploadFileHandler = this.uploadFileHandler.bind(this)
    this.startTimeDisabledDate = this.startTimeDisabledDate.bind(this)
    this.endTimeDisabledDate = this.endTimeDisabledDate.bind(this)
    this.loadActivityDetail = this.loadActivityDetail.bind(this)
    this.handleResetDistributeOption = this.handleResetDistributeOption.bind(this)
    this.isDistributeOptionsLegal = this.isDistributeOptionsLegal.bind(this)
  }
  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
  };
  // 提交新增营销活动的请求，组装数据
  submitHandler() {
    const { uploadedFileList, distributeOptions } = this.state
    const activityObj = Object.assign({}, this.state.activityObj)

    // 如果是分配，验证分配时用户填写的数据是否合法
    if (this.operation === 'distribution') {
      if (this.isDistributeOptionsLegal() === false) {
        console.log('分配数据有误')
        return false
      }
    }

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        console.log(err)
        return
      }

      // 日期转化为时间戳格式
      ['startTime', 'endTime'].forEach(dateKey => {
        if (activityObj[dateKey]) {
          activityObj[dateKey] = activityObj[dateKey].valueOf()
        }
      })

      // 对执行方进行数据格式转换
      // let executorInstitutionIds = []
      // const executorArr = activityObj.executorInstitutionIds
      // for (let executor of executorArr) {
      //   const idChain = executor.split('===')[1]
      //   const ids = idChain.split('-')
      //   for (let id of ids) {
      //     if (id + '' !== '0') {
      //       executorInstitutionIds.push(parseInt(id))
      //     }
      //   }
      // }
      // executorInstitutionIds = [...new Set(executorInstitutionIds)]
      // activityObj.executorInstitutionId = executorInstitutionIds

      // 组装文件列表数据
      if (uploadedFileList.length > 0) {
        let attachments = []
        if (
          this.operation === 'create' ||
          (this.operation === 'distribution' && this.distributeUploadFile)
        ) {
          attachments = uploadedFileList.map((file, index) => {
            return ({
              name: file.name,
              url: file.response.payload.data
            })
          })
        } else if (this.operation === 'distribution') {
          attachments = uploadedFileList
        }
        activityObj.attachments = attachments
      }

      // 组装分配任务的数据
      if (this.operation === 'distribution') {
        const ids = Object.keys(distributeOptions)
        let ainDos = []
        for (let id of ids) {
          ainDos.push(distributeOptions[`${id}`])
        }
        activityObj.ainDos = ainDos
      }

      this.props.saveActivity(activityObj, () => {
        this.props.history.goBack()
      })
    })
  }

  valueChangeHandler(key, value) {
    commonChangeHandler(this, 'activityObj', key, value)
    setTimeout(() => {
      this.validate(key)
    })
  }

  uploadFileHandler({ file, fileList }) {
    const that = this

    // 如果是分配任务，新上传文件后设置一个标志位，在提交前拼装数据时用
    if (that.operation === 'distribution') {
      that.distributeUploadFile = true
    }

    if (file.status === 'done' || file.status === 'removed') {
      that.uploadedFileList = fileList
      that.setState({ uploadedFileList: fileList })
    }
  }

  validate(fieldName) {
    this.props.form.validateFields([fieldName], { first: true }, (err, values) => {
      if (!err) {
        for (let key in values) {
          this.fieldsValidateType[key] = true
        }
      } else {
        for (let key in values) {
          this.fieldsValidateType[key] = false
        }
      }

      // this.updateSubmitType(this.fieldsValidateType, 'canSubmit')
    })
  }

  updateSubmitType(fieldsValidateType, stateKey) {
    for (let key in fieldsValidateType) {
      if (!fieldsValidateType[key]) {
        this.setState({
          [stateKey]: false
        })
        return
      }
    }

    this.setState({
      [stateKey]: true
    })
  }

  loadActivityDetail() {
    // 如果是分配活动，先获取活动详情
    if (this.operation === 'distribution') {
      this.props.getActivityDetail(this.id)
    }
  }

  componentDidMount() {
    this.props.getActivityNumber()
    // console.log(this.props.managerTree)
    this.props.getManagerTree(()=>{
      this.props.managerTree.children && this.setState({
        managerTree:this.props.managerTree.children
      })
    })
  }

  componentWillReceiveProps({ actDetail, actNumber ,managerTree }) {
    if (actDetail !== this.props.actDetail) {
      // 日期转化为时间戳格式
      // ['effectiveDate', 'expiryDate'].forEach(dateKey => {
      //   if (actDetail[dateKey]) {
      //     actDetail[dateKey] = actDetail[dateKey].valueOf()
      //   }
      // })
      const attachments = actDetail.attachments
      const uploadedFileList = attachments ? attachments.map(file => {
        return ({
          uid: file.id,
          name: file.name,
          url: file.url,
        })
      }) : []

      const executorInstitutionIds = actDetail.executorInstitutionIds
      const distributeOptions = {}
      executorInstitutionIds.forEach((id) => {
        // 在 distributeOptions 的内部，为每个执行方设置对应的对象，后期用来保存数据
        distributeOptions[`${id}`] = {}
      })

      this.setState({
        distributeOptions,
        uploadedFileList,
        activityObj: { ...actDetail },
        remainingHouseholds: actDetail.households,
        remainingAmount: actDetail.amount,
      })
      
    }

    if (actNumber !== this.props.actNumber) {
      this.setState({
        activityObj: {
          ...this.state.activityObj,
          code: actNumber.data
        }
      })
    }
    
    if(managerTree&&managerTree.id!==undefined&&managerTree.children === undefined){
      this.setState({
        shouldShowInstitutionManagers:true
      })
      this.props.getInstitutionManagers(this.state.institutionId,(data)=>{
        this.setState({
          institutionManagers:data.data
        })
      })
    }


  }

  startTimeDisabledDate(current) {
    const { endTime } = this.state.activityObj
    if (!!endTime) {
      return current > moment(endTime, 'YYYY-MM-DD').endOf('day')
    }
  }

  endTimeDisabledDate(current) {
    const { startTime } = this.state.activityObj
    if (!!startTime) {
      return current < moment(startTime, 'YYYY-MM-DD').endOf('day')
    }
  }

  handleResetDistributeOption() {
    const { households, amount } = this.state.activityObj
    const { distributeOptions } = this.state
    const idKeys = Object.keys(distributeOptions)
    idKeys.forEach(id => {
      distributeOptions[`${id}`] = {
        executorInstitutionId: id,
        household: undefined,
        targetAmount: undefined,
      }
    })

    this.setState({
      distributeOptions,
      remainingHouseholds: households,
      remainingAmount: amount,
    })
  }

  // 分配活动时，输入户数
  handleInputDistributeHouseholds(executorId, household) {
    const { households, executorInstitutionIds } = this.state.activityObj
    let { distributeOptions } = this.state

    // 1.将值保存在 distributeOptions 对应的对象中
    // 2.统计目前输入的总户数
    // 3.计算剩余户数
    if (
      !!distributeOptions[`${executorId}`] === false
    ) {
      // 依据目前勾选的 executorInstitutionIds 重新绘制 distributeOptions
      distributeOptions = {}
      executorInstitutionIds.forEach(newId => {
        const idChain = newId.split('===')[1]
        const ids = idChain.split('-')
        const id = ids[ids.length - 1]
        distributeOptions[`${id}`] = {}
      })
      distributeOptions[`${executorId}`] = {}
      distributeOptions[`${executorId}`].executorInstitutionId = executorId
      distributeOptions[`${executorId}`].household = household
    } else {
      distributeOptions[`${executorId}`].executorInstitutionId = executorId
      distributeOptions[`${executorId}`].household = household
    }

    const keys = Object.keys(distributeOptions)
    let remainingHouseholds = households
    let distributedHouseholds = 0
    keys.forEach(key => {
      let household = !!distributeOptions[`${key}`].household ? distributeOptions[`${key}`].household : 0
      distributedHouseholds += household
    })

    remainingHouseholds = households - distributedHouseholds

    this.setState({
      distributeOptions,
      remainingHouseholds,
    }, () => {
      // console.log(this.state.distributeOptions)
    })
  }

  // 分配活动时，输入金额
  handleInputDistributeAmount(executorId, targetAmount) {
    const { amount, executorInstitutionIds } = this.state.activityObj
    let { distributeOptions } = this.state

    // 1.将值保存在 distributeOptions 对应的对象中
    // 2.统计目前输入的总金额
    // 3.计算剩余金额
    if (
      !!distributeOptions[`${executorId}`] === false
    ) {
      // 依据目前勾选的 executorInstitutionIds 重新绘制 distributeOptions
      distributeOptions = {}
      executorInstitutionIds.forEach(newId => {
        const idChain = newId.split('===')[1]
        const ids = idChain.split('-')
        const id = ids[ids.length - 1]
        distributeOptions[`${id}`] = {}
      })
      distributeOptions[`${executorId}`] = {}
      distributeOptions[`${executorId}`].executorInstitutionId = executorId
      distributeOptions[`${executorId}`].targetAmount = targetAmount
    } else {
      distributeOptions[`${executorId}`].executorInstitutionId = executorId
      distributeOptions[`${executorId}`].targetAmount = targetAmount
    }

    const keys = Object.keys(distributeOptions)
    let remainingAmount = amount
    let distributedAmount = 0
    keys.forEach(key => {
      let amount = !!distributeOptions[`${key}`].targetAmount ? distributeOptions[`${key}`].targetAmount : 0
      distributedAmount += amount
    })

    remainingAmount = amount - distributedAmount

    this.setState({
      distributeOptions,
      remainingAmount,
    }, () => {
      // console.log(this.state.distributeOptions)
    })
  }

  // 检查分配时数据的合法性，在发起分配请求前调用
  isDistributeOptionsLegal() {
    const { operation } = this
    // 如果不是分配操作，则不作校验
    if (operation !== 'distribution') {
      return true
    }

    const { distributeOptions } = this.state
    const { households, amount } = this.state.activityObj
    let isLegal = true
    const ids = Object.keys(distributeOptions)
    const length = ids.length
    let totalDistributedHousehold = 0
    let totalDistributedAmount = 0

    /*
     * 不合法的情况：
     * 1. 填写不完整，有 household 或 targetAmount 为空
     * 2. 所有 household 的和超过总的 households / 所有 targetAmount 的和超过总的 amount
     * 3. 所有 household 的和小于总的 households / 所有 targetAmount 的和小于总的 amount
     * 4. ？
     *
    */
    for (let i = 0; i < length; i++) {
      let option = distributeOptions[`${ids[i]}`]

      // 用户是否填写完整
      if (
        !!option.household === false ||
        !!option.targetAmount === false
      ) {
        message.warning('请将分配内容填写完整')
        isLegal = false
        i = length
      }

      // 累加
      totalDistributedHousehold += option.household
      totalDistributedAmount += option.targetAmount

      // 当循环到末项后，对比两个数据(household / targetAmount)各自的总和与对应标准和(households / amount)之间的关系(必须相等)
      if (i === length - 1) {
        if (totalDistributedHousehold > households) {
          message.warning('分配的目标户数超过目标总户数，请修正')
          isLegal = false
        } else if (totalDistributedHousehold < households) {
          message.warning('分配的目标户数小于目标总户数，请修正')
          isLegal = false
        } else if (totalDistributedAmount > amount) {
          message.warning('分配的目标金额超过目标总金额，请修正')
          isLegal = false
        } else if (totalDistributedAmount < amount) {
          message.warning('分配的目标金额小于目标总金额，请修正')
          isLegal = false
        }
      }
    }

    return isLegal
  }

  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    }
    const { getFieldDecorator } = this.props.form
    const { operation } = this
    const {
      households,
      amount,
      executorInstitutionIds,
      executorInstitutionNames,
    } = this.state.activityObj
    const {
      distributeOptions,
      remainingHouseholds,
      remainingAmount,
    } = this.state
    
    let columns2 = [
      {
        title: '当前执行方',
        dataIndex: 'name',
        width: '40%'
      },
      {
        title: '目标户数',
        dataIndex: 'targetPeople',
        width: '30%',
        editable: true,
      },
      {
        title: '目标金额(万元)',
        dataIndex: 'targetMoney',
        width: '30%',
        editable: true,
      }
    ]
    const columns = columns2.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          initialValue:0,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div className={styles['createOrEdit-component']} >

        <HzBreadcrumb />

        <div className={styles['main-body']}>
          <Form className={styles['form']}>
            <div className={styles['form-content']}>
              <div className={styles['form-title']}>
                <span className={styles['text']}>{this.state.operationCnName}活动</span>
              </div>
              <div className={styles['form-body']}>
                <Row>
                  <Col span={11}>
                    <FormItem label='活动名称' {...labelProps}>
                      {getFieldDecorator('title', {
                        rules: [
                          { required: true, message: '请输入活动名称' },
                          { max: 20, message: '不能超过20字' },
                          { whitespace: true, message: '内容不能为空' }
                        ],
                        initialValue: this.state.activityObj.title
                      })(
                        <Input placeholder='请输入活动名称'
                          onChange={this.valueChangeHandler.bind(this, 'title')}
                        />
                      )}
                    </FormItem>
                  </Col>

                  {/* <Col span={11} push={1}>
                    <FormItem label='活动类型' {...labelProps}>
                      {getFieldDecorator('type', {
                        rules: [{ required: true, message: '请输入活动类型' }],
                        initialValue: this.state.activityObj.type
                      })(
                        <Select placeholder='请输入活动类型'
                          onChange={this.valueChangeHandler.bind(this, 'type')}
                        >
                          <Option value='营销任务'>营销任务</Option>
                          <Option value='营销活动'>营销活动</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col> */}
                  


                  {/* 20190508 隐藏活动编号 */}
                  {/* <Col span={11} push={1}>
                    <FormItem label='活动编号' {...labelProps}>
                      {getFieldDecorator('code', {
                        initialValue: this.props.actNumber.data
                      })(
                        <Input placeholder='请输入机构编号' disabled={this.state.isNumber}
                          onChange={this.valueChangeHandler.bind(this, 'code')}
                        />
                      )}
                    </FormItem>
                  </Col> */}
                </Row>

                <div className={styles['row-line-gap']}></div>

                <Row>
                  <Col span={11}>
                    <FormItem label='开始日期' {...labelProps} >
                      {getFieldDecorator('startTime', {
                        rules: [{ required: true, message: '请输入开始日期' }],
                        initialValue: this.state.activityObj.startTime ?
                          moment(this.state.activityObj.startTime, 'YYYY-MM-DD') : null
                      })(
                        <DatePicker placeholder='请输入开始日期' className={styles['time-style']}
                          onChange={this.valueChangeHandler.bind(this, 'startTime')}
                          disabledDate={this.startTimeDisabledDate}
                        />
                      )}
                    </FormItem>
                  </Col>

                  <Col span={11} push={1}>
                    <FormItem label='结束日期' {...labelProps}>
                      {getFieldDecorator('endTime', {
                        rules: [{ required: true, message: '请输入结束日期' }],
                        initialValue: this.state.activityObj.endTime ?
                          moment(this.state.activityObj.endTime, 'YYYY-MM-DD') : null
                      })(
                        <DatePicker placeholder='请输入结束日期' className={styles['time-style']}
                          onChange={this.valueChangeHandler.bind(this, 'endTime')}
                          disabledDate={this.endTimeDisabledDate}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>

                {/* <Row>
                  <Col span={11}>
                    <FormItem label='目标户数' {...labelProps}>
                      {getFieldDecorator('households', {
                        initialValue: this.state.activityObj.households
                      })(
                        <Input
                          placeholder='请输入目标户数'
                          type='number'
                          suffix={<span>户</span>}
                          onChange={this.valueChangeHandler.bind(this, 'households')}
                          disabled={operation === 'distribution'}
                        />
                      )}
                    </FormItem>
                  </Col>

                  <Col span={11} push={1}>
                    <FormItem label='目标金额' {...labelProps}>
                      {getFieldDecorator('amount', {
                        initialValue: this.state.activityObj.amount
                      })(
                        <Input
                          placeholder='请输入目标金额'
                          className='hide-arrow-button'
                          type='number'
                          suffix={<span>万元</span>}
                          onChange={this.valueChangeHandler.bind(this, 'amount')}
                          disabled={operation === 'distribution'}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row> */}

                <Row>
                  <Col span={11}>
                    <FormItem label='是否提醒' {...labelProps}>
                      {getFieldDecorator('remindFlag', {
                        initialValue: this.state.activityObj.remindFlag ? 0 : 1,
                      })(
                        <RadioGroup
                          onChange={this.valueChangeHandler.bind(this, 'remindFlag')}
                          className={styles['radio-group']}
                        >
                          <Radio value={0}>是</Radio>
                          <Radio value={1} className={styles['second-radio-button']}>否</Radio>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col>

                  <Col span={11} push={1}>
                    <FormItem label='提示天数' {...labelProps}>
                      {getFieldDecorator('remindDay', {
                        initialValue: this.state.activityObj.remindDay
                      })(
                        <Input placeholder='请输入倒计时提示天数' type="number"
                          onChange={this.valueChangeHandler.bind(this, 'remindDay')}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>

                <div className={styles['row-line-gap']}></div>
                <Row>
                  <Col span={11}>
                    {/* <FormItem label='执行方' {...labelProps}>
                      {getFieldDecorator('executorInstitutionIds', {
                        rules: [{ required: true, message: '请输入执行方' }],
                        // FIXME: 由于 Tree 组件的特殊性，这里无法直接将默认值渲染出来
                        // initialValue: this.state.activityObj.executorInstitutionIds
                      })(
                        <SingleOwnInstitution
                          multiple={true}
                          placeholder='请输入执行方'
                          onChange={this.valueChangeHandler.bind(this, 'executorInstitutionIds')}
                          onLoad={this.loadActivityDetail}
                        />
                      )}
                    </FormItem> */}
                    <FormItem label='执行方' {...labelProps}>
                      {getFieldDecorator('executorInstitutionIds', {
                        rules: [{ required: true, message: '请输入执行方' }],
                      })(
                      <Select
                        mode="multiple"
                        placeholder="请输入执行方"
                        onChange={
                          // this.valueChangeHandler.bind(this, 'executorInstitutionIds')
                          (selectedItems)=>{
                            let objArr=[]
                            selectedItems.map((item,index)=>{
                              let _item = item.split(":")
                              objArr.push({
                                key:index.toString(),
                                name:_item[0],
                                id:_item[1]
                              })
                            })
                            this.setState({
                              selectedItems:objArr
                            })
                          }
                        }
                        onLoad={this.loadActivityDetail}
                      >
                         {
                           this.state.shouldShowInstitutionManagers?
                           this.state.institutionManagers.map(
                             item => (
                              //  console.log(item)
                                <Select.Option key={item.id} value={item.name+":"+item.id}>
                                  {item.name}
                                </Select.Option>
                             )
                            ):
                           this.state.managerTree.map(
                              item => (
                                <Select.Option key={item.id} value={item.name+":"+item.id}>
                                  {item.name}
                                </Select.Option>
                              )
                            )
                          } 
                      </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>

                {
                this.state.selectedItems.length>0?
                <Table
                  components={components}
                  rowClassName={() => 'editable-row'}
                  bordered
                  dataSource={this.state.selectedItems}
                  columns={columns}
                  pagination={false}
                />:""}


                <div className={styles['row-line-gap']}></div>


                {/* <Row>
                  <Col span={12}>
                    <FormItem label='地址' {...labelProps}>
                      {getFieldDecorator('replace', {
                        rules: [{ whitespace: true, message: '内容不能为空' }],
                        initialValue: this.state.activityObj.replace
                      })(
                        <Input
                          placeholder='请输入地址'
                          className={styles['place-style']}
                          onChange={this.valueChangeHandler.bind(this, 'replace')}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row> */}

                <Row>
                  <Col span={12}>
                    <FormItem label='任务描述' {...labelProps}>
                      {getFieldDecorator('description', {
                        rules: [
                          { required: true, message: '请输入任务描述' },
                          { whitespace: true, message: '内容不能为空' },
                        ],
                        initialValue: this.state.activityObj.description
                      })(
                        <Input.TextArea
                          placeholder="请输入任务描述"
                          className={styles['task-style']}
                          onChange={this.valueChangeHandler.bind(this, 'description')}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>

                <div className={styles['row-line-gap']}></div>

                <Row>
                  <Col span={12}>
                    <FormItem label='附件' {...labelProps}>
                      {getFieldDecorator('url', {
                        initialValue: this.state.uploadedFileList
                      })(

                        <Upload
                          accept='multipart/form-data'
                          withCredentials={true}
                          action='/crm-fd/api/upload/file'
                          onChange={this.uploadFileHandler}
                        // fileList={this.state.uploadedFileList}
                        >
                          <Button className={styles['upload-button']}>
                            <Icon type="upload" /> 请选择文件
                          </Button>
                        </Upload>
                      )}
                    </FormItem>
                  </Col>
                </Row>

                {/* 如果是分配，则展示下面的部分（分配输入区） */}
                {
                  operation === 'distribution' ?
                    <div className={styles['row-line-gap']}></div> : null
                }
                {
                  operation === 'distribution' ?
                    <div className={styles['distribute-container']}>
                      {/* 分配活动的操作区域 */}
                      <span className={styles['distribute-info-title']}>
                        目标总户数：
                      <span className={styles['color-red']}>{ households }</span>
                        户，剩余
                      <span className={styles['color-red']}>{ remainingHouseholds > 0 ? remainingHouseholds : 0 }</span>
                        户未分配，目标总金额：
                      <span className={styles['color-red']}>{ amount }</span>
                        万元，剩余
                      <span className={styles['color-red']}>{ remainingAmount > 0 ? remainingAmount : 0 }</span>
                        万元未分配
                    </span>

                      {/* 重置按钮 */}
                      <span
                        className={styles['distribute-reset-button']}
                        onClick={this.handleResetDistributeOption}
                      >重置</span>

                      {/* 分配区域 */}
                      <div className={styles['distribute-list']}>
                        {
                          executorInstitutionIds && executorInstitutionIds.map((id, index) => {

                            let _id = id + ''
                            let _name = ''
                            if (_id.indexOf('===') === -1) {
                              // 直接从后端拿到的 id 数组，直接渲染 id 即可
                              _id = id
                              _name = executorInstitutionNames[index]
                            } else {
                              // 如果存在 ‘===’ 说明是前端生成的，需要处理（方法同提交时的处理方法）
                              _name = _id.split('===')[0]
                              _id = _id.split('===')[1]
                              _id = _id.split('-')
                              _id = _id[_id.length - 1]
                            }

                            return (
                              <div className={styles['distribute-item']} key={_id}>
                                <span
                                  className={styles['distribute-executor-name']}
                                  title={_name}
                                >{_name}</span>
                                <span className={styles['distribute-households']}>
                                  <InputNumber
                                    style={{ width: 250 }}
                                    placeholder='目标户数（户）'
                                    min={0}
                                    onChange={ this.handleInputDistributeHouseholds.bind(this, _id) }
                                    value={ !!distributeOptions[`${_id}`] ? distributeOptions[`${_id}`].household : undefined }
                                  />
                                </span>
                                <span className={styles['distribute-amount']}>
                                  <InputNumber
                                    style={{ width: 250 }}
                                    placeholder='目标金额（万元）'
                                    min={0}
                                    onChange={ this.handleInputDistributeAmount.bind(this, _id) }
                                    value={ !!distributeOptions[`${_id}`] ? distributeOptions[`${_id}`].targetAmount : undefined }
                                  />
                                </span>
                              </div>
                            )
                          })
                        }
                      </div>

                    </div> : null
                }

              </div>
            </div>
          </Form>

          <div className={styles['btns-area'] + ' clearfix'}>
            <Button
              className={styles['btn-cancel']}
              onClick={() => {
                this.props.history.goBack()
              }}
            >取消</Button>
            <Button
              className={styles['btn-submit']}
              type='primary'
              onClick={this.submitHandler.bind(this)}
            // disabled={this.state.canSubmit}
            >确定</Button>
          </div>

        </div>
      </div>
    )
  }
}
const CreateOrEdit = Form.create()(CreateOrEditForm)
export default withRouter(CreateOrEdit)
