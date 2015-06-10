import React from 'react'
import State from '../../../state/main'
import {iconPath} from '../../../utils'
import {imageUrlForLayer, imageUrlForSurface} from '../../../state/utils'
import ChooseLayer from './ChooseLayer'
import ChoosePalette from './ChoosePalette'
import ChooseArt from './ChooseArt'
import ChooseSurface from './ChooseSurface'
var classNames = require('classnames')

export default React.createClass({
            //{{new-colors-button size="small"}}
            //{{toggle-options-button upLabel="Color Options"
                                    //downLabel="Art Options"
                                    //inUpPosition=isChooseArtVisible
                                    //onToggle="switchVisibleOptions"
                                    //}}

  render() {
    return (
      <section className={classNames('detail', {visible: this.props.isActive})}>
        <article className="layer-selector-wrapper small">
          <div className="container">
            {this.props.design.get('layers').map(layer => {
              return <img src={imageUrlForLayer(layer)} width={40} height={40}/>
             })
            }
            <img src={null} width={40} height={40}/>
          </div>
        </article>

        <ChooseLayer design={this.props.design} isActive={false}/>
        <article className={classNames('palette-art-container', {visible: false})}>
          <ChoosePalette />
          <section className="options-button-container">
          </section>

          <ChooseArt design={this.props.design} isActive={false}/>
        </article>

        <ChooseSurface/>
      </section>
    )
  }
})
