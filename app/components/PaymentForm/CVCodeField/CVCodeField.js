import React from 'react'
import classNames from 'classnames'
export default React.createClass({

  onChange(e) {
    var val = e.target.value.substr(0, 7).replace(/[^0-9]/g, '')
    this.props.onChange({target: {value: val}})
  },

  render() {
    var errorMsg = this.props.errorMsg
    var hasError = errorMsg.length > 0
    var errorMessage = <span className="errorMsg">{errorMsg}</span>
    return (
      <span>
        {hasError ? errorMessage : null}
        <label>CV Code</label>
        <input className={classNames("CVCodeField cv_code",{error:hasError})}
          autoComplete="off"
          maxLength="4"
          pattern="\d*"
          placeholder="123"
          type="tel"
          onChange={this.onChange}
          value={this.props.value}
          onBlur={this.props.onBlur} />
      </span>
    )
  }
})
