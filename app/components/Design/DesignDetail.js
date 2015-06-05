import React from 'react'
import Modal from '../Modal'
import reactor from '../../state/reactor'
import State from '../../state/main'
import {imageUrlForLayer} from '../../state/utils'
import {Link} from 'react-router'
import {iconPath} from '../../utils'
var srcDir = require('../../../config').srcDir
var appElement = document.getElementById('app')
Modal.setAppElement(appElement)
Modal.injectCSS()

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return { design: State.getters.currentDesign };
  },

  componentWillMount() {
    State.actions.selectDesignId(this.props.params.designId);
  },

  render() {
    if (this.state.design == null) { return null; }

    let layerImages = this.state.design.get('layers').map(
      layer => {
        return (
          <div className="layer" key={layer.id}>
            <img src={imageUrlForLayer(layer)} width={100} height={100} />
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
            <Link to="designEdit" params={{designId: this.state.design.get('id')}}>
              <img src={'/' + srcDir + "/images/icons/edit-pencil.svg"}
                   width={40} height={40}/>
            </Link>
          </div>
        </section>
      </Modal>
    );
  }
})
