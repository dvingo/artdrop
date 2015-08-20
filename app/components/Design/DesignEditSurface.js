import React from 'react'
import reactor from '../../state/reactor'
import Store from '../../state/main'

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return {design: Store.getters.currentDesign}
  },

  componentWillMount() {
    Store.actions.selectDesignId(this.props.params.designId)
  },

  render() {
    return (
      <div> Design Edit Surface </div>
    )
  }
})
