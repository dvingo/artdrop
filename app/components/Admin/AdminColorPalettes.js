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
    return { colorPalettes: Store.getters.colorPalettes,
             errors: ['errors']}
  },

  getInitialState() {
    return {
      selectedPalette: null,
      tempPalette: null,
      tempColorOne: null,
      tempColorTwo: null,
      tempColorThree: null,
      tempColorFour: null,
      isEditingNewPalette: false
    }
  },

  componentWillMount() {
    Store.actions.loadAdminColorPalettes()
  },

  componentDidMount() {
    var self = this
    window.addEventListener('resize', () => self.forceUpdate())
  },

  choosePalette(palette) {
    this.setState({
      isEditingNewPalette: false,
      selectedPalette: palette,
      tempPalette: palette,
      tempColorOne: palette.get('colorOne'),
      tempColorTwo: palette.get('colorTwo'),
      tempColorThree: palette.get('colorThree'),
      tempColorFour: palette.get('colorFour')
    })
  },

  handleEditNewPalette() {
    this.setState({
      isEditingNewPalette: true,
      selectedPalette: null,
      tempPalette: Immutable.fromJS({
        colorOne: '#ffffff',
        colorTwo: '#ffffff',
        colorThree: '#ffffff',
        colorFour: '#ffffff'
      }),
      tempColorOne: '#ffffff',
      tempColorTwo: '#ffffff',
      tempColorThree: '#ffffff',
      tempColorFour: '#ffffff'
    })
  },

  handleColorChange(color, e) {
    var newColor = e.target.value.substr(0, 7).replace(/[^#\da-fA-F]/, '')
    var newState = {}
    var prop = 'temp' + color[0].toUpperCase() + color.substr(1)
    newState[prop] = newColor
    if (/#[\da-fA-F]{6}/.test(newColor)) {
      newState.tempPalette = this.state.tempPalette.set(color, newColor)
    }
    this.setState(newState)
  },

  handleSavePalette(e) {
    e.preventDefault()
    // TODO Add validations with error reporting with Store
    // holding the apps errors.
    if (this.state.selectedPalette) {
      Store.actions.saveColorPalette(this.state.tempPalette)
    } else {
      Store.actions.createNewColorPalette(this.state.tempPalette)
    }
  },

  render() {

    var palettes = this.state.colorPalettes.map(palette => {
      var bgColor = (
        this.state.selectedPalette &&
        this.state.selectedPalette.get('id') === palette.get('id')
        ? 'yellow' : '#fff'
      )
      return (
        <div style={{display:'inline-block', border:'1px solid',background:bgColor}}
          onClick={this.choosePalette.bind(null, palette)}>
          <ColorPalette palette={palette}/>
        </div>
      )
    })

    var bgColor = (this.state.isEditingNewPalette ? 'yellow' : '#fff')
    var margin = (window.innerWidth > 650 ? '10px 20px' : '5px')
    palettes = palettes.push(
      <div style={{display:'inline-block', border:'1px solid', background:bgColor}}
        onClick={this.handleEditNewPalette}>
        <div style={{fontSize:12,margin:margin,height:60, width:60,overflow:'hidden'}}>NEW PALETTE</div>
      </div>
    )

    var editForm = (() => {
      if (this.state.tempPalette) {
        let colorOne = this.state.tempPalette.get('colorOne')
        let colorTwo = this.state.tempPalette.get('colorTwo')
        let colorThree = this.state.tempPalette.get('colorThree')
        let colorFour = this.state.tempPalette.get('colorFour')
        return (
          <form style={{border: '1px solid'}} onSubmit={this.handleSavePalette}>

           <div>
             <label>Color One</label>
             <input type="color" value={colorOne} onChange={this.handleColorChange.bind(null, 'colorOne')}/>
             <input type="text" value={this.state.tempColorOne}
               onChange={this.handleColorChange.bind(null, 'colorOne')}/>
             <div style={{width:20,height:20,background:colorOne,display:'inline-block'}}/>
             <span>{colorOne}</span>
           </div>

           <div>
             <label>Color Two</label>
             <input type="color" value={colorTwo} onChange={this.handleColorChange.bind(null, 'colorTwo')}/>
             <input type="text" value={this.state.tempColorTwo}
               onChange={this.handleColorChange.bind(null, 'colorTwo')}/>
             <div style={{width:20,height:20,background:colorTwo,display:'inline-block'}}/>
             <span>{colorTwo}</span>
           </div>

           <div>
             <label>Color Three</label>
             <input type="color" value={colorThree} onChange={this.handleColorChange.bind(null, 'colorThree')}/>
             <input type="text" value={this.state.tempColorThree}
               onChange={this.handleColorChange.bind(null, 'colorThree')}/>
             <div style={{width:20,height:20,background:colorThree,display:'inline-block'}}/>
             <span>{colorThree}</span>
           </div>

           <div>
             <label>Color Four</label>
             <input type="color" value={colorFour} onChange={this.handleColorChange.bind(null, 'colorFour')}/>
             <input type="text" value={this.state.tempColorFour}
                onChange={this.handleColorChange.bind(null, 'colorFour')}/>
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
