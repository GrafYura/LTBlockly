/**
                    {
                        "type": "field_dropdown",
                        "name": "EVENT",
                        "options": [
                            ["Close", "0"],
                            ["Open", "1"],
                            ["Force close", "2"],
                            ["Force open", "3"],
                            ["Toggle", "4"]
                        ]
                    }
 */

function addVirtualJalousie(block) {
    block.getInput('ARGS')
        .appendField('Event:', 'TEXT1')
        .appendField(new Blockly.FieldDropdown([
            ["Close", "0"],
            ["Open", "1"],
            ["Force close", "2"],
            ["Force open", "3"],
            ["Toggle", "4"]
        ]), 'EVENTS')
        .appendField('Timeout:', 'TEXT2')
        .appendField(new Blockly.FieldNumber(1, 0, 255, 1), 'TIMEOUT');

}

function onVirtualDeviceChange(event) {
    if (event.type == Blockly.Events.CHANGE ||
        event.type == Blockly.Events.CREATE) {
        var block = Blockly.getMainWorkspace().getBlockById(event.blockId);

        if (block.type != 'virtual_device') return;

        if (block.getFieldValue('TYPE') == block.state) return;
        else block.state = block.getFieldValue('TYPE');

        if (block.getInput('ARGS')) {
            var blocks = block.getInput('ARGS').fieldRow;
            blocks.forEach(element => {
                block.getInput('ARGS').removeField(element.name);
            });
        } else {
            block.appendDummyInput('ARGS');
        }

        if (!block.getInput('CONTENT'))
            block.appendStatementInput('CONTENT');

        if (block.state == 'jalousie') {
            addVirtualJalousie(block);
        }
    }
}

Blockly.Blocks['virtual_device'] = {
    init: function () {
        this.jsonInit(
            {
                "message0": "%1 Type: %2 Device: %3",
                "args0": [
                    {
                        "type": "field_image",
                        "src": "https://www.gstatic.com/codesite/ph/images/star_on.gif",
                        "width": 15,
                        "height": 15,
                        "alt": "*"
                    },
                    {
                        "type": "field_dropdown",
                        "name": "TYPE",
                        "options": [
                            ['jalousie', 'jalousie']
                        ]
                    },
                    {
                        "type": "field_dropdown",
                        "name": "DEV",
                        "options": blocklyDeviceOptions.bind(this, [this.getFieldValue('TYPE')])
                    }
                ],
                "colour": "%{BKY_LT_CATEGORY_COLOUR_STATUS}"
            });
        this.state = '';
    }
};

Blockly.JavaScript['virtual_device'] = function (block) {
    // Search the text for a substring.
    var mode = block.getFieldValue('MODE');
    var self = block.getFieldValue('SELF');

    var code = {
        before: "",
        gencode: "",
        after: "",
        global: ""
    };

    if (self) {
        code.gencode = '([V-ADDR]&1)';
    } else {
        code.gencode = '([' + mode + '.0]&1)';
    }

    return JSON.stringify(code);
};

