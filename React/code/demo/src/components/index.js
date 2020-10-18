import React, { PureComponent } from 'react'
import JalSetState from './JalSetState'
import JSXDemo from './JSXDemo'
import ListDemo from './ListDemo'
import EventDemo from './EventDemo'
import FormDemo from './FormDemo'
import PropsDemo from './PropsDemo'
import StateDemo from './StateDemo'
import ReduxApp from './ReduxApp'
/*
creator: cathy
created time: 2020-09-21 07:09:22 星期一
*/

export default class BaseDemo extends PureComponent {
  render () {
    return (
      <div style={{width: 900, margin: '0 auto'}}>
        {/* <JalSetState />
        <JSXDemo />
        <ListDemo />
        <EventDemo />
        <FormDemo />
        <PropsDemo /> */}
        {/* <StateDemo/> */}
        <ReduxApp />
      </div>
    )
  }
}
