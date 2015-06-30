import React from 'react'
import Router from 'react-router'
import reactor from '../../state/reactor'
import Store from '../../state/main'
import RenderLayers from '../Design/RenderLayers'
import ColorPalette from '../ColorPalette'
import Immutable from 'Immutable'
import Notification from '../Notification'
import {imageUrlForLayer,imageUrlForLayerImage,imageUrlForSurface} from '../../state/utils'
import {toA} from '../../utils'

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return {layerImages: Store.getters.layerImages,
            colorPalettes: Store.getters.colorPalettes,
            surfaces: Store.getters.surfaces};
  },

  getInitialState() {
    return {newDesign: Immutable.fromJS({layers:[{},{},{}], adminCreated: true}),
            currentLayer: 0,
            errors: [],
            messages: [],
            w: 400,
            h: 400}
  },

  componentWillMount() {
    Store.actions.loadAdminCreateDesignData()
  },

  jpgImageString(w,h) {
    return `left=0,top=0,width=${w},height=${h},toolbar=0,resizable=0`
  },

  svgTextToImage(svgEl) {
    var svgString = (new window.XMLSerializer()).serializeToString(svgEl)
    var imageString = 'data:image/svg+xml;base64,' + window.btoa(svgString)
    var img = new Image()
    img.src = imageString
    return img
  },

  componentDidUpdate() {
    var w = this.state.w, h = this.state.h
    var canvas = React.findDOMNode(this.refs.canvas)
    var admin = document.querySelector('.admin-create-design')
    var svgs = toA(document.querySelectorAll('.canvas .layer svg'))
    .map(this.svgTextToImage)
    .map(svg => {
      svg.setAttribute('height', String(h))
      svg.setAttribute('width', String(w))
      return svg
    })
    console.log('svgs: ', svgs)

    //if (canvas && svgs.length === 3) {
      var ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, w, h)
      var bgColor = '#fff'
      var compositeOperation = ctx.globalCompositeOperation
      svgs.forEach(svg => {
        console.log('svg: ', svg)
        ctx.drawImage(svg, 0, 0, w, h)
      })
      var data = ctx.getImageData(0, 0, w, h);

       //Draw a white background.
      ctx.globalCompositeOperation = "destination-over";
      ctx.fillStyle = bgColor;
      ctx.fillRect(0,0,w,h);
      var jpgImage = canvas.toDataURL('image/jpeg');

      // Reset to original composition setting.
      ctx.clearRect(0,0,w,h);
      ctx.putImageData(data, 0,0);
      ctx.globalCompositeOperation = compositeOperation;
      console.log('jpg: ', jpgImage);
      window.open(jpgImage,"canvasImage", this.jpgImageString(jpgImage, w, h));
    //}
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

  selectLayer(e) {
    this.setState({currentLayer: e.target.value})
  },

  updateTitle(e) {
    this.setState({newDesign: this.state.newDesign.set('title', e.target.value)})
  },

  saveIt(e) {
    e.preventDefault()
    var title = this.state.newDesign.get('title')
    var surface = this.state.newDesign.get('surface')
    var errors = []
    var messages = []
    if (!title || title.length === 0) {
      errors.push('You must set a title')
    }
    if (!surface) { errors.push('You must select a surface') }
    var layersValid = (this.state.newDesign.get('layers')
       .map(l => l.has('colorPalette') && l.has('selectedLayerImage')))
       .every(v => v)
    if (!layersValid) { errors.push('You must select a color palette and image for every layer.') }

    if (errors.length === 0) {
      Store.actions.createNewDesign(this.state.newDesign)
      messages.push('Design successfully created.')
    }
    this.setState({errors: errors, messages:messages})
  },

  render() {
    var surfaces = this.state.surfaces.map(s => {
      return <img src={imageUrlForSurface(s)}
                  onClick={this.selectSurface.bind(null, s)}
                  width={40} height={40} key={s.get('id')}/>
    })

    var palettes = this.state.colorPalettes.map(p => {
     return <ColorPalette onClick={this.selectColorPalette.bind(null, p)}
                          palette={p}/>
    })

    var layerImages = this.state.layerImages
        .filter(layerImage => layerImage)
        .map(layerImage => {
      return (
        <li onClick={this.selectLayerImage.bind(null, layerImage)}>
          <img src={imageUrlForLayerImage(layerImage)}/>
        </li>
      )
    })
    var layers = (
      this.state.newDesign.get('layers')
        .filter(l => l.has('colorPalette') &&
                     l.has('selectedLayerImage')))

    var errorStyle = {
      background: '#E85672'
    }
    var errors = this.state.errors.map(e => {
      return <p style={errorStyle}>{e}</p>
    })

    var messages = this.state.messages.map(m => {
      return <Notification message={m} onClose={this.clearMessages}/>
    })

    var height = this.state.h
    var width = this.state.w
    return (
      <div className="admin-create-design">
        {this.state.errors.length > 0 ? <div>{errors}</div> : null}
        {this.state.messages.length > 0 ? <div>{messages}</div> : null}
        <p>New Design</p>

        <div style={{height:height, width:width, position:'relative'}}>
          <RenderLayers layers={layers} width={width} height={height}/>
        </div>

        <div style={{height:height, width:width, position:'relative'}}>
          <canvas height={height} width={width} ref="canvas"></canvas>
        </div>

        <label>Select layer to edit</label>
        <select value={this.state.currentLayer} onChange={this.selectLayer}>
          <option value="0">Layer 1</option>
          <option value="1">Layer 2</option>
          <option value="2">Layer 3</option>
        </select>

        <form onSubmit={this.saveIt}>
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
