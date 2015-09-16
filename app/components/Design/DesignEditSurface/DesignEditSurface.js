import React from 'react'
import Router from 'react-router'
import reactor from 'state/reactor'
import Store from 'state/main'
import SurfaceImage from 'components/Design/SurfaceImage/SurfaceImage'
import RenderLayers from 'components/Design/RenderLayers/RenderLayers'
import {imageUrlForSurface} from 'state/utils'
var Set = require('nuclear-js').Immutable.Set
var Map = require('nuclear-js').Immutable.Map
var classNames = require('classnames')

export default React.createClass({
  mixins: [reactor.ReactMixin, Router.Navigation],

  getDataBindings() {
    return {
      design: Store.getters.currentDesign,
      surfaces: Store.getters.surfaces,
      currentSurfaceOptionsMap: Store.getters.currentSurfaceOptionsMap
    }
  },

  componentWillMount() {
    Store.actions.selectDesignId(this.props.params.designId)
    Store.actions.loadCurrentDesignEditResources()
  },

  transitionToBuyPage() {
    this.transitionTo('cart', {designId: this.props.params.designId})
  },

  selectSurface(surface) {
    Store.actions.selectSurface(surface)
  },

  onOptionChanged(key, e) {
    var value = e.target.value
    Store.actions.selectSurfaceOptionFromKeyValue(key, value)
  },

  render() {
    var design = this.state.design
    if (!(design && this.state.surfaces && typeof design.get('surfaceOption') === 'object'
        && this.state.currentSurfaceOptionsMap)) { return null }

    var surface = design.get('surface')
    var surfaces = this.state.surfaces.map(s => {
      return <SurfaceImage surface={s} currentSurface={surface}
                           onClick={this.selectSurface.bind(null, s)}
                           key={s.get('id')}/>
    })
    var surfaceOption = design.get('surfaceOption')
    var surfaceOptionPrice = design.getIn(['surfaceOption', 'salePrice']) / 100
    var surfaceOptionsMap = this.state.currentSurfaceOptionsMap
    var selectBoxes = surfaceOptionsMap.keySeq().map(key => {
      return (
        <div key={key}>
          <span>{key}</span>
          <select value={surfaceOption.get(key)} onChange={this.onOptionChanged.bind(null, key)}>
            {surfaceOptionsMap.get(key).sort().map(value => {
              return <option value={value}>{value}</option>
            })}
          </select>
        </div>
      )
    })

    return (
      <section className="main design-edit">

        <div className="edit-ui">

          <div className="edit-ui-top surface-details">
            <div className="left">
              {selectBoxes}
              <div>
                <p style={{fontWeight:'bold'}}>{surface.get('name')}</p>
                <span style={{fontSize:'0.7em'}}>{surface.get('description')}</span>
              </div>
            </div>
            <div className="right">
              <img src={imageUrlForSurface(surface)} height={200}/>
            </div>
          </div>

          <div className="edit-ui-mid">
            <span style={{fontSize:'3em', color:'#fff'}}>${surfaceOptionPrice}</span>
            <button className="button" onClick={this.transitionToBuyPage}>Buy it!</button>
          </div>

          <div className="edit-ui-bottom surface-details">
            {surfaces}
          </div>

        </div>

      </section>
    )
  }
})
