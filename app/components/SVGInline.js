import React from 'react'
var SVGInjector = require('svg-injector')

export default React.createClass({

  componentDidMount() {
    var self = this;
    var img = React.findDOMNode(this.refs.imgRef)
    SVGInjector(img, {"each": function(svgEl) {
      svgEl.style.height = '100%';
      svgEl.style.width = '100%';
      svgEl.style.margin = '0 auto';
      svgEl.style.display = 'block';
    }});
  },

  render() {
    return (
      <img src={this.props.src}
           width={this.props.width}
           height={this.props.height}
           ref="imgRef"/>
    )
  }
})
