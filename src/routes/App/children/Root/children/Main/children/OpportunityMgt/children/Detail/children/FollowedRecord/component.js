import React from 'react'
import './component.scss'
import DownloadFile from 'components/DownloadFile'
import queryString from 'query-string'

class FollowedRecord extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const businessId = this.props.businessId
    this.props.getFollowedRecordList(businessId)
  }

  render() {

    const { followedRecordList } = this.props

    return (
      <div className='followed-record-component'>

        <div className='title'>
          <span className='title-icon'></span>
          跟进记录
        </div>

        <div className="follow-list">
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
                          </DownloadFile> : null
                      }
                    </div>
                  </div>
                )
              }) :
              <div className='empty-tips'>暂无跟进记录</div>
          }

        </div>

      </div>
    )
  }
}

export default FollowedRecord
