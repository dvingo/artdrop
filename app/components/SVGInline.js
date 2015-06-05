import React from 'react'
var SVGInjector = require('svg-injector')

export default React.createClass({

  componentDidMount() {
    var img = React.findDOMNode(this.refs.imgRef)
    SVGInjector(img, {"each": function(svgEl) {
      svgEl.style.cssText = [
      'height: 100%',
      'width: 100%',
      'margin: 0 auto',
      'display: block'].join(" ")
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
