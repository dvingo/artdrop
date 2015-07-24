import React from 'react';
import {Link} from 'react-router';
import {iconPath} from '../utils';
import Router from 'react-router'

export default React.createClass({
  mixins: [Router.State],

  handleGoBack(e) {
    e.preventDefault()
    var haveHistory = window.history.back()
  },

  render() {
    var onDesignEdit = (this.isActive('designEdit') || this.isActive('layerEdit'))

    return (
      <div className="nav-bar">

        <Link to="designs" className="logo">
          <img src={iconPath('logo-drop.png')} height={20} width={20}/>
        </Link>

        {onDesignEdit ? (
          <img src={iconPath('left-arrow.svg')}
            height={30} width={30}
            style={{margin: '0 20px 0 5px'}}
            onClick={this.handleGoBack}/> ) : null}

        {onDesignEdit ? (
           <span className="btn">Reset</span>) : null}

        <div className="right-icons">
          <div className="icon" style={{marginRight:20}}>
            <img src={iconPath('share-icon.svg')} height={20} width={20}
                 style={{marginTop:4}}/>
          </div>
          {onDesignEdit ? (
             <span className="price">$75</span>) : null}
          {onDesignEdit ? (
             <span className="btn">Buy</span>) : null}
        </div>

      </div>
    )
  }
})
