#!/bin/bash -
echo 'Compiling tests: '
echo
command="webpack --config webpack.test.config.js --display-error-details --progress"
printf "\t$command"
echo
echo
$command
echo
echo
