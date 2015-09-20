import React from 'react'
import classNames from 'classnames'

export default React.createClass({

  getInitialState() {
    return {hasError: false, errorMsg: ''}
  },

  checkIfValid() {
    if (this.props.value.length === 0) {
      this.setState({hasError:true, errorMsg:'You must enter a city'})
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
        <label>City</label>
        <input className={classNames("CityField", {error:this.state.hasError})}
          placeholder="Anytown" type="text"
          onChange={this.props.onChange}
          value={this.props.value}
          onBlur={this.checkIfValid} />
      </span>
    )
  }
})
