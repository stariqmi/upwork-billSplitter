import React, { Component } from 'react'
import * as HTTP from 'superagent'
import { Link } from 'react-router'
import config from './config'

let BASE_URL = config.base_url

class HousemateCreate extends Component {

  constructor() {
    super()
    this.state = {
      name: '',
      email: '',
      card: {
        number: 0,
        exp_month: 0,
        exp_year: 0,
        cvc: 0
      }
    }
  }

  handleBasicChange(prop, e) {
    let value = e.target.value
    let mod = {}
    mod[prop] = value
    this.setState(Object.assign({}, this.state, mod))

  }

  handleCCChange(prop, e) {
    let value = e.target.value
    let mod = {}
    mod[prop] = parseInt(value) // Ideally the card number should be an integer
    let mod_card = Object.assign({}, this.state.card, mod)
    this.setState(Object.assign({}, this.state, {card: mod_card}))

  }

  createHousemate(e) {
    e.preventDefault()

    HTTP.post(BASE_URL + '/housemates')
      .send(this.state)
      .end((err, res) => {
        if (!res.body.success) {
          alert('Error: ' + res.body.error)
        }
        alert('Success: ' + res.body.success)
      })
  }

  render() {
    return (
      <div className="container-fluid">
        <Link to='/main'>Home</Link>
        <div className="row">
          <div className="col-sm-4">
             <h2>Create a Housemate</h2>
             <form className="create-housemate-form">
               <div className="form-group">
                 <label htmlFor="name">Name</label>
                 <input type="text"
                         className="form-control"
                         onChange={this.handleBasicChange.bind(this, 'name')}/>
               </div>
               <div className="form-group">
                 <label htmlFor="email">Email</label>
                 <input type="text"
                         className="form-control"
                         onChange={this.handleBasicChange.bind(this, 'email')}/>
               </div>

               <div className="form-group">
                 <label htmlFor="cc_number">Card Number</label>
                 <input type="text"
                         className="form-control"
                         onChange={this.handleCCChange.bind(this, 'number')}/>
               </div>

               <div className="form-group">
                 <label htmlFor="exp_month">Expiry Month</label>
                 <input type="text"
                         className="form-control"
                         onChange={this.handleCCChange.bind(this, 'exp_month')}/>
               </div>

               <div className="form-group">
                 <label htmlFor="exp_year">Expiry Year</label>
                 <input type="text"
                         className="form-control"
                         onChange={this.handleCCChange.bind(this, 'exp_year')}/>
               </div>

               <div className="form-group">
                 <label htmlFor="cvc">CVC</label>
                 <input type="text"
                         className="form-control"
                         onChange={this.handleCCChange.bind(this, 'cvc')}/>
               </div>
               <button type="submit" className="btn btn-primary" onClick={this.createHousemate.bind(this)}>Submit</button>
             </form>
          </div>
        </div>
      </div>
    )
  }
}

export default HousemateCreate
