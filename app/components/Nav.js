import React from 'react';
import {Link} from 'react-router';
import {iconPath} from '../utils';

export default React.createClass({
  render() {
    return (
      <div className="nav-bar">
        <Link to="designs" className="logo">
          <img src={iconPath('logo.png')}/>
        </Link>
        <ul className="right-icons">
          <li>
            <img src={iconPath('share-icon.svg')}/>
          </li>
          <li>
            <img src={iconPath('cart-icon.svg')}/>
          </li>
        </ul>
      </div>
    )
  }
})
