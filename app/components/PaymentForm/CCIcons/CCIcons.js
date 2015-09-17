import React from 'react'
import {iconPath} from 'utils'
export default React.createClass({
  render() {

    var ccStyle = {
      float: 'left',
      display: 'inline',
      margin: '1px 0 0 5px',
      fontSize: 0,
      width: 30,
      marginTop: 7,
      borderRadius: 2,
      overflow: 'hidden'
    }
    return (
      <span>
        <i style={ccStyle}><img src={iconPath("cc_visa.png")}/></i>
        <i style={ccStyle}><img src={iconPath("cc_mastercard.png")}/></i>
        <i style={ccStyle}><img src={iconPath("cc_american_express.png")}/></i>
        <i style={ccStyle}><img src={iconPath("cc_discover.png")}/></i>
      </span>
    )
  }
})
