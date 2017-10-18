import React, { Component } from 'react'
import { Header, Table, Icon, Card } from 'semantic-ui-react'
import ReactDataGrid from 'react-data-grid';
import { Toolbar } from 'react-data-grid-addons';
import moment from 'moment';
import { ref } from '../../config/constants'


// Custom Formatter component
class numberFormatter extends Component{
  render() {
    return (
      <div style={{textAlign: 'right', textTransform: 'bolder', fontSize: '22px'}}>
        {this.props.value}
      </div>
    );
  }
};

class dateFormatter extends Component{
  render() {
    const val = this.props.value;
    const vals = val.split('_');
    return (
      <div>
        <i style={{color: 'blue', fontSize: '8px'}}>{vals[1]} </i> <strong>{vals[0]}</strong>
      </div>
    );
  }
};



export default class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: {},
      rows: []
    };
    this._columns = [
      {
        key: 'orderId',
        name: 'ORDER-ID',
        filterable: true,
      },
      {
        key: 'time',
        name: 'Time',
        width: 250,
        filterable: true,
        sortable: true,
        formatter: dateFormatter
      },
      {
        key: 'status',
        name: 'status',
        filterable: true,
        sortable: true
      },
      {
        key: 'weight',
        name: 'Weight in Tons',
        filterable: true,
        className: 'weight',
        sortable: true,
        formatter: numberFormatter
      },
      {
        key: 'price',
        name: 'Amount',
        filterable: true,
        className: 'price',
        sortable: true,
        formatter: numberFormatter
      },
      {
        key: 'updates',
        name: 'Updates',
        filterable: false
      },
    ];
  }



  componentDidMount() {
    const refPath = `orders`;
    const orders = [];
    ref.child(refPath).orderByChild('uid').equalTo('9849123866').once('value', (snap) => {
      const orderData = snap.val();
      Object.keys(orderData).forEach(orderId => {
        const { time, status, isSubAgentOrder, cart} = orderData[orderId];
        const { totalWeight, grossPrice } = cart;
        const totalWeightInTowns = totalWeight/10;
        const date = new Date(time);
        const dateString = moment(date).format('DD/MM/YY-h:mm:ssa') + '_'
        + moment(date).fromNow();
        orders.push({
          orderId,
          time: dateString,
          status,
          weight: totalWeightInTowns.toFixed(2),
          price: grossPrice.toFixed(2).toLocaleString('en-IN')
        });
      })
      this.setState({
        rows: orders
      });
    });
  }

  getRows() {
    return this.state.rows;
  }

  getSize() {
    return this.state.rows ? this.state.rows.length : 0;
  }

  rowGetter(rowIdx) {
    return this.state.rows ? this.state.rows[rowIdx] : {};
  }

  handleFilterChange(filter) {
    let newFilters = Object.assign({}, this.state.filters);
    if (filter.filterTerm) {
      newFilters[filter.column.key] = filter;
    } else {
      delete newFilters[filter.column.key];
    }
    this.setState({ filters: newFilters });
  }

  onClearFilters() {
    // all filters removed
    this.setState({filters: {} });
  }

  render () {
    // iterate over orders in the state and render Table
    // use react-data-grid
    // npm install react-data-grid --save
    // and start using


    return (
      <ReactDataGrid
        columns={this._columns}
        rowGetter={this.rowGetter.bind(this)}
        enableCellSelect={true}
        rowsCount={this.getSize()}
        minHeight={600}
        toolbar={<Toolbar enableFilter={true}/>}
        onAddFilter={this.handleFilterChange.bind(this)}
        onClearFilters={this.onClearFilters.bind(this)} />
    );
  }

  renderOldTable() {
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
    );
  }
}
