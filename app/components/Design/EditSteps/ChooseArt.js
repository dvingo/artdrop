import React from 'react'
import State from '../../../state/main'
var classNames = require('classnames')

export default React.createClass({
  render() {
    //var layerImages = this.props.design.getIn(['layers', 'layerImages']).map(layerImage => {
      //return null
      //return <img src={layerImage.get('imageUrl')}/>
    //})
    return (
      <section className={classNames('choose-art', {visible: false})}>
        <ul className="design-selection">
        </ul>
      </section>
    )
  }
})
