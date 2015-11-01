import React from 'react'
import reactor from 'state/reactor'
import Router from 'react-router'
import Store from 'state/main'
import RenderLayers from 'components/Design/RenderLayers/RenderLayers'
import LayerSelectorGroup from 'components/Design/LayerSelectorGroup/LayerSelectorGroup'
import ColorsButton from 'components/ColorsButton/ColorsButton'
import CheckButton from 'components/CheckButton/CheckButton'
import {makeDesignCopy, imageUrlForLayer} from 'state/utils'
import {iconPath} from 'utils'
import classNames from 'classnames'

export default React.createClass({
  mixins: [reactor.ReactMixin, Router.State, Router.Navigation],

  getDataBindings() {
    return {
      design: Store.getters.currentDesign,
      currentLayer: Store.getters.currentLayer,
      numEnabledLayers: Store.getters.numEnabledLayers
    }
  },

  _designIsNotEditable() {
    return (
      this.state.design != null &&
      this.state.design.get('isImmutable') &&
      !this._isTransitioning
    )
  },

  _makeEditableCopyAndTransition() {
    this._isTransitioning = true
    var newDesign = makeDesignCopy(this.state.design).set('isImmutable', false)
    Store.actions.saveDesign(newDesign)
    this.transitionTo('designEdit', {
      designId: newDesign.get('id'),
      layerId: newDesign.getIn(['layers', 0, 'id'])
    })
    Store.actions.selectDesignAndLayerId({
      designId: newDesign.get('id'),
      layerId: newDesign.getIn(['layers', 0, 'id'])
    })
  },

  componentWillMount() {
    this._isTransitioning = false
    if (this._designIsNotEditable()) {
      this._makeEditableCopyAndTransition()
    } else {
      Store.actions.selectDesignAndLayerId({
        designId: this.props.params.designId,
        layerId: this.props.params.layerId
      })
    }
  },

  componentWillUnmount() {
    clearInterval(this._interval)
  },

  componentWillUpdate(nextProps, nextState) {
    if (this._designIsNotEditable()) {
      this._makeEditableCopyAndTransition()
    }
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

  selectLayer(layer) {
    Store.actions.selectLayerId(layer.get('id'))
    this.transitionTo('designEdit', {
      designId: this.state.design.get('id'),
      layerId: layer.get('id')
    })
  },

  toggleCurrentLayer(e) {
    e.preventDefault()
    Store.actions.toggleCurrentLayer()
  },

  editLayerDetail() {
    this.transitionTo('designEditDetail', {
      designId: this.state.design.get('id'),
      layerId: this.state.currentLayer.get('id'),
      imagesOrColors: 'images'
    })
  },

  editDesignSurface() {
    this.transitionTo('designEditSurface', { designId: this.state.design.get('id') })
  },

  onSelectLayer(layerId) {
    Store.actions.selectLayerId(layerId)
    this.transitionTo('designEdit', {
      designId: this.state.design.get('id'),
      layerId: layerId
    })
  },

  render() {
    if (this.state.design == null || this.state.currentLayer == null) { return null }

    return (
      <section className="DesignEdit">
        <div className="DesignEdit-canvas-flex-wrapper">
          {/*Pass through translate and rotate params here*/}
          <RenderLayers layers={this.state.design.get('layers')} />
        </div>

        <div className="DesignEdit-ui">
          <div className="DesignEdit-ui-top">
            <ColorsButton isSmall={false}
               onLeftClick={Store.actions.previousDesignColors}
               onRightClick={Store.actions.nextDesignColors}/>
            <CheckButton onClick={this.editDesignSurface} isSmall={false}/>
          </div>
          <LayerSelectorGroup onClick={this.onSelectLayer}/>
        </div>
      </section>
    )
  }
})
