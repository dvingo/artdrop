import React from 'react';
import Router from 'react-router';
import s from '../styles/main.scss';
import {iconPath} from '../utils';

export default React.createClass({
  render() {
    return (
      <div>
        <div className="nav-bar">
          <span>
            <img src={iconPath('logo.png')}/>
          </span>
          <ul>
            <li>
              <img src={iconPath('home-icon.svg')}/>
            </li>
            <li>
              <img src={iconPath('share-icon.svg')}/>
            </li>
            <li>
              <img src={iconPath('cart-icon.svg')}/>
            </li>
          </ul>
        </div>
        <Router.RouteHandler/>
      </div>
    );
  }
})
