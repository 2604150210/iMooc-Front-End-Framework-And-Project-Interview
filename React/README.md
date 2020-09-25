# React

## 一、React VS Vue

+ React和Vue一样重要（特别是大场面试），力求两者都学会
+ React和Vue有很多相通之处，而且正在趋于一致
+ React和Vue学习成本高，尤其是对初学者

## 二、React使用

+ 基本使用 -- 常用，必须会
+ 高级特性 -- 不常用，但体现深度
+ Redux和React-router使用
+ 是否可以自己看文档学习？
  + 行，但这是最低效的方式
  + 文档是一个备忘录，给会用的人查阅，并不是入门教程
  + 文档全面冗长且细节过多，不能突出面试考点

## 三、讲解的React面试题

+ React组件如何通讯
+ JSX本质是什么
+ context是什么，有何用途？
+ shouldComponentUpdate的用途
+ 描述redux单向数据流
+ setState是同步还是异步？

## 四、React基本使用

### 1. JSX基本知识点

+ 变量、表达式：写在一对大括号里，`{this.state.name}`

+ class、style

  React中的CSS类要写成className，style是一个JS对象，内联写法：`style={{color: '#aaa'}}`。

+ 子元素和组件

+ 原生HTML写法

  `<div dangerouslySetInnerHTML={{__html: '<h3>我是原生HTML</h3>'}}></div>`

+ 条件判断

  + if-else
  + 三元表达式
  + 逻辑运算符 && ||

+ 渲染列表

  + map

  + key：和Vue中的key类似，必填，不能是index或random

    ```jsx
    <ul>
      {
      this.state.list.map((item, index) => {
        return <li key={item.id}>index {index}; title {item.title}</li>
      })
    	}
      </ul>
    ```

### 2. 事件

+ bind this

  ```jsx
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
  
    render () {
      return (
        <p onClick={this.clickHandler1}>{this.state.name}</p>
      )
    }
  }
  
  ```

  更推荐的写法：静态方法：

  ```jsx
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
    }
  
    // 静态方法，this指向当前实例
    clickHandler2 = () => {
      console.log(this)
      this.setState({
        name: 'Cathy'
      })
    }
  
    render () {
      return (
        	<p onClick={this.clickHandler2}>{this.state.name}</p>
      )
    }
  }
  
  ```

  

+ 关于event 参数

  1. event 是 SyntheticEvent，模拟出来了 DOM 事件所有能力
  2. event.nativeEvent 是原生事件对象
  3. 所有的事件都被挂载到 document 上，和 DOM 事件不一样，和 Vue 事件也不一样

  ```jsx
  export default class EventDemo extends PureComponent {
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
  
    render () {
      return (
        <a href="https://imooc.com" onClick={this.clickHandler3}>Click me</a>
      )
    }
  }
  ```

+ 传递自定义参数

  ```jsx
  export default class EventDemo extends PureComponent {
    constructor(props) {
      super(props)
      this.state = {
        name: 'Jal'
      }
    }
  
    // 传递参数
    clickHandler4 (id, title, event) {
      console.log(id, title, event) // 最后追加一个参数 event
    }
  
    render () {
      return (
        <p onClick={this.clickHandler4.bind(this, 4, 'title')}>{this.state.name}</p>
      )
    }
  }
  ```

### 3. 表单

+ 受控组件（表单的值受state控制）

    ```jsx
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
    
    ```

+ 非受控组件

    

### 3. 组件使用

+ props 传递数据: `<List list={this.state.list} />`

+ props 传递函数：`<Input submitTitle={this.onSubmitTitle} />`

+ props 类型检查:

    ```jsx
    import PropTypes from 'prop-types'
    
    Input.propTypes = {
      submitTitle: PropTypes.func.isRequired
    }
    ```

### 4. setState（React最重要的概念，一定要会）

+ 不可变值

  ```js
  // 不要修改 state，使用不可变值
  // this.state.count++ // 错误
  this.setState({
    // 新旧值不能相同
    count: this.state.count + 1
  })
  
  // 不可变值（函数式编程，纯函数） - 数组
  const list5Copy = this.state.list5.slice()
  list5Copy.splice(2, 0, 'a') // 中间插入/删除
  this.setState({
    list1: this.state.list1.concat(100), // 追加 新数组，不会改变老数组
    list2: [...this.state.list2, 100], // 追加 新数组，不会改变老数组
    list3: this.state.list3.slice(0, 3), // 截取 新数组，不会改变老数组
    list4: this.state.list4.filter(item => item > 100), // 筛选 新数组，不会改变老数组
    list5: this.state.list5, // 其他操作，生成副本进行其他操作
  })
  // 在 setState 之前不能去修改 state 的值，不能对 this.state.list 进行 push pop splice 等，这样违反不可变值
  
  // 不可变值 - 对象
  this.setState({
    obj1: Object.assign({}, this.state.obj1, {a: 100}),
    obj2: { ...this.state.obj2, a: 100 }
  })
  // 注意，不能直接对this.state.obj直接进行属性设置，这样违反不可变值
  ```

+ 可能是异步更新

  + 异步情况

    ```js
    this.setState({
      count: this.state.count + 1
    }
     , () => {
      // 相当于Vue的nextTick
      console.log('回调获取最新值', this.state.count) // 回调获取最新值
    	}
    )
    console.log(this.state.count) // 异步的，拿不到新值
    ```

  + 同步情况

    ```js
    setTimeout(() => {
      this.setState({
        count: this.state.count + 1
      })
      console.log(this.state.count) // setTimeout中是同步
    }, 0);
    ```

    

+ 可能会被合并



  



