/**
 * Print registers
 */

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// BLOCKS //////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

/**
 * Modbus
 */


/**
 * Modbus take
 */

Blockly.Blocks['weather'] = {
    init: function () {
        this.jsonInit({
            "message0": "%2 %{BKY_LT_OTHER_WEATHER1}: %1",
            "args0": [{
                "type": "field_dropdown",
                "name": "ACT",
                "options": [["%{BKY_LT_OTHER_WEATHER1}", "1"],
                    ["%{BKY_LT_OTHER_WEATHER2}", "2"],
                    ["%{BKY_LT_OTHER_WEATHER3}", "3"],
                    ["%{BKY_LT_OTHER_WEATHER4}", "4"],
                    ["%{BKY_LT_OTHER_WEATHER5}", "5"],
                    ["%{BKY_LT_OTHER_WEATHER6}", "6"],
                    ["%{BKY_LT_OTHER_WEATHER7}", "7"],
                    ["%{BKY_LT_OTHER_WEATHER8}", "8"],
                    ["%{BKY_LT_OTHER_WEATHER9}", "9"],
                    ["%{BKY_LT_OTHER_WEATHER10}", "10"],
                    ["%{BKY_LT_OTHER_WEATHER11}", "11"]
                ]
            },
            {
                "type": "field_image",
                "src": "js/blockly/img/other/weather.png",
                "width": 16,
                "height": 16,
                "alt": "*"
            }
            ],
            'colour': '%{BKY_LT_CATEGORY_COLOUR_OTHER}',
            "tooltip": "Returns weather data.\nWeather = weather index.\nSunrise/Sunset in minutes",
            "output": "Number"
        });
        this.appendDummyInput('BYTE')
            .appendField('Byte: ')
            .appendField(new Blockly.FieldNumber(0, 0, 255), 'BYTE')
            .setVisible(false);

    }

};
//
//
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// GENCODE /////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

/**
 * Modbus take
 */

Blockly.JavaScript['weather'] = function (block) {
    var act = block.getFieldValue('ACT');

    var code = {
        before: "",
        gencode: "",
        after: "",
        global: ""
    };
    var varname = bloclyGenerateVariableName();
    switch (act) {
        case '1':
            code.before="\nu8 "+varname+"[9];";
            code.before += '\ngetStatus(999:9, &'+varname+');';
            code.gencode = varname+'[0]';
            break;
        case '2':
            code.before="\nu8 "+varname+"[9];";
            code.before += '\ngetStatus(999:9, &'+varname+');';
            code.gencode = varname+'[1]';
            break;
        case '3':
            code.before="\nu8 "+varname+"[9];";
            code.before +='\ngetStatus(999:9, &'+varname+');';
            var varname2 = bloclyGenerateVariableName();
            code.before +="\nu8 "+varname2+" = ("+varname+"[2]>127)?("+varname+"[2]-256):"+varname+"[2];";
            code.gencode = varname2;
            break;
        case '4':
            code.before="\n u8 "+varname+"[9];";
            code.before +='\ngetStatus(999:9, &'+varname+');';
            var varname2 = bloclyGenerateVariableName();
            code.before +="\nu16 "+varname2+" = "+varname+"[3]+("+varname+"[4]<<8);";
            code.gencode = varname2;
            break;
        case '5':
            code.before="\nu8 "+varname+"[9];";
            code.before += '\ngetStatus(999:9, &'+varname+');';
            code.gencode = varname+'[6]';
            break;
        case '6':
            code.before="\n u8 "+varname+"[9];";
            code.before +='\ngetStatus(999:9, &'+varname+');';
            var varname2 = bloclyGenerateVariableName();
            code.before +="\nu16 "+varname2+" = "+varname+"[7]+("+varname+"[8]<<8);";
            code.gencode = varname2;
            break;
        case '7':
            code.before="\nu8 "+varname+"[2];";
            code.before += '\ngetStatus(999:1, &'+varname+');';
            code.gencode = varname+'[1]';
            break;
        case '8':
            code.before="\n u8 "+varname+"[4];";
            code.before +='\ngetStatus(999:10, &'+varname+');';
            var varname2 = bloclyGenerateVariableName();
            code.before +="\nu16 "+varname2+" = "+varname+"[0]+("+varname+"[1]<<8);";
            code.gencode = varname2;
            break;
        case '9':
            code.before="\n u8 "+varname+"[4];";
            code.before +='\ngetStatus(999:10, &'+varname+');';
            var varname2 = bloclyGenerateVariableName();
            code.before +="\nu16 "+varname2+" = "+varname+"[2]+("+varname+"[3]<<8);";
            code.gencode = varname2;
            break;
        case '10':
            var varname2 = bloclyGenerateVariableName();
            var bool = bloclyGenerateVariableName();
            code.before="\nu8 "+varname+";";
            code.before+="\nu8 "+bool+"=0;";
            code.before+='\ngetStatus(999:9, &'+varname+');';
            code.before+="\nu8 "+varname2+"[18] = {3,4,5,6,9,10,11,12,14,18,35,37,38,39,40,42,45,47};";
            code.before+="\nfor(u8 i=0;i<18;++i){";
            code.before+="\nif("+varname2+"[i]=="+varname+"){";
            code.before+="\n"+bool+"=1;\ni=18;\n}\n}";
            code.gencode = bool;
            break;
        case '11':
            var varname2 = bloclyGenerateVariableName();
            var bool = bloclyGenerateVariableName();
            code.before="\nu8 "+varname+";";
            code.before+="\nu8 "+bool+"=0;";
            code.before+='\ngetStatus(999:9, &'+varname+');';
            code.before+="\nu8 "+varname2+"[16] = {5,6,7,8,10,13,14,16,17,18,25,35,41,42,43,46};";
            code.before+="\nfor(u8 i=0;i<16;++i){";
            code.before+="\nif("+varname2+"[i]=="+varname+"){";
            code.before+="\n"+bool+"=1;\ni=16;\n}\n}";
            code.gencode = bool;
            break;
        default:
            break;
    }

    return JSON.stringify(code);
};