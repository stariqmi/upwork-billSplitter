import React, { Component } from 'react'
import * as HTTP from 'superagent'
import BillHousemate from './BillHousemate'
import config from './config'

const BASE_URL = config.base_url

class Bill extends Component {

  constructor() {
    super()
    this.state = {
      bill: {}
    }
  }

  componentDidMount() {
    this.setState({bill: this.props.data})
  }

  onSplitClick() {
    if (!this.state.bill.split) {
      // After all charges have been split
      let housemates = this.state.bill.housemates
      let bill_id = this.state.bill._id.$oid

      let promises = []
      for (let key in housemates) {
        let housemate_id = key

        let promise = HTTP.put(BASE_URL + '/charge')
          .send({bill_id, housemate_id})

        promises.push(promise)
      }

      Promise.all(promises).then((values) => {
        HTTP.get(BASE_URL + '/bills/' + this.state.bill._id.$oid)
          .end((err, res) => {
            this.setState({bill: res.body.bill})
          })
      })
    }


  }

  onDeleteClick() {
    HTTP.del(BASE_URL + '/bills/' + this.state.bill._id.$oid)
      .end((err, res) => {
        alert('Success: ' + res.body.success)
        this.props.onBillDelete(this.state.bill._id.$oid)
      })
  }

  render() {

    let housemate_els = []
    let housemates = this.state.bill.housemates
    for (let key in housemates) {
      housemate_els.push(<BillHousemate key={key} data={housemates[key]} />)
    }

    return (
      <div className="bill">
        <div className="bill-details">
          <b>Amount: </b>{this.props.data.amount}<br/>
          <b>Description: </b> {this.props.data.description}<br/>
          <b>Housemates: </b><br/>
          <ul>
            {housemate_els}
          </ul>
        </div>
        <div className="row">
          <div
            onClick={this.onSplitClick.bind(this)}
            className={"bill-btn bill-split-button col-md-6" + (this.state.bill.split ? ' bill-split-complete':'')}>Split</div>
          <div className="bill-btn bill-delete-button col-md-6" onClick={this.onDeleteClick.bind(this)}>Delete</div>
        </div>
      </div>
    )
  }
}

export default Bill
