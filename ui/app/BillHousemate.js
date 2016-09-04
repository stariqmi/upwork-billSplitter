import React, { Component} from 'react'

class BillHousemate extends Component {
  render() {
    return (
      <li>
        <div>
          {this.props.data.name} - {this.props.data.paid ? /*'Charge ID: ' + /this.props.data.charge_id*/'Paid' : 'Not Paid'}
        </div>
      </li>
    )
  }
}

export default BillHousemate
