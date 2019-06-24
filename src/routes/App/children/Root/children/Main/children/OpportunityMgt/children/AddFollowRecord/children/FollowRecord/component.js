import React from 'react'
import './component.scss'
import { withRouter } from 'react-router-dom'
import { Input, Button, Upload, Icon, message, Spin } from 'antd'
import DownloadFile from 'components/DownloadFile'
import queryString from 'query-string'


const TextArea = Input.TextArea

/**
 * @desc 添加跟进记录组件
 * @prop {string | number} [id] 商机id
 */
class FollowRecord extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      uploadedFile: {},
      uploading: false,
      description: '',
      status:"0"
    }

    // 获取当前商机的id
    this.id = parseInt(this.props.id)

    this.handleFileUpload = this.handleFileUpload.bind(this)
    this.handleRemoveFile = this.handleRemoveFile.bind(this)
    this.handleUserInput = this.handleUserInput.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  // 文件上传
  handleFileUpload({ file }) {

    if (file.status === 'uploading') {
      this.setState({ uploading: true })
    }

    if (file.status === 'done') {
      message.success('附件上传成功')
      this.setState({
        uploadedFile: file,
        uploading: false
      })
    }

    if (file.status === 'error') {
      this.setState({ uploading: false })
      message.error('附件上传失败')
    }

  }

  // 删除文件
  handleRemoveFile() {
    this.setState({ uploadedFile: {} })
  }

  // 用户输入
  handleUserInput(ev) {
    const userInput = ev.target.value.trim()
    this.setState({ description: userInput })
  }

  // 添加跟进记录
  handleConfirm() {
    const { uploadedFile, description , status} = this.state

    if (description.length < 1) {
      message.info('请输入跟进记录描述')
      return false
    }

    let attachmentPath = ''
    if (Object.keys(uploadedFile).length > 0) {
      const fileName = uploadedFile.name
      const fileUrl = uploadedFile.response.payload.data
      attachmentPath = `${fileUrl}?fileName=${encodeURIComponent(fileName)}`
    }

    const recordObj = {
      businessChanceId: this.id,
      description,
      status
    }

    if (!!attachmentPath) {
      recordObj.attachmentPath = attachmentPath
    }

    this.props.addFollowRecord(recordObj, () => {
      this.setState({
        description: '',
        uploadedFile: {},
      })
      this.props.getFollowedRecordList(this.id)
    })

  }

  // 取消
  handleCancel() {
    this.props.history.goBack()
  }


  componentDidMount() {
    this.props.getFollowedRecordList(this.id)
  }
  componentWillReceiveProps({curStatus}){
    this.setState({
      status:curStatus
    })
  }

  render() {

    const {
      uploadedFile,
      uploading,
      description,
    } = this.state

    const { followedRecordList } = this.props

    return (
      <div className='follow-record-component'>

        <div className='follow-record-header'>
          <span className='follow-record-icon'></span>
          <span>跟进记录</span>
        </div>

        <div className='follow-record-body'>

          {/* 发布区域 start */}
          <div className='record-publish-container'>

            {/* 输入框 */}
            <TextArea
              className='follow-record-textarea'
              rows={5}
              suffix={<h1>123</h1>}
              autosize={true}
              onChange={this.handleUserInput}
              value={description}
            />

            {
              uploading || Object.keys(uploadedFile).length > 0 ?
                <div className='upload-file-container'>

                  {
                    uploading ?
                      <Spin /> :
                      <div className='upload-file'>
                        <span className='file-icon'></span>
                        <span>{uploadedFile.name}</span>
                        <Icon
                          type='close'
                          className='close-icon'
                          onClick={this.handleRemoveFile}
                        />
                      </div>
                  }

                </div> : null
            }


            {/* 按钮区域 */}
            <div className='operation-area'>
              <span>
                <Upload
                  accept='multipart/form-data'
                  withCredentials={true}
                  action='/crm-fd/api/upload/file'
                  className='upload-button'
                  onChange={this.handleFileUpload}
                >
                  <Icon type='upload' className='add-attachment-icon' />
                  <span className='add-attachment-wording'>添加附件</span>
                </Upload>
              </span>

              <span className='button-container'>
                <Button
                  type='primary'
                  className='cancel-button'
                  onClick={this.handleConfirm}
                >确定</Button>
                <Button
                  type='default'
                  onClick={this.handleCancel}
                >取消</Button>
              </span>
            </div>
          </div>
          {/* 发布区域 end */}

          <div className='records-container'>
            {
              followedRecordList.data.length > 0 ?
                followedRecordList.data.map(record => {

                  // 解析下载路径和文件名
                  const attachmentPath = record.attachmentPath
                  let downloadUrl = ''
                  let fileName = ''
                  if (!!attachmentPath) {
                    const urlAndName = attachmentPath.split('?')
                    downloadUrl = urlAndName[0]
                    const queryObj = queryString.parse(urlAndName[1])
                    fileName = decodeURIComponent(queryObj.fileName)
                  }

                  return (
                    <div className='followed-record' key={record.followTime}>
                      <span className="follower-name">{record.userName}</span>
                      <span className="follow-date">{record.followTime}</span>
                      <div className="follow-content">
                        <div className='wording'>{record.description}</div>

                        {
                          !!attachmentPath ?
                          <DownloadFile
                            downloadUrl={downloadUrl}
                            fileName={fileName}
                          >
                            <div className='attachment'>
                              <span className='attachment-icon'></span>
                              <span>{`附件: ${fileName}`}</span>
                            </div>
                          </DownloadFile>  : null
                        }
                      </div>
                    </div>
                  )
                }) :
                <div className='empty-tips'>暂无跟进记录</div>
            }

          </div>


        </div>
      </div>
    )
  }
}

export default withRouter(FollowRecord)
