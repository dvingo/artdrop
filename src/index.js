import React from 'react';
import Router from 'react-router';
import router from './router';

router.run(Root => {
  React.render(<Root/>, document.getElementById("app"));
});
