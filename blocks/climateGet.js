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

Blockly.Blocks['climate_get'] = {
    init: function () {
        this.jsonInit({
            "message0": "%3 %{BKY_LT_OTHER_CCGET}",
            "args0": [{
                    "type": "field_dropdown",
                    "name": "DEVICE",
                    "options": blocklyDeviceOptions.bind(this, ["climate-control"])
                },
                {"type": "field_dropdown",
                "name": "ACT",
                "options": [["%{BKY_LT_OTHER_CCGET1}", "1"],
                ["%{BKY_LT_OTHER_CCGET2}", "2"],
                ["%{BKY_LT_OTHER_CCGET3}", "3"],
                ["%{BKY_LT_OTHER_CCGET4}", "4"],
                ["%{BKY_LT_OTHER_CCGET5}", "5"],
                ["%{BKY_LT_OTHER_CCGET6}", "6"],
                ["%{BKY_LT_OTHER_CCGET7}", "7"],
                ["%{BKY_LT_OTHER_CCGET8}", "8"],
                ["%{BKY_LT_OTHER_CCGET9}", "9"],
                ["%{BKY_LT_OTHER_CCGET10}", "10"],
                ["%{BKY_LT_OTHER_CCGET11}", "11"],
                ["%{BKY_LT_OTHER_CCGET12}", "12"],
                ["%{BKY_LT_OTHER_CCGET13}", "13"],
                ["%{BKY_LT_OTHER_CCGET14}", "14"],
                ["%{BKY_LT_OTHER_CCGET15}", "15"]
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

Blockly.JavaScript['climate_get'] = function (block) {
    var act = block.getFieldValue('ACT');
    var device = block.getFieldValue("DEVICE");
    var code = {
        before: "",
        gencode: "",
        after: "",
        global: ""
    };
    var varname = bloclyGenerateVariableName();
    //code.before="\nu8 "+varname+"[25];";
    //code.before += '\ngetStatus('+device+', &'+varname+');';
    switch (act) {
        case '1':
            code.gencode = '['+device+'.0]&1';
            break;
        case '2':
            code.gencode = '((['+device+'.2]>127)?(-1*(255-['+device+'.2]+1)):['+device+'.2])';
            break;
        case '3':
            code.gencode = '((['+device+'.3]>127)?(-1*(255-['+device+'.3]+1)):['+device+'.3])';
            break;
        case '4':
            code.gencode = '((['+device+'.4]>127)?(-1*(255-['+device+'.4]+1)):['+device+'.4])';
            break;
        case '5':
            code.gencode = '((['+device+'.5]>127)?(-1*(255-['+device+'.5]+1)):['+device+'.5])';
            break;
        case '6':
            code.gencode = '(['+device+'.7])';
            break;
        case '7':
            code.gencode = '(['+device+'.9])';
            break;
        case '8':
            code.gencode = '(['+device+'.11])';
            break;
        case '9':
            code.gencode = '(['+device+'.13])';
            break;
        case '10':
            code.gencode = '((['+device+'.15]<<8) + ['+device+'.14])';
            break;
        case '11':
            code.gencode = '(['+device+'.17])';
            break;
        case '12':
            code.gencode = '((['+device+'.19]>127)?(-1*(255-['+device+'.19]+2)):['+device+'.19])';
            break;
        case '13':
            code.gencode = '(['+device+'.21])';
            break;
        case '14':
            code.gencode = '((['+device+'.23]<<8) + ['+device+'.22])';
            break;
        case '15':
            code.gencode = '((['+device+'.25]>127)?(-1*(255-['+device+'.25]+2)):['+device+'.25])';
            break;
        default:
            break;
    }

    return JSON.stringify(code);
};