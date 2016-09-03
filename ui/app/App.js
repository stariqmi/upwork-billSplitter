import React, { Component } from 'react'
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router'
import BillSplitter from './BillSplitter'
import HousemateEdit from './HousemateEdit'
import HousemateCreate from './HousemateCreate'

class App extends Component {
  render() {
    return (
      <Router history={hashHistory}>
        <Route path='/main' component={BillSplitter} />
        <Route path='/housemates/:id/edit' component={HousemateEdit} />
        <Route path='/housemates/create' component={HousemateCreate} />
      </Router>
    )
  }
}

export default App
