import React from 'react'
import Router from 'react-router'
import reactor from '../../state/reactor'
import Store from '../../state/main'
import getters from '../../state/getters'
import Notification from '../Notification'
import {imageUrlForLayerImage} from '../../state/utils'

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return {layerImages: getters.layerImages}
  },

  getInitialState() {
    return {selectedLayerImage: null,
            errors: [],
            messages: [],
            showDeleteConfirmation: false,
            confirmDeleteText: ''}
  },

  componentWillMount() {
    Store.actions.loadAdminLayerImages()
  },

  selectLayerImage(layerImage) {
    this.setState({selectedLayerImage:layerImage, confirmDeleteText: '', showDeleteConfirmation: false})
  },

  handleShowDeleteConfirmation(){
     this.setState({showDeleteConfirmation: true})
  },

  confirmedDeleteSelectedLayerImage() {
    Store.actions.deleteLayerImage(this.state.selectedLayerImage)
    this.setState({selectedLayerImage: null, confirmDeleteText: '', showDeleteConfirmation: false})
  },

  onConfirmDeleteChange(e) {
    this.setState({confirmDeleteText: e.target.value})
  },

  render() {
    var errors = this.state.errors.map(e => {
      return <p style={{background:'#E85672'}}>{e}</p>
    })

    var messages = this.state.messages.map(m => {
      return <Notification message={m}
                 onClose={() => this.setState({messages:[]})}/>
    })

    var layerImages = this.state.layerImages
        .map(layerImage => {
      var border = this.state.selectedLayerImage === layerImage ? '2px solid' : 'none'
      return (
        <div onClick={this.selectLayerImage.bind(null, layerImage)}
             style={{display: 'inline-block', border: border}}>
          <img src={imageUrlForLayerImage(layerImage)} height={60} width={60}/>
        </div>
      )
    })

    var labelStyle = { display: 'inline-block', fontWeight: 'bold', marginRight: 20 }
    var infoStyle = { display: 'inline-block'}
    var rowStyle = { margin: '10px 0' }
    var selectedLayerImage = this.state.selectedLayerImage
    var selectedLayerImageInfo = selectedLayerImage ? (
        <div style={{margin: '20px 0'}}>
          <img src={imageUrlForLayerImage(selectedLayerImage)} height={200} width={200}/>
          <div style={rowStyle}>
            <div style={labelStyle}>Created:</div>
            <div style={infoStyle}>{new Date(selectedLayerImage.get('createdAt')).toString()}</div>
          </div>
          <div style={rowStyle}>
            <div style={labelStyle}>Last Updated:</div>
            <div style={infoStyle}>{new Date(selectedLayerImage.get('updatedAt')).toString()}</div>
          </div>
          <div style={rowStyle}>
            <div style={labelStyle}>Image URL:</div><div style={infoStyle}>{selectedLayerImage.get('imageUrl')}</div>
          </div>
          <div style={rowStyle}>

            {!this.state.showDeleteConfirmation ?
              <button onClick={this.handleShowDeleteConfirmation}>DELETE</button> : null}

            {this.state.showDeleteConfirmation ? (
              <div>
                <label>Enter 'yes' to confirm.</label>
                <input type="text" value={this.state.confirmDeleteText} onChange={this.onConfirmDeleteChange}/>
                {this.state.confirmDeleteText === 'yes' ?
                    <button onClick={this.confirmedDeleteSelectedLayerImage}>REALLY DELETE</button> : null}
              </div>
              ) : null}

          </div>
        </div>
    ) : null

    return (
      <div className="admin-layer-images"
           style={{padding:10}}>
        <h1>Layer Images</h1>
        {selectedLayerImageInfo}
        {layerImages}
        {this.state.errors.length > 0 ? <div>{errors}</div> : null}
        {this.state.messages.length > 0 ? <div>{messages}</div> : null}
      </div>
    )
  }
})
