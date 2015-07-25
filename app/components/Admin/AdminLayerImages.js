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
            messages: []}
  },

  componentWillMount() {
    Store.actions.loadAdminLayerImages()
  },

  selectLayerImage(layerImage) {
    this.setState({selectedLayerImage:layerImage})
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
        .filter(layerImage => layerImage)
        .sort((imageOne, imageTwo) => imageTwo.get('createdAt') - imageOne.get('createdAt'))
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
