/**
 * @desc 借助 react-loadable 进行 code-splitting 时的loading组件
 */
import React from 'react'

 function Loading({ error }) {
  if (error) {
    console.log('react-loadable error')
    console.log(error)
    return 'error';
  } else {
    return <div></div>;
  }
}

export default Loading
