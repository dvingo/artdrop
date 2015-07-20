import React from 'react';
import {Navigation} from 'react-router';
import State from '../../state/main';
import SVGInlineLayer  from '../SVGInlineLayer'
import {imageUrlForLayer} from '../../state/utils';

export default React.createClass({
  mixins: [Navigation],

  selectDesign(e) {
    State.actions.selectDesignId(this.props.design.get('id'))
    this.transitionTo('designDetail', {designId: this.props.design.get('id')})
  },

  componentDidMount() {
    var self = this
    window.addEventListener('resize', () => self.forceUpdate())
  },

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.design !== nextProps.design
  },

  render() {
    let layerImages = this.props.design.get('layers')
      .map(layer => {
        return (
          <div className="layer" key={layer.get('id')}>
            <SVGInlineLayer layer={layer}/>
          </div>
        )
      })

    var imgSize = (() => {
      var w = window.innerWidth
       if (w > 900)      { return 180 }
       else if (w > 650) { return 120 }
       else              { return 100 }
    }())

    return (
      <section className="show-design">
        <div className="canvas-container">
          <div className="canvas" onClick={this.selectDesign} onTouchEnd={this.selectDesign}>
            <img src={this.props.design.get('imageUrl')} width={imgSize} height={imgSize}/>
          </div>
        </div>
      </section>
    )
  }
})
