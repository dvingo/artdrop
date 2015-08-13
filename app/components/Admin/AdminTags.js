import React from 'react'
import Router from 'react-router'
import reactor from '../../state/reactor'
import Store from '../../state/main'

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return { tags: Store.getters.tags,
             errors: ['errors'] }
  },

 getInitialState() {
   return { newTagName: '' }
 },

  componentWillMount() {
    this._interval = setInterval(() => {
      if (!reactor.__isDispatching) {
        clearInterval(this._interval)
        Store.actions.loadAdminTags()
      }
    }, 10)
  },

  componentWillUnmount() {
    clearInterval(this._interval)
  },

  handleNewTagNameChange(e) {
    this.setState({newTagName: e.target.value})
  },

  handleCreateTag(e) {
    e.preventDefault()
    Store.actions.createTag(this.state.newTagName)
  },

  render() {
    var tags = this.state.tags.map(tag => {
      return <p>{tag.get('name')}</p>
    })
    var createTagForm = (
      <div>
        <h2>Create a tag</h2>
        <form onSubmit={this.handleCreateTag}>
          <label>Tag Name</label>
          <input type="text" onChange={this.handleNewTagNameChange}/>
          <input type="submit"/>
        </form>
      </div>
    )
    return (
      <div style={{padding: '10px 20px'}}>
        {createTagForm}
        <h2>Tags</h2>
        {tags}
      </div>
    )
  }
})
