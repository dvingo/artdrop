#!/bin/bash -

rm hosted-dir/bundle.js
echo 'webpack --config webpack.prod.config.js --progress'
webpack --config webpack.prod.config.js --progress
