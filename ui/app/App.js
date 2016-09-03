import React, { Component } from 'react'
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router'
import BillSplitter from './BillSplitter'
import HousemateEdit from './HousemateEdit'

class App extends Component {
  render() {
    return (
      <Router history={hashHistory}>
        <Route path='/main' component={BillSplitter} />
        <Route path='/housemates/:id/edit' component={HousemateEdit} />
      </Router>
    )
  }
}

export default App
