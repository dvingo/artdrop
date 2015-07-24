import React from 'react'
import {imageUrlForLayer, imageUrlForSurface} from '../../../state/utils'
import reactor from '../../../state/reactor'
import Store from '../../../state/main'
import {Navigation, State} from 'react-router'
var classNames = require('classnames')
var imgSize = 60

export default React.createClass({
  mixins: [reactor.ReactMixin, Navigation, State],

  getDataBindings() {
    return {currentLayerId: ['currentLayerId'],
            design: Store.getters.currentDesign}
  },

  selectLayer(layerId) {
    Store.actions.selectLayerId(layerId)
    var imagesOrColors = this.getParams().imagesOrColors
    imagesOrColors = (imagesOrColors ? imagesOrColors : 'images')
    this.transitionTo('layerEdit', {designId: this.state.design.get('id'), layerId: layerId,
                                    imagesOrColors: imagesOrColors})
  },

  editSurface() {
    Store.actions.selectLayerId('')
    this.transitionTo('designEdit', {designId: this.state.design.get('id'), step: 'surface'})
  },

  render() {
    var editingSurface = this.getParams().step === 'surface'
      console.log('SURAF: ',editingSurface)
    return (
      <article className="layer-selector-wrapper small">
        <div className="container">
          {this.state.design.get('layers').reverse().map(layer => {
            return (
              <div className="layer-selector"
                   onClick={this.selectLayer.bind(null, layer.get('id'))}>
                <img src={imageUrlForLayer(layer)} width={imgSize} height={imgSize}
                     className={classNames({selected: this.state.currentLayerId === layer.get('id')})}/>
              </div>
            )
           })
          }
          <div className="layer-selector surface">
            <img src={imageUrlForSurface(this.state.design.get('surface'))}
                 className={classNames({selected: editingSurface})}
                 onClick={this.editSurface}
                 width={imgSize} height={imgSize}/>
          </div>
        </div>
      </article>
    )
  }
})
