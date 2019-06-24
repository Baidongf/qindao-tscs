import React from 'react'
import { Modal } from 'antd'
import './component.scss'

/**
 * Popup
 * @desc 全局弹窗
 * @param {function} [afterClose=()=>{}] 弹窗关闭后的回调
 * @param {object} [bodyStyle={}] 弹窗 body 的样式
 * @param {string} [cancelText='取消'] 取消按钮文字
 * @param {boolean} [centered=false] 是否垂直居中展示弹窗
 * @param {boolean} [closable=true] 是否显示右上角关闭按钮
 * @param {boolean} [confirmLoading] 确定按钮 loading
 * @param {boolean} [destroyOnClose=false] 关闭时销毁弹窗中的子元素
 * @param {string|ReactNode} [footer] 底部内容，默认是确定和取消按钮
 * @param {HTMLElement} [getContainer=()=>document.body] 指定弹窗挂载的 HTML 节点，默认为 body
 * @param {boolean} [keyboard=true] 是否支持键盘 ESC 关闭弹窗
 * @param {boolean} [mask=true] 是否展示蒙层
 * @param {boolean} [maskClosable=true] 点击蒙层是否可以关闭弹窗
 * @param {object} [maskStyle={}] 蒙层的样式
 * @param {string} [okText='确定'] 确定按钮的文案
 * @param {string} [title] 弹窗标题
 * @param {boolean} [visible] 弹窗是否可见
 * @param {string|number} [width=520] 弹窗的宽度
 * @param {string} [wrapClassName] 弹窗外层容器的类名
 * @param {number} [zIndex=1000] 弹窗的 z-index
 * @param {function} [onCancel] 点击关闭按钮或取消按钮的回调
 * @param {function} [onOk] 点击确定按钮的回调
 */
class Popup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const props = this.props
    const propsCopy = Object.assign({}, props)

    // 默认垂直居中
    if (typeof(propsCopy.centered) === 'undefined'){
      propsCopy.centered = true
    }

    return (
      <Modal
        {...propsCopy}
      ></Modal>
    )
  }
}

export default Popup
