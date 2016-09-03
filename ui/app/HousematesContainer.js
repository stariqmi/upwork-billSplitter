import React, { Component } from 'react'
import * as HTTP from 'superagent'
import config from './config'
import Housemate from './Housemate'

const BASE_URL = config.base_url

class HousematesContainer extends Component {
  constructor() {
    super()
    this.state = {
      housemates: []
    }
  }

  onHousemateDelete(housemate_id) {
    let index = this.state.housemates.findIndex((h) => {
      return h._id.$oid === housemate_id
    })

    if (index > -1) {
      // The extra slice is to get a copy of the array and then modify it
      let new_housemates = this.state.housemates.slice()
      new_housemates.splice(index, index + 1)
      this.setState({housemates: new_housemates})
    }
  }

  componentDidMount() {
    let self = this
    HTTP.get(BASE_URL + '/housemates')
      .end(function(err, res) {
        self.setState({
          housemates: res.body.housemates
        })
      })
  }

  render() {

    let housemates = this.state.housemates.map((h) => {
      return <Housemate key={h._id.$oid} data={h} onDelete={this.onHousemateDelete.bind(this)}/>
    });

    return <div>
      <center><h1 className="header">Housemates</h1></center>
      {housemates}
    </div>
  }
}

export default HousematesContainer
