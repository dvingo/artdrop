import React from 'react'
import Modal from 'components/Modal/Modal'
import reactor from 'state/reactor'
import Store from 'state/main'
import {imageUrlForDesign} from 'state/utils'
import {Navigation} from 'react-router'
import {iconPath} from 'utils'
import Button from 'components/Button/Button'
import {makeDesignCopy} from 'state/utils'
var appElement = document.getElementById('app')
Modal.setAppElement(appElement)
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
    if (nextProps !== this.props || nextState !== this.state) {
      return true
    }
    return false
  },

  transitionToEdit() {
    var newDesign = makeDesignCopy(this.state.design)
    Store.actions.saveDesign(newDesign)
    this.transitionTo('designEdit', {designId: newDesign.get('id'), layerId: newDesign.getIn(['layers', 0, 'id'])});
  },

  transitionToDesigns() {
    this.transitionTo('designs')
  },

  transitionToCart() {
    this.transitionTo('cart', {designId: this.state.design.get('id')});
  },

  render() {
    var design = this.state.design
    if (design == null ||
        typeof design.getIn(['layers', 0]) === 'string' ||
        design && this.props.params.designId !== design.get('id')) {
      return null
    }

    return (
      <Modal isOpen={true} key={design.get('id')}>
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
              <img src={imageUrlForDesign(this.state.design, 'large')} width='100%'/>
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
