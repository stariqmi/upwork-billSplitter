import React, { Component } from 'react'
import *  as HTTP  from 'superagent'
import BillCreate from './BillCreate'
import Bill from './Bill'

import config from './config'

const BASE_URL = config.base_url

class BillsContainer extends Component {

  constructor() {
    super()
    this.state = {
      bills: []
    }
  }

  componentDidMount() {
    HTTP.get(BASE_URL + '/bills')
      .end((err, res) => {
        this.setState({bills: res.body.bills})
      })
  }

  addBill(bill) {
    let bills = this.state.bills.slice()
    bills.push(bill)

    this.setState({bills: bills})
  }

  onBillDelete(bill_id) {
    let bills = this.state.bills;
    let index = bills.findIndex((bill) => {
      return bill._id.$oid === bill_id
    })

    bills.splice(index, index + 1)

    this.setState({bills: bills})
  }

  render() {
    let bills = this.state.bills.map((bill) => {
      return <Bill key={bill._id.$oid} data={bill} onBillDelete={this.onBillDelete.bind(this)}/>
    })

    return (
      <div>
        <BillCreate onCreate={this.addBill.bind(this)}/>
        <div className="bills">
          {bills}
        </div>
      </div>
    )
  }
}

export default BillsContainer
