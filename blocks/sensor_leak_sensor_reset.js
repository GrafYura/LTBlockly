function onLeakEvent(event) {
    var block = Blockly.getMainWorkspace().getBlockById(event.blockId);
    if (block)
        if (block.type == 'sensor_leak_sensor_reset') {
            if (block.getField('ACTION')) {
                var type = parseInt(block.getFieldValue('ACTION'), 10);
                if (type == 0) {
                    if (block.getInput('PERIOD')) {
                        block.removeInput('PERIOD');
                    }
                }
                if (type > 0) {
                    if (!block.getInput('PERIOD')) {
                        block.appendDummyInput('PERIOD')
                            .appendField(new Blockly.FieldDropdown([["Ignore for: 5 minutes", "300"],
                            ["Ignore for: 10 minutes", "600"],
                            ["Ignore for: 30 minutes", "1800"],
                            ["Ignore for: 1 hour", "3600"],
                            ["Ignore for: 12 hours", "43200"],
                            ["Ignore for: 1 day", "86400"]]), 'PERIOD');
                    }
                }
            }
        }
}
Blockly.Blocks['sensor_leak_sensor_reset'] = {
    init: function () {
        this.jsonInit({
            "message0": "%{BKY_LT_CATEGORY_CONTROL_LEAK}",
            "args0": [
                {
                    "type": "field_dropdown",
                    "name": "DEVICE",
                    "options": blocklyDeviceOptions.bind(this, ["leak-sensor"])
                },
                {
                    "type": "field_dropdown",
                    "name": "ACTION",
                    "options": [["Reset", "0"],
                    ["Ignore", "1"]]
                },
                {
                    "type": "field_image",
                    "src": "js/blockly/img/control/control.png",
                    "width": 16,
                    "height": 16,
                    "alt": "*"
                }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}",
            "tooltip": "%{BKY_LT_CATEGORY_CONTROL_LEAK_TT}"
        });
        //appendShadowBlock(this, "MESSAGE", "sensor_leak_sensor_reset_value_helper");    
    }
};

Blockly.JavaScript['sensor_leak_sensor_reset'] = function (block) {
    // Search the text for a substring.
    var id = block.getFieldValue('DEVICE');
    var period = block.getFieldValue('PERIOD');
    var code = {
        before: "",
        gencode: "",
        after: "",
        global: ""
    };
    if (id.length < 1) {
        $.msalert(Blockly.Msg["LT_ERROR_EMPTY_DEVICE"] + ' ' + block.type);
        throw Blockly.Msg["LT_ERROR_EMPTY_DEVICE"] + ' ' + block.type;
    }

    if (period == null) {
        period = 0;
    }

    code.gencode = '\nsetStatus(' + id + ', ' + period + ');\n';
    return JSON.stringify(code);
};


Blockly.Blocks['sensor_leak_sensor_reset_value_helper'] = {
    init: function () {
        this.jsonInit({
            "message0": "%1",
            "args0": [
                {
                    "type": "field_number",
                    "name": "VALUE",
                    "value": 5
                }
            ],
            "colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}",
            "output": "Number"
        });
    }
};

Blockly.JavaScript['sensor_leak_sensor_reset_value_helper'] = function (block) {
    // Search the text for a substring.
    var message = block.getFieldValue('VALUE');

    var code = {
        before: "",
        gencode: "",
        after: "",
        global: ""
    };
    code.gencode += '"' + message + '"';
    return JSON.stringify(code);
};
