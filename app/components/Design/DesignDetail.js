import React from 'react'
import Modal from '../Modal'
import reactor from '../../state/reactor'
import getters from '../../state/getters'
import Store from '../../state/main'
import {imageUrlForDesign, imageUrlForLayer, newId} from '../../state/utils'
import {Link, Navigation} from 'react-router';
import {iconPath} from '../../utils';
import SVGInlineLayer  from '../SVGInlineLayer';
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

  render() {
    var currentDesign = reactor.evaluate(getters.currentDesign)
    if (currentDesign == null ||
        typeof currentDesign.getIn(['layers', 0]) === 'string') {
      return null
    }

    return (
      <Modal isOpen={true}>
        <section className="show-design">

          <div className="top-ui">
            <span className="price">$75</span>
            <ul className="cart">
                <li className="cart-image">
                  <img src={iconPath('cart-icon-black.svg')}/>
                </li>
              <li>add to cart</li>
            </ul>

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
            <ul className="image-with-label">
              <li>
                <img src={iconPath('share-icon-black.svg')}/>
              </li>
              <li className="label">share</li>
            </ul>
            <ul className="image-with-label">
              <li>
                <img src={iconPath('edit-pencil.svg')} onClick={this.transitionToEdit}/>
              </li>
              <li className="label">customize</li>
            </ul>
          </div>

        </section>
      </Modal>
    )
  }
})
