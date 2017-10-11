import React, { Component } from 'react'
import { Header, Table, Icon } from 'semantic-ui-react'


export default class Orders extends Component {
  render () {
    return (
      <div className="orders head">
        <h1>Your Orders</h1>
        <Table celled padded>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell singleLine>Order ID</Table.HeaderCell>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Weight in Tons</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
              <Table.HeaderCell>Updates</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              <Table.Cell>
                <Header as='h2' textAlign='center'>112121</Header>
              </Table.Cell>
              <Table.Cell singleLine>30/12/2017 10:30:21AM</Table.Cell>
              <Table.Cell>
                <Icon name='checkmark' />Delivered</Table.Cell>
              <Table.Cell>
                <Header as='h2' textAlign='center'>11.4</Header>
              </Table.Cell>
              <Table.Cell textAlign='right'>
                <Header as='h2'>1,40,000.00</Header>
              </Table.Cell>
              <Table.Cell>
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc auctor diam vitae scelerisque feugiat. In imperdiet dui nibh, quis pretium libero placerat nec. Aenean efficitur, justo vitae consectetur suscipit, nibh turpis pretium nisi, in auctor velit odio id velit. Mauris velit nisl, mattis a nisi non, egestas gravida ante. Etiam bibendum lorem ornare sem tincidunt dignissim. Curabitur mattis cursus mi ut fringilla. Cras convallis volutpat velit quis tristique.
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <Header as='h2' textAlign='center'>112122</Header>
              </Table.Cell>
              <Table.Cell singleLine>31/12/2017 11:20:11AM</Table.Cell>
              <Table.Cell>
                <Icon name='attention' />Order Rejected</Table.Cell>
              <Table.Cell>
                <Header as='h2' textAlign='center'>3.2</Header>
              </Table.Cell>
              <Table.Cell textAlign='right'>
                <Header as='h2'>2,32,000.00</Header>
              </Table.Cell>
              <Table.Cell>
                  Curabitur efficitur vestibulum enim, nec eleifend orci imperdiet et. Maecenas sollicitudin ultrices aliquet.
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>

      </div>
    )
  }
}
