import React from 'react'
import SVGInlineLayer  from 'components/SVGInlineLayer/SVGInlineLayer'
import Hammer from 'react-hammerjs'
import actions from 'state/actions'

export default React.createClass({

  getInitialState() {
    return {
      isAnimating: false,
      delta: 10,
      x: 0,
      direction: 1
    }
  },

  handleSwipe(e) {
    if (this.state.isAnimating) { return }
    var direction
    if (e.direction === 2) {
      direction = -1
      console.log('SWIPE LEFT')
    } else if (e.direction === 4) {
      direction = 1
      console.log('SWIPE RIGHT')
    }
    console.log('setting direction to: ', direction)
    this.setState({isAnimating:true, direction:direction})
    requestAnimationFrame(this.updateMovement)
  },

  onAnimationEnd() {
    this.setState({isAnimating:false, x:0})
    actions.nextLayerImage(this.state.direction)
  },

  updateMovement() {
    var max = 800
    var {delta, x, direction} = this.state
    if (x < -max || x > max) {
      this.onAnimationEnd(); return
    }
    // TODO Use time as well
    // these should be lin interp'd over a distance
    var newX = (Math.abs(x) + delta) * direction
    requestAnimationFrame(this.updateMovement)
    this.setState({x: newX})
  },

  _computeStyles() {
    return {
      transform: `translate3d(${this.state.x}px,0,0)`
    }
  },

  render() {
    var styles = this._computeStyles()
      console.log("styles are: ", styles)
    return (
      <Hammer onSwipe={this.handleSwipe}>
        <div className="canvas" style={styles}>
          {this.props.layers
              .filter(layer => layer.get('isEnabled'))
              .map(layer => <SVGInlineLayer layer={layer} key={layer.get('id')}/>)}
        </div>
      </Hammer>
    )
  }

})
