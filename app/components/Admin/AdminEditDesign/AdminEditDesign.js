import React from 'react'
import reactor from 'state/reactor'
import Store from 'state/main'
import {rotateColorPalette} from 'state/utils'
import RenderLayers from 'components/Design/RenderLayers/RenderLayers'
import ColorsButtonRotate from 'components/ColorsButtonRotate/ColorsButtonRotate'
import ColorPalette from 'components/ColorPalette/ColorPalette'
import Tags from 'components/Tags/Tags'
import Notification from 'components/Notification/Notification'
import Immutable from 'Immutable'
import Router from 'react-router'
import {imageUrlForLayerImage, imageUrlForSurface} from 'state/utils'
import {updateLayerOfDesign} from 'state/helpers'
var { Map, Set, List } = Immutable
var classNames = require('classnames')

function tagsUpdatedOnExistingDesign(prevState, state) {
  var existingDesign = state.existingDesign
  if (existingDesign == null || prevState.existingDesign == null) { return false }
  var layers = existingDesign.get('layers')
  var prevLayers = prevState.existingDesign.get('layers')
  return layers.some((layer, i) => {
    if (!layer) { return true }
    return layers.get(i).get('tags') !== prevLayers.get(i).get('tags')
  })
}

function updateEditingDesignWithNewTags(state) {
  return state.editingDesign.updateIn(['layers'], layers => {
    return layers.map((layer, i) => {
      var newTags = state.existingDesign.getIn(['layers', i, 'tags'])
      return layer.set('tags', newTags)
    })
  })
}

function setTagsOnLayerOfDesign(tags, layerIndex, design) {
  return design.updateIn(['layers', layerIndex], layer => (
    layer.set('tags', tags)
  ))
}

export default React.createClass({
  mixins: [reactor.ReactMixin, Router.State, Router.Navigation],

  getDataBindings() {
    return {existingDesign: Store.getters.currentDesign,
            layerImages: Store.getters.layerImages,
            colorPalettes: Store.getters.colorPalettes,
            surfaces: Store.getters.surfaces,
            tags: Store.getters.tags,
    }
  },

  getInitialState() {
    return {
      editingDesign: null,
      currentLayer: 0,
      errors: [],
      messages: [],
      width: 400,
      height: 400,
      designJpgUrl: null,
      showDeleteConfirmation: false,
      confirmDeleteText: '',
      selectedTag: null,
      selectingColors: true,
      tagsToNewLayersMap: List()
    }
  },

  componentWillMount() {
    if (this._isCreatingNewDesign()) {
      this.setState({
        editingDesign: Immutable.fromJS({
          layers: [{id:0,paletteRotation:0,isEnabled:true},{id:1,paletteRotation:0,isEnabled:true},
                   {id:2,paletteRotation:0,isEnabled:true}],
          adminCreated: true})
      })
      Store.actions.loadAdminCreateDesignData()
    } else if (this._editingDesignNotSet()) {
      this.setState({editingDesign: this.state.existingDesign})
    } else {
      Store.actions.selectDesignId(this.props.params.designId)
      Store.actions.loadAdminCreateDesignData()
    }
  },

  componentDidUpdate(prevProps, prevState) {
    if ((!this.state.editingDesign || this.designIsNotHydrated()) && this.state.existingDesign) {
      setTimeout(() => this.setState({editingDesign: this.state.existingDesign}), 200)
    }
    else if (tagsUpdatedOnExistingDesign(prevState, this.state)) {
      var newDesign = updateEditingDesignWithNewTags(this.state)
      setTimeout(() => this.setState({editingDesign: newDesign}), 200)
    }
  },

  _isCreatingNewDesign() {
    return !this.getParams().hasOwnProperty('designId')
  },

  _editingDesignNotSet() {
    return (this.state.editingDesign == null || this.designIsNotHydrated()) &&
     this.state.existingDesign &&
     this.getParams().designId === this.state.existingDesign.get('id')
  },

  _showDeleteButton() {
    return !this._isCreatingNewDesign() && !this.state.showDeleteConfirmation
  },

  clearMessages() {
    this.setState({messages: []})
  },

  selectSurface(surface) {
    this.setState({editingDesign: this.state.editingDesign.set('surface', surface)})
  },

  selectLayerImage(layerImage) {
    var layerIndex = this.state.currentLayer
    var editingDesign = this.state.editingDesign.updateIn(['layers', layerIndex],
                                l => l.set('selectedLayerImage', layerImage))
    this.setState({editingDesign: editingDesign})
  },

  selectColorPalette(palette) {
    var layerIndex = this.state.currentLayer
    var editingDesign = this.state.editingDesign.updateIn(['layers', layerIndex], l => l.set('colorPalette', palette))
    this.setState({editingDesign:editingDesign})
  },

  selectLayer(i) {
    console.log('selecting layer: ', i)
    if (this.state.currentLayer === i) {
      let layerIndex = this.state.currentLayer
      let design = this.state.editingDesign
      let layer = design.getIn(['layers', layerIndex])
      var newDesign = updateLayerOfDesign(layer, design, l => (
        l.set('isEnabled', !l.get('isEnabled'))
      ))
      this.setState({editingDesign:newDesign})
    } else {
      this.setState({currentLayer: i})
    }
  },

  handleRotateColorPalette() {
    var design = this.state.editingDesign
    this.setState({editingDesign: rotateColorPalette(design, null, this.state.currentLayer)})
  },

  updateTitle(e) {
    this.setState({editingDesign: this.state.editingDesign.set('title', e.target.value)})
  },

  saveDesign(e) {
    e.preventDefault()
    var title = this.state.editingDesign.get('title')
    var surface = this.state.editingDesign.get('surface')
    var errors = []
    var messages = []
    if (!title || title.length === 0) {
      errors.push('You must set a title')
    }
    if (!surface) { errors.push('You must select a surface') }
    var layersValid = (
      this.state.editingDesign.get('layers')
      .every(l => l.has('colorPalette') && l.has('selectedLayerImage'))
    )
    if (!layersValid) {
      errors.push('You must select a color palette and image for every layer.')
    }

    if (errors.length === 0) {
      let svgEls = document.querySelectorAll('.canvas .SVGInlineLayer svg')
      if (this._isCreatingNewDesign()) {
        Store.actions.createNewDesign({
          design: this.state.editingDesign,
          svgEls: svgEls,
          layersToTagsMap: this.state.tagsToNewLayersMap})
      } else {
        Store.actions.updateDesign({design: this.state.editingDesign, svgEls: svgEls})
      }
      messages.push('Design successfully saved.')
    }
    this.setState({errors: errors, messages: messages})
  },

  designIsNotHydrated() {
    var editingDesign = this.state.editingDesign
    return !(editingDesign &&
            editingDesign.get('layers').every(l => (typeof l === 'object')))
  },

  handleShowDeleteConfirmation(){
    this.setState({showDeleteConfirmation: true})
  },

  onConfirmDeleteChange(e) {
    this.setState({confirmDeleteText: e.target.value})
  },

  confirmedDeleteDesign() {
    Store.actions.deleteDesign(this.state.existingDesign)
    this.transitionTo('adminDesigns')
  },

  _selectedLayer() {
    return this.state.editingDesign.getIn(['layers', this.state.currentLayer])
  },

  _selectedLayerTags() {
    return this._selectedLayer().get('tags')
  },

  onAddTagToSelectedLayer(tagToAdd) {
    if (this._isCreatingNewDesign()) {
      var {tagsToNewLayersMap} = this.state
      var tags = tagsToNewLayersMap.get(this.state.currentLayer, Set()).add(tagToAdd)
      var newDesign = setTagsOnLayerOfDesign(tags, this.state.currentLayer, this.state.editingDesign)
      this.setState({
        tagsToNewLayersMap: tagsToNewLayersMap.set(this.state.currentLayer, tags),
        editingDesign: newDesign
      })
    } else {
      Store.actions.addTagToLayer(tagToAdd, this._selectedLayer(), this.state.existingDesign)
    }
  },

  onRemoveTagFromSelectedLayer(tagToRemove) {
    if (this._isCreatingNewDesign()) {
      var {tagsToNewLayersMap} = this.state
      var tags = tagsToNewLayersMap.get(this.state.currentLayer, Set()).remove(tagToRemove)
      var newDesign = setTagsOnLayerOfDesign(tags, this.state.currentLayer, this.state.editingDesign)
      this.setState({
        tagsToNewLayersMap: tagsToNewLayersMap.set(this.state.currentLayer, tags),
        editingDesign: newDesign
      })
    } else {
      Store.actions.removeTagFromLayer(tagToRemove, this._selectedLayer(), this.state.existingDesign)
    }
  },

  selectImagesOrColors(imagesOrColors) {
    this.setState({selectingColors: imagesOrColors === 'colors'})
  },

  render() {
    if (this.designIsNotHydrated()) { return null }
    var surfaces = this.state.surfaces.map(s => {
      var border = (this.state.editingDesign.getIn(['surface', 'id']) === s.get('id') ? '2px solid' : 'none')
      return <img src={imageUrlForSurface(s)}
                  onClick={this.selectSurface.bind(null, s)}
                  width={40} height={40} key={s.get('id')}
                  style={{border:border}}/>
    })

    var palettes = this.state.colorPalettes.map(p => {
      var bg = (this.state.editingDesign.getIn(['layers', this.state.currentLayer, 'colorPalette', 'id'])
               === p.get('id') ? 'yellow' : '#fff')
     return (
       <div style={{background:bg}}>
         <ColorPalette onClick={this.selectColorPalette.bind(null, p)} palette={p}/>
       </div>
       )
    })

    var layerImages = this.state.layerImages.map(layerImage => {
      var bg = (this.state.editingDesign.getIn(['layers',this.state.currentLayer,
                  'selectedLayerImage', 'id']) === layerImage.get('id') ? 'yellow' : '#fff')
      return (
        <li onClick={this.selectLayerImage.bind(null, layerImage)}
            className="LayerImage"
            style={{background:bg, float:"left"}}>
          <img src={imageUrlForLayerImage(layerImage)}/>
        </li>
      )
    })

    var layers = (
      this.state.editingDesign.get('layers')
        .filter(l => l.has('colorPalette') &&
                     l.has('selectedLayerImage') &&
                     l.get('isEnabled')))

    var errors = this.state.errors.map(e => {
      return <p style={{background:'#E85672'}}>{e}</p>
    })

    var messages = this.state.messages.map(m => {
      return <Notification message={m} onClose={this.clearMessages}/>
    })

    var height = this.state.height
    var width = this.state.width
    var layerDesc = ['Background', 'Middleground', 'Foreground']
    var selectLayers = [0,1,2].map(i => {
      var bg = this.state.currentLayer === i ? 'yellow' : '#fff'
      var layerOff = !this.state.editingDesign.getIn(['layers', i, 'isEnabled'])
      return (
        <div style={{background:bg}} className="AdminEditDesign-select-layer"
          onClick={this.selectLayer.bind(null, i)}>
          Layer {i+1} ({layerDesc[i]}) {layerOff ? ', off' : ''}
        </div>)
    })

    var selectingColors = this.state.selectingColors
    return (
      <div className="AdminEditDesign">
        {this.state.errors.length > 0 ? <div>{errors}</div> : null}
        {this.state.messages.length > 0 ? <div>{messages}</div> : null}
        <p>{this._isCreatingNewDesign() ? "Create" : "Edit"} Design:</p>

        {this._showDeleteButton() ?
          <div><button onClick={this.handleShowDeleteConfirmation}>DELETE</button></div> : null}

        {this.state.showDeleteConfirmation ? (
          <div>
            <label>Enter 'yes' to confirm.</label>
            <input type="text" value={this.state.confirmDeleteText} onChange={this.onConfirmDeleteChange}/>
            {this.state.confirmDeleteText === 'yes' ?
                <button onClick={this.confirmedDeleteDesign}>REALLY DELETE</button> : null}
          </div>
          ) : null}

        <div style={{height:height, width:width, position:'relative', border: '1px solid'}}>
          <RenderLayers layers={layers} width={width} height={height} />
        </div>

        <label>Select layer to edit</label>
        <div style={{padding:20}}>
          {selectLayers}
        </div>

        <Tags label={"Tags for layer " + (this.state.currentLayer + 1)}
              selectedTags={this._selectedLayerTags()}
              onRemoveTag={this.onRemoveTagFromSelectedLayer}
              onAddTag={this.onAddTagToSelectedLayer} />

        <form onSubmit={this.saveDesign}>
          <label>Title</label>
          <input type="text" value={this.state.editingDesign.get('title')} onChange={this.updateTitle}></input>
          <input type="submit"></input>
        </form>

          {this.state.editingDesign.getIn(['layers', this.state.currentLayer, 'colorPalette']) ?
            [<p>Rotate palette</p>,
              <ColorsButtonRotate layer={this.state.editingDesign.getIn(['layers', this.state.currentLayer])}
                onClick={this.handleRotateColorPalette}/>]
            : null
          }

        <div className="AdminEditDesign-button-container">
          <span onClick={this.selectImagesOrColors.bind(null, 'images')}
              className={classNames("button", {off: !selectingColors})}>Art</span>

          <span onClick={this.selectImagesOrColors.bind(null, 'colors')}
              className={classNames("button", {off: selectingColors})}>Color</span>
        </div>
        <div className="DesignEditDetail-layer-grid">
          { selectingColors
            ? <section className='ChoosePalette'>
                {palettes}
              </section>
            : <ul className="select-layer-image">
               {layerImages}
              </ul>
          }
        </div>
        {surfaces}
      </div>
    )
  }
})
