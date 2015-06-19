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
  mixins: [Navigation],

  componentWillMount() {
    Store.actions.selectDesignId(this.props.params.designId)
  },

  transitionToEdit() {
    var newDesignId = newId()
    Store.actions.makeDesignCopy(newDesignId)
    this.transitionTo('designEdit', {designId: newDesignId, step: 'start'})
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

          <div className="show-design-top-ui">
            <span className="price">$75</span>
            <ul className="cart">
              <li>
                <img src={iconPath('cart-icon-black.svg')}/>
              </li>
              <li>add to cart</li>
            </ul>

            <span className="exit-detail">
              <img src={iconPath('cancel-x.svg')}/>
            </span>
          </div>

          <div className="show-canvas">
            <div className="canvas">
              {layerImages}
            </div>
          </div>

          <div className="show-design-bottom-ui">
            <ul className="edit">
              <img src={iconPath('edit-pencil.svg')}
                   width={40} height={40}
                   onClick={this.transitionToEdit}/>
            </ul>
          </div>

        </section>
      </Modal>
    )
  }
})
