/**
 * @file Loading 弹窗
 * @author xieyuzhong@haizhi.com
 */
import React from 'react';
import { Rodal } from '../rodal';

class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: true };

    this.statusMap = {
      'pending': '正在获取数据',
      'drawing': '正在绘制图谱',
      'success': '绘制完成'
    }
  }

  show () {
    this.setState({ visible: true });
  }

  hide () {
    this.setState({ visible: false });
  }

  render () {
    return (
      <div className="loading">
        <Rodal visible={this.state.visible}
          closeMaskOnClick={false}
          showCloseButton={false}
          width={186} height={140}
          onClose={this.hide.bind(this)} >
          <div className="loading-icon">
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
          </div>
          <p className='loading-msg'>{this.statusMap[this.props.status]}</p>
          <p className='loading-msg'>最长需要1分钟，请耐心等待...</p>
        </Rodal>
      </div>
    )
  }
}

export default Loading;
