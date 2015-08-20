import React from 'react';
import {Link} from 'react-router';
import {iconPath} from '../utils';
import Router from 'react-router'

export default React.createClass({
  mixins: [Router.State],

  handleGoBack(e) {
    e.preventDefault()
    window.history.back()
  },

  render() {
    var onDesigns = (this.isActive('designs'))
    return (
      <div className="nav-bar ">
        <div className="nav-bar-container">

          <div className="left-side">
            <Link to="designs" className="logo">
              <img className="space" src={iconPath('drop.svg')} height={40} width={30}/>
            </Link>
            {onDesigns ? null:
              (<img src={iconPath('back.svg')}
                  className="space"
                  height={30} width={30}
                  onClick={this.handleGoBack}/>)
            }
            
            {onDesigns ? null:
              (<img src={iconPath('refresh.svg')}
                   className="space"
                   height={30} width={30}
                   onClick={this.handleReset}/>)
            }
          </div>

          <div className="right-side">
            <div className="space">
              <img src={iconPath('share-icon.svg')} height={25} width={25}
                   style={{marginTop:4}}/>
            </div>

            {onDesigns ? null:
              (<span className="space price">$75</span>)
            }

            {onDesigns ? null:
              (<img src={iconPath('buy.svg')}
                   className="buy"
                   height={50} width={70}
                   onClick={this.handleBuy}/>)
            }
          </div>
        </div>
      </div>
    )
  }
})
