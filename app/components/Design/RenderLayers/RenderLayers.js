import React from 'react'
import {imageUrlForLayer} from 'state/utils'
import SVGInlineLayer  from 'components/SVGInlineLayer/SVGInlineLayer'

export default React.createClass({

  render() {
    
    (this.props.layers ? console.log('empty') : console.log('not empty'))
    // var overlayStyle = (
    //   selectedSurface.get('id') === surface.get('id') ?
    //   { position: 'absolute',
    //     background: '#27002B',
    //     opacity: 0.7,
    //     top: 0,
    //     left: 0,
    //     height: '100%',
    //     width: '100%',
    //     borderRadius: 6 }
    //   : { display: 'none' })
    // <div style={overlayStyle}/>

    return (
      <div className="canvas-flex-wrapper">
        <span>
          <div className="canvas">
            {this.props.layers
                .filter(layer => layer.get('isEnabled'))
                .map(layer => (
                    <SVGInlineLayer imageUrl={imageUrlForLayer(layer)}
                                    layer={layer}
                                    key={layer.get('id')} />))
            }
          </div>
        </span>
      </div>
    )
  }

})
