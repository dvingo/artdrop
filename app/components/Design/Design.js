import React from 'react'
import SVGInlineLayer  from 'components/SVGInlineLayer/SVGInlineLayer'
import {imageUrlForDesign} from 'state/utils'

export default React.createClass({

  componentDidMount() {
    var self = this
    window.addEventListener('resize', () => {
      if (self.isMounted()) { self.forceUpdate() }
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
          <div className="canvas" onClick={this.props.onClick}>
            <img src={imageUrlForDesign(this.props.design, 'small')} width={imgSize} height={imgSize}/>
          </div>
        </div>
      </section>
    )
  }
})
