import React, { Component } from 'react'
import { Grid, Segment, Input, Confirm } from 'semantic-ui-react'
import Lorry from './Lorry'
import { ref } from '../../config/constants'
import { Header, Card, Table, Modal, Button, Message } from 'semantic-ui-react'



//17AUG7-ANI984-923 - temporary order for testing
//22SEP7-ANI984-475
//9849123866 - mobile number for testing
const SUCCESS = 'SUCCESS', ERROR = 'ERROR';

export default class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lorryCapacity: 17,
      currentLoad: 0,
      orderId: '17AUG7-ANI984-923',
      subOrders: {},
      mainOrder: {},
      acceptedOrders: [],
      notificationOpen: false,
      notificationMsg: {}
    };
  }

  componentDidMount() {
    const ordersRef =  `users/9849123866/suborders`;
    ref.child(ordersRef).once('value', (snap) => {
      console.log('SUBORDERS', snap.val());
      this.setState({
        subOrders: snap.val()
      });
    });
  }


  openTheModal = (orderId, subAgentMobile) => this.setState({ modalOpen: true, modalOrderId: orderId, subAgentMobile }, this.fetchOrder);
  closeTheModal = () => this.setState({modalOpen:false});
  rejectOrder = (orderId, orderData) => {
    const { subOrders } = this.state;
    const {...newSubOrders} = subOrders;
    delete newSubOrders[orderData.uid][orderId];
    this.setState({
              modalOpen: false ,
              subOrders: newSubOrders
    });
    let deleteOrderRef = ref.child('users/' + '9849123866/' + 'suborders/' + orderData.uid + '/' + orderId);
    deleteOrderRef.remove();
  };

  acceptOrder = (orderId, orderData) => {
    const { acceptedOrders, subOrders, subAgentMobile, currentLoad } = this.state;
    const newAcceptedOrders = [...acceptedOrders];
    orderData.orderId=orderId;
    newAcceptedOrders.push(orderData);
    const {...newSubOrders} = subOrders;
    delete newSubOrders[subAgentMobile][orderId];
    const newLoad = currentLoad + (orderData.cart.totalWeight)/10;
//    const {[orderId]: ignore, ...newSubAgentOrders} = newSubOrders[subAgentMobile];
    this.setState({
        acceptedOrders: newAcceptedOrders,
        modalOpen: false,
        subOrders: newSubOrders,
        currentLoad : newLoad
    });
  };

  notificationOpen = () => this.setState({ notificationOpen: true })
  handleNotificationConfirm = () => this.setState({ notificationOpen: false })
  handleNotificationCancel = () => this.setState({ notificationOpen: false })

  render() {
    const { currentLoad } = this.state;
    const notificationConfirmLink = <a href={`order/${this.state.notificationOrderId}`} target="_blank"><strong>Take me to Order</strong></a>;
    // <Input label={`currentLoad`} placeholder='currentLoad' width={4} onChange={ this.onChangeValue.bind(this, 'currentLoad')} value={currentLoad} />


    return (
      <div className="cart head">
        <Confirm
          basic
          open={this.state.notificationOpen}
          content={this.state.notificationMsg}
          cancelButton='Return to Cart'
          confirmButton={notificationConfirmLink}
          onCancel={this.handleNotificationCancel}
          onConfirm={this.handleNotificationConfirm}
        />
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Segment className="lorry">
                <Lorry {...this.state} onChange={ this.onChangeValue.bind(this, 'lorryCapacity') } onSubmit={ this.submitOrder.bind(this) } />
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
          <Button negative content='REJECT' onClick={this.rejectOrder.bind(this,modalOrderId,modelOrderData)} />
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
    if(!subOrders || subOrders == null) {
      return <Message floating content='No sub agent orders!'  color='orange' />;
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
                  <Button primary fluid onClick={that.openTheModal.bind(that,orderId, key)}>VIEW</Button>
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
             discount: {`₹${shopDiscountAmount.toLocaleString('en-IN')}`}
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
        const { name, bags, weight, quintalWeightPrice, discountedQuintalPrice, price } = productTypeItems[product];
        const discount = quintalWeightPrice - discountedQuintalPrice;
        itemsArray.push(
          <Table.Row key={product}>
            <Table.Cell textAlign='left'>{name}</Table.Cell>
            <Table.Cell textAlign='right'>{bags}</Table.Cell>
            <Table.Cell textAlign='right'>{weight}</Table.Cell>
            <Table.Cell textAlign='right'>{parseFloat(quintalWeightPrice).toLocaleString('en-IN')}(<strong>{discount}</strong>)</Table.Cell>
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
            <Table.HeaderCell textAlign='right'>Qnt Price(disc)</Table.HeaderCell>
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

  submitOrder(e, data) {
    console.log('*********************')
    console.log(this.state);
    const { acceptedOrders, currentLoad , lorryCapacity } = this.state;
    //TODO
    let now = new Date(); let orderMsg = ""; let uid ='9849123866'; let userName ='Anil';
    let newOrder = {
      uid : uid,
      time : now,
      userName : userName,
      status : "received",
      priority : (now * -1),
      orderMsg : orderMsg,
      isSubAgentOrder : false
    };

    let mycart = {
      discount_amount : 0,
      grossPrice : 0,
      totalPrice : 0,
      selectedLorrySize : lorryCapacity,
      totalWeight : currentLoad,
      shopDetail : []
    };

    acceptedOrders.forEach((order) => {
      let cart = order.cart;
      mycart.discount_amount += cart.discount_amount;
      mycart.grossPrice += cart.grossPrice;
      mycart.totalPrice += cart.totalPrice;
      mycart.shopDetail= mycart.shopDetail.concat(cart.shopDetail);
    });


    newOrder['cart']=mycart;
    console.log(newOrder);

    var monthsText=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    var mathRandom = Math.floor((Math.random())*1000);

    var orderId= (now.getDate()).toString()  + monthsText[now.getMonth()] + (now.getYear()%10).toString() + '-'+
              userName.substring(0,3).toUpperCase() + uid.substring(0,3) +'-'+ mathRandom.toString();


    var usersRef = ref.child('users/' + uid );
    usersRef.once('value', function(data){
      var userValue = data.val();
      userValue["orders"] = userValue["orders"] || [];
      userValue["orders"].push(orderId);
      var promise = usersRef.update(userValue);
    }).catch(function(e){
      console.log(e);
    });


    let ordersRef = ref.child('orders/' + orderId);
    let promise = ordersRef.set(newOrder);
    let that = this;
    promise
    .then(e => {
      //  that.sendSMS(mycart);
      that.deleteSubAgentOrders(mycart);
      this.showNotificationMsg(SUCCESS, orderId);
    })
    .catch(e => {
      console.log('Some problem occured while submitting the order',"Sorry!!")
      this.showNotificationMsg(ERROR, orderId);
    });


    var orderListRef = ref.child('orderList');

    orderListRef.transaction(orders => {
      orders=orders||[];
      orders.push(orderId);
      return orders;
    });

  }

  showNotificationMsg(notificationType, orderId) {
    let msg = '';
    if(notificationType === SUCCESS) {
      msg = <p>Order <a href={`order/${orderId}`} target="_blank"><strong>{orderId}</strong> </a>   is successfully placed. Check Orders tab for updates </p>;
    } else {
      msg = <p>Unable to submit order <a href={`order/${orderId}`} target="_blank"><strong>{orderId}</strong></a>. Contact Lalitha Industries. </p>;
    }
    this.setState({
      notificationMsg: msg,
      notificationOpen: true,
      currentLoad: 0,
      notificationOrderId: orderId
    });
  }

  deleteSubAgentOrders(myCart) {
    console.log('deleting subagent orders .....' , this.state);
    const { acceptedOrders } = this.state;
    acceptedOrders.forEach((order) => {
        let subAgentMobileNumber = order.uid;
        let subAgentOrderId = order.orderId;
        console.log('deleting subagent orders .....' , subAgentMobileNumber, subAgentOrderId);
        let mainAgentRef = ref.child('users/' + '9849123866' + '/suborders/' +
                      subAgentMobileNumber + '/' +subAgentOrderId );
            mainAgentRef.remove();

    })
    this.setState({acceptedOrders : []});
  }


  sendSMS(myCart) {
              var smsURL = 'https://www.google.com';
              myCart.shopDetail.forEach(function(shop,index){
                  var shopName = shop.name || "";
                  var text = "Dear " + shopName + "! \nYour order has been  placed successfully.";
                  var mobile = shop.mobile;
                  var objectOfAllItems = this.jsonConcat(shop.items.rice || {},shop.items.ravva || {}) || {};
                  objectOfAllItems = this.jsonConcat(objectOfAllItems,shop.items.broken || {}) || {};
                  text += "Total Weight = " + shop.totalWeight +" Quintals\n";
                  text += "We will deliver your goods as soon as possible.\n Thank-you!";
                  var obj = {};
                  obj[mobile] = text;
                 if(smsURL) {
                     this.makeCorsRequest(smsURL,obj);
                 }
              });
    }


    // Make the actual CORS request.
   makeCorsRequest(smsURL,object) {
             var xhr = this.createCORSRequest('POST', smsURL);
             if (!xhr) {
               return;
             }

             var params = JSON.stringify(object);
             xhr.send(params);

     }


     // Create the XHR object.
    createCORSRequest(method, url) {
            var xhr = new XMLHttpRequest();
            if ("withCredentials" in xhr) {
              // XHR for Chrome/Firefox/Opera/Safari.
              xhr.open(method, url, true);
            } else if (typeof XDomainRequest != "undefined") {
              // XDomainRequest for IE.
              xhr = new XDomainRequest();
              xhr.open(method, url);
            } else {
              // CORS not supported.
              xhr = null;
            }
            xhr.setRequestHeader("Content-Type", "application/json");

            return xhr;
      }

     jsonConcat(o1, o2) {
               for (var key in o2) {
                   o1[key] = o2[key];
               }
               return o1;
    }


}
