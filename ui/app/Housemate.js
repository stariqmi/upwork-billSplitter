import React, { Component } from 'react'
import * as HTTP from 'superagent'
import { Link } from 'react-router'
import config from './config'

const BASE_URL = config.base_url

class Housemate extends Component {

  onDeleteClick() {

    // Delete housemates/{this.props.data._id.$oid}
    HTTP.del(BASE_URL + '/housemates/' + this.props.data._id.$oid)
    .withCredentials()
    .end((err, res) => {
      console.log(res)
      // If the housemate was deleted
      if (res.body.success) {
        this.props.onDelete(this.props.data._id.$oid)
      }
    })
  }

  render() {
    return (
      <div className="housemate container-fluid">
        <div className="name row">{this.props.data.name}</div>
        <div className="details row">
          <div className="email col-sm-6">{this.props.data.email}</div>
          <div className="card_num col-sm-6">
            XXXX XXXX XXXX {this.props.data.card.number.toString().substring(12, 16)}<br/>
            {this.props.data.card.exp_month}/{this.props.data.card.exp_year}
          </div>
        </div>
        <div className="controls row">
          <div className="edit col-sm-6"><Link to={'housemates/' + this.props.data._id.$oid + '/edit'}>Edit</Link></div>
          <div className="delete col-sm-6" onClick={this.onDeleteClick.bind(this)}>Delete</div>
        </div>
      </div>
    )
  }
}

export default Housemate
