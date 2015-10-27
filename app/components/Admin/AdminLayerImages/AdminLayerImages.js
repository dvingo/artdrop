import React from 'react'
import Router from 'react-router'
import reactor from 'state/reactor'
import Store from 'state/main'
import getters from 'state/getters'
import Notification from 'components/Notification/Notification'
import {imageUrlForLayerImage} from 'state/utils'
import LayerImage from './LayerImage'
import LayerImageDetail from './LayerImageDetail'
import Tags from 'components/Tags/Tags'
import { Set } from 'Immutable'

var numLayerImagesPerPage = 30
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
            confirmDeleteText: '',
            currentPage: 0,
            totalPages: -1}
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

    if (this._needToUpdatePageCount(prevState)) {
      var filteredLayerImages = this.state.layerImages.filter(
          this._filterBySelectedTags.bind(null, this.state.tagsToFilterBy))
      this.setState({
        currentPage: 0,
        totalPages: Math.floor(filteredLayerImages.count() / numLayerImagesPerPage) + 1
      })
    }

    var tagsMap = this.state.tagsMap
    var selectedTag = this.state.selectedTag
    if (selectedTag && tagsMap.get(selectedTag.get('id'))
       && tagsMap.get(selectedTag.get('id')) !== selectedTag) {
      var updatedTag = tagsMap.get(selectedTag.get('id'))
      this.setState({selectedTag:updatedTag})
    }
  },

  _needToUpdatePageCount(prevState) {
    var currentImagesCount = this.state.layerImages.filter(
        this._filterBySelectedTags.bind(null, this.state.tagsToFilterBy)).count()
    var previousImagesCount = prevState.layerImages.filter(
        this._filterBySelectedTags.bind(null, prevState.tagsToFilterBy)).count()
    return (
      (this.state.totalPages === -1 && this.state.layerImages.count() > 0) ||
      (currentImagesCount !== previousImagesCount)
    )
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

  _filterBySelectedTags(tagsToFilterBy, layerImage) {
    return tagsToFilterBy.every(tag => (
      Set(layerImage.get('tags').map(t => t.get('id'))).includes(tag.get('id'))))
  },

  _addTagToFilterBy(tag) {
    this.setState({tagsToFilterBy: this.state.tagsToFilterBy.add(tag)})
  },

  _removeTagToFilterBy(tag) {
    this.setState({tagsToFilterBy: this.state.tagsToFilterBy.remove(tag)})
  },

  _isLayerImageSelected(layerImage) {
    if (this.state.editMode === 'editLayerImage') { return false }
    return this.state.selectedLayerImageIds.includes(layerImage.get('id'))
  },

  _layerImagesForCurrentPage() {
    var {currentPage} = this.state
    var start = numLayerImagesPerPage * currentPage
    var end = start + numLayerImagesPerPage
    var filteredImages = this.state.layerImages.filter(
        this._filterBySelectedTags.bind(null, this.state.tagsToFilterBy))
    return filteredImages.slice(start, end)
  },

  onNextPage() {
    this.setState({currentPage: this.state.currentPage + 1})
  },

  onPreviousPage() {
    this.setState({currentPage: this.state.currentPage - 1})
  },

  render() {
    var errors = this.state.errors.map(e => (
      <p style={{background:'#E85672'}}>{e}</p>))

    var messages = this.state.messages.map(m => (
      <Notification message={m}
                 onClose={() => this.setState({messages:[]})}/> ))

    let layerImages = (
      this._layerImagesForCurrentPage().map(layerImage => (
        <LayerImage layerImage={layerImage}
          key={layerImage.get('id')}
          isSelected={this._isLayerImageSelected(layerImage)}
          onClick={this.selectLayerImage.bind(null, layerImage)} />)))

    var selectedLayerImage = this.state.selectedLayerImage
    var showSelectedLayerImage = selectedLayerImage && this.state.editMode === 'editLayerImage'

    var tagOptions = this.state.tags.map(tag => (
      <option value={tag.get('id')}>{tag.get('name')}</option>))

    var selectedTag = this.state.selectedTag ? this.state.selectedTag.get('id') : ''
    var { currentPage, totalPages } = this.state

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

        {/*When tags to filter by changes make another DB query
        for all images with those tags and repaginate,
        Because tags have layerImages we can just construct queries based on those and
        only load tags into memory.*/}
        {layerImages}
        {this.state.errors.length > 0 ? <div>{errors}</div> : null}
        {this.state.messages.length > 0 ? <div>{messages}</div> : null}
        <p>
          Page {currentPage + 1} of {totalPages}
          { currentPage > 0 ?
            <button onClick={this.onPreviousPage}>Previous Page</button> : null }
          { currentPage < totalPages ?
            <button onClick={this.onNextPage}>Next Page</button> : null }
        </p>
      </div>
    )
  }
})
