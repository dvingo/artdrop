module.exports = function() {
  injectStyle([
    '.ReactModal__Overlay {',
    '  background-color: rgba(50, 50, 50, 0.50);',
    '}',
    '.ReactModal__Content {',
    '  position: absolute;',
    // '  top: 40px;',
    // '  left: 40px;',
    // '  right: 40px;',
    // '  bottom: 40px;',
    '  width: 75%;',
    '  height: 90%;',
    '  max-width: 350px;',
    '  max-height: 500px;',
    '  border: 1px solid #ccc;',
    '  background: #fff;',
    '  overflow: auto;',
    '  -webkit-overflow-scrolling: touch;',
    '  border-radius: 4px;',
    '  outline: none;',
    '  padding: 7px;',
    '}',
    '@media (max-width: 768px) {',
    '  .ReactModal__Content {',
    // '    top: 10px;',
    // '    left: 10px;',
    // '    right: 10px;',
    // '    bottom: 10px;',
    // '    padding: 10px;',
    '  }',
    '}'
  ].join('\n'));
};

function injectStyle(css) {
  var style = document.getElementById('rackt-style');
  if (!style) {
    style = document.createElement('style');
    style.setAttribute('id', 'rackt-style');
    var head = document.getElementsByTagName('head')[0];
    head.insertBefore(style, head.firstChild);
  }
  style.innerHTML = style.innerHTML+'\n'+css;
}

