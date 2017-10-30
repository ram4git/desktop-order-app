import React, { Component } from 'react'
import { Progress, Image, Button, Grid, Dropdown, Message, Form } from 'semantic-ui-react'

const lorryCapacityOptions = [
    { key: '3', value: 3, text: '3 tons' },
    { key: '7', value: 7, text: '7 tons' },
    { key: '10', value: 10, text: '10 tons' },
    { key: '17', value: 17, text: '17 tons' },
    { key: '21', value: 21, text: '21 tons' }
];

const OVERLOAD_FACTOR = 1.00;

export default class Lorry extends Component {

    constructor(props) {
        super(props);
        this.state = {
            orderMsg: ''
        };
    }


    render() {
      const { lorryCapacity, currentLoad } = this.props;
      const overload = currentLoad/lorryCapacity;
      return (
        <div className="orderSummary">
          {(overload > OVERLOAD_FACTOR) ? <Message visible className="blink">Lorry is overloaded. Use bigger Lorry or Remove items from cart.</Message> : null}
          <Image src='/lorry.png' size='large'/>
          <Progress className="lorry" indicating value={currentLoad} total={lorryCapacity} progress='ratio' error={(overload > OVERLOAD_FACTOR) ? true: false}/>
          <Grid className="orderSummaryControls">
            <Grid.Row>
              <Grid.Column width={8}>
                  <Button
                    content='LORRY CAPACITY'
                    disabled
                    primary
                    width={4}
                    className='buttonAsLabel'
                  />
                  <Dropdown width={4} placeholder='Lorry Capacity' search selection options={lorryCapacityOptions} onChange={this.props.onChange.bind(this)} value={this.props.lorryCapacity}/>
              </Grid.Column>
              <Grid.Column width={8}>
                <Button
                  content='PLACE ORDER'
                  positive
                  onClick={this.onSubmit.bind(this)}
                  fluid
                  disabled={ (overload > OVERLOAD_FACTOR || overload === 0) ? true : false }
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={16}>
                    <Form className='splMsg'>
                        <Form.TextArea label='SPECIAL MESSAGE' placeholder='Write special instructions to factory...' onChange={this.onSplMsgChange.bind(this)} value={this.state.orderMsg}/>
                    </Form>
                </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      );
    }

    onSplMsgChange(e, data) {
        this.setState({
            orderMsg: data.value
        });
    }

    onSubmit(e, data) {
      this.props.onSubmit({orderMsg: this.state.orderMsg}, e, data);
      this.setState({
        orderMsg: ''
      });
    }
}
