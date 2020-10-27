import React, { PureComponent } from 'react'
/*
creator: cathy
created time: 2020-09-25 07:11:25 星期五
*/

// 函数组件(后面会讲)，默认没有state


export default class StateDemo extends PureComponent {

  constructor(props){
    super(props)
    this.state = {
      count: 0,
      list1: [20, 40, 100, 200, 400],
      list2: [20, 40, 100, 200, 400],
      list3: [20, 40, 100, 200, 400],
      list4: [20, 40, 100, 200, 400],
      list5: [20, 40, 100, 200, 400]
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
    }, 0)
    setTimeout(() => {
      this.setState({ count: this.state.count + 1 })
      console.log(this.state.count) // 3
    }, 0)
  }

  render () {
    return (
      <div>
        <p>{this.state.count}</p>
        <button onClick={this.increase}>累加</button>
      </div>
    )
  }

  increase = () => {
    // 不要修改 state，使用不可变值
    // this.state.count++ // 错误
    // this.setState({
    //   // 新旧值不能相同
    //   count: this.state.count + 1
    // })

    // // 不可变值（函数式编程，纯函数） - 数组
    // const list5Copy = this.state.list5.slice()
    // list5Copy.splice(2, 0, 'a') // 中间插入/删除
    // this.setState({
    //   list1: this.state.list1.concat(100), // 追加 新数组，不会改变老数组
    //   list2: [...this.state.list2, 100], // 追加 新数组，不会改变老数组
    //   list3: this.state.list3.slice(0, 3), // 截取 新数组，不会改变老数组
    //   list4: this.state.list4.filter(item => item > 100), // 筛选 新数组，不会改变老数组
    //   list5: this.state.list5, // 其他操作，生成副本进行其他操作
    // })
    // // 在 setState 之前不能去修改 state 的值，不能对 this.state.list 进行 push pop splice 等，这样违反不可变值

    // // 不可变值 - 对象
    // this.setState({
    //   obj1: Object.assign({}, this.state.obj1, {a: 100}),
    //   obj2: { ...this.state.obj2, a: 100 }
    // })
    // // 注意，不能直接对this.state.obj直接进行属性设置，这样违反不可变值

    // setState 可能是异步更新（有可能是同步更新）
    // this.setState({
    //   count: this.state.count + 1
    // }
    // , () => {
    //   // 相当于Vue的nextTick
    //   console.log('回调获取最新值', this.state.count) // 回调获取最新值
    // }
    // )
    // console.log(this.state.count) // 异步的，拿不到新值

    setTimeout(() => {
      this.setState({
        count: this.state.count + 1
      })
      console.log(this.state.count) // setTimeout中是同步
    }, 0);
  }
}
