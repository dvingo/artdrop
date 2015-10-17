import React from 'react'
import Router from 'react-router'
import reactor from 'state/reactor'
import Store from 'state/main'
import Immutable from 'Immutable'
import Tag from 'components/Tag/Tag'
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
      this.setState({selectedTag: this._nonSelectedTags(this.state).first()})
    }
  },

  componentWillUpdate(nextProps, nextState) {
    if (this.state.selectedTag === null &&
        nextState.tags.count() > 0) {
          console.log('setting selected tag')
      this.setState({selectedTag: this._nonSelectedTags(nextState).first()})
    }
  },

  _nonSelectedTags(state) {
    return Set(state.tags).subtract(Set(this.props.selectedTags))
  },

  handleTagChange(e) {
    var tag = this.state.tagsMap.get(e.target.value)
    console.log('setting selected tag to: ', tag.toJS())
    this.setState({selectedTag:tag})
  },

  onAddTag(e) {
    this.props.onAddTag(this.state.selectedTag)
  },

  render() {
    console.log("nonSeelcted tags: ", this._nonSelectedTags(this.state).toJS())
    var tagOptions = this._nonSelectedTags(this.state).map(tag => {
      return (
        <option value={tag.get('id')}>{tag.get('name')}</option>
      )
    })
    console.log("tag options count: ", tagOptions.count())

    var selectedTagId = this.state.selectedTag ? this.state.selectedTag.get('id') : ''
    console.log("selectedTags: ", this.props.selectedTags.toJS())
    var tags = this.props.selectedTags.map(tag => {
      return <Tag tag={tag} onRemoveTag={this.props.onRemoveTag.bind(null, tag)}/>
    })
    return (
      <div className="Tags">
        <p>list of selected tags will go here</p>
        <div>
          {tags}
        </div>
        { tagOptions.count() > 0 ?
          <select value={selectedTagId} style={{width:'50%'}} onChange={this.handleTagChange}>
            {tagOptions}
          </select>
          : null
        }
        { tagOptions.count() > 0 ?
          <div style={{padding:'10px 0'}}>
            <button onClick={this.onAddTag}>+</button>
          </div>
          : null
        }
      </div>
    )
  }
})
