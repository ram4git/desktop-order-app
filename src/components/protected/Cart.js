import React, { Component } from 'react'
import { Grid, Segment, Input } from 'semantic-ui-react'
import Lorry from './Lorry'
import { ref } from '../../config/constants'
import { Header, Card, Table } from 'semantic-ui-react'



//17AUG7-ANI984-923 - temporary order for testing


export default class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lorryCapacity: 14,
      currentLoad: 0,
      orderId: '22SEP7-ANI984-475'
    };
  }

  componentDidMount() {
    const refPath = `orders/${this.state.orderId}`;
    ref.child(refPath).once('value', (snap) => {
      const orderData = snap.val();
      this.setState({
        orderData
      });
    });

  }

  render () {
    const { lorryCapacity, currentLoad } = this.state;

    return (
      <div className="cart head">
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Segment className="lorry">
                <Lorry {...this.state} onChange={ this.onChangeValue.bind(this, 'lorryCapacity') } />
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className="items">
            <Grid.Column width={6}>
              <Segment className="fieldAgentOrders">
                <Header as='h5' textAlign='center' inverted color='orange'>
                  Field Agents Orders
                </Header>
                <Input label={`currentLoad`} placeholder='currentLoad' width={4} onChange={ this.onChangeValue.bind(this, 'currentLoad')} value={currentLoad} />
              </Segment>
            </Grid.Column>
            <Grid.Column width={10}>
              <Segment className="currentOrder">
                <Header as='h5' textAlign='center' inverted color='orange'>
                  Current Order
                </Header>
                { this.renderActiveOrderItems() }
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }

  renderActiveOrderItems() {
    const { orderData } = this.state;
    if(!orderData) {
      return null;
    }

    const shops = orderData.cart.shopDetail;
    const shopsList = [];
    shops.forEach((shop, index) => {
      const { name, mobile, shopGrossAmount, totalWeight, items } = shop;
      shopsList.push(
        <Card fluid key={index}>
          <Card.Content>
            <Card.Header>
              {name}
            </Card.Header>
            <Card.Meta>
              {mobile}
            </Card.Meta>
            <Card.Description>
              { this.renderItemsTable(items) }
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Header as='h5' textAlign='right' inverted>
            {`₹${shopGrossAmount.toLocaleString('en-IN')}/${totalWeight} qnts`}
          </Header>
          </Card.Content>
        </Card>
      )
    });
    return shopsList;
  }

  renderItemsTable(items) {
    const itemsArray = [];
    Object.keys(items).forEach( productType => {
      const productTypeItems = items[productType];
      Object.keys(productTypeItems).forEach( product => {
        const { name, bags, weight, discountedQuintalPrice, price } = productTypeItems[product];
        itemsArray.push(
          <Table.Row key={product}>
            <Table.Cell textAlign='left'>{name}</Table.Cell>
            <Table.Cell textAlign='right'>{bags}</Table.Cell>
            <Table.Cell textAlign='right'>{weight}</Table.Cell>
            <Table.Cell textAlign='right'>{discountedQuintalPrice.toLocaleString('en-IN')}</Table.Cell>
            <Table.Cell textAlign='right'>{price.toLocaleString('en-IN')}</Table.Cell>
          </Table.Row>
        )
      })
    })


    return (
      <Table striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign='left'>Product</Table.HeaderCell>
            <Table.HeaderCell textAlign='right'>Bags</Table.HeaderCell>
            <Table.HeaderCell textAlign='right'>Qnts</Table.HeaderCell>
            <Table.HeaderCell textAlign='right'>Qnt Price</Table.HeaderCell>
            <Table.HeaderCell textAlign='right'>Total Price</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { itemsArray }
        </Table.Body>
      </Table>
    );
  }

  onChangeValue(inputName, e, data) {
    const { value } = data;
    this.setState({
      [inputName]: value ? parseFloat(value) : 0
    });
  }
}
