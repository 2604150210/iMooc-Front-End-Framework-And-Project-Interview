import React, { PureComponent } from 'react'
/*
creator: cathy
created time: 2020-09-21 07:20:48 星期一
*/

export default class JSXDemo extends PureComponent {
  render () {
    return (
      <div dangerouslySetInnerHTML={{__html: '<h3>我是原生HTML</h3>'}}></div>
    )
  }
}
