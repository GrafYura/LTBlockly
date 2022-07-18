function onAutomationEdit(block) {
    var type = block.getFieldValue('ACT');
    if (type > 0) {
        if (!block.getInput('TIME')) {
            block.appendDummyInput('TIME')
                .appendField('Time:')
                .appendField(new Blockly.FieldNumber(10), 'TIME')
                //    .appendField('Time type:')
                .appendField(new Blockly.FieldDropdown([
                    ['Minutes', '60'],
                    ['Seconds', '1']
                ]), 'TIME_TYPE');
        }
    }
    else {
        if (block.getInput('TIME')) {
            block.removeInput('TIME');
        }
    }
    block.render();
}

function onAutomationEventsChange(event) {
    if (event.type == Blockly.Events.CHANGE) {
        var block = Blockly.getMainWorkspace().getBlockById(event.blockId);

        if (block) {
            if (block.type == 'automation_turns_on')
                onAutomationEdit(block);
            else {
                Blockly.getMainWorkspace().getAllBlocks().forEach(element => {
                    if (element.type == 'automation_turns_on') {
                        onAutomationEdit(element);
                    }
                });
            }
        }
    }
}
 
Blockly.Blocks['automation_turns_on'] = {
    init: function () {
        this.jsonInit({
            "message0": "%3%{BKY_LT_HEATING_DEVICE} %1 %{BKY_LT_TEXT_SPRINTF_TYPE_ONOFF}: %2",
            "args0": [
                {
                    "type": "field_dropdown",
                    "name": "DEVICE",
                    "options": blocklyDeviceOptions.bind(this, ["dimer-lamp", "dimmer-lamp", "rgb-lamp", "lamp", "script", "valve", "light-scheme", "jalousie", "gate", "speaker"])
                },
                {
                    "type": "field_dropdown",
                    "name": "ACT",
                    "options": [["%{BKY_LT_OTHER_ON}", "0"],
                    ["%{BKY_LT_OTHER_OFF}", "-1"],
                    ["Off temporarily", "1"]]
                },
                {
                    "type": "field_image",
                    "src": "js/blockly/img/automation/automation.png",
                    "width": 16,
                    "height": 16,
                    "alt": "*"
                }
            ],
            "previousStatement": null,
            "nextStatement": null,
            'colour': '%{BKY_LT_CATEGORY_COLOUR_AUTOMATION}',
            "tooltip": "Enable or disable automation on the device"
        });
        this.appendDummyInput('TIME')
            .appendField('Time:')
            .appendField(new Blockly.FieldNumber(10), 'TIME')
            //    .appendField('Time type:')
            .appendField(new Blockly.FieldDropdown([
                ['Minutes', '60'],
                ['Seconds', '1']
            ]), 'TIME_TYPE');
        if (this.workspace != Blockly.getMainWorkspace())
            this.removeInput('TIME');
        setTimeout(onAutomationEdit, 100, this);
        //appendShadowBlock(this, "VALUE", "illumination_dimer_brightness_value_helper");
        //appendShadowBlock(this, "TIME", "illumination_dimer_brightness_time_helper");
    }
};

Blockly.JavaScript['automation_turns_on'] = function (block) {
    // Search the text for a substring.
    var device = block.getFieldValue('DEVICE');
    var act = block.getFieldValue('ACT');
    if (act > 0)
        act = parseInt(block.getFieldValue('TIME'))
            * parseInt(block.getFieldValue('TIME_TYPE'));

    var code = {
        before: "",
        gencode: "\nsetAutoState(" + device + ',' + act + ');\n',
        after: "",
        global: ""
    };
    return JSON.stringify(code);
};
/*
./scr.sh AUTOMATION_IS_DEF_DSCR "Is defined %1" "Определено %1"
*/
