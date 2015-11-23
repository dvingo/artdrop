import React from 'react'
import {Link} from 'react-router'
import {iconPath} from 'utils'
import Router from 'react-router'
import cn from 'classnames'

export default React.createClass({
  mixins: [Router.State, Router.Navigation],

  getInitialState () {
    return {
      active: false
    }
  },

  handleGoBack(e) {
    e.preventDefault()
    window.history.back()
  },

  _onHomePage() {
    return this.isActive('designs') ||
           this.isActive('/') ||
           this.isActive('admin')
  },

  handleDelete() {
    console.log("-- HANDLE.DELETE --")
    this.setState({
      active: true
    })
  },

  handleLeaveModal (e) {
    e.preventDefault()
    console.log("-- HANDLE.LEAVE.MODAL --")
    this.setState({
      active: false
    })
  },

  handleModal (state, e) {
    e.preventDefault()
    console.log("-- HANDLE.MODAL --")
    console.log(state)
    if (state) {
      console.log('-- TRANSITIONING.TO.DESIGNS --')
      this.transitionTo('designs')
    } else if (state === false){
      console.log(state)
    }
  },

  handleReset () {
    e.prevenDefault()
    console.log("-- HANDLE.RESET --")
    // this.handleModal()
  },

  render() {

    const NavModalContainer_classes = cn (
      'Nav-modal-container', {
        '--active': this.state.active
      }
    )

    return (
      <div className="Nav">
        <div className="Nav-container">
          <div className="Nav-left-side">
            {this._onHomePage() ?
              <Link to="designs" className="Nav-logo">
                <img className="Nav-button" src={iconPath('logo-white.png')}/>
              </Link>
            :
            [<img src={iconPath('cancel-x-white.svg')}
                         className="cancel-x Nav-button"
                         height={30} width={30}
                         onClick={this.handleDelete}/>,
             <img src={iconPath('back.svg')}
                  className="Nav-button"
                  height={30} width={30}
                  onClick={this.handleGoBack}/>,

              <img src={iconPath('refresh.svg')}
                   className="Nav-button"
                   height={30} width={30}
                   onClick={this.handleReset}/>]
            }
          </div>

          <div className="Nav-right-side">
            <div className="Nav-button">
              <img src={iconPath('share-icon.svg')} height={25} width={25}
                   style={{marginTop:4}}/>
            </div>
          </div>
        </div>
        <div className={NavModalContainer_classes} onClick={this.handleLeaveModal}>
            <span className="Nav-modal">
              <span>ARE YOU SURE YOU WANT TO QUIT THIS DESIGN?</span>
              <ul>
                <li onClick={this.handleModal.bind(null, true)}>YES</li>
                <li onClick={this.handleModal.bind(null, false)}>NO</li>
              </ul>
            </span>
        </div>
      </div>
    )
  }
})
