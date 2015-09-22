import React from 'react';
import Router from 'react-router';
import router from 'router';
React.initializeTouchEvents(true)
router.run(Root => {
  React.render(<Root/>, document.getElementById("app"));
})
