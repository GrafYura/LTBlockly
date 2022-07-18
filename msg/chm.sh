#!/bin/bash

file=$3
arg=$2
key=$1

str=$(awk -v var=$key '$0 ~ var {print $0}' $file)
str1=$(awk -v var=$key '$0 ~ var {print $1}' $file)

res=${str1}' = "'${arg}'";'
sed -i "s/${str}/${res}/g" $file



