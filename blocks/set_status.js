Blockly.Blocks['set_status'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage("js/blockly/img/events/events.png", 16, 16, "*"))
            .appendField('Type: ')
            .appendField(new Blockly.FieldDropdown(blocklyDeviceTypeOptions.bind(this)), 'DEVICETYPE');
        this.appendDummyInput()
            .appendField('Device: ')
            .appendField(new Blockly.FieldDropdown(blocklyDeviceOptions.bind(this)), 'DEVICE');
        this.setColour("%{BKY_LT_CATEGORY_COLOUR_EVENTS}");
        this.setTooltip(Blockly.Msg["LT_EVENT_ON_DEVICE_TTEVENT"]);
        this.appendValueInput('VALUE')
            .setCheck('Array')
            .appendField('Status: ');
        this.setColour("%{BKY_LT_CATEGORY_COLOUR_OTHER}");
        this.setTooltip(Blockly.Msg["LT_EVENT_ON_DEVICE_TTEVENT"]);
        this.setNextStatement(true);
        this.setPreviousStatement(true);
    }
};

Blockly.JavaScript['set_status'] = function (block) {
    // Search the text for a substring.
    var device = block.getFieldValue('DEVICE');
    var value = Blockly.JavaScript.statementToCode(block, 'VALUE');
    var value = JSON.parse(value);

    if (value == '') {
        throw 'ERROR: no array for set status!';
    }

    var code = {
        before: value.before,
        gencode: "",
        after: value.after,
        global: value.global
    };

    code.gencode = '\nsetStatus(' + device + ', ' +
        value.gencode + ');\n';

    return JSON.stringify(code);
};