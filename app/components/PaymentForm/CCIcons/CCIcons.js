import React from 'react'
import {iconPath} from 'utils'
export default React.createClass({
  render() {

    var ccStyle = {
      display: 'inline',
      margin: 0,
      fontSize: 0,
      width: 30,
      borderRadius: 2,
      overflow: 'hidden'
    }
    return (
      <span className="CCIcons">
        <i style={ccStyle}><img src={iconPath("cc_visa.png")}/></i>
        <i style={ccStyle}><img src={iconPath("cc_mastercard.png")}/></i>
        <i style={ccStyle}><img src={iconPath("cc_american_express.png")}/></i>
        <i style={ccStyle}><img src={iconPath("cc_discover.png")}/></i>
      </span>
    )
  }
})
