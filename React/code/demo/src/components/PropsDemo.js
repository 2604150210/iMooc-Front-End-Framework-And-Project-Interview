import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
/*
creator: cathy
created time: 2020-09-25 06:38:03 星期五
*/

export default class PropsDemo extends PureComponent {
  render () {
    return (
      <TodoListDemo />
    )
  }
}

class Input extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      title: ''
    }
  }

  onSubmit = () => {
    this.props.submitTitle(this.state.title)
  }

  onTitleChange = e => {
    this.setState({
      title: e.target.value
    })
  }

  render() {
    return (
      <div>
        <input value={this.state.title} onChange={this.onTitleChange}/>
        <button onClick={this.onSubmit}>提交</button>
      </div>
    )
  };
}
Input.propTypes = {
  submitTitle: PropTypes.func.isRequired
}

class List extends React.Component {
  render() {
    const { list } = this.props
    return <ul>
      {
        list.map((item, index) => {
          return <li key={item.id}><span>{item.title}</span></li>
        })
      }
    </ul>
  }
}

// 类型检查
List.protoTypes = {
  list: PropTypes.arrayOf(PropTypes.object).isRequired
}

class TodoListDemo extends React.Component {

  constructor(props){
    super(props)
    // 状态（数据）提升
    this.state = {
      list: [
        {
          id: 'id-1',
          title: '标题'
        },
        {
          id: 'id-2',
          title: '标2'
        },
        {
          id: 'id-3',
          title: '标3'
        },
      ]
    }
  }

  render() {
   return (
    <div>
      <Input submitTitle={this.onSubmitTitle} />
      <List list={this.state.list} />
    </div>
   )
  }

  onSubmitTitle = title => {
    this.setState({
      list: this.state.list.concat({
        id: `id-${+new Date()}`,
        title
      })
    })
  }
}