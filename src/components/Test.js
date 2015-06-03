import React from 'react';
import Modal from './Modal';
import reactor from '../state/reactor';
import State from '../state/main';
var appElement = document.getElementById('app');
Modal.setAppElement(appElement);
Modal.injectCSS();

export default React.createClass({
  render: function() {
    return (
      <Modal isOpen={true}>
        <section className="show-design">
          <div className="show-canvas">
            <div className="canvas">
              <h1>TEST HERE</h1>
            </div>
          </div>
        </section>
      </Modal>
    );
  }
})
