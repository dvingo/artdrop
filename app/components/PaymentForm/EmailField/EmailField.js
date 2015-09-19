import React from 'react'
import Router from 'react-router'
import RenderLayers from 'components/Design/RenderLayers/RenderLayers'
import reactor from 'state/reactor'
import Store from 'state/main'
import getters from 'state/getters'
import {iconPath} from 'utils'
import classNames from 'classnames'
var Route = Router.Route;

function isValidEmail(val) {
  var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,30}/i
  return re.test(val)
}

export default React.createClass({

  getInitialState() {
    return { hasError: false, errorMsg: ''}
  },

  checkIfValid() {
    if (this.props.value.length === 0) {
      this.setState({hasError:true, errorMsg:'You must provide an email'})
    } else if (!isValidEmail(this.props.value)) {
      this.setState({hasError:true, errorMsg:'The email you entered is invalid'})
    } else {
      this.setState({hasError:false, errorMsg:''})
    }
  },

  onChange(e) {
    // Todo when you type you should remove any errors, then onBlur will check again.
    // Otherwise the message will still be there while you're fixing it.
    this.props.onChange(e)
  },

  render() {
    var value = this.state.value;
    var placeholder = this.props.placeholder || "Your email address"
    var errorMessage = <span className="errorMsg">{this.state.errorMsg}</span>
    var inputField = (
      <input className={classNames("EmailField",{error:this.state.hasError})}
               type="email"
               value={this.props.value}
               onBlur={this.checkIfValid}
               placeholder={placeholder}
               onChange={this.onChange}/>)
    return (
      <span>
        {this.state.hasError ? errorMessage : null}
        {inputField}
      </span>
    )
  }
})
