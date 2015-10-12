import React from 'react'
import reactor from 'state/reactor'
import Store from 'state/main'

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return { errors: Store.getters.errors }
  },

  handleClose(error, e) {
    e.preventDefault()
    Store.actions.removeError(error)
  },

  render() {
    var hasErrors = this.state.errors.count() > 0
    var errors = this.state.errors.map(e => {
      return (
        <p className="error">
          {e.get('message')}
          <span className="close" onClick={this.handleClose.bind(null, e)}>X</span>
        </p>
      )
    })

    return (hasErrors ?
        <div className="Errors">
          <div className="error-container">
            {errors}
          </div>
        </div> : null
    )
  }
})
