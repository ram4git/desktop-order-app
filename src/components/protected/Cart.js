import React, { Component } from 'react'
import { Grid, Segment, Input } from 'semantic-ui-react'
import Lorry from './Lorry'
import { ref } from '../../config/constants'
import { Header, Card, Table, Modal, Button, Message } from 'semantic-ui-react'



//17AUG7-ANI984-923 - temporary order for testing
//22SEP7-ANI984-475
//9849123866 - mobile number for testing


export default class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lorryCapacity: 14,
      currentLoad: 0,
      orderId: '17AUG7-ANI984-923',
      subOrders: {},
      mainOrder: {},
      acceptedOrders: []
    };
  }

  componentDidMount() {
    //const refPath = `orders/${this.state.orderId}`;
    const ordersRef =  `users/9849123866/suborders`;
    ref.child(ordersRef).once('value', (snap) => {
      console.log('SUBORDERS', snap.val());
      this.setState({
        subOrders: snap.val()
      });
    });
  }


  openTheModal = (orderId, subAgentMobile) => this.setState({ modalOpen: true, modalOrderId: orderId, subAgentMobile }, this.fetchOrder);
  closeTheModal = () => this.setState({ modalOpen: false });

  acceptOrder = (orderId, orderData) => {
    const { acceptedOrders, subOrders, subAgentMobile } = this.state;
    const newAcceptedOrders = [...acceptedOrders];
    newAcceptedOrders.push(orderData);
    const {...newSubOrders} = subOrders;
    delete newSubOrders[subAgentMobile][orderId];
//    const {[orderId]: ignore, ...newSubAgentOrders} = newSubOrders[subAgentMobile];
    this.setState({
        acceptedOrders: newAcceptedOrders,
        modalOpen: false,
        subOrders: newSubOrders
    });
  };

  render () {
    const { currentLoad } = this.state;
    // <Input label={`currentLoad`} placeholder='currentLoad' width={4} onChange={ this.onChangeValue.bind(this, 'currentLoad')} value={currentLoad} />


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
                <Header as='h5' textAlign='center'>
                  Field Agents Orders
                </Header>
                { this.renderSubOrders() }
                { this.renderViewOrderModal() }
              </Segment>
            </Grid.Column>
            <Grid.Column width={10}>
              <Segment className="currentOrder">
                <Header as='h5' textAlign='center'>
                  Current Order
                </Header>
                { this.renderAcceptedOrders() }
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  };

  renderViewOrderModal() {
    const { modalOrderId, modalOpen, modelOrderData } = this.state;

    return (
      <Modal basic open={modalOpen} onClose={this.closeTheModal.bind(this)}>
        <Modal.Header>
          Details of order : [ <span className="head">{ modalOrderId }</span> ]
        </Modal.Header>
        <Modal.Content scrolling>
          { this.renderOrderShopsAndItems(modelOrderData) }
        </Modal.Content>
        <Modal.Actions>
          <Button negative content='REJECT' onClick={this.closeTheModal.bind(this)} />
          <Button positive icon='checkmark' labelPosition='right' content='ACCEPT' onClick={this.acceptOrder.bind(this,modalOrderId,modelOrderData)} />
        </Modal.Actions>
      </Modal>
    );
  }

  // Rendering functions should just return JSX
  // No backend calls

  fetchOrder() {
    const { modalOrderId } = this.state;
    const ordersRef =  ref.child(`orders/${modalOrderId}`);

    ordersRef.on('value', (data) => {
      console.log('modelOrderData=', data.val());
      const orderData = data.val();
      this.updatePrices(orderData);

    });
  }


  updatePrices(orderData) {
    const pricesRef = ref.child(`priceList`);
    pricesRef.on('value', (data) => {
      let priceList = data.val();
      this.calculateDiscount(orderData, priceList);
    });

  }

  calculateDiscount(orderData , priceList) {
    const shopArray = orderData.cart.shopDetail;
    orderData.cart.discount_amount = 0;

    let totaldiscountedPrice = 0; let itemsProcessed = 0;

    const that = this;
    shopArray.forEach(function(shop){

    var shopDiscountAmount = 0;

    var items = shop.items;
    var riceObjectOrg = items.rice;
    var ravvaObjectOrg = items.ravva;
    var brokenObjectOrg = items.broken;
    var shopRiceWeight = 0;var shopRavvaWeight = 0; var shopBrokenWeight= 0;
    for(var productId in riceObjectOrg){
        shopRiceWeight += riceObjectOrg[productId].weight;
    }
    for(var productId in ravvaObjectOrg){
        shopRavvaWeight += ravvaObjectOrg[productId].weight;
    }
    for(var productId in brokenObjectOrg){
        shopBrokenWeight += brokenObjectOrg[productId].weight;
    }
    var ricediscount=0, ravvadiscount=0,brokendiscount=0;

    var areasRef = ref.child('areas/' + shop.areaId );
    var riceDiscArray = [];var ravvaDiscArray = []; var brokenDiscArray=[];
   (function() {

       var ravvaObject = ravvaObjectOrg ? JSON.parse(JSON.stringify(ravvaObjectOrg)) : {};
       var riceObject = riceObjectOrg ? JSON.parse(JSON.stringify(riceObjectOrg)): {};
       var brokenObject = brokenObjectOrg ? JSON.parse(JSON.stringify(brokenObjectOrg)): {};

    areasRef.once('value', function(data){

        itemsProcessed++;
        var discounts = data.val().discounts;
      //  console.log(discounts);
        if(discounts) {
            riceDiscArray = discounts.rice || riceDiscArray ;
            ravvaDiscArray = discounts.ravva ||  ravvaDiscArray;
            brokenDiscArray = discounts.broken || brokenDiscArray;
        }

        riceDiscArray.forEach(function(entry){
        if(shopRiceWeight >= entry.quintals){
            ricediscount = entry.discount;
        }
        });

     ravvaDiscArray.forEach(function(entry){
        if(shopRavvaWeight >= entry.quintals){
            ravvadiscount = entry.discount;
        }
        });

     brokenDiscArray.forEach(function(entry){
        if(shopBrokenWeight >= entry.quintals){
            brokendiscount = entry.discount;
        }
        });
        let areaId = shop.areaId ;

     for(var productId in riceObject){
           riceObject[productId].quintalWeightPrice=priceList[areaId]['rice'][productId]['Agent'];
           riceObject[productId]['discountedQuintalPrice']=  riceObject[productId].quintalWeightPrice - ricediscount;
           riceObject[productId]['price']= riceObject[productId].discountedQuintalPrice * riceObject[productId]['weight'];
           shopDiscountAmount += ricediscount*riceObject[productId]['weight'];
           totaldiscountedPrice += ricediscount*riceObject[productId]['weight']
    }
    for(var productId in ravvaObject){
            ravvaObject[productId].quintalWeightPrice=priceList[areaId]['ravva'][productId]['Agent'];
            ravvaObject[productId]['discountedQuintalPrice']= ravvaObject[productId].quintalWeightPrice - ravvadiscount;
            ravvaObject[productId]['price']= ravvaObject[productId].discountedQuintalPrice * ravvaObject[productId]['weight']
            shopDiscountAmount += ravvadiscount*ravvaObject[productId]['weight'];
            totaldiscountedPrice += ravvadiscount*ravvaObject[productId]['weight'];
    }

    for(var productId in brokenObject){
            brokenObject[productId].quintalWeightPrice=priceList[areaId]['broken'][productId]['Agent'];
            brokenObject[productId]['discountedQuintalPrice']=  brokenObject[productId].quintalWeightPrice - brokendiscount;
            brokenObject[productId]['price']= brokenObject[productId].discountedQuintalPrice * brokenObject[productId]['weight']
            shopDiscountAmount += brokendiscount*brokenObject[productId]['weight'];
            totaldiscountedPrice += brokendiscount*brokenObject[productId]['weight'];
    }

    shop['items']['rice'] = riceObject;
    shop['items']['ravva'] = ravvaObject;
    shop['items']['broken'] = brokenObject;

    shop['shopDiscountAmount'] = shopDiscountAmount;
    shop['shopGrossAmount'] = shop['totalShopPrice'] - shopDiscountAmount;
    if(itemsProcessed == shopArray.length) {
      console.log('order data = = = ' , orderData);
      orderData.cart.discount_amount = totaldiscountedPrice;
      that.setState({
        modelOrderData: orderData
      })
    }
})
    }());


});


  }

  renderSubOrders() {
    const { subOrders } = this.state;
    if(!subOrders) {
      return null;
    }

    const subOrdersList = [];
    const that = this;
    Object.keys(subOrders).forEach(key => {
      const singleSubAgentOrders = subOrders[key];
      Object.keys(singleSubAgentOrders).forEach(function(orderId) {
        const orderDetails = singleSubAgentOrders[orderId];
        const split = orderDetails.split(`;`);
        const agentName = split[0];
        const shopName = split[1];
        subOrdersList.push(
          <div key={orderId} className="subAgentOrders">
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
              <Card.Content extra>
                <div className='ui two buttons'>
                  <Button positive fluid onClick={that.openTheModal.bind(that,orderId, key)}>VIEW</Button>
                </div>
              </Card.Content>
            </Card>
          </div>
        )
      });
    });
    if(!subOrdersList.length) {
      subOrdersList.push(
        <Message floating content='No sub agent orders!'  color='orange' />
      );
    }
    return subOrdersList;
  }

  renderAcceptedOrders() {
    const { acceptedOrders } = this.state;
    const acceptedOrderShopsList = [];
    if(!acceptedOrders) {
      return null;
    }
    acceptedOrders.forEach( (acceptedOrder,index) => {
      acceptedOrderShopsList.push(
        <div className="subAgentOrder">
          { this.renderOrderShopsAndItems(acceptedOrder) }
        </div>
      );
    });
    if(!acceptedOrderShopsList.length) {
      acceptedOrderShopsList.push(
        <Message color='orange' floating content='No itesms in the cart. View/Accept sub-agent orders on left to place an order to the Factory!' />
      );
    }
    return acceptedOrderShopsList;
  }

  renderOrderShopsAndItems(orderData) {
    if(!orderData) {
      return null;
    }

    const shops = orderData.cart.shopDetail;
    const shopsList = [];
    shops.forEach((shop, index) => {
      const { name, mobile, shopGrossAmount,shopDiscountAmount, totalWeight, items } = shop;
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
          <Card.Meta textAlign='right'>
             Discount = {`₹${shopDiscountAmount}`}
          </Card.Meta>
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
        const { name, bags, weight,quintalWeightPrice, discountedQuintalPrice, price } = productTypeItems[product];
        itemsArray.push(
          <Table.Row key={product}>
            <Table.Cell textAlign='left'>{name}</Table.Cell>
            <Table.Cell textAlign='right'>{bags}</Table.Cell>
            <Table.Cell textAlign='right'>{weight}</Table.Cell>
            <Table.Cell textAlign='right'>{quintalWeightPrice.toLocaleString('en-IN')}</Table.Cell>
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
            <Table.HeaderCell textAlign='right'>Discount Price</Table.HeaderCell>
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
