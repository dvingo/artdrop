import React from 'react'
import State from '../../../state/main'
import {iconPath} from '../../../utils'
import {imageUrlForLayer, imageUrlForSurface} from '../../../state/utils'
import ChooseLayer from './ChooseLayer'
import ChoosePalette from './ChoosePalette'
import ChooseArt from './ChooseArt'
import ChooseSurface from './ChooseSurface'
import LayerSelector from './LayerSelector'
import ColorsButton from '../../ColorsButton'
import UpDownSwitch from '../../UpDownSwitch'
import Router from 'react-router'
var classNames = require('classnames')

export default React.createClass({
  mixins: [Router.State, Router.Navigation],
  onSwitchEditLayerImagesOrColors() {
    var imagesOrColors = (this.getParams().imagesOrColors === 'images'
                         ? 'colors' : 'images')
    this.transitionTo('layerEdit', {designId: this.getParams().designId,
                                     layerId: this.getParams().layerId,
                                     imagesOrColors: imagesOrColors})
  },

  render() {
    var step = this.getParams().step
    var layerId = this.getParams().layerId
    var editingLayerImages = this.getParams().imagesOrColors === 'images'
    var editingLayerColors = this.getParams().imagesOrColors === 'colors'
    return (
      <section className={classNames('detail', {visible: step !== 'start'})}>
        <LayerSelector design={this.props.design}/>

        <ChooseLayer design={this.props.design} isActive={step === 'choose-layer'}/>

        <article className={classNames('palette-art-container', {visible: layerId != null})}>

          <ChoosePalette isActive={editingLayerColors}/>

          <section className="options-button-container">
            <ColorsButton isSmall={true}/>
            <UpDownSwitch upLabel="Color Options"
                          downLabel="Art Options"
                          inUpPosition={editingLayerImages}
                          onToggle={this.onSwitchEditLayerImagesOrColors}/>
          </section>

          <ChooseArt design={this.props.design}
                     layerId={layerId}
                     isActive={editingLayerImages}/>
        </article>

        <ChooseSurface/>

      </section>
    )
  }
})
