import React from 'react'
import Router from 'react-router'
import Design from '../Design/Design'
import reactor from '../../state/reactor'
import Store from '../../state/main'
import ColorPalette from '../ColorPalette'
import Immutable from 'Immutable'
import {imageUrlForLayerImage,imageUrlForSurface} from '../../state/utils'

export default React.createClass({
  mixins: [reactor.ReactMixin, Router.Navigation],

  getDataBindings() {
    return { designs: Store.getters.adminCreatedDesigns,
             tags: Store.getters.tags,
             tagsMap: ['tags']}
  },

  getInitialState() {
    return { selectedDesign: null,
             selectedTag: null,
             editMode: 'editDesign',
             selectedDesigns: Immutable.Set() }
  },

  componentWillMount() {
    this._interval = setInterval(() => {
      if (!reactor.__isDispatching) {
        clearInterval(this._interval)
        Store.actions.loadAdminCreatedDesigns()
        Store.actions.loadAdminTags()
      }
    }, 100)
  },

  componentWillUnmount() {
    clearInterval(this._interval)
  },

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.selectedTag && this.state.tags.count() > 0) {
      var selectedTag = this.state.tags.get(0)
      var newState = {selectedTag: selectedTag}
      if (selectedTag.get('designs') && selectedTag.get('designs').count() > 0) {
        newState.selectedDesigns = Immutable.Set(selectedTag.get('designs'))
      }
      this.setState(newState)
    }
    var tagsMap = this.state.tagsMap
    var selectedTag = this.state.selectedTag
    if (selectedTag && tagsMap.get(selectedTag.get('id'))
       && tagsMap.get(selectedTag.get('id')) !== selectedTag) {
      var updatedTag = tagsMap.get(selectedTag.get('id'))
      this.setState({selectedTag:updatedTag})
    }
  },

  clickDesign(design, e) {
    var designId = design.get('id')
    e.preventDefault()
    if (this.state.editMode === 'editDesign') {
      this.transitionTo('adminEditDesign', {designId: designId})
    } else {
      var selectedDesigns = this.state.selectedDesigns
      if (selectedDesigns.includes(designId)) {
        this.setState({selectedDesigns: selectedDesigns.remove(designId)})
      } else {
        this.setState({selectedDesigns: selectedDesigns.add(designId)})
      }
    }
  },

  handleAddDesignsToTag() {
    Store.actions.addDesignsToTag({tag: this.state.selectedTag,
                                   designs: this.state.selectedDesigns})
  },

  onFormChange(e) {
    this.setState({editMode: e.target.value})
  },

  handleTagChange(e) {
    var tag = this.state.tagsMap.get(e.target.value)
    var selectedDesigns = Immutable.Set(tag.get('designs'))
    this.setState({selectedTag:tag, selectedDesigns:selectedDesigns})
  },

  render() {
    var selectDivStyles = {
      width: '100%',
      height: '100%',
      background: '#262323',
      opacity: '0.8',
      position: 'absolute',
      top: '0',
      left: '0'
    }
    let designs = this.state.designs.map(d => {
      var overlayStyles = (
        (() => {
          if (this.state.editMode === 'editDesign') { return null }
          else if (this.state.selectedDesigns.includes(d.get('id'))) {
            return selectDivStyles }
          else { return null }
        }()))

      return (
        <li className="design" key={d.get('id')} style={{margin: 4}}>
          <Design design={d} onClick={this.clickDesign.bind(null, d)}/>
          <div style={overlayStyles} onClick={this.clickDesign.bind(null, d)}></div>
        </li>
      )
    })

    var tagOptions = this.state.tags.map(tag => {
      return (
        <option value={tag.get('id')}>{tag.get('name')}</option>
      )
    })

    var selectedTag = this.state.selectedTag ? this.state.selectedTag.get('id') : ''
    return (
      <div className="main">

        <form onChange={this.onFormChange}>
          <div>
            <label>Edit a design</label>
            <input type="radio" value="editDesign" name="editMode"
                   checked={this.state.editMode === 'editDesign'}/>
          </div>
          <div>
            <label>Group designs by tag</label>
            <input type="radio" value="groupDesignsByTag"
                   name="editMode" checked={this.state.editMode === 'groupDesignsByTag'}/>
          </div>
        </form>

        { this.state.editMode === 'groupDesignsByTag' ?
          <div style={{padding:'10px'}}>
            <select value={selectedTag} style={{width:'50%'}} onChange={this.handleTagChange}>
              {tagOptions}
            </select>
            <div style={{padding:'10px 0'}}>
              <button onClick={this.handleAddDesignsToTag}>Update Designs</button>
            </div>
          </div>
          : null }

        <ul className="designs">
          {designs}
        </ul>
        <Router.RouteHandler/>
      </div>
    )
  }
})
