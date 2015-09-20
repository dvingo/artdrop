import React from 'react'
import classNames from 'classnames'

export default React.createClass({

  getInitialState() {
    return { hasError: false, errorMsg: ''}
  },

  checkIfValid() {
    if (this.props.value.length === 0) {
      this.setState({hasError:true, errorMsg:'You must provide a name'})
    } else {
      this.setState({hasError:false, errorMsg:''})
    }
    this.props.onBlur()
  },

  render() {
    var errorMessage = <span className="errorMsg">{this.state.errorMsg}</span>
    return (
      <span>
        {this.state.hasError ? errorMessage : null}
        <label>Full Name</label>
        <input className={classNames("NameField", {error:this.state.hasError})}
          placeholder="John McCarthy" type="text"
          onChange={this.props.onChange}
          value={this.props.value}
          onBlur={this.checkIfValid} />
      </span>
    )
  }
})
