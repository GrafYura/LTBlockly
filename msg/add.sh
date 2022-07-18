#!/bin/bash

varmsg='Blockly.Msg.'
varlb='Blockly.Msg["'
varle='"] = "'
coma='"'
eq=' = '
end=';'

name=$1
eng=$2
rus=$3

msg=$varmsg$name$eq$coma$eng$coma$end; 
en=$varlb$name$varle$eng$coma$end;
ru=$varlb$name$varle$rus$coma$end;

echo $msg>>messages.js
echo $en>>js/en.js
echo $ru>>js/ru.js
