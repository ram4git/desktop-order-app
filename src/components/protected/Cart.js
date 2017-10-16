import React, { Component } from 'react'
import { Grid, Segment, Input } from 'semantic-ui-react'
import Lorry from './Lorry'
import { ref } from '../../config/constants'
import { Header, Card, Table, Modal, Button } from 'semantic-ui-react'



//17AUG7-ANI984-923 - temporary order for testing
//9849123866 - mobile number for testing


export default class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lorryCapacity: 14,
      currentLoad: 0,
      orderId: '22SEP7-ANI984-475',
      subOrders : {},
      modalOpen : false,
      acceptedOrders : [],
      modalOrderId : null
    };
  }

  componentDidMount() {
   const ordersRef =  ref.child('users/9849123866' + '/suborders');
   ordersRef.once('value', function(data){
     let orderData = { 'subOrders' : data.val() };

     this.setState(orderData);
     console.log(this.state);

   }, this);
  }

  openTheModal = (orderId) => this.setState({ modalOpen: true, modalOrderId: orderId });

  closeTheModal = () => this.setState({ modalOpen: false });

  acceptOrder = (orderId) => {
    let {acceptedOrders} = this.state;
    acceptedOrders.push(orderId);
    this.setState({
        acceptedOrders : acceptedOrders,
        modalOpen : false
    })

    //populate into Ram's mainAgentOrders field from acceptedOrders
};


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
                { this.renderSubOrders() }
                { this.renderViewOrder() }
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

  renderViewOrder() {
      const { modalOrderId } = this.state;

      return (
        <Modal size="small" open={this.state.modalOpen} onClose={this.closeTheModal.bind(this)}>
          <Modal.Header>
            Details of order : [ <span className="head">{ modalOrderId }</span> ]
          </Modal.Header>
          <Modal.Content>
            { this.showOrder() }
          </Modal.Content>
          <Modal.Actions>
            <Button negative content='REJECT' onClick={this.closeTheModal.bind(this)} />
            <Button positive icon='checkmark' labelPosition='right' content='ACCEPT' onClick={this.acceptOrder.bind(this,modalOrderId)} />
          </Modal.Actions>
        </Modal>
      );
  }

  showOrder() {
    const { modalOrderId } = this.state;
    const ordersRef =  ref.child('orders/' + modalOrderId );
    if(!modalOrderId)
      return;

    const cardsList = [];
    ordersRef.once('value', function(data){
      const orderData = data.val();
      console.log(orderData);

      const shopArrayOrderDetail= orderData.cart.shopDetail;

      //NOT WORKING
      shopArrayOrderDetail.forEach((shop, index) => {
        cardsList.push(
        <Card fluid key={shop.name}>
          <Card.Content>
            <Card.Header>
              {shop.name}
            </Card.Header>
            <Card.Meta>
              {shop.address}
            </Card.Meta>
            <Card.Description>
              { shop.address }
            </Card.Description>
          </Card.Content>
        </Card>
      );


    });
    console.log(cardsList);
    return cardsList;

    }, this);


  }

  renderSubOrders() {
    const { subOrders } = this.state;
    if(!subOrders) {
      return null;
    }

    const subOrdersList = [];      const that = this;
    Object.keys(subOrders).forEach(function(key) {
      let singleSubAgentOrders = subOrders[key];
      Object.keys(singleSubAgentOrders).forEach(function(orderId) {
        let orderDetails = singleSubAgentOrders[orderId];
        let split = orderDetails.split(`;`);
        let agentName = split[0];
        let shopName = split[1];
        subOrdersList.push(
          <div key={orderId} onClick={that.openTheModal.bind(that,orderId)} >
          <Card fluid key={orderId}>
            <Card.Content>
              <Card.Header>
                {agentName}
              </Card.Header>
              <Card.Meta>
                {orderId}
              </Card.Meta>
              <Card.Description>
                { shopName }
              </Card.Description>
            </Card.Content>
          </Card>
          </div>
        )

      });
    });
    return subOrdersList;
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
