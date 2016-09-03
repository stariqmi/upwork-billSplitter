import React, { Component } from 'react'
import { Link} from 'react-router'
import * as HTTP from 'superagent'
import config from './config'

const BASE_URL = config.base_url

class HousemateEdit extends Component {
  constructor() {
    super()
    this.state = {
      basic: {},
      card: {}
    }
  }

  componentDidMount() {
    HTTP.get(BASE_URL + '/housemates/' + this.props.params.id)
      .end((err, res) => {
        this.setState({
          basic: {
            name: res.body.housemate.name,
            email: res.body.housemate.email
          },
          card: res.body.housemate.card
        })
      })
  }

  editBasic(e) {
    e.preventDefault()
    HTTP.put(BASE_URL + '/housemates/' + this.props.params.id + '/info')
    .send(this.state.basic)
    .end((err, res) => {
      alert('Success: ' + res.body.success)
    })
  }

  editCC(e) {
    e.preventDefault()
    HTTP.put(BASE_URL + '/housemates/' + this.props.params.id + '/cc')
    .send(this.state.card)
    .end((err, res) => {
      if (!res.body.success) {
        alert('Error: ' + res.body.error)
      }
    })
  }

  handleBasicChange(prop, e) {
    let value = e.target.value
    let basic = this.state.basic
    let mod = {}
    mod[prop] = value
    let new_basic = Object.assign({}, basic, mod)
    this.setState({basic: new_basic})
  }

  handleCCChange(prop, e) {
    let value = e.target.value
    let card = this.state.card
    let mod = {}
    mod[prop] = parseInt(value)
    let new_card = Object.assign({}, card, mod)
    this.setState({card: new_card})
  }

  render() {
    return (
      <div className="container-fluid">
        <Link to='/main'>Home</Link>
        <div className="row">
          <div className="col-sm-6">
            <h2>Basic Info</h2>
            <form className="basic-edit-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text"
                        className="form-control"
                        placeholder={this.state.basic.name}
                        onChange={this.handleBasicChange.bind(this, 'name')}/>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email"
                        className="form-control"
                        placeholder={this.state.basic.email}
                        onChange={this.handleBasicChange.bind(this, 'email')}/>
              </div>
              <button type="submit" className="btn btn-primary" onClick={this.editBasic.bind(this)}>Submit</button>
            </form>
          </div>
          <div className="col-sm-6">
            <h2>Credit Card Info</h2>
            <form className="cc-edit-form">
            <div className="form-group">
              <label htmlFor="number">Number</label>
              <input type="text"
                      className="form-control"
                      placeholder={this.state.card.number}
                      onChange={this.handleCCChange.bind(this, 'number')}/>
            </div>
              <div className="form-group">
                <label htmlFor="exp_month">Exp Month</label>
                <input type="text"
                        className="form-control"
                        placeholder={this.state.card.exp_month}
                        onChange={this.handleCCChange.bind(this, 'exp_month')}/>
              </div>
              <div className="form-group">
                <label htmlFor="exp_year">Exp Year</label>
                <input type="text"
                        className="form-control"
                        placeholder={this.state.card.exp_year}
                        onChange={this.handleCCChange.bind(this, 'exp_year')}/>
              </div>
              <div className="form-group">
                <label htmlFor="cvc">CVC</label>
                <input type="text"
                        className="form-control"
                        placeholder={this.state.card.cvc}
                        onChange={this.handleCCChange.bind(this, 'cvc')}/>
              </div>
              <button type="submit" className="btn btn-primary" onClick={this.editCC.bind(this)}>Submit</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default HousemateEdit
