import React from 'react'
import {Button} from 'antd'
import './component.scss'

class HzUpload extends React.Component {

  constructor(props){
    super()
    this.state = {
      fileName: '请选择上传Excel文件'
    }
    this.getInputFile = this.getInputFile.bind(this)
  }

  // 获取input上传的文件，兼容ie9
  getInputFile(inputId) {
    // 获取文件对象(该对象的类型是[object FileList]，其下有个length属性)
    var fileEle = document.getElementById(inputId)
    // var fileEle = $('#' + inputId)[0];
    var fileObj = null;
    if (fileEle.files) {
        // 如果文件对象的length属性为0，就是没文件
        if (fileEle.files.length === 0) {
            // console.log('没选择文件');
            return false;
        };

        fileObj = fileEle.files[0];

    }
    return fileObj;
  }
  change(value){
    const file =  this.getInputFile('file')
    this.setState({
      fileName: file.name
    })
    this.props.onChange(file)
  }
  myClick(){
    let upload = document.getElementById('file')
    upload.click()
  }

  componentWillMount(){
    this.setState({
      fileName: this.props.tip || '请选择上传文件'
    })
  }




  render(){
    return <div className='HzUpload'>
      <input type="file" onChange={this.change.bind(this)} id='file' accept='.xlsx,.xls' className='HzUpload-hidden-input'/>
      <Button onClick={this.myClick.bind(this)} icon='upload'>上传文件</Button>
      <span className='HzUpload-fileName'>{this.state.fileName}</span>
    </div>
  }
}

export default HzUpload
