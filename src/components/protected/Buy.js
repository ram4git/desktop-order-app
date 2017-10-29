import React, { Component } from 'react'
import { Grid, Segment, Statistic, Card, Message } from 'semantic-ui-react'
import Product from './Product'



export default class Cart extends Component {


  /**
  Car shows up only if there items added
  */

  render() {
    return (
      <div className="buy head">
        <h1>Products</h1>
        <Message visible className="blink">This page is under construction. DO NOT USE</Message>
        <Grid>
          <Grid.Row className="products">
            <Grid.Column>
              <Segment className='productsContainer'>
                <Product />
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }

  // <div className="cart">
  //   <Segment>
  //     { this.renderCartSummary() }
  //     { this.renderCartItems() }
  //   </Segment>
  // </div>

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
