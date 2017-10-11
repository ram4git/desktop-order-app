import React, { Component } from 'react'
import { Grid, Segment } from 'semantic-ui-react'


export default class Cart extends Component {
  render() {
    return (
      <div className="buy head">
        <h1>Products and Cart</h1>
        <Grid>
          <Grid.Row className="cart">
            <Grid.Column>
              <Segment>{`Items added to cart show up here`}</Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className="products">
            <Grid.Column>
              <Segment>{`All products and categories show up here`}</Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }


}
