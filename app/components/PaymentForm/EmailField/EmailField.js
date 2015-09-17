import React from 'react'
import Router from 'react-router'
import RenderLayers from 'components/Design/RenderLayers/RenderLayers'
import reactor from 'state/reactor'
import Store from 'state/main'
import getters from 'state/getters'
import {iconPath} from 'utils'
var Route = Router.Route;

function isValidEmail(val) {
  var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,30}/i
  return re.test(val)
}

export default React.createClass({

  getInitialState() {
    return { value: '' }
  },

  handleChange(e) {
    this.setState({value: e.target.value})
  },

  checkIfValid() {
    if (isValidEmail(this.state.value)) {
      this.props.onChange(this.state.value)
    } else {
      this.props.onInvalidInput(this.state.value)
    }
  },

  render() {
    var currentDesign = reactor.evaluate(getters.currentDesign)
    if (currentDesign == null) { return null }

    var value = this.state.value;
    return (
      <input className="EmailField"
             name="email" type="email" value={this.state.value}
             onBlur={this.checkIfValid}
             placeholder={this.props.placeholder}
             onChange={this.handleChange}/>
    )
  }
});
