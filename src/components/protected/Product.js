import React, { Component } from 'react';
import { Image, Icon, Card, Button, Modal, Header, Form } from 'semantic-ui-react'

export default class Product extends Component {

  state = { open: false }

  show = (selectedProductId) => this.setState({ open: true, selectedProductId })
  close = () => this.setState({ open: false })
  productImageUrl = (productId) => `https://mrps-orderform.firebaseapp.com/rice_200/${productId}.png`;



  renderProductToCartModal() {
    const { open, selectedProductId } = this.state;
    return (
      <Modal size='tiny' dimmer='blurring' open={open} onClose={this.close} className="addToCart">
        <Modal.Header>{`Add ${selectedProductId} to cart?`}</Modal.Header>
        <Modal.Content image>
          <Image wrapped size='medium' src={this.productImageUrl(selectedProductId)} />
          <Modal.Description>
          <Modal.Header>{`${selectedProductId}`}</Modal.Header>
          <Form>
            <div class="content">
              <div class="header">10KG LALITHA GREEN</div>
              <div class="meta">
                <span class="date">2,400</span>
              </div>
              <div class="description">Matthew is a musician living in Nashville.</div>
            </div>
            <div class="header">10KG LALITHA GREEN</div>
            <Form.Group>
              <Form.Input label='PRICE/QNTL' placeholder='0.00' type='number' width={16} disabled/>
            </Form.Group>
            <Form.Group>
              <Form.Input label='BAGS' placeholder='bags' type='number' width={16}/>
            </Form.Group>
            <Form.Group>
              <Form.Input label='QUINATLS' placeholder='qnts' type='number' width={16}/>
            </Form.Group>
            <Form.Group>
              <Form.Input label='TOTAL PRICE' placeholder='qnts' type='number' width={16}/>
            </Form.Group>
          </Form>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={this.close}>
            BACK
          </Button>
          <Button positive icon='checkmark' labelPosition='right' content="ADD to CART" onClick={this.close} />
        </Modal.Actions>
      </Modal>
    );
  }

  render () {
    return (
      <div>
        { this.renderProductToCartModal() }
        <Card.Group itemsPerRow={4}>
          { this.renderProductCard('10KgLalithaBrown') }
          { this.renderProductCard('10KgLalithaGreen') }
          { this.renderProductCard('25KgHydLalitha') }
          { this.renderProductCard('25KgLalithaOrange') }
          { this.renderProductCard('25KgSonamBrown') }
          { this.renderProductCard('500GmRiceRavva') }
        </Card.Group>
      </div>
    );
  }

  renderProductCard(productId) {

    return (
      <Card raised>
        <Image size='small' centered src={this.productImageUrl(productId)} />
        <Card.Content>
          <Card.Header>
            10KG LALITHA GREEN
          </Card.Header>
          <Card.Meta>
            <span className='date'>
              2,400
            </span>
          </Card.Meta>
          <Card.Description>
            Matthew is a musician living in Nashville.
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Button  color='green' fluid primary onClick={this.show.bind(this,productId)} >BUY</Button>
        </Card.Content>
      </Card>
    );

  }

}
