import React, { Component } from 'react'
import { Progress, Image, Button, Grid, Dropdown, Label } from 'semantic-ui-react'

const lorryCapacityOptions = [
    { key: '10', value: 10, text: '10 tons' },
    { key: '14', value: 14, text: '14 tons' },
    { key: '16', value: 16, text: '16 tons' },
    { key: '20', value: 20, text: '20 tons' },
    { key: '24', value: 24, text: '24 tons' }
];



export default class Lorry extends Component {


    render() {
      const { lorryCapacity, currentLoad } = this.props;
      const percent = 100*currentLoad/lorryCapacity;

      return (
        <div className="orderSummary">
          <Image src='/lorry.png' size='huge'/>
          <Progress className="lorry" percent={percent} indicating />
          <Grid className="orderSummaryControls">
            <Grid.Column width={8}>
                <Button
                  content='LORRY CAPACITY'
                  disabled
                  primary
                />
                <Dropdown value={14} placeholder='Lorry Capacity' search selection options={lorryCapacityOptions} onChange={this.props.onChange.bind(this)}/>
            </Grid.Column>
            <Grid.Column width={4}>
              <Button
                content='PLACE ORDER'
                positive
                ref={this.handleRef}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Button
                negative
                content='CLEAR ORDER'
                onClick={this.handleClick}
              />
            </Grid.Column>
          </Grid>
        </div>
      );
    }


}
