function set_status_editor(block) {
    var type = block.getFieldValue('VALUE');
    if (type == '-1') {
        if (!block.getInput('ARRAY')) {
            block.appendDummyInput('ARRAY')
                .appendField('Status:')
                .appendField(new Blockly.FieldTextInput(''),
                    'ARRAY');
        }
    } else if (block.getInput('ARRAY')) {
        block.removeInput('ARRAY');
    }
}
function onExtendedStatusEvents(event) {
    var block = Blockly.getMainWorkspace().getBlockById(event.blockId);
    if (block) {
        if (block.type == 'status_set_on_off') {
            set_status_editor(block);
        } else {
            Blockly.getMainWorkspace().getAllBlocks().forEach(blck => {
                if (blck.type == 'status_set_on_off') {
                    set_status_editor(blck);
                }
            });
        }
    } else {
        Blockly.getMainWorkspace().getAllBlocks().forEach(blck => {
            if (blck.type == 'status_set_on_off') {
                set_status_editor(blck);
            }
        });
    }
}
invertVaue = function(val){
    if (val==1)
        return 0;
    else if (val==0)
        return 1;
    else return val;
}
blocklyGetDeviceType = function (filter) {
        var type = blocklyLogicXml.find(filter)[0];
        if (type) {
            type = type.outerHTML;
            type = type.substring(type.search(' type=') + 7);
            type = type.substring(0, type.search('"'));
        } else {
            type = '';
        }

        return type;
    },
Blockly.Blocks['status_set_on_off'] = {
    init: function () {
        this.jsonInit({
            "message0": "%3%{BKY_LT_STATUS_SET_ON_OFF}",
            "args0": [
                {
                    "type": "field_dropdown",
                    "name": "DEVICE",
                    "options": blocklyDeviceOptions.bind(this, ["lamp", "valve", "dimer-lamp", "dimmer-lamp", "script", "speaker", "conditioner", "rgb-lamp", "valve-heating", "vent", "fancoil", "jalousie", "gate", "light-scheme"])
                },
                {
                    "type": "field_dropdown",
                    "name": "VALUE",
                    "options": [
                        ["%{BKY_LT_OTHER_ON}", "1"],
                        ["%{BKY_LT_OTHER_OFF}", "0"],
                        ["%{BKY_LT_OTHER_TOGGLE}", "0xFF"],
                        ["%{BKY_LT_OTHER_EXTENDED}", "-1"]
                    ]
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
            "tooltip": "%{BKY_LT_CONTROL_STATUS_ON_OFF_TT}"
        });
        if (this.workspace == Blockly.getMainWorkspace())
            this.appendDummyInput('ARRAY')
                .appendField('Status:')
                .appendField(new Blockly.FieldTextInput('0xFF,0xFF'), 'ARRAY');
    }
};


Blockly.JavaScript['status_set_on_off'] = function (block) {
    // Search the text for a substring.
    var device = block.getFieldValue('DEVICE');
    var value = block.getFieldValue('VALUE');
    var devtype = blocklyGetDeviceType('[addr="' + device + '"]');
    if(devtype=="valve")
        value = invertVaue(value);
    if (device.length < 1) {
        throw Blockly.Msg["LT_ERROR_EMPTY_DEVICE"] + ' ' + block.type;
    }
    if (value < 0) {
        if(block.getFieldValue('ARRAY').indexOf(',') != -1)
            value = '{' + block.getFieldValue('ARRAY') + '}';
        else
            value = block.getFieldValue('ARRAY');
    }
    var code = {
        before: "",
        gencode: "",
        after: "",
        global: ""
    };
    code.gencode = "\nsetStatus(" + device + ", " + value + ");\n";

    return JSON.stringify(code);
};

