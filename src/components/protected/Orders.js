import React, { Component } from 'react'
import ReactDataGrid from 'react-data-grid';
const { Toolbar, Data: { Selectors } } = require('react-data-grid-addons');
import { Loader } from 'semantic-ui-react';
import { onFetchUserMobileNumber } from '../../helpers/auth'



import moment from 'moment';
import { ref } from '../../config/constants'


// Custom Formatter component
class numberFormatter extends Component{
  render() {
    return (
      <div style={{textAlign: 'right', textTransform: 'bolder', fontSize: '16px', fontWeight: 'bold'}}>
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
        <i style={{color: 'blue', fontSize: '8px'}}>{vals[1]} </i>{vals[0]}
      </div>
    );
  }
};

class orderLinkFormatter extends Component{
  render() {
    const orderId = this.props.value;
    return (
      <div>
        <a href={`/view/${orderId}`} target='_blank'><strong>{orderId}</strong></a>
      </div>
    );
  }
};



export default class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: {},
      rows: [],
      loading: true
    };
    this._columns = [
      {
        key: 'orderId',
        name: 'ORDER-ID',
        width: 180,
        filterable: true,
        formatter: orderLinkFormatter
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
        filterable: false,
        width: 400
      }
    ];
  }

  componentDidMount() {
    const mobile = sessionStorage.getItem('mobile');
    if(!mobile) {
      console.log('MOBILE NOT FOUND');
      onFetchUserMobileNumber().then(data => {
        console.log('MOBILE FETCHED WITH A CALL',  data.val());
        const fetchedMobile = data.val();
        this.fetchOrders(fetchedMobile);
      });
    } else {
      console.log('MOBILE IS ALREADY IN THE SESSION');
      this.fetchOrders(mobile);
    }
  }

  fetchOrders(mobile) {
    const refPath = `orders`;
    const orders = [];

    ref.child(refPath).orderByChild('uid').equalTo(mobile).once('value', (snap) => {
      const orderData = snap.val();
      Object.keys(orderData).forEach(orderId => {
        const { time, status, isSubAgentOrder, cart} = orderData[orderId];
        if(!isSubAgentOrder) {
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
            price: grossPrice.toLocaleString('en-IN'),
            epochTime : time
          });
        }
      })
      this.setState({
        rows: orders,
        loading: false
      });
      //SORT RECORDS HERE UNTIL WE FIGUORE OUT FIREBASE
      this.handleGridSort('epochTime','DESC');
    });
  }

  getRows() {
    return Selectors.getRows(this.state);
  }

  getSize() {
    return this.getRows().length;
  }

  rowGetter(rowIdx) {
    const rows = this.getRows();
    return rows[rowIdx];
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

  handleGridSort = (sortColumn, sortDirection) => {
    if(sortColumn === 'time')
      sortColumn = 'epochTime';



    const comparer = (a, b) => {
      if(sortColumn === 'price' || sortColumn === 'weight') {
        let aa = a[sortColumn].replace(/,/g , "");
        let bb = b[sortColumn].replace(/,/g , "");

        if (sortDirection === 'ASC') {
          return (Number(aa) > Number(bb)) ? 1 : -1;
        } else if (sortDirection === 'DESC') {
          return (Number(aa) < Number(bb)) ? 1 : -1;
        }

      }else {
        if (sortDirection === 'ASC') {
          return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
        } else if (sortDirection === 'DESC') {
          return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
        }
      }


    };

    const rows = sortDirection === 'NONE' ? this.state.rows.slice(0) : this.state.rows.sort(comparer);

    this.setState({ rows });
  }

  render () {
    if(this.state.loading) {
      return <Loader active inline='centered' size='massive'/>;
    }

    return (
      <ReactDataGrid
        columns={this._columns}
        rowGetter={this.rowGetter.bind(this)}
        onGridSort={this.handleGridSort.bind(this)}
        minHeight={600}
        rowsCount={this.getSize()}
        toolbar={<Toolbar enableFilter={true}/>}
        onAddFilter={this.handleFilterChange.bind(this)}
        onClearFilters={this.onClearFilters.bind(this)} />
    );
  }

}
