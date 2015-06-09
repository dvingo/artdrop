import React from 'react'
import Modal from '../Modal'
import reactor from '../../state/reactor'
import State from '../../state/main'
import {Navigation} from 'react-router';
import {imageUrlForLayer} from '../../state/utils'
import {Link} from 'react-router'
import {iconPath} from '../../utils'
import SVGInlineLayer  from '../SVGInlineLayer'
var srcDir = require('../../../config').srcDir
var appElement = document.getElementById('app')
Modal.setAppElement(appElement)
Modal.injectCSS()

export default React.createClass({
  mixins: [reactor.ReactMixin, Navigation],

  getDataBindings() {
    return { design: State.getters.currentDesign }
  },

  componentWillMount() {
    State.actions.selectDesignId(this.props.params.designId)
  },

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.design && this.state.design) {
      return this.state.design.get('id') !== nextState.design.get('id');
    }
    return true
  },

  transitionToEdit() {
    this.transitionTo('designEdit', {designId: this.state.design.get('id')});
  },

  render() {
    if (this.state.design == null) { return null; }

    let layerImages = this.state.design.get('layers').map(
      layer => {
        return (
          <div className="layer" key={layer.get('id')}>
            <SVGInlineLayer layer={layer} width={100} height={100} />
          </div>
        )
      })

    return (
      <Modal isOpen={true}>
        <section className="show-design">
          <div className="show-canvas">
            <div className="canvas">
              {layerImages}
            </div>
          </div>
          <div className="edit">
            <img src={iconPath('edit-pencil.svg')}
                 width={40} height={40}
                 onClick={this.transitionToEdit}/>
          </div>
        </section>
      </Modal>
    );
  }
})
