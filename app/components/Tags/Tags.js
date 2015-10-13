import React from 'react'
import Router from 'react-router'
import reactor from 'state/reactor'
import Store from 'state/main'
import Immutable from 'Immutable'
var Set = Immutable.Set

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDefaultProps() {
    return {
      selectedTags: Immutable.List(),
      onRemoveTag: () => null,
      onAddTag: () => null
    }
  },

  getInitialState() {
    return { selectedTag: null }
  },

  getDataBindings() {
    return { tags: Store.getters.tags,
             tagsMap: ['tags']}
  },

  componentWillMount() {
    if (this.state.tags.count() === 0) {
      Store.actions.loadAdminTags()
    } else {
      this.setState({selectedTag: this.state.tags.get(0)})
    }
  },

  componentWillUpdate(nextProps, nextState) {
    if (this.state.selectedTag === null &&
        nextState.tags.count() > 0) {
          console.log('setting selected tag')
      this.setState({selectedTag: nextState.tags.get(0)})
    }
  },

  _nonSelectedTags() {
    return Set(this.state.tags).subtract(Set(this.props.selectedTags))
  },

  handleTagChange(e) {
    var tag = this.state.tagsMap.get(e.target.value)
    this.setState({selectedTag:tag})
  },

  onAddTag(e) {
    this.props.onAddTag(this.state.selectedTag)
  },

  render() {
    var tagOptions = this._nonSelectedTags().map(tag => {
      return (
        <option value={tag.get('id')}>{tag.get('name')}</option>
      )
    })

    var selectedTag = this.state.selectedTag ? this.state.selectedTag.get('id') : ''
    return (
      <div className="Tags">
        <p>list of selected tags will go here</p>
        <select value={selectedTag} style={{width:'50%'}} onChange={this.handleTagChange}>
          {tagOptions}
        </select>
        <div style={{padding:'10px 0'}}>
          <button onClick={this.onAddTag}>+</button>
        </div>
      </div>
    )
  }
})
