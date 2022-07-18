Blockly.Blocks['automation_is_defined'] = {
    init: function () {
        this.jsonInit({
            "message0": "%2%{BKY_LT_AUTOMATION_IS_DEF_DSCR}",
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
            'colour': '%{BKY_LT_CATEGORY_COLOUR_AUTOMATION}',
            "tooltip": "Is the device defined"
        });
        //appendShadowBlock(this, "VALUE", "illumination_dimer_brightness_value_helper");
        //appendShadowBlock(this, "TIME", "illumination_dimer_brightness_time_helper");
    },
    output: "Number"
};


Blockly.JavaScript['automation_is_defined'] = function (block) {
    // Search the text for a substring.
    var device = block.getFieldValue('DEVICE');

    var code = {
        before: "",
        gencode: "",
        after: "",
        global: ""
    };

    code.gencode = 'isDefined(' + device + ')';
    return JSON.stringify(code);
};
/* 
./scr.sh AUTOMATION_IS_DEF_DSCR "Is defined %1" "Определено %1"
*/
