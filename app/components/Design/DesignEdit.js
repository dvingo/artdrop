import React from 'react'
import reactor from '../../state/reactor'
import Router from 'react-router'
import Store from '../../state/main'
import SVGInlineLayer  from '../SVGInlineLayer'
import Start from './EditSteps/Start'
import Container from './EditSteps/Container'

export default React.createClass({
  mixins: [reactor.ReactMixin, Router.State],

  getDataBindings() {
    return {design: Store.getters.currentDesign}
            //validSteps: Store.getters.validSteps}
  },

  componentWillMount() {
    // TODO redirect if invalid step
    //if (this.props.params.step  not in validSteps...)
    //if (!this.state.validSteps.contains(this.props.params.step)) {
      //this.redirectTo('designEdit')
    //}
    Store.actions.selectDesignId(this.props.params.designId)
    if (this.props.params.layerId) {
      Store.actions.selectLayerId(this.props.params.layerId)}
  },

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.design && this.state.design) {
      var getParams = this.getParams()
      var propParams = this.props.params
      return (this.state.design         !== nextState.design  ||
              propParams.step           !== getParams.step    ||
              propParams.layerId        !== getParams.layerId ||
              propParams.imagesOrColors !== getParams.imagesOrColors)
    }
    return true
  },

  componentWillUpdate(nextProps) {
    if (this.getParams().layerId &&
        this.props.params.layerId !== this.getParams().layerId) {
      Store.actions.selectLayerId(this.getParams().layerId)}
  },

  render() {
    if (this.state.design == null) { return null }

    let layerImages = this.state.design.get('layers').map(
      layer => {
        return (
          <div className="layer" key={layer.get('id')}>
            <SVGInlineLayer layer={layer}/>
          </div>
        )
      })

    var step = this.props.params.step
    return (
      <section className="main design-edit">

        <div className="canvas">
          {layerImages}
        </div>

        <div className="edit-ui">
          <div className="edit-steps">

            <Start isActive={step === 'start'}
                   isSmall={step === 'choose-layer'}/>

            <Container design={this.state.design}
                       step={step}
                       layerId={this.props.params.layerId}/>
          </div>
        </div>

      </section>
    )
  }
})
