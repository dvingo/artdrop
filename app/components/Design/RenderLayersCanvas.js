import React from 'react'
import SVGInlineLayer  from '../SVGInlineLayer'
import {imageUrlForLayer, compositeImageUrlForLayer} from '../../state/utils'

export default React.createClass({

  getInitialState() {
    return {
      layersAsJpg: []
    }
  },

  setNewLayers() {
    var w = 400, h = 400;

    this.props.layers.forEach((l, index) => {
      var canvas = document.createElement('canvas')
      var ctx = canvas.getContext('2d')
      if (l.get('selectedLayerImage').has('compositeImageUrl')) {
        ctx.globalCompositeOperation = 'multiply'
        var img = new Image
        img.src = imageUrlForLayer(l)
        var self = this
        var layers;
        img.onload = () => {
          ctx.drawImage(img, 0, 0, w, h)
          var compImg = new Image
          compImg.src = compositeImageUrlForLayer(l)
          compImg.onload = () => {
            ctx.drawImage(compImg, 0, 0, w, h)
            layers = self.state.layersAsJpg
            layers[index] = canvas.toDataURL('image/jpeg', 1.0)
            self.setState({layersAsJpg:layers})
          }
        }
      } else {
        var img = new Image
        img.src = imageUrlForLayer(l)
        img.onload = () => ctx.drawImage(img, 0, 0, w, h)
        layers = this.state.layersAsJpg
        layers[index] = canvas.toDataURL('image/jpeg', 1.0)
        this.setState({layersAsJpg:layers})
      }
    })

  },

  componentWillReceiveProps() {
    this.setNewLayers()
  },

  componentDidUpdate() {
    var w = 400, h = 400;
    var canvas = React.findDOMNode(this.refs.canvas)
    var ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, w, h)
    this.state.layersAsJpg.forEach(l => {
      var i = new Image
      i.src = l
      ctx.drawImage(i, 0, 0, w, h)
    })
    ctx.globalCompositeOperation = "destination-over"
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, w, h)
  },

  render() {
    return (
      <div className="canvas">
        <canvas ref="canvas" width={400} height={400}></canvas>
      </div>
    )
  }
})
