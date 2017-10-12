import React, { Component } from 'react'
import { Progress } from 'semantic-ui-react'


export default class Lorry extends Component {


    render() {
      const { lorryCapacity, currentLoad } = this.props;
      const percent = 100*currentLoad/lorryCapacity;
      console.log("RENDERING LORRY: ", JSON.stringify(this.props, null, 2) );

      return (
        <div className="lorry">
          <Progress percent={percent} indicating />
        </div>
      );
    }


}
