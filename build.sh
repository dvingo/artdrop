#!/bin/bash -

rm hosted-dir/bundle.js
export NODE_ENV=production
echo 'webpack --config webpack.prod.config.js --progress'
webpack --config webpack.prod.config.js --progress
export NODE_ENV=dev
