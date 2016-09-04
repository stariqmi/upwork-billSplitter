import React, { Component } from 'react'
import *  as HTTP  from 'superagent'
import config from './config'

const BASE_URL = config.base_url

class BillCreate extends Component {

  constructor() {
    super()
    this.state = {
      amount: 0,
      description: ''
    }
  }

  handleBillChange(prop, e) {
    let value = e.target.value

    let mod = {}
    mod[prop] = (prop === 'amount')? parseInt(value) : value
    this.setState(Object.assign({}, this.state, mod))
  }

  createBill(e) {
    e.preventDefault()
    HTTP.post(BASE_URL + '/bills')
      .send(this.state)
      .end((err, res) => {
        if (!res.body.success) alert('Error: ' + res.body.error)
        else {
          alert('Success: ' + res.body.success)
          this.props.onCreate(res.body.bill)
        }
      })
  }

  render() {
    return (<div>
      <center><h2>Create a Bill</h2></center>
      <form className="create-bill-form">

          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input type="text" className="form-control" onChange={this.handleBillChange.bind(this, 'amount')}/>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input type="text" className="form-control" onChange={this.handleBillChange.bind(this, 'description')}/>
          </div>

        <button type="submit" className="btn btn-primary" onClick={this.createBill.bind(this)}>Create</button>
      </form>

    </div>)
  }
}

export default BillCreate
