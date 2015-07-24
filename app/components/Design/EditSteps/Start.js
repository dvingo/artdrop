import React from 'react'
import reactor from '../../../state/reactor'
import Store from '../../../state/main'
import ColorsButton from '../../ColorsButton'
import {iconPath} from '../../../utils'
import {imageUrlForLayer} from '../../../state/utils'
import {Navigation} from 'react-router'
import {Link} from 'react-router'
var classNames = require('classnames')
var imgSize = 120

export default React.createClass({
  mixins: [reactor.ReactMixin, Navigation],
  getDataBindings() {
    return { design: Store.getters.currentDesign }
  },

  selectLayer(layerId) {
    Store.actions.selectLayerId(layerId)
    this.transitionTo('layerEdit', {designId: this.state.design.get('id'), layerId: layerId,
                                    imagesOrColors: 'images'})
  },

  render() {
    var isActive = this.props.isActive
    var isSmall = this.props.isSmall
    var layerImages = this.state.design.get('layers').reverse().map(layer => {
      return (
        <div className="layer-selector"
             onClick={this.selectLayer.bind(null, layer.get('id'))}>
          <img src={imageUrlForLayer(layer)} width={imgSize} height={imgSize}
               style={{opacity:1}}
               className={classNames({selected: this.state.currentLayerId === layer.get('id')})}/>
        </div>
        )
    }.bind(this))

    return (
      <div className={classNames('start', {visible: isActive, small: isSmall})}>
        <div className="actions">
          <ColorsButton isSmall={isSmall}
                        onLeftClick={Store.actions.previousDesignColors}
                        onRightClick={Store.actions.nextDesignColors}
                        label={isActive ? "New Colors" : null}/>
        </div>
         {this.props.isActive ?
          <div className="more-options">
            {layerImages}
           </div>
          : null }
      </div>
    )
  }
})
