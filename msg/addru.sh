#!/bin/bash

varmsg='Blockly.Msg.'
varlb='Blockly.Msg["'
varle='"] = "'
coma='"'
eq=' = '
end=';'

name=$1
rus=$2

ru=$varlb$name$varle$rus$coma$end;

echo $ru>>js/ru.js
