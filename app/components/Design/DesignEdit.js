import React from 'react'
import reactor from '../../state/reactor'
import Router from 'react-router'
import Store from '../../state/main'
import Immutable from 'Immutable'
import RenderLayers from './RenderLayers'
import LayerSelectorGroup from './EditSteps/LayerSelectorGroup'
import ColorsButton from '../ColorsButton'
import CheckButton from '../CheckButton'
import {imageUrlForLayer} from '../../state/utils'

import {iconPath} from '../../utils'
var classNames = require('classnames')
var Hammer = require('react-hammerjs')

export default React.createClass({
  mixins: [reactor.ReactMixin, Router.State, Router.Navigation],

  getDataBindings() {
    return {
      design: Store.getters.currentDesign,
      currentLayer: Store.getters.currentLayer,
      numEnabledLayers: Store.getters.numEnabledLayers
    }
  },

  componentWillMount() {
    Store.actions.selectDesignAndLayerId({
      designId: this.props.params.designId, 
      layerId: this.props.params.layerId})
  },

  componentWillUnmount() {
    clearInterval(this._interval)
  },

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps !== this.props || nextState !== this.state) {
      return true
    }
    return false
  },

  attemptLoadResources() {
    this._interval = setInterval(() => {
      var svgs = document.querySelectorAll('.canvas svg')
      if (svgs.length === this.state.numEnabledLayers) {
        clearInterval(this._interval)
        Store.actions.loadCurrentDesignEditResources()
      }
    }, 50)
  },

  componentDidMount() {
    this.attemptLoadResources()
  },

  handleSwipe(e) {
    var direction = e.direction
    if (direction === 2) {
      console.log('SWIPE LEFT')
    } else if (direction === 4) {
      console.log('SWIPE RIGHT')
    }
  },

  handlePan(e) {
   console.log('GOT PAN: ', e)
  },

  selectLayer(layer) {
    Store.actions.selectLayerId(layer.get('id'))
    this.transitionTo('designEdit', {designId: this.state.design.get('id'), layerId: layer.get('id')})
  },

  toggleCurrentLayer(e) {
    e.preventDefault()
    Store.actions.toggleCurrentLayer()
  },

  editLayerDetail() {
    this.transitionTo('designEditDetail', {designId: this.state.design.get('id'), layerId: this.state.currentLayer.get('id'), imagesOrColors: 'images'})
  },

  editDesignSurface() {
    this.transitionTo('designEditSurface', {designId: this.state.design.get('id')})
  },

  render() {
    if (this.state.design == null || this.state.currentLayer == null) { return null }

    return (
      <section className="main design-edit">

        <div className="canvas-flex-wrapper">
          <Hammer onSwipe={this.handleSwipe} onPan={this.handlePan}>
            <RenderLayers layers={this.state.design.get('layers')}/>
          </Hammer>
        </div>

        <div className="edit-ui">

            <div className="edit-ui-top">
              <ColorsButton isSmall={false}
                onLeftClick={Store.actions.previousDesignColors}
                onRightClick={Store.actions.nextDesignColors}/>
              <CheckButton onClick={this.editDesignSurface} isSmall={false}/>
            </div>
            <LayerSelectorGroup />

        </div>

      </section>
    )
  }
})
