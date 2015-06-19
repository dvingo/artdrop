import React from 'react'
import Router from 'react-router'
import reactor from '../state/reactor'
import Store from '../state/main'
import ColorPalette from './ColorPalette'
import Immutable from 'Immutable'
import {imageUrlForLayerImage,imageUrlForSurface} from '../state/utils'

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return { layerImages: Store.getters.layerImages,
             colorPalettes: Store.getters.colorPalettes,
             surfaces: Store.getters.surfaces};
  },

  getInitialState() {
    return { newDesign: Immutable.fromJS({layers:[{},{},{}], adminCreated: true}),
             currentLayer: 0 }
  },

  selectSurface(surface) {
    this.setState({newDesign:this.state.newDesign.set('surface', surface)})
  },

  selectLayerImage(layerImage) {
    var layerIndex = this.state.currentLayer
    var newDesign = this.state.newDesign.updateIn(['layers', layerIndex], l => l.set('selectedLayerImage', layerImage))
    console.log('new DESIGN: ', newDesign.toJS())
    this.setState({newDesign:newDesign})
  },

  selectColorPalette(palette) {
    var layerIndex = this.state.currentLayer
    var newDesign = this.state.newDesign.updateIn(['layers', layerIndex], l => l.set('colorPalette', palette))
    console.log('new DESIGN: ', newDesign.toJS())
    this.setState({newDesign:newDesign})
  },

  selectLayer(e) {
    this.setState({currentLayer:e.target.value})
  },

  updateTitle(e) {
    this.setState({newDesign:this.state.newDesign.set('title', e.target.value)})
  },

  saveIt(e) {
    e.preventDefault()
    Store.actions.createNewDesign(this.state.newDesign)
    console.log('saving it!')
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

    return (
      <div className="admin">
        <p>New Design</p>

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
    );
  }
});
