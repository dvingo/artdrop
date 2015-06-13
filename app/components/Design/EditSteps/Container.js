import React from 'react'
import State from '../../../state/main'
import {iconPath} from '../../../utils'
import {imageUrlForLayer, imageUrlForSurface} from '../../../state/utils'
import ChooseLayer from './ChooseLayer'
import ChoosePalette from './ChoosePalette'
import ChooseArt from './ChooseArt'
import ChooseSurface from './ChooseSurface'
import LayerSelector from './LayerSelector'
import Router from 'react-router'
var classNames = require('classnames')

export default React.createClass({
  mixins: [Router.State],
            //{{new-colors-button size="small"}}
            //{{toggle-options-button upLabel="Color Options"
                                    //downLabel="Art Options"
                                    //inUpPosition=isChooseArtVisible
                                    //onToggle="switchVisibleOptions"
                                    //}}

  render() {
    var step = this.getParams().step
    var layerId = this.getParams().layerId
    return (
      <section className={classNames('detail', {visible: step !== 'start'})}>
        <LayerSelector design={this.props.design}/>

        <ChooseLayer design={this.props.design} isActive={step === 'choose-layer'}/>

        <article className={classNames('palette-art-container', {visible: layerId != null})}>
          <ChoosePalette />
          <section className="options-button-container">
          </section>

          <ChooseArt design={this.props.design}
                     layerId={layerId}
                     isActive={layerId != null}/>
        </article>

        <ChooseSurface/>

      </section>
    )
  }
})
