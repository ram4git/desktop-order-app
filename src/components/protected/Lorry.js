import React, { Component } from 'react'
import { Progress, Image, Button, Grid, Dropdown, Message } from 'semantic-ui-react'

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
      const overload = currentLoad/lorryCapacity;
      return (
        <div className="orderSummary">
          {(overload > 1.1) ? <Message visible className="blink" textAlign="center">Lorry is overloaded. Use bigger Lorry or Remove items from cart.</Message> : null}
          <Image src='/lorry.png' size='huge'/>
          <Progress className="lorry" indicating value={currentLoad} total={lorryCapacity} progress='ratio'/>
          <Grid className="orderSummaryControls">
            <Grid.Column width={8}>
                <Button
                  content='LORRY CAPACITY'
                  disabled
                  primary
                />
              <Dropdown value={14} placeholder='Lorry Capacity' search selection options={lorryCapacityOptions} onChange={this.props.onChange.bind(this)} value={this.props.lorryCapacity}/>
            </Grid.Column>
            <Grid.Column width={4}>
              <Button
                content='PLACE ORDER'
                positive
                onClick={this.props.onSubmit.bind(this)}
                ac
              />
            </Grid.Column>

          </Grid>
        </div>
      );
    }


}
