import React from 'react'
import {Link} from 'react-router'
import {iconPath} from 'utils'
import Router from 'react-router'
import cn from 'classnames'
import { FacebookButton, TwitterButton, PinterestButton } from 'react-social'

export default React.createClass({
  mixins: [Router.State, Router.Navigation],

  getInitialState () {
    return {
      modalActive: false,
      deleteActive: false,
      resetActive: false,
      shareActive: false
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

  handleLeaveModal (e) {
    e.preventDefault()
    console.log("-- HANDLE.LEAVE.MODAL --")
    this.setState({
      modalActive: false,
      deleteActive: false,
      resetActive: false,
      shareActive: false
    })
  },

  handleDelete() {
    console.log("-- HANDLE.DELETE --")
    this.setState({
      modalActive: true,
      deleteActive: true
    })
  },

  handleReset (e) {
    e.preventDefault()
    console.log("-- HANDLE.RESET --")
    this.setState({
      modalActive: true,
      resetActive: true
    })
  },

  handleShare (e) {
    e.preventDefault()
    console.log("-- HANDLE.SHARE --")
    this.setState({
      modalActive: true,
      shareActive: true
    })
  },

  render() {
    let {modalActive, deleteActive, resetActive, shareActive} = this.state
    const url = "https://www.artdrop.it"

    const NavModalContainer_classes = cn (
      'Nav-modal-container', {
        '--active': modalActive
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
                         onClick={this.handleDelete}/>,
             <img src={iconPath('back.svg')}
                  className="Nav-button"
                  onClick={this.handleGoBack}/>,

              <img src={iconPath('refresh.svg')}
                   className="Nav-button"
                   onClick={this.handleReset}/>]
            }
          </div>

          <div className="Nav-right-side">
            <div className="Nav-button share">
              <img src={iconPath('share-icon.svg')}
                   onClick={this.handleShare}/>
            </div>
          </div>
        </div>
        <div className={NavModalContainer_classes} onClick={this.handleLeaveModal}>
            { this.state.deleteActive ?
              <span className="Nav-modal-delete">
                <span>Are you sure you want to delete this design?</span>
                <ul>
                  <li onClick={this.handleModal.bind(null, true)}>YES</li>
                  <li onClick={this.handleModal.bind(null, false)}>NO</li>
                </ul>
              </span>: null}

            { this.state.resetActive ?
              <span className="Nav-modal-reset">
                <span>Are you sure you want to reset this design?</span>
                <ul>
                  <li onClick={this.handleModal.bind(null, true)}>YES</li>
                  <li onClick={this.handleModal.bind(null, false)}>NO</li>
                </ul>
              </span>: null}

            { this.state.shareActive ?
              <span className="Nav-modal-share">
                <span>Share Artdrop with your network</span>
                <ul>
                  <FacebookButton url={url}>Facebook</FacebookButton>
                  <TwitterButton url={url}>Twitter</TwitterButton>
                  <PinterestButton url={url}>Pinterest</PinterestButton>
                </ul>
              </span>: null}
        </div>
      </div>
    )
  }
})
