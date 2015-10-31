import React from 'react'
import Router from 'react-router'
import reactor from 'state/reactor'
import Store from 'state/main'
import RenderLayers from 'components/Design/RenderLayers/RenderLayers'
import LayerSelectorGroup from 'components/Design/LayerSelectorGroup/LayerSelectorGroup'
import ChoosePalette from 'components/Design/ChoosePalette/ChoosePalette'
import ColorsButtonRotate from 'components/ColorsButtonRotate/ColorsButtonRotate'
import LayerImage from 'components/Design/LayerImage/LayerImage'
import CheckButton from 'components/CheckButton/CheckButton'
var classNames = require('classnames')

var numLayerImagesPerPage = 30
export default React.createClass({
  mixins: [reactor.ReactMixin, Router.State, Router.Navigation],

  getDataBindings() {
    return {
      design:           Store.getters.currentDesign,
      currentLayer:     Store.getters.currentLayer,
      layerImagesForCurrentLayer: Store.getters.layerImagesForCurrentLayer,
      numEnabledLayers: Store.getters.numEnabledLayers,
      layerImages:      Store.getters.layerImages
    }
  },

  getInitialState() {
    // TODO put current page in the url as a query param
    return { currentPage: 0 }
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
    return nextProps !== this.props || nextState !== this.state
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

  _layerImagesForCurrentPage() {
    var {currentPage} = this.state
    var start = numLayerImagesPerPage * currentPage
    var end = start + numLayerImagesPerPage
    return this.state.layerImagesForCurrentLayer.slice(start, end)
  },

  returnToDesignEdit() {
    this.transitionTo('designEdit', {
      designId: this.state.design.get('id'),
      layerId: this.state.currentLayer.get('id')
    })
  },

  selectImagesOrColors(imagesOrColors) {
    this.transitionTo('designEditDetail', {
      designId: this.state.design.get('id'),
      layerId: this.state.currentLayer.get('id'),
      imagesOrColors: imagesOrColors
    })
  },

  onSelectLayer(layerId) {
    Store.actions.selectDesignAndLayerId({
      designId: this.state.design.get('id'),
      layerId: layerId
    })
    this.transitionTo('designEditDetail', {
      designId: this.state.design.get('id'),
      layerId: layerId,
      imagesOrColors: this.getParams().imagesOrColors
    })
  },

  render() {
    if (this.state.design == null || this.state.currentLayer == null
          || this.state.layerImages == null ) { return null }

    var layerImages = this._layerImagesForCurrentPage().map(layerImage => (
      <LayerImage layerImage={layerImage} key={layerImage.get('id')}/>
    ))

    var isPortrait = window.innerHeight > window.innerWidth
    var selectingColors = this.getParams().imagesOrColors === 'colors'
    var layerSelectorGroup = <LayerSelectorGroup isPortrait={isPortrait}
                                                 onClick={this.onSelectLayer}/>

    return (
      <section className="DesignEditDetail main">
        <div className="DesignEditDetail-wrapper-1">
          { isPortrait ? layerSelectorGroup : null}
          <div className="DesignEditDetail-canvas">
            <span>
              <RenderLayers layers={this.state.design.get('layers')}/>
            </span>
          </div>
        </div>

        <div className="DesignEditDetail-wrapper-2">
          { isPortrait ? null : layerSelectorGroup }
          <div className="DesignEditDetail-mid">
            <ColorsButtonRotate className="rotate-colors" isSmall={false}/>

            <div onClick={this.selectImagesOrColors.bind(null, 'images')}
                className={classNames("button", {off: !selectingColors})}>Art</div>

            <div onClick={this.selectImagesOrColors.bind(null, 'colors')}
                className={classNames("button", {off: selectingColors})}>Color</div>

            <CheckButton onClick={this.returnToDesignEdit} isSmall={false}/>
          </div>

          <div className="DesignEditDetail-layer-grid">
              { selectingColors ? <ChoosePalette/> : layerImages }
          </div>
        </div>
      </section>
    )
  }
})
