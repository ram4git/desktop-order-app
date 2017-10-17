import React, { Component } from 'react'
import { Grid, Segment, Statistic, Card } from 'semantic-ui-react'


export default class Cart extends Component {


  /**
  Car shows up only if there items added
  */

  render() {
    return (
      <div className="buy head">
        <h1>Products</h1>
        <Grid>
          <Grid.Row className="products">
            <Grid.Column>
              <Segment>{`All products and categories show up here`}</Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <div className="cart">
          <Segment>
            { this.renderCartSummary() }
            { this.renderCartItems() }
          </Segment>
        </div>
      </div>
    )
  }

  renderCartSummary() {
    //dummy data
    const items = [
      { label: 'Items', value: '5' },
      { label: 'Tons', value: '31.4' },
      { label: 'Price', value: '1,40,000.00' },
    ];
    return (
      <div className="summary">
        <Statistic.Group items={items} size='mini' />
      </div>
    )
  }

  renderCartItems() {
    return(
      <Card.Group>
        <Card color='red' inverted/>
        <Card color='orange' inverted/>
        <Card color='yellow' inverted/>
        <Card color='green' inverted/>
      </Card.Group>
    );
  }


}
