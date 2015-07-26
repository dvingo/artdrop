import React from 'react'
import Store from '../../../state/main'
import reactor from '../../../state/reactor'
import {imageUrlForLayerImage} from '../../../state/utils'
var classNames = require('classnames')

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return {layerImageOptions: Store.getters.layerImageOptions}
  },

  getInitialState() {
    return { liSize: 105,
             ulSize: 210 }
  },

  componentDidMount() {
    var self = this
    window.addEventListener('resize', () => self.forceUpdate())
    this.updateImageSizes(0)
  },

  componentWillMount() {
    if (this.props.layerId) {
      Store.actions.selectLayerId(this.props.layerId)
    }
  },

  currentUlSize() {
    var bodyWidth = document.body.clientWidth
    var bodyHeight = document.body.clientHeight
    var ul = React.findDOMNode(this.refs.ul)
    if (ul != null) {
      var isLandscape = (bodyWidth > 650 || bodyWidth > bodyHeight)
      return (isLandscape ? ul.clientWidth : ul.clientHeight)
    } else {
      return 200
     }
  },

  updateImageSizes(previousUlSize) {
    var ulSize = this.currentUlSize()
    if (previousUlSize !== ulSize) {
      this.setState({ulSize: ulSize, liSize: Number(((ulSize - 2) / 2).toFixed(0))})
    }
  },

  componentDidUpdate(prevProps, prevState) {
    this.updateImageSizes(prevState.ulSize)
  },

  selectLayerImage(layerImage) {
    Store.actions.selecteLayerImageId(layerImage.get('id'))
  },

  render() {
    if (this.state.layerImageOptions == null) return null
    var layerImages = this.state.layerImageOptions
        .filter(layerImage => layerImage)
        .map(layerImage => {
      return (
        <li onClick={this.selectLayerImage.bind(null, layerImage)}
            style={{height:this.state.liSize, width:this.state.liSize}}>
          <img src={imageUrlForLayerImage(layerImage)} height={this.state.liSize} width={this.state.liSize}/>
        </li>
      )
    })

    return (
      <section className={classNames('choose-art', {visible: this.props.isActive})}>
        <ul className="design-selection" ref="ul">
          {layerImages}
        </ul>
      </section>
    )
  }
})
