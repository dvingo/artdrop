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
    console.log('SHOULD UPDATE')
    if (nextState.design && this.state.design) {
      return (this.state.design !== nextState.design ||
              this.props.params.step !== this.getParams().step ||
              this.props.params.layerId !== this.getParams().layerId)
    }
    return true
  },

  componentWillUpdate(nextProps) {
    if (this.props.params.layerId !== this.getParams().layerId) {
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

    return (
      <section className="main design-edit">

        <div className="canvas">
          {layerImages}
        </div>

        <div className="edit-ui">
          <div className="edit-steps">
            <Start isActive={this.props.params.step === 'start'}/>
            <Container design={this.state.design}
                       step={this.props.params.step}
                       layerId={this.props.params.layerId}/>
          </div>
        </div>

      </section>
    )
  }
})
