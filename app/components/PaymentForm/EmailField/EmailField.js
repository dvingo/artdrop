import React from 'react'
import classNames from 'classnames'
import {isValidEmail} from 'utils'

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
    this.props.onBlur()
  },

  onChange(e) {
    // Todo when you type you should remove any errors, then onBlur will check again.
    // Otherwise the message will still be there while you're fixing it.
    this.props.onChange(e)
  },

  render() {
    var placeholder = this.props.placeholder || "Your email address"
    var errorMessage = <span className="errorMsg">{this.state.errorMsg}</span>
    return (
      <span>
        {this.state.hasError ? errorMessage : null}
        <input className={classNames("EmailField",{error:this.state.hasError})}
          type="email"
          value={this.props.value}
          onBlur={this.checkIfValid}
          placeholder={placeholder}
          onChange={this.onChange}/>
      </span>
    )
  }
})
