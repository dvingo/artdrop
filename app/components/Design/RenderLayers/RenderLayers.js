import React from 'react'
import SVGInlineLayer  from 'components/SVGInlineLayer/SVGInlineLayer'
import Hammer from 'react-hammerjs'
import actions from 'state/actions'
import LayerImageInline from './LayerImageInline'
var eventToDirectionMap = { '2': -1, '4': 1 }

export default React.createClass({

  getDefaultProps() {
    return { animate: true }
  },

  getInitialState() {
    return {
      isAnimating: false,
      delta: 10,
      x: 0,
      direction: 1,
      containerWidth: -1,
      containerHeight: -1,
      currentTime: -1,
      animDuration: 300
    }
  },

  _onResize() {
    this._attemptSetContainerSize()
  },

  _attemptSetContainerSize() {
    var {clientWidth:width, clientHeight:height} = React.findDOMNode(this.refs.container)
    if (width != null && height != null) {
      console.log('got width: ', width)
      console.log('got height: ', height)
      this.setState({containerWidth: Number(width), containerHeight: Number(height)})
      return true
    }
    return false
  },

  componentDidMount() {
    window.addEventListener('resize', this._onResize)

    if (this.state.containerWidth > -1) { return }
    this._interval = setInterval(() => {
      if (this._attemptSetContainerSize()) {
        clearInterval(this._interval)
      }
    }, 100)
  },

  componentWillUnmount() {
    clearInterval(this._interval)
    window.removeEventListener('resize', this._onResize)
  },

  handleSwipe(e) {
    if (this.state.isAnimating || !this.props.animate) { return }

    var direction = eventToDirectionMap[e.direction] || -1
    this.setState({
      isAnimating: true,
      direction: direction,
      currentTime: Date.now()
    })
    requestAnimationFrame(this.updateMovement)
  },

  onAnimationEnd() {
    console.log('animation is done, x is: ', this.state.x)
    this.setState({isAnimating:false, x:0})
    actions.nextLayerImage(this.state.direction * -1)
  },

  updateMovement() {
    var max = this.state.containerWidth
    var {delta, x, direction, currentTime, animDuration} = this.state
    var now = Date.now()
    delta = now - currentTime
    var fract = delta / animDuration
    var newX = (max * fract) * direction
    this.setState({x: newX})
    if (Math.abs(newX) > max) {
      this.onAnimationEnd(); return
    }
    // TODO Use time as well
    // these should be lin interp'd over a distance
    requestAnimationFrame(this.updateMovement)
  },

  render() {
    return (
      <Hammer onSwipe={this.handleSwipe}>
        <div className="canvas" ref="container">
          {this.props.layers
              .filter(layer => layer.get('isEnabled'))
              .map(layer => {
                return (
                  <LayerImageInline layer={layer}
                      key={layer.get('id')}
                      xOffset={this.state.x} />
                )
              })
          }
        </div>
      </Hammer>
    )
  }

})
