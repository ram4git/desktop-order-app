import React, { Component } from 'react'
import { Progress, Image, Button, Grid, Dropdown, Message } from 'semantic-ui-react'

const lorryCapacityOptions = [
    { key: '3', value: 3, text: '3 tons' },
    { key: '7', value: 7, text: '7 tons' },
    { key: '10', value: 10, text: '10 tons' },
    { key: '17', value: 17, text: '17 tons' },
    { key: '21', value: 21, text: '21 tons' }
];



export default class Lorry extends Component {


    render() {
      const { lorryCapacity, currentLoad } = this.props;
      const overload = currentLoad/lorryCapacity;
      return (
        <div className="orderSummary">
          {(overload > 1.1) ? <Message visible className="blink">Lorry is overloaded. Use bigger Lorry or Remove items from cart.</Message> : null}
          <Image src='/lorry.png' size='huge'/>
          <Progress className="lorry" indicating value={currentLoad} total={lorryCapacity} progress='ratio'/>
          <Grid className="orderSummaryControls">
            <Grid.Column width={8}>
                <Button
                  content='LORRY CAPACITY'
                  disabled
                  primary
                  width={4}
                />
                <Dropdown width={4} placeholder='Lorry Capacity' search selection options={lorryCapacityOptions} onChange={this.props.onChange.bind(this)} value={this.props.lorryCapacity}/>
            </Grid.Column>
            <Grid.Column width={8}>
              <Button
                content='PLACE ORDER'
                positive
                onClick={this.props.onSubmit.bind(this)}
                fluid
              />
            </Grid.Column>

          </Grid>
        </div>
      );
    }


}
