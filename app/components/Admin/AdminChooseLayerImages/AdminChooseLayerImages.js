import React from 'react'
import {List, Set} from 'Immutable'
import {imageUrlForLayerImage} from 'state/utils'
import Tags from 'components/Tags/Tags'

export default React.createClass({
  getDefaultProps() {
    return {
      onClick: () => null,
      selectedLayerImageId: '',
      layerImages: List()
    }
  },

  getInitialState() {
    return {tagsToFilterBy: Set()}
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

  _filteredLayerImages() {
    return this.props.layerImages.filter(
        this._filterBySelectedTags.bind(null, this.state.tagsToFilterBy))
  },

  render() {
    var layerImages = this._filteredLayerImages().map(layerImage => {
      var bg = (this.props.selectedLayerImageId === layerImage.get('id') ? 'yellow' : '#fff')
      return (
        <li onClick={this.props.onClick.bind(null, layerImage)}
            className="LayerImage"
            style={{background:bg, float:"left"}}>
          <img src={imageUrlForLayerImage(layerImage)}/>
        </li>
      )
    })

    return (
      <div>
        <Tags label='Tags to filter by'
          selectedTags={this.state.tagsToFilterBy.toList()}
          onRemoveTag={this._removeTagToFilterBy}
          onAddTag={this._addTagToFilterBy}/>
        <ul className="select-layer-image">{layerImages}</ul>
      </div>
    )
  }
})
