import React, { PureComponent } from 'react'
/*
creator: cathy
created time: 2020-09-21 07:30:48 星期一
*/

export default class ListDemo extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      list: [
        {id: 1, title: 'jal'},
        {id: 2, title: 'wyb'},
        {id: 3, title: 'cathy'},
      ]
    }
  }

  render () {
    return (
      <ul>
        {
          this.state.list.map((item, index) => {
            return <li key={item.id}>index {index}; title {item.title}</li>
          })
        }
      </ul>
    )
  }
}
