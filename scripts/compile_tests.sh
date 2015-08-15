#!/bin/bash -
watch=false
if [[ $# -eq 1 ]]; then
  watch=true
fi

echo 'Compiling tests: '
echo
command="webpack --config webpack.test.config.js --display-error-details --progress"
if [ $watch = 'true' ]; then
  command="$command --watch"
fi
printf "\t$command"
echo
echo
$command
echo
echo
