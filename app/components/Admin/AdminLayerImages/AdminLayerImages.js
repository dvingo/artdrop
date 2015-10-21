import React from 'react'
import Router from 'react-router'
import reactor from 'state/reactor'
import Store from 'state/main'
import getters from 'state/getters'
import Notification from 'components/Notification/Notification'
import {imageUrlForLayerImage} from 'state/utils'
import LayerImageDetail from './LayerImageDetail'
import { Set } from 'Immutable'

console.log('layer image detail: ', LayerImageDetail)
export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return { layerImages: getters.layerImages,
             tags: Store.getters.tags,
             tagsMap: ['tags'] }
  },

  getInitialState() {
    return {selectedLayerImage: null,
            errors: [],
            messages: [],
            selectedTag: null,
            editMode: 'editLayerImage',
            selectedLayerImages: Set(),
            showDeleteConfirmation: false,
            confirmDeleteText: ''}
  },

  componentWillMount() {
    Store.actions.loadAdminTags()
    Store.actions.loadAdminLayerImages()
  },

  selectLayerImage(layerImage) {
    if (this.state.editMode === 'editLayerImage') {
      this.setState({
        selectedLayerImage: layerImage,
        confirmDeleteText: '',
        showDeleteConfirmation: false})
    } else {
      var selectedLayerImages = this.state.selectedLayerImages
      if (selectedLayerImages.includes(layerImage)) {
        this.setState({selectedLayerImages: selectedLayerImages.remove(layerImage)})
      } else {
        this.setState({selectedLayerImages: selectedLayerImages.add(layerImage)})
      }
    }
  },

  deleteSelectedLayerImage() {
    Store.actions.deleteLayerImage(this.state.selectedLayerImage)
    this.setState({selectedLayerImage: null, confirmDeleteText: '', showDeleteConfirmation: false})
  },

  onFormChange(e) {
    this.setState({editMode: e.target.value})
  },

  handleTagChange(e) {
    var tag = this.state.tagsMap.get(e.target.value)
    var selectedLayerImages = Set(tag.get('layerImages'))
    this.setState({selectedTag:tag, selectedLayerImages:selectedLayerImages})
  },

  handleAddLayerImagesToTag() {
    Store.actions.addLayerImagesToTag({
      tag: this.state.selectedTag,
      layerImages: this.state.selectedLayerImages
    })
  },

  render() {
    var errors = this.state.errors.map(e => {
      return <p style={{background:'#E85672'}}>{e}</p>
    })

    var messages = this.state.messages.map(m => {
      return <Notification message={m}
                 onClose={() => this.setState({messages:[]})}/>
    })

    var selectDivStyles = {
      width: '100%',
      height: '100%',
      background: '#262323',
      opacity: '0.8',
      position: 'absolute',
      top: '0',
      left: '0'
    }
    let layerImages = this.state.layerImages.map(layerImage => {
      var overlayStyles = (
        (() => {
          if (this.state.editMode === 'editLayerImage') { return null }
          else if (this.state.selectedLayerImages.includes(layerImage)) {
            return selectDivStyles }
          else { return null }
        }()))

      return (
        <div onClick={this.selectLayerImage.bind(null, layerImage)}
             key={layerImage.get('id')}
             style={{display: 'inline-block', position:'relative'}}>
          <img src={imageUrlForLayerImage(layerImage)} height={60} width={60}/>
          <div style={overlayStyles} onClick={this.selectLayerImage.bind(null, layerImage)}></div>
        </div>
      )
    })

    var selectedLayerImage = this.state.selectedLayerImage
    var showSelectedLayerImage = selectedLayerImage && this.state.editMode === 'editLayerImage'

    var tagOptions = this.state.tags.map(tag => {
      return (
        <option value={tag.get('id')}>{tag.get('name')}</option>
      )
    })

    var selectedTag = this.state.selectedTag ? this.state.selectedTag.get('id') : ''

    return (
      <div className="AdminLayerImages" style={{padding:10}}>
        <h1>Layer Images</h1>

        <form onChange={this.onFormChange}>
          <div>
            <label>Edit a Layer Image</label>
            <input type="radio" value="editLayerImage" name="editMode"
                   checked={this.state.editMode === 'editLayerImage'}/>
          </div>
          <div>
            <label>Group Layer Images by Tag</label>
            <input type="radio" value="groupImagesByTag" name="editMode"
              checked={this.state.editMode === 'groupImagesByTag'}/>
          </div>
        </form>

        { this.state.editMode === 'groupImagesByTag' ?
          <div style={{padding:'10px'}}>
            <select value={selectedTag} style={{width:'50%'}} onChange={this.handleTagChange}>
              {tagOptions}
            </select>
            <div style={{padding:'10px 0'}}>
              <button onClick={this.handleAddLayerImagesToTag}>Update Layer Images</button>
            </div>
          </div>
          : null }

        {showSelectedLayerImage ?
          <LayerImageDetail layerImage={selectedLayerImage}
                            onDelete={this.deleteSelectedLayerImage} /> : null}

        {layerImages}
        {this.state.errors.length > 0 ? <div>{errors}</div> : null}
        {this.state.messages.length > 0 ? <div>{messages}</div> : null}
      </div>
    )
  }
})
