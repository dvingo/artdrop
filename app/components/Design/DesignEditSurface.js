import React from 'react'
import reactor from '../../state/reactor'
import Store from '../../state/main'
import {imageUrlForSurface} from '../../state/utils'
import SurfaceImage from './SurfaceImage'
import RenderLayers from './RenderLayers'
var Set = require('nuclear-js').Immutable.Set
var Map = require('nuclear-js').Immutable.Map
var classNames = require('classnames')

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return {
      design: Store.getters.currentDesign,
      surfaces: Store.getters.surfaces
    }
  },

  componentWillMount() {
    Store.actions.selectDesignId(this.props.params.designId)
    Store.actions.loadCurrentDesignEditResources()
  },

  transitionToBuyPage() {
    console.log('transition to buy page')
  },

  selectSurface(surface) {
    Store.actions.selectSurface(surface)
  },

  setSizeOnSurfaceOption(option) {
    var units = option.get('units')
    var height = option.get('height')
    var width = option.get('width')
    var depth = option.get('depth')
    if (!(height && width)) {
      return option
    }
    if (depth) {
      return option.set('size: height, width, depth', `${height} x ${width} x ${depth} ${units}`)
    }
    return option.set('size: height, width', `${height} x ${width} ${units}`)
  },

  render() {
    var design = this.state.design
    if (!(design && this.state.surfaces && typeof design.get('surfaceOption') === 'object')) { return null }

    var surface = design.get('surface')
    console.log('SELECTED SURFACE: ', surface.toJS())
    var surfaces = this.state.surfaces.map(s => {
      console.log('surface type: ', s.get("type"))
      return <SurfaceImage surface={s} currentSurface={surface}
                           onClick={this.selectSurface.bind(null, s)}
                           key={s.get('id')}/>
    })
    var surfaceOption = this.setSizeOnSurfaceOption(design.get('surfaceOption'))
    var surfaceOptionPrice = design.getIn(['surfaceOption', 'salePrice']) / 100
    var surfaceOptions = surface.get('options')
    surfaceOptions = surfaceOptions.map(this.setSizeOnSurfaceOption)

    console.log('surface option: ', surfaceOption.toJS())
    console.log('ALL options: ', surfaceOptions.toJS())
    var nonOptionKeys = Set.of('id', 'printingPrice', 'salePrice', 'units', 'vendorId', 'height',
        'width', 'depth')
    console.log('non options: ', nonOptionKeys.toJS())
    var allOptionsSet = Set.fromKeys(surfaceOption)
    var optionKeys = allOptionsSet.subtract(nonOptionKeys).toJS()
    console.log('selectable option: set ', optionKeys)

    var keyToValuesMap = optionKeys.reduce((retVal, key) => {
      var index = optionKeys.indexOf(key)
      var values = surfaceOptions.reduce((retSet, o) => {
        var propsToFilterWith = optionKeys.slice(0, index)
        if (propsToFilterWith.every(prop => o.get(prop) === surfaceOption.get(prop))) {
          return retSet.add(o.get(key))
        }
        return retSet
      }, Set())
      return retVal.set(key, values.toList())
    }, Map())

    console.log('key to values map: ', keyToValuesMap.toJS())
    var selectBoxes = keyToValuesMap.keySeq().map(key => {
      return (
        <div key={key}>
          <span>{key}</span>
          <select value={surfaceOption.get(key)}>
            {keyToValuesMap.get(key).sort().map(value => {
              return <option value={value}>{value}</option>
            })}
          </select>
        </div>
      )
    })

    return (
      <section className="main design-edit">

        <div className="edit-ui">

          <div className="edit-ui-top surface-details">
            <div className="left">
              {selectBoxes}
              <div>
                <p style={{fontWeight:'bold'}}>{surface.get('name')}</p>
                <span style={{fontSize:'0.7em'}}>{surface.get('description')}</span>
              </div>
            </div>
            <div className="right">
              <img src={surface.get('imageUrl')} height={200}/>
            </div>
          </div>

          <div className="edit-ui-mid">
            <span style={{fontSize:'3em', color:'#fff'}}>${surfaceOptionPrice}</span>
            <button className="button" onClick={this.transitionToBuyPage}>Buy it!</button>
          </div>

          <div className="edit-ui-bottom">
            {surfaces}
          </div>

        </div>

      </section>
    )
  }
})
