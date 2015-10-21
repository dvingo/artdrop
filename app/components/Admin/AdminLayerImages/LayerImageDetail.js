import React from 'react'
import {imageUrlForLayerImage} from 'state/utils'
export default React.createClass({

  getInitialState() {
    return {showDeleteConfirmation: false,
            confirmDeleteText: ''}
  },

  onConfirmDeleteChange(e) {
    this.setState({confirmDeleteText: e.target.value})
  },

  handleShowDeleteConfirmation(){
    this.setState({showDeleteConfirmation: true})
  },

  render() {
    var {layerImage} = this.props
    var labelStyle = { display: 'inline-block', fontWeight: 'bold', marginRight: 20 }
    var infoStyle = { display: 'inline-block'}
    var rowStyle = { margin: '10px 0' }
    return (
      <div style={{margin: '20px 0'}}>
        <img src={imageUrlForLayerImage(layerImage)} height={200} width={200}/>

        <div style={rowStyle}>
          <div style={labelStyle}>Created:</div>
          <div style={infoStyle}>{new Date(layerImage.get('createdAt')).toString()}</div>
        </div>

        <div style={rowStyle}>
          <div style={labelStyle}>Last Updated:</div>
          <div style={infoStyle}>{new Date(layerImage.get('updatedAt')).toString()}</div>
        </div>

        <div style={rowStyle}>
          <div style={labelStyle}>Image URL:</div>
          <div style={infoStyle}>
            {layerImage.get('imageUrl')}
          </div>
        </div>

        <div style={rowStyle}>
          {!this.state.showDeleteConfirmation ?
            <button onClick={this.handleShowDeleteConfirmation}>DELETE</button> : null}

          {this.state.showDeleteConfirmation ? (
            <div>
              <label>Enter 'yes' to confirm.</label>
              <input type="text" value={this.state.confirmDeleteText} onChange={this.onConfirmDeleteChange}/>
              {this.state.confirmDeleteText === 'yes' ?
                  <button onClick={this.props.onDelete}>REALLY DELETE</button> : null}
            </div>
            ) : null}

        </div>
      </div>
    )
  }
})
