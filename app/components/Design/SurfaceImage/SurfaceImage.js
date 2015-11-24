import React from 'react'
import reactor from 'state/reactor'
import Store from 'state/main'
import {imageUrlForSurface} from 'state/utils'
import RenderLayers from 'components/Design/RenderLayers/RenderLayers'
import cn from 'classnames'

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings () {
    return {
      design: Store.getters.currentDesign
    }
  },

  shouldComponentUpdate(nextProps) {
    var currentSurface = this.props.currentSurface.get('id')
    var nextCurrentSurface = nextProps.currentSurface.get('id')
    var surface = this.props.surface.get('id')
    var nextSurface = nextProps.surface.get('id')
    if ((nextCurrentSurface === nextSurface && currentSurface !== surface) ||
        (currentSurface === surface && nextCurrentSurface !== nextSurface)) {
      return true
    }
    return false
  },

  render() {
    var design = this.state.design
    var height = this.props.height || 100
    var width = this.props.width || 100
    var selectedSurface = this.props.currentSurface
    var surface = this.props.surface

    console.log("-- RENDER --")
    console.log(design)
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

    const classes = cn(
      'SurfaceImage-info', {
        '--selected': selectedSurface.get('id') === surface.get('id')
      }
    )

    // {classNames("SurfaceImage-info", {selected: (selectedSurface.get('id') === surface.get('id')})}
    
    return (
      <div className="SurfaceImage" onClick={this.props.onClick}>   
        <div className="SurfaceImage-image">
          <div className="SurfaceImage-preview">
            <img src={imageUrlForSurface(this.props.surface)} width={width} height={height}/>
          </div>
          <div className="SurfaceImage-overlay-container">
            <img src={imageUrlForSurface(this.props.surface)} width={width} height={height}/>
            {( design ? <RenderLayers layers={design.get('layers')}/> : console.log("empty"))}
          </div>
        </div>
        <div className={classes}>
          <p>{surface.get('vendorName')}</p>
        </div>
      </div>
    )
  }
})
