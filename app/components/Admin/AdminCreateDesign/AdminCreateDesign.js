import React from 'react'
import reactor from 'state/reactor'
import Store from 'state/main'
import {rotateColorPalette} from 'state/utils'
import RenderLayers from 'components/Design/RenderLayers/RenderLayers'
import ColorsButtonRotate from 'components/ColorsButtonRotate/ColorsButtonRotate'
import ColorPalette from 'components/ColorPalette/ColorPalette'
import Tags from 'components/Tags/Tags'
import Notification from 'components/Notification/Notification'
import AdminChooseLayerImages from 'components/Admin/AdminChooseLayerImages/AdminChooseLayerImages'
import Immutable from 'Immutable'
import Router from 'react-router'
import {imageUrlForLayerImage, imageUrlForSurface} from 'state/utils'
import {updateLayerOfDesign} from 'state/helpers'
var { Map, Set, List } = Immutable
var classNames = require('classnames')

function setTagsOnLayerOfDesign(tags, layerIndex, design) {
  return design.updateIn(['layers', layerIndex], layer => (
    layer.set('tags', tags)
  ))
}

export default React.createClass({
  mixins: [reactor.ReactMixin, Router.State, Router.Navigation],

  getDataBindings() {
    return {layerImages: Store.getters.layerImages,
            colorPalettes: Store.getters.colorPalettes,
            surfaces: Store.getters.surfaces,
            tags: Store.getters.tags}
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
      selectedTag: null,
      selectingColors: true,
      tagsToNewLayersMap: List()
    }
  },

  _getInitialDesignData() {
    var layers = [
      {id:0,paletteRotation:0,isEnabled:true},
      {id:1,paletteRotation:0,isEnabled:true},
      {id:2,paletteRotation:0,isEnabled:true}]
    if (this.state.colorPalettes && this.state.colorPalettes.count() > 0) {
      var palette = this.state.colorPalettes.get(0).toJS()
      layers.forEach(layer => layer.colorPalette = palette)
    }
    return Immutable.fromJS({
      layers:layers,
      adminCreated: true})
  },

  componentWillMount() {
    this.setState({editingDesign: this._getInitialDesignData()})
    Store.actions.loadAdminCreateDesignData()
  },

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.editingDesign.getIn(['layers', 0]).has('colorPalette')) {
      setTimeout(() => this.setState({editingDesign: this._getInitialDesignData()}), 100)
    }
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

  _toggleCurrentLayer() {
    var layerIndex = this.state.currentLayer
    var design = this.state.editingDesign
    var layer = design.getIn(['layers', layerIndex])
    var newDesign = updateLayerOfDesign(layer, design, l => (
      l.set('isEnabled', !l.get('isEnabled'))
    ))
    this.setState({editingDesign:newDesign})
  },

  selectLayer(i) {
    if (this.state.currentLayer === i) {
      this._toggleCurrentLayer()
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
      let svgEls = document.querySelectorAll('.canvas .layer svg')
      Store.actions.createNewDesign({
        design: this.state.editingDesign,
        svgEls: svgEls,
        layersToTagsMap: this.state.tagsToNewLayersMap})
      messages.push('Design successfully saved.')
    }
    this.setState({errors: errors, messages: messages})
  },

  _selectedLayer() {
    return this.state.editingDesign.getIn(['layers', this.state.currentLayer])
  },

  _selectedLayerTags() {
    return this._selectedLayer().get('tags')
  },

  onAddTagToSelectedLayer(tagToAdd) {
    var {tagsToNewLayersMap} = this.state
    var tags = tagsToNewLayersMap.get(this.state.currentLayer, Set()).add(tagToAdd)
    var newDesign = setTagsOnLayerOfDesign(tags, this.state.currentLayer, this.state.editingDesign)
    this.setState({
      tagsToNewLayersMap: tagsToNewLayersMap.set(this.state.currentLayer, tags),
      editingDesign: newDesign
    })
  },

  onRemoveTagFromSelectedLayer(tagToRemove) {
    var {tagsToNewLayersMap} = this.state
    var tags = tagsToNewLayersMap.get(this.state.currentLayer, Set()).remove(tagToRemove)
    var newDesign = setTagsOnLayerOfDesign(tags, this.state.currentLayer, this.state.editingDesign)
    this.setState({
      tagsToNewLayersMap: tagsToNewLayersMap.set(this.state.currentLayer, tags),
      editingDesign: newDesign
    })
  },

  selectImagesOrColors(imagesOrColors) {
    this.setState({selectingColors: imagesOrColors === 'colors'})
  },

  render() {
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

    var selectedLayerImageId = this.state.editingDesign.getIn(
      ['layers',this.state.currentLayer, 'selectedLayerImage', 'id'])

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
        <div className="admin-edit-design-section-one">
          <p>Create Design:</p>

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
        </div>

        <div className="admin-edit-design-section-two">

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
              : <AdminChooseLayerImages
                  layerImages={this.state.layerImages}
                  selectedLayerImageId={selectedLayerImageId}
                  onClick={this.selectLayerImage}/>
            }
          </div>
          {surfaces}
        </div>
      </div>
    )
  }
})
