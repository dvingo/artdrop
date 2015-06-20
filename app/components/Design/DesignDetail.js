import React from 'react'
import Modal from '../Modal'
import reactor from '../../state/reactor'
import getters from '../../state/getters'
import Store from '../../state/main'
import {newId} from '../../state/utils'
import {Navigation} from 'react-router';
import {iconPath} from '../../utils';
import SVGInlineLayer  from '../SVGInlineLayer'
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
  },

  shouldComponentUpdate(nextProps, nextState) {
    var currentDesign = reactor.evaluate(getters.currentDesign)
    if (nextState.design && this.state.design) {
      return currentDesign !== nextState.design
    }
    return true
  },

  transitionToEdit() {
    var newDesignId = newId()
    Store.actions.makeDesignCopy(newDesignId)
    this.transitionTo('designEdit', {designId: newDesignId, step: 'start'})
  },
  transitionToDesigns() {
    this.transitionTo('designs')
  },

  render() {
    var currentDesign = reactor.evaluate(getters.currentDesign)
    if (currentDesign == null) { return null }

    let layerImages = currentDesign.get('layers').map(
      layer => {
        return (
          <div className="layer" key={layer.get('id')}>
            <SVGInlineLayer layer={layer}/>
          </div>
        )
      })

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

            <span className="exit" onClick={this.transitionToDesigns} onTouchEnd={this.transitionToDesigns}>
              <img src={iconPath('cancel-x.svg')}/>
            </span>
          </div>

          <div className="canvas-container">
            <div className="canvas">
              {layerImages}
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
              <li className="label">edit</li>
            </ul>
          </div>

        </section>
      </Modal>
    )
  }
})
