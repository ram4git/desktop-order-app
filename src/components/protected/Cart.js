import React, { Component } from 'react'
import { Grid, Segment, Input } from 'semantic-ui-react'
import Lorry from './Lorry'


export default class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lorryCapacity: 14,
      currentLoad: 0
    };
  }

  componentDidMount() {
    // fetch firebase DB
    // format data
    // set to state
  }

  render () {
    const { lorryCapacity, currentLoad } = this.state;

    return (
      <div className="cart head">
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Segment className="lorry">
                <Lorry {...this.state} />
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className="items">
            <Grid.Column width={6}>
              <Segment className="fieldAgentOrders">
                Field Agents Orders List
                <Input label={`lorryCapacity`} placeholder='lorryCapacity' width={4} onChange={ this.onChangeValue.bind(this, 'lorryCapacity')} value={lorryCapacity} />
                <Input label={`currentLoad`} placeholder='currentLoad' width={4} onChange={ this.onChangeValue.bind(this, 'currentLoad')} value={currentLoad} />
              </Segment>
            </Grid.Column>
            <Grid.Column width={10}>
              <Segment className="currentOrder">Current Order Items</Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }

  onChangeValue(inputName, e, data) {
    const { value } = data;
    this.setState({
      [inputName]: value ? parseFloat(value) : 0
    });
  }
}
