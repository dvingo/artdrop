import React from 'react'
import {imageUrlForLayerImage} from 'state/utils'
export default React.createClass({

  render() {
    var selectDivStyles = {
      width: '100%',
      height: '100%',
      background: '#262323',
      opacity: '0.8',
      position: 'absolute',
      top: '0',
      left: '0'
    }
    var layerImage = this.props.layerImage
    var overlayStyles = (this.props.isSelected ? selectDivStyles : null)
    return (
      <div onClick={this.props.onClick.bind(null, layerImage)}
           key={layerImage.get('id')}
           style={{display: 'inline-block', position:'relative'}}>
        <img src={imageUrlForLayerImage(layerImage)} height={60} width={60}/>
        <div style={overlayStyles} onClick={this.props.onClick.bind(null, layerImage)}></div>
      </div>
    )
  }
})
