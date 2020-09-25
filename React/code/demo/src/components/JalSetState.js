import React, { PureComponent } from 'react'
/*
creator: cathy
created time: 2020-09-21 06:59:41 星期一
*/

export default class JalSetState extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      count: 0
    }
  }

  componentDidMount () {
    this.setState({ count: this.state.count + 1 })
    console.log(this.state.count) // 0
    this.setState({ count: this.state.count + 1 })
    console.log(this.state.count) // 0
    setTimeout(() => {
      this.setState({ count: this.state.count + 1 })
      console.log(this.state.count) // 2
    }, 0);
    setTimeout(() => {
      this.setState({ count: this.state.count + 1 })
      console.log(this.state.count) // 3
    }, 0);
  }
  render () {
    return (
      <h1>{this.state.count}</h1>
    )
  }
}
