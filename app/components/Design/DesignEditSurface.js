import React from 'react'
import reactor from '../../state/reactor'
import Store from '../../state/main'
import {imageUrlForSurface} from '../../state/utils'
import SurfaceImage from './SurfaceImage'
import RenderLayers from './RenderLayers'
var classNames = require('classnames')

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return {
      design: Store.getters.currentDesign,
      surfaces: Store.getters.surfaces
    }
  },

  componentWillMount() {
    Store.actions.selectDesignId(this.props.params.designId)
    Store.actions.loadCurrentDesignEditResources()
  },

  transitionToBuyPage() {
    console.log('transition to buy page')
  },

  selectSurface(surface) {
    Store.actions.selectSurface(surface)
  },

  render() {
    var design = this.state.design
    if (!(design && this.state.surfaces && typeof design.get('surfaceOption') === 'object')) { return null }

    var surface = design.get('surface')
    var surfaces = this.state.surfaces.map(s => {
      return <SurfaceImage surface={s} currentSurface={surface}
                           onClick={this.selectSurface.bind(null, s)}
                           key={s.get('id')}/>
    })
    var surfaceOptionPrice = design.getIn(['surfaceOption', 'salePrice']) / 100

    return (
      <section className="main design-edit-surface">

        <div className="edit-ui">

          <div className="edit-ui-top">
            <div style={{width: '100%'}}>
              <img style={{float:'right'}} src={surface.get('imageUrl')} height={100}/>
              <div>
                <p style={{fontWeight:'bold'}}>{surface.get('name')}</p>
                <span style={{fontSize:'0.7em'}}>{surface.get('description')}</span>
              </div>
            </div>
          </div>

          <div className="edit-ui-mid">
            <span style={{fontSize:'3em', color:'#fff'}}>${surfaceOptionPrice}</span>
            <button className="button" onClick={this.transitionToBuyPage}>Buy it!</button>
          </div>

          <div className="edit-ui-bottom">
            {surfaces}
          </div>
        </div>

      </section>
    )
  }
})
