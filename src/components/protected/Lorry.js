import React, { Component } from 'react'
import { Progress, Image } from 'semantic-ui-react'


export default class Lorry extends Component {


    render() {
      const { lorryCapacity, currentLoad } = this.props;
      const percent = 100*currentLoad/lorryCapacity;

      return (
        <div className="orderSummary">
          <Image src='/lorry.png' size='huge'  fluid/>
          <Progress className="lorry" percent={percent} indicating />
        </div>
      );
    }


}
