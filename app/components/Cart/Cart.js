import React from 'react'
import RenderLayers from 'components/Design/RenderLayers/RenderLayers'
import reactor from 'state/reactor'
import Store from 'state/main'
import {imageUrlForSurface} from 'state/utils'
import PaymentForm from 'components/PaymentForm/PaymentForm'

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return {
      design: Store.getters.currentDesign,
      designPrice: Store.getters.currentDesignPrice
    }
  },

  componentWillMount() {
    Store.actions.selectDesignId(this.props.params.designId);
  },

  render() {
    var design = this.state.design
    if (design == null) { return null }

    return (
      <div className="Cart cart">
        <div className="Cart-left">

          <div className="Cart-canvas-flex-wrapper">
            <span>
              <RenderLayers layers={design.get('layers')}/>
            </span>
          </div>

          <div className="Cart-surface-info">
            <h2>Printed on: {design.getIn(['surface', 'name'])}</h2>
            <img src={imageUrlForSurface(design.get('surface'))}/>
          </div>

          <div className="Cart-price-info">
            <h2>Total:${this.state.designPrice}</h2>
          </div>

        </div>

        <PaymentForm />

      </div>
    )
  }
})
