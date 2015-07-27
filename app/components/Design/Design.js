import React from 'react';
import {Navigation} from 'react-router';
import State from '../../state/main';
import SVGInlineLayer  from '../SVGInlineLayer'
import {imageUrlForDesign} from '../../state/utils';

export default React.createClass({
  mixins: [Navigation],

  selectDesign(e) {
    State.actions.selectDesignId(this.props.design.get('id'))
    this.transitionTo('designDetail', {designId: this.props.design.get('id')})
  },

  componentDidMount() {
    var self = this
    window.addEventListener('resize', () => {
      if (self.isMounted()) {
        self.forceUpdate()
      }
    })
  },

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.design !== nextProps.design
  },

  render() {
    var imgSize = (() => {
      var w = window.innerWidth
       if (w > 900)      { return 180 }
       else if (w > 650) { return 120 }
       else              { return 100 }
    }())

    return (
      <section className="show-design">
        <div className="canvas-container">
          <div className="canvas" onClick={this.selectDesign}>
            <img src={imageUrlForDesign(this.props.design)} width={imgSize} height={imgSize}/>
          </div>
        </div>
      </section>
    )
  }
})
