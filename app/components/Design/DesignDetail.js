import React from 'react'
import Modal from '../Modal'
import reactor from '../../state/reactor'
import getters from '../../state/getters'
import Store from '../../state/main'
import {imageUrlForDesign, imageUrlForLayer, newId} from '../../state/utils'
import {Link, Navigation} from 'react-router';
import {iconPath} from '../../utils';
import SVGInlineLayer  from '../SVGInlineLayer';
import Button from '../Button'
var appElement = document.getElementById('app');
Modal.setAppElement(appElement);
Modal.injectCSS()

export default React.createClass({
  mixins: [Navigation, reactor.ReactMixin],

  getDataBindings() {
    return {design: Store.getters.currentDesign}
  },

  componentWillMount() {
    Store.actions.selectDesignId(this.props.params.designId)
    // Preload svg layer images, to be used for edit screen.
    //if (this.state.design != null) {
      //this.state.design.get('layers').forEach(layer => {
        //var liImage = new Image
        //liImage.src = imageUrlForLayer(layer)
      //})
    //}
  },

  shouldComponentUpdate(nextProps, nextState) {
    if (typeof nextState.design.getIn(['layers', 0]) === 'string') {
      return true
    }
    if (nextState.design && this.state.design) {
      return this.state.design !== nextState.design
    }
    return true
  },

  transitionToEdit() {
    var newDesignId = newId()
    Store.actions.makeDesignCopy(newDesignId)
    this.transitionTo('designEdit', {designId: newDesignId, step: 'start'});
  },

  transitionToDesigns() {
    this.transitionTo('designs')
  },

  transitionToCart() {
    this.transitionTo('cart', {designId: this.state.design.get('id')});
  },

  render() {
    var currentDesign = reactor.evaluate(getters.currentDesign)
    if (currentDesign == null ||
        typeof currentDesign.getIn(['layers', 0]) === 'string') {
      return null
    }

    var buttonShadow = {boxShadow: '1px 1px 1px black', overflow: 'hidden', borderRadius: 2}
    var buttonDownShadow = {boxShadow: '1px 1px 4px black inset', overflow: 'hidden', borderRadius: 2}

    return (
      <Modal isOpen={true}>
        <section className="show-design">

          <div className="top-ui">
            <span className="price">$75</span>

            <Button label="add to cart" imgSrc={iconPath('cart-icon-black.svg')}
                onClick={this.transitionToCart} size={40}/>

            <span className="exit" onClick={this.transitionToDesigns}>
              <img src={iconPath('cancel-x.svg')}/>
            </span>
          </div>

          <div className="canvas-container" onClick={this.transitionToEdit}>
            <div className="canvas">
              <img src={imageUrlForDesign(this.state.design)} width='100%'/>
            </div>
          </div>

          <div className="bottom-ui">
            <Button label="share" imgSrc={iconPath('share-icon-black.svg')}/>
            <Button label="customize" imgSrc={iconPath('edit-pencil.svg')} onClick={this.transitionToEdit}/>
          </div>

        </section>
      </Modal>
    )
  }
})
