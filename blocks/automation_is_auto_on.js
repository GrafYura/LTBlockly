Blockly.Blocks['automation_is_auto_on'] = {
    init: function () {
        this.jsonInit({
            "message0": "%2%{BKY_LT_AUTOMATION_IS_ON_DSCR}",
            "args0": [
                {
                    "type": "field_dropdown",
                    "name": "DEVICE",
                    "options": blocklyDeviceOptions.bind(this)
                },
                {
                    "type": "field_image",
                    "src": "js/blockly/img/automation/automation.png",
                    "width": 16,
                    "height": 16,
                    "alt": "*"
                }
            ],
            "output": "Number",
            "colour": '%{BKY_LT_CATEGORY_COLOUR_AUTOMATION}',
            "tooltip": "Checks if an automation is turned on, 0 is turned off, another number is turned on"
        });
    },
    output: "Number"
};


Blockly.JavaScript['automation_is_auto_on'] = function (block) {
    // Search the text for a substring.
    var device = block.getFieldValue('DEVICE');  
    var scriptId=getScriptId();
    var expr = new RegExp("([0-9]+):([0-9]+)");
    var deviceParsed = expr.exec(device);
    var code = {
        before: "",
        gencode: "",
        after: "",
        global: ""
    };
    if(scriptId == deviceParsed[1])
    {
        code.gencode = 'isAutoOn(' + expr.exec(device)[2] + ')';
    }
    else
    {
        var stt = bloclyGenerateVariableName();
        var sttOfRgb = bloclyGenerateVariableName();
        code.before += "u8 "+stt+";\n u16 "+sttOfRgb+";\n"+sttOfRgb+" = getStatus("+device+", &"+stt+");"
        code.gencode = '('+stt+'&8)>>3';

    }
    return JSON.stringify(code);
};
 /* 
./scr.sh AUTOMATION_IS_ON_DSCR "Is automation turned on %1" "Включена ли автоматизация %1"
*/
