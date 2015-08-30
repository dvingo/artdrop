import React from 'react'
import reactor from '../../state/reactor'
import Store from '../../state/main'
import {imageUrlForSurface} from '../../state/utils'
import SurfaceImage from './SurfaceImage'
import RenderLayers from './RenderLayers'
var Set = require('nuclear-js').Immutable.Set
var classNames = require('classnames')

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return {
      design: Store.getters.currentDesign,
      surfaces: Store.getters.surfaces
    }
  },

  componentWillMount() {
    Store.actions.selectDesignId(this.props.params.designId)
    Store.actions.loadCurrentDesignEditResources()
  },

  transitionToBuyPage() {
    console.log('transition to buy page')
  },

  selectSurface(surface) {
    Store.actions.selectSurface(surface)
  },

  render() {
    var design = this.state.design
    if (!(design && this.state.surfaces && typeof design.get('surfaceOption') === 'object')) { return null }

    var surface = design.get('surface')
    console.log('SELECTED SURFACE: ', surface.toJS())
    var surfaces = this.state.surfaces.map(s => {
      console.log('surface type: ', s.get("type"))
      return <SurfaceImage surface={s} currentSurface={surface}
                           onClick={this.selectSurface.bind(null, s)}
                           key={s.get('id')}/>
    })
    var surfaceOption = design.get('surfaceOption')
    var surfaceOptionPrice = design.getIn(['surfaceOption', 'salePrice']) / 100
    var surfaceOptions = surface.get('options')
    console.log('surface option: ', surfaceOption.toJS())
    var nonOptionKeys = Set.of('id', 'printingPrice', 'salePrice', 'units', 'vendorId')

    console.log('non options: ', nonOptionKeys.toJS())
    var allOptionsSet = Set.fromKeys(surfaceOption)
    var optionKeys = allOptionsSet.subtract(nonOptionKeys)
    console.log('selectable option: set ', optionKeys.toJS())

    var selectBoxes = optionKeys.map(key => {
      return (
        <div key={key}>
          <span>{key}</span>
          <select value={surfaceOption.get('id')}>
            {surfaceOptions.map(option => {
              return (
                <option value={option.get('id')}>{option.get(key)}</option>
              )
            })}
          </select>
        </div>
      )
    })

    return (
      <section className="main design-edit">

        <div className="edit-ui">

          <div className="edit-ui-top">
            <div style={{width:'100%'}}>
              <div>
                {selectBoxes}
              </div>

              <img style={{float:'right'}} src={surface.get('imageUrl')} height={100}/>
              <div>
                <p style={{fontWeight:'bold'}}>{surface.get('name')}</p>
                <span style={{fontSize:'0.7em'}}>{surface.get('description')}</span>
              </div>
            </div>
          </div>

          <div className="edit-ui-mid">
            <span style={{fontSize:'3em', color:'#fff'}}>${surfaceOptionPrice}</span>
            <button className="button" onClick={this.transitionToBuyPage}>Buy it!</button>
          </div>

          <div className="edit-ui-bottom">
            {surfaces}
          </div>
        </div>

      </section>
    )
  }
})
