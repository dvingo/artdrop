import React from 'react'
import Router from 'react-router'
import reactor from 'state/reactor'
import Store from 'state/main'
import getters from 'state/getters'
import Notification from 'components/Notification/Notification'
import {imageUrlForLayerImage} from 'state/utils'
import LayerImageDetail from './LayerImageDetail'
import Tags from 'components/Tags/Tags'
import { Set } from 'Immutable'

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
            tagsToFilterBy: Set(),
            editMode: 'editLayerImage',
            selectedLayerImageIds: Set(),
            showDeleteConfirmation: false,
            confirmDeleteText: ''}
  },

  componentWillMount() {
    Store.actions.loadAdminLayerImages()
  },

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.selectedTag && this.state.tags.count() > 0) {
      var selectedTag = this.state.tags.get(0)
      var newState = {selectedTag: selectedTag}
      if (selectedTag.get('layerImages') && selectedTag.get('layerImages').count() > 0) {
        newState.selectedLayerImageIds = Set(selectedTag.get('layerImages'))
      }
      this.setState(newState)
    }

    var tagsMap = this.state.tagsMap
    var selectedTag = this.state.selectedTag
    if (selectedTag && tagsMap.get(selectedTag.get('id'))
       && tagsMap.get(selectedTag.get('id')) !== selectedTag) {
      var updatedTag = tagsMap.get(selectedTag.get('id'))
      this.setState({selectedTag:updatedTag})
    }
  },

  selectLayerImage(layerImage) {
    if (this.state.editMode === 'editLayerImage') {
      this.setState({
        selectedLayerImage: layerImage,
        confirmDeleteText: '',
        showDeleteConfirmation: false})
    } else {
      var selectedLayerImageIds = this.state.selectedLayerImageIds
      var layerImageId = layerImage.get('id')
      if (selectedLayerImageIds.includes(layerImageId)) {
        this.setState({selectedLayerImageIds: selectedLayerImageIds.remove(layerImageId)})
      } else {
        this.setState({selectedLayerImageIds: selectedLayerImageIds.add(layerImageId)})
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
    var selectedLayerImageIds = Set(tag.get('layerImages'))
    this.setState({selectedTag:tag, selectedLayerImageIds:selectedLayerImageIds})
  },

  handleAddLayerImagesToTag() {
    Store.actions.addLayerImagesToTag(
      this.state.selectedTag,
      this.state.selectedLayerImageIds
    )
  },

  _filterBySelectedTags(layerImage) {
    return this.state.tagsToFilterBy.every(tag => {
      return Set(layerImage.get('tags')).includes(tag)
    })
  },

  _addTagToFilterBy(tag) {
    this.setState({tagsToFilterBy: this.state.tagsToFilterBy.add(tag)})
  },

  _removeTagToFilterBy(tag) {
    this.setState({tagsToFilterBy: this.state.tagsToFilterBy.remove(tag)})
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
    let layerImages = (
      this.state.layerImages.filter(this._filterBySelectedTags)
        .map(layerImage => {
      var overlayStyles = (
        (() => {
          if (this.state.editMode === 'editLayerImage') { return null }
          else if (this.state.selectedLayerImageIds.includes(layerImage.get('id'))) {
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
    }))

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

        <Tags label='Tags to filter by'
          selectedTags={this.state.tagsToFilterBy.toList()}
          onRemoveTag={this._removeTagToFilterBy}
          onAddTag={this._addTagToFilterBy}/>

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
