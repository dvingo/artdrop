import React from 'react'
import classNames from 'classnames'

export default React.createClass({

  getInitialState() {
    return {hasError: false, errorMsg: ''}
  },

  handleChange(e) {
    this.props.onChange(e)
    //this.setState({value: e.target.value})
  },

  checkIfValid() {
    if (this.props.value.length === 0) {
      this.setState({hasError:true, errorMsg: 'You must enter an address'})
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
        <label>Address</label>
        <input className={classNames("AddressField", {error:this.state.hasError})}
          placeholder="123 Fake Street Apt 2" type="text"
          onChange={this.handleChange}
          value={this.props.value}
          onBlur={this.checkIfValid} />
      </span>
    )
  }
})
