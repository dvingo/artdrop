import React from 'react'
import classNames from 'classnames'
export default React.createClass({
  render() {
    var errorMsg = this.props.errorMsg
    var hasError = errorMsg.length > 0
    var errorMessage = <span className="errorMsg">{errorMsg}</span>
    return (
      <span>
        {hasError ? errorMessage : null}
        <label>City</label>
        <input className={classNames("CityField", {error:hasError})}
          placeholder="Anytown"
          type="text"
          onChange={this.props.onChange}
          value={this.props.value}
          onBlur={this.props.onBlur} />
      </span>
    )
  }
})
