import React, { Component} from 'react'

class BillHousemate extends Component {
  render() {
    return (
      <li>
        <div>
          {this.props.data.name} - Paid: {this.props.data.paid ? this.props.data.charge_id : 'Not Paid'}
        </div>
      </li>
    )
  }
}

export default BillHousemate
