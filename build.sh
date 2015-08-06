#!/bin/bash -

rm hosted-dir/bundle.js
export NODE_ENV=production
echo 'rsync -a app/images/icons/ hosted-dir/app/images/icons'
rsync -a app/images/icons/ hosted-dir/app/images/icons
echo 'webpack --config webpack.prod.config.js --progress'
webpack --config webpack.prod.config.js --progress
export NODE_ENV=dev
