import React, { Component } from 'react';
import { Image } from 'semantic-ui-react'


export default class Home extends Component {
  render () {
    return (
      <div className="home">
        <Image src='1.png' fluid size='massive' centered/>
      </div>
    )
  }
}
