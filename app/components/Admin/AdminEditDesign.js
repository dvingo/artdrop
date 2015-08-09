import React from 'react'
import reactor from '../../state/reactor'
import Store from '../../state/main'
import RenderLayers from '../Design/RenderLayers'
import RenderLayersCanvas from '../Design/RenderLayersCanvas'
import ColorPalette from '../ColorPalette'
import Immutable from 'Immutable'
import Notification from '../Notification'
import {imageUrlForLayer,imageUrlForLayerImage,imageUrlForSurface} from '../../state/utils'
import {svgTextToImage, renderDesignToJpegBlob} from '../../utils'

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return {layerImages: Store.getters.layerImages,
            colorPalettes: Store.getters.colorPalettes,
            surfaces: Store.getters.surfaces}
  },

  getInitialState() {
    return {newDesign: Immutable.fromJS({layers:[{},{},{}], adminCreated: true}),
            currentLayer: 0,
            errors: [],
            messages: [],
            w: 400,
            h: 400,
            designJpgUrl: null}
  },

  componentWillMount() {
    Store.actions.loadAdminCreateDesignData()
  },

  clearMessages() {
    this.setState({messages: []})
  },

  selectSurface(surface) {
    this.setState({newDesign: this.state.newDesign.set('surface', surface)})
  },

  selectLayerImage(layerImage) {
    var layerIndex = this.state.currentLayer
    var newDesign = this.state.newDesign.updateIn(['layers', layerIndex],
                                l => l.set('selectedLayerImage', layerImage))
    this.setState({newDesign: newDesign})
  },

  selectColorPalette(palette) {
    var layerIndex = this.state.currentLayer
    var newDesign = this.state.newDesign.updateIn(['layers', layerIndex], l => l.set('colorPalette', palette))
    this.setState({newDesign:newDesign})
  },

  selectLayer(i) {
    this.setState({currentLayer: i})
  },

  updateTitle(e) {
    this.setState({newDesign: this.state.newDesign.set('title', e.target.value)})
  },

  saveDesign(e) {
    e.preventDefault()
    var title = this.state.newDesign.get('title')
    var surface = this.state.newDesign.get('surface')
    var errors = []
    var messages = []
    if (!title || title.length === 0) {
      errors.push('You must set a title')
    }
    if (!surface) { errors.push('You must select a surface') }
    var layersValid = (
      this.state.newDesign.get('layers')
      .map(l => l.has('colorPalette') && l.has('selectedLayerImage'))
      .every(v => v)
    )
    if (!layersValid) {
      errors.push('You must select a color palette and image for every layer.')
    }

    if (errors.length === 0) {
      let svgEls = document.querySelectorAll('.canvas .layer svg')
      let designJpgBlob = renderDesignToJpegBlob(400, svgEls)
      Store.actions.createNewDesign({newDesign: this.state.newDesign,
                                     jpgBlob: designJpgBlob})
      messages.push('Design successfully created.')
    }
    this.setState({errors: errors, messages: messages})
  },

  render() {
    var surfaces = this.state.surfaces.map(s => {
      var border = (this.state.newDesign.get('surface') === s ? '2px solid' : 'none')
      return <img src={imageUrlForSurface(s)}
                  onClick={this.selectSurface.bind(null, s)}
                  width={40} height={40} key={s.get('id')}
                  style={{border:border}}/>
    })

    var palettes = this.state.colorPalettes.map(p => {
      var bg = (this.state.newDesign.getIn(['layers', this.state.currentLayer, 'colorPalette'])
               === p ? 'yellow' : '#fff')
     return (
       <div style={{background:bg}}>
         <ColorPalette onClick={this.selectColorPalette.bind(null, p)}
                       palette={p}/>
       </div>
       )
    })

    var layerImages = this.state.layerImages.map(layerImage => {
      var bg = (this.state.newDesign.getIn(['layers',this.state.currentLayer,
                  'selectedLayerImage']) === layerImage ? 'yellow' : '#fff')
      return (
        <li onClick={this.selectLayerImage.bind(null, layerImage)}
            style={{background:bg}}>
          <img src={imageUrlForLayerImage(layerImage)}/>
        </li>
      )
    })

    var layers = (
      this.state.newDesign.get('layers')
        .filter(l => l.has('colorPalette') &&
                     l.has('selectedLayerImage')))

    var errors = this.state.errors.map(e => {
      return <p style={{background:'#E85672'}}>{e}</p>
    })

    var messages = this.state.messages.map(m => {
      return <Notification message={m} onClose={this.clearMessages}/>
    })

    var height = this.state.h
    var width = this.state.w
    var selectLayers = [0,1,2].map(i => {
      return (
        <div style={{
          background:(this.state.currentLayer === i ? 'yellow' : '#fff'),
          border: '1px solid',
          display:'inline-block',
          padding: 10}}
          onClick={this.selectLayer.bind(null, i)}>Layer {i}</div>
        )
    })

    return (
      <div className="admin-create-design">
        {this.state.errors.length > 0 ? <div>{errors}</div> : null}
        {this.state.messages.length > 0 ? <div>{messages}</div> : null}
        <p>New Design, svg:</p>

        <div style={{height:height, width:width, position:'relative', border: '1px solid'}}>
          <RenderLayers layers={layers} width={width} height={height} />
        </div>

        {/*<p>In Canvas:</p>
        <div style={{height:height, width:width, position:'relative', border: '1px solid'}}>
          <RenderLayersCanvas layers={layers}/>
        </div>*/}

        <label>Select layer to edit</label>
        <div style={{padding:20}}>
          {selectLayers}
        </div>

        <form onSubmit={this.saveDesign}>
          <label>Title</label>
          <input type="text" value={this.state.newDesign.get('title')} onChange={this.updateTitle}></input>
          <input type="submit"></input>
        </form>

        <section className='choose-palette'>
          {palettes}
        </section>

        <ul className="select-layer-image">
          {layerImages}
        </ul>

        {surfaces}

      </div>
    )
  }
})
