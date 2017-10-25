import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import 'semantic-ui-css/semantic.min.css';
import { Route, BrowserRouter, Link, Redirect, Switch } from 'react-router-dom'
import Login from './Login'
import Home from './Home'
import Cart from './protected/Cart'
import Buy from './protected/Buy'
import Orders from './protected/Orders'
import Settings from './protected/Settings'
import OrderDetails from './protected/OrderDetails'

import { logout } from '../helpers/auth'
import { authRef } from '../config/constants'

function PrivateRoute ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
    />
  )
}

function PublicRoute ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === false
        ? <Component {...props} />
      : <Redirect to='/Cart' />}
    />
  )
}

export default class App extends Component {
  state = {
    authed: false,
    loading: true,
  }
  componentDidMount () {
    this.removeListener = authRef().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authed: true,
          loading: false,
        })
      } else {
        this.setState({
          authed: false,
          loading: false
        })
      }
    })
  }
  componentWillUnmount () {
    this.removeListener()
  }
  render() {
    //const currentRoute = this.props.location.pathname;
    //console.log('ROUTE=', currentRoute);

    return this.state.loading === true ? <h1>Loading...</h1> : (
      <BrowserRouter>
        <div>
          <nav className="navbar navbar-default navbar-static-top">
            <div className="nav-container">
              <div className="navbar-header">
                <Link to="/" className="navbar-brand">Lalitha Agent Console</Link>
              </div>
              {this.state.authed
                ?
                  <ul className="nav navbar-nav pull-right">
                    <li>
                      <Link to="/buy" className="navbar-brand active">Buy</Link>
                    </li>
                    <li>
                      <Link to="/cart" className="navbar-brand active">Cart</Link>
                    </li>
                    <li>
                      <Link to="/orders" className="navbar-brand">Orders</Link>
                    </li>
                    <li>
                      <Link to="/settings" className="navbar-brand">Settings</Link>
                    </li>
                    <li>
                      <button
                          style={{border: 'none', background: 'transparent'}}
                          onClick={() => {
                            logout()
                          }}
                          className="navbar-brand">Logout</button>
                    </li>
                  </ul>
                :
                  <ul className="nav navbar-nav pull-right">
                    <li>
                      <span>
                        <Link to="/login" className="navbar-brand">Login</Link>
                      </span>
                    </li>
                  </ul>}
            </div>
          </nav>
          <div className="container">
            <div className="row">
              <Switch>
                <Route path='/' exact component={Home} />
                <PublicRoute authed={this.state.authed} path='/login' component={Login} />
                <PrivateRoute authed={this.state.authed} path='/buy' component={Buy} />
                <PrivateRoute authed={this.state.authed} path='/cart' component={Cart} />
                <PrivateRoute authed={this.state.authed} path='/orders' component={Orders} />
                <PrivateRoute authed={this.state.authed} path='/settings' component={Settings} />
                <PrivateRoute authed={this.state.authed} path="/view/:orderId" component={ OrderDetails }/>
                <Route render={() => <h3>Ooops! Nothing to show here</h3>} />
              </Switch>
            </div>
          </div>
          <footer>©MRP Solutions</footer>
        </div>
      </BrowserRouter>
    );
  }
}
