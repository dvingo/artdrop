import React from 'react'
import Router from 'react-router'
import reactor from '../../state/reactor'
import Store from '../../state/main'
import ColorPalette from '../ColorPalette'
import Immutable from 'Immutable'
import {imageUrlForLayerImage,imageUrlForSurface} from '../../state/utils'

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return { colorPalettes: Store.getters.colorPalettes }
  },

  getInitialState() {
    return { selectedPalette: null, tempPalette: null }
  },

  componentWillMount() {
    Store.actions.loadAdminColorPalettes()
  },

  choosePalette(palette) {
    this.setState({selectedPalette: palette, tempPalette: palette})
  },

  handleColorChange(color, e) {
    this.setState({tempPalette: this.state.tempPalette.set(color, e.target.value)})
  },

  handleSavePalette(e) {
    e.preventDefault()
    Store.actions.saveColorPalette(this.state.tempPalette)
  },

  render() {
    var palettes = this.state.colorPalettes.map(palette => {
      var bgColor = (this.state.selectedPalette === palette
        ? 'yellow' : '#fff')
      return (
        <div style={{display:'inline-block', border:'1px solid',background:bgColor}}
          onClick={this.choosePalette.bind(null, palette)}>
          <ColorPalette palette={palette}/>
        </div>
      )
    })

    var editForm = (() => {
      if (this.state.selectedPalette) {
        let colorOne = this.state.tempPalette.get('colorOne')
        let colorTwo = this.state.tempPalette.get('colorTwo')
        let colorThree = this.state.tempPalette.get('colorThree')
        let colorFour = this.state.tempPalette.get('colorFour')
        return (
          <form style={{border: '1px solid'}} onSubmit={this.handleSavePalette}>

           <div>
             <label>Color One</label>
             <input type="color" value={colorOne} onChange={this.handleColorChange.bind(null, 'colorOne')}/>
             <div style={{width:20,height:20,background:colorOne,display:'inline-block'}}/>
             <span>{colorOne}</span>
           </div>

           <div>
             <label>Color Two</label>
             <input type="color" value={colorTwo} onChange={this.handleColorChange.bind(null, 'colorTwo')}/>
             <div style={{width:20,height:20,background:colorTwo,display:'inline-block'}}/>
             <span>{colorTwo}</span>
           </div>

           <div>
             <label>Color Three</label>
             <input type="color" value={colorThree} onChange={this.handleColorChange.bind(null, 'colorThree')}/>
             <div style={{width:20,height:20,background:colorThree,display:'inline-block'}}/>
             <span>{colorThree}</span>
           </div>

           <div>
             <label>Color Four</label>
             <input type="color" value={colorFour} onChange={this.handleColorChange.bind(null, 'colorFour')}/>
             <div style={{width:20,height:20,background:colorFour,display:'inline-block'}}/>
             <span>{colorFour}</span>
           </div>

           <ColorPalette palette={this.state.tempPalette}/>
           <input type="submit" value="save"/>

          </form>
        )
      } else { return null }
    }())

    return (
      <div className="admin-color-palettes">
        {palettes}
        {editForm}
      </div>
    )
  }
})
