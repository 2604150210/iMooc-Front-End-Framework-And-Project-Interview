import React, { PureComponent } from 'react'
/*
creator: cathy
created time: 2020-09-21 07:34:36 星期一
*/

export default class EventDemo extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      name: 'Jal'
    }
    this.clickHandler1 = this.clickHandler1.bind(this) // 改变this指向
  }

  clickHandler1 () {
    console.log(this) // this默认是undefined
    this.setState({
      name: 'Cathy'
    })
  }

  // 静态方法，this指向当前实例
  clickHandler2 = () => {
    console.log(this)
    this.setState({
      name: 'Cathy'
    })
  }

  // 获取Event
  clickHandler3 = (event) => {
    event.preventDefault() // 阻止默认行为
    event.stopPropagation() // 阻止冒泡
    console.log('target', event.target) // 指向当前元素，即当前元素触发
    console.log('current target', event.currentTarget) // 指向当前元素，假象
    // 注意， event 其实是 React 封装的。可以看 __proto__.constructor 是 SyntheticEvent
    console.log('event', event) // Class 不是原生的 Event ，  SyntheticEvent 的子类，原生的是 MouseEvent
    console.log('event.__proto__.constructor', event.__proto__.__proto__) // SyntheticEvent
    console.log('nativeEvent', event.nativeEvent) // MouseEvent
    console.log('nativeEvent target', event.nativeEvent.target) // 指向当前元素，即当前元素触发
    console.log('nativeEvent target', event.nativeEvent.currentTarget) // 指向document
  }

  // 传递参数
  clickHandler4 (id, title, event) {
    console.log(id, title, event) // 最后追加一个参数 event
  }

  render () {
    return (
      <div>
      <p onClick={this.clickHandler1}>{this.state.name}</p>
      <p onClick={this.clickHandler2}>{this.state.name}</p>
      <a href="https://imooc.com" onClick={this.clickHandler3}>Click me</a>
      <p onClick={this.clickHandler4.bind(this, 4, 'title')}>{this.state.name}</p>
      </div>
    )
  }
}
