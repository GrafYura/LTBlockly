function onChangeModule(block) {
    var device = block.getFieldValue('DEVICE');
    var hw = blocklyGetDeviceAttr(device, 'hw');
    var cfgid = blocklyGetDeviceAttr(device, 'cfgid');
    if(!hw.length)
        hw = blocklyGetParamFromBase(cfgid, 'hwDef');
    var out = getHWVal(hw, 'out');
    var IN = getHWVal(hw, 'in');
    var optsOut = blocklyGetParamFromBase(cfgid, 'out');
    var optsIn = blocklyGetParamFromBase(cfgid, 'in');
    var i = 0;
    for (i=0; block.getInput('splitter'); i++) {
            block.removeInput('splitter');
        }
    if(1) {
        for (i=0; block.getInput('out'+ (i+1)); i++) {
            block.removeInput('out'+ (i+1));
        }
        for (i = 0; i < out.length; i++) {
            if(!block.getInput('out'+ (i+1))) {
                block.appendDummyInput('out' + (i+1))
                .appendField('out' + (i+1) + ':')
                .appendField(new Blockly.FieldDropdown(optsOut), 'outtype'+ (i+1));
                block.getField('outtype'+ (i+1)).setValue(out[i].toUpperCase());
            }
        }
        if(optsIn.length)
            block.appendDummyInput('splitter');
    }
    if(optsIn.length) {
        for (i=0; block.getInput('in'+ (i+1)); i++) {
            block.removeInput('in'+ (i+1));
        }
        for (i = 0; i < out.length; i++) {
            if(!block.getInput('in'+ (i+1))) {
                block.appendDummyInput('in' + (i+1))
                .appendField('in' + (i+1) + ':')
                .appendField(new Blockly.FieldDropdown(optsIn), 'in'+ (i+1));
                block.getField('in'+ (i+1)).setValue(IN[i].toUpperCase());
            }
        }
    }
}
function onAutomationEvents(event) {
    if (event.type == Blockly.Events.CHANGE && event.name == 'DEVICE') {
        var block = Blockly.getMainWorkspace().getBlockById(event.blockId);

        if (block) {
            if (block.type == 'test_module')
                onChangeModule(block);
            else {
                Blockly.getMainWorkspace().getAllBlocks().forEach(element => {
                    if (element.type == 'test_module') {
                        onChangeModule(element);
                    }
                });
            }
        }
    }
}
var getHWVal = function(hw, val) {
    var array1=hw.split(' ');
    for (var i = 0; i < array1.length; i++) {
        array2=array1[i].split('=');
        if(array2[0]==val) {
            array2[1]=array2[1].replace(/'/g,'');
            return array2[1];
        }
    }

};

Blockly.Blocks['test_module'] = {
    init: function () {
        this.jsonInit({
            "message0": "%2%{BKY_LT_TEST_MODULE}",
            "args0": [
                {
                    "type": "field_dropdown",
                    "name": "DEVICE",
                    "options": blocklyDeviceOptionsCFGID.bind(this, ["temperature-sensor"])
                },
                {
                    "type": "field_image",
                    "src": "js/blockly/img/automation/automation.png",
                    "width": 16,
                    "height": 16,
                    "alt": "*"
                }
            ],
            "colour": '%{BKY_LT_CATEGORY_COLOUR_AUTOMATION}',
            "tooltip": "Checks if a device is connected, 0 is disabled, another number is connected"
        });
    },
};


Blockly.JavaScript['test_module'] = function (block) {
    // Search the text for a substring.
    var device = block.getFieldValue('DEVICE');
    alert(blocklyGetDeviceAttr('[addr="' + device + '"]', 'hw'));

    var code = {
        before: "",
        gencode: "",
        after: "",
        global: ""
    };

    var expr = new RegExp(":([0-9]+)");

    code.gencode = 'isDefined(' + expr.exec(device)[1] + ')';
    return JSON.stringify(code);
};