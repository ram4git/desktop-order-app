import React, { Component } from 'react'
import { Grid, Segment } from 'semantic-ui-react'


export default class Cart extends Component {
  render () {
    return (
      <div className="cart head">
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Segment className="lorry">Lorry Image</Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className="items">
            <Grid.Column width={6}>
              <Segment className="fieldAgentOrders">Field Agents Orders List</Segment>
            </Grid.Column>
            <Grid.Column width={10}>
              <Segment className="currentOrder">Current Order Items</Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}
