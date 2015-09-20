import React from 'react'
import classNames from 'classnames'
export default React.createClass({
  render() {
    var placeholder = this.props.placeholder || "Your email address"
    var errorMsg = this.props.errorMsg
    var hasError = errorMsg.length > 0
    var errorMessage = <span className="errorMsg">{errorMsg}</span>
    return (
      <span>
        {hasError ? errorMessage : null}
        <input className={classNames("EmailField",{error:hasError})}
          type="email"
          value={this.props.value}
          onBlur={this.props.onBlur}
          placeholder={placeholder}
          onChange={this.props.onChange}/>
      </span>
    )
  }
})
