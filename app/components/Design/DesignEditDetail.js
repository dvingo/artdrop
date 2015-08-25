import React from 'react'
import Router from 'react-router'
import reactor from '../../state/reactor'
import Store from '../../state/main'
import Immutable from 'Immutable'
import RenderLayers from './RenderLayers'
import LayerSelectorGroup from './EditSteps/LayerSelectorGroup'
import ColorsButtonRotate from '../ColorsButtonRotate'
import LayerImage from './LayerImage'
import CheckButton from '../CheckButton'

export default React.createClass({
  mixins: [reactor.ReactMixin, Router.State, Router.Navigation],

  getDataBindings() {
    return {
      design:           Store.getters.currentDesign,
      currentLayer:     Store.getters.currentLayer,
      numEnabledLayers: Store.getters.numEnabledLayers,
      layerImages:      Store.getters.layerImages
    }
  },

  componentWillMount() {
    Store.actions.selectDesignAndLayerId({
      designId: this.props.params.designId,
      layerId: this.props.params.layerId
    })

    Store.actions.loadAdminLayerImages()
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

  componentDidMount() {
    this.attemptLoadResources()
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

  returnToDesignEdit() {
    this.transitionTo('designEdit', {designId: this.state.design.get('id')})
  },

  render() {
    if (this.state.design == null || this.state.currentLayer == null || this.state.layerImages == null ) { return null }

    var layerImages = this.state.layerImages.slice(0,30).map(layerImage => {
      return <LayerImage layerImage={layerImage} key={layerImage.get('id')}/>
    })

    return (
      <section className="main design-edit-detail">
        <div className="edit-ui">
          <div className="edit-ui-canvas">
            <div className="canvas-flex-wrapper">
              <span>
                <RenderLayers layers={this.state.design.get('layers')}/>
              </span>
            </div>
          </div>

          <div className="edit-ui-detailed">
            <LayerSelectorGroup/>
            <div className="edit-ui-mid">
              <ColorsButtonRotate className="rotate-colors" isSmall={false}/>
              <div className="art-button button">Art</div>
              <div className="color-button button">Color</div>
              <CheckButton onClick={this.returnToDesignEdit} isSmall={false}/>
            </div>

            <div className="edit-ui-bottom">
              {layerImages}
            </div>
          </div>
        </div>
      </section>
    )
  }
})
