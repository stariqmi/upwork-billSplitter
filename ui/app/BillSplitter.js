import React, { Component } from 'react'
import * as HTTP from 'superagent'

import HousematesContainer from './HousematesContainer'
import BillsContainer from './BillsContainer'

class BillSplitter extends Component {

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-6"><BillsContainer /></div>
          <div className="col-sm-6"><HousematesContainer /></div>
        </div>
      </div>
    )
  }
}

export default BillSplitter
