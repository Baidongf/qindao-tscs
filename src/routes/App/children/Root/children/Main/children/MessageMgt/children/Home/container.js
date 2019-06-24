import {connect} from 'react-redux'
import Component from './component'
import {getMessageCategory, getMessageList, deleteMessage, readMessage,readAllMessage} from 'store/modules/messageMgt'

const mapStateToProps = (state) => ({
  messageCategory: state.messageMgt.messageCategory,
  messageList: state.messageMgt.messageList
})

const mapDispatchToProps = {
  getMessageCategory,
  getMessageList,
  deleteMessage,
  readMessage,
  readAllMessage
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
