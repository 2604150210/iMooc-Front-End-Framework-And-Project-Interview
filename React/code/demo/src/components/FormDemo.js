import React, { PureComponent } from 'react'
/*
creator: cathy
created time: 2020-09-24 07:23:50 星期四
*/

export default class FormDemo extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      name: 'jal'
    }
  }

  onInputChange = (event) => {
    this.setState({
      name: event.target.value
    })
  }
  render () {
    // 受控组件
    return (
      <div>
        <p>{this.state.name}</p>
        <label htmlFor="inputName">姓名：</label> {/* 用htmlFor代替for */}
        <input id="inputName" value={this.state.name} onChange={this.onInputChange} />
      </div>
    )
  }
}
