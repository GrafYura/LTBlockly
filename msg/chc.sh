#!/bin/bash

file1='messages.js'
file2='js/en.js'
arg=$2
key=$1

./chm.sh $key $arg $file1
./che.sh $key $arg $file2



