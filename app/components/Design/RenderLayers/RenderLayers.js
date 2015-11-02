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
      direction: 1
    }
  },

  handleSwipe(e) {
    if (this.state.isAnimating || !this.props.animate) { return }
    var direction = eventToDirectionMap[e.direction] || -1
    this.setState({isAnimating:true, direction:direction})
    requestAnimationFrame(this.updateMovement)
  },

  onAnimationEnd() {
    this.setState({isAnimating:false, x:0})
    actions.nextLayerImage(this.state.direction * -1)
  },

  updateMovement() {
    var max = 200
    var {delta, x, direction} = this.state
    if (Math.abs(x) > max) {
      this.onAnimationEnd(); return
    }
    // TODO Use time as well
    // these should be lin interp'd over a distance
    var newX = (Math.abs(x) + delta) * direction
    requestAnimationFrame(this.updateMovement)
    this.setState({x: newX})
  },

  render() {
    return (
      <Hammer onSwipe={this.handleSwipe}>
        <div className="canvas">
          {this.props.layers
              .filter(layer => layer.get('isEnabled'))
              .map((layer) => {
                return (
                  <LayerImageInline layer={layer}
                      key={layer.get('id')}
                      xOffset={this.state.x}
                      isAnimating={this.state.isAnimating}/>
                )
              })
          }
        </div>
      </Hammer>
    )
  }

})
