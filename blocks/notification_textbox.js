Blockly.Blocks['notification_textbox'] = {
    init: function () {
        this.jsonInit({
            "message0": "%3%{BKY_LT_NOTIFICATION_TEXTBOX}",
            "args0": [
                {
                    "type": "field_dropdown",
                    "name": "DEVICE",
                    "options": blocklyDeviceOptions.bind(this, ["virtual"])
                },
                {
                    "type": "input_value",
                    "name": "MESSAGE",
                    "check": ""
                },
                {
                    "type": "field_image",
                    "src": "js/blockly/img/notifications/notifications.png",
                    "width": 16,
                    "height": 16,
                    "alt": "*"
                }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "%{BKY_LT_CATEGORY_COLOUR_NOTIFICATION}",
            "tooltip": "%{BKY_LT_NOTIFICATION_BOX_TT}"
        });
        appendShadowBlock(this, "MESSAGE", "notification_textbox_message_helper");
    },
    buffer: null
};


Blockly.JavaScript['notification_textbox'] = function (block) {
    // Search the text for a substring.
    var device = block.getFieldValue('DEVICE');
    if (device.length < 1) {
        throw Blockly.Msg["LT_ERROR_EMPTY_DEVICE"] + ' ' + block.type;
    }
    var message = Blockly.JavaScript.statementToCode(block, 'MESSAGE');
    var parser = JSON.parse(message);
    var buffer = bloclyGenerateVariableName();
    var code = {
        before: "",
        gencode: "",
        after: "",
        global: ""
    };
    var sprtf = '', helper = '', values = '';
    if (if_previous_buffer_exsist(block)) {
        block.buffer = if_previous_buffer_exsist(block);
        buffer = block.buffer;
        code.before = '\n' + buffer + '[0] = 0;'
    }
    else {
        block.buffer = buffer;
        code.before = '\nu8 ' + buffer + '[100];'
    }
    switch (block.getInputTargetBlock('MESSAGE').type) {
        case 'notification_textbox_message_helper':
            sprtf = null;
            helper += parser.gencode;
            values = null;
            break;
        case 'getbyte_control':
            sprtf = parser.gencode;
            values = parser.after;
            break;
        case 'sprintf':
            sprtf = parser.gencode;
            values = parser.after;
            break;
        case 'variebles_getter':
            sprtf = parser.gencode;
            values = parser.after;
            break;
        default:
            if (block.getInputTargetBlock('MESSAGE').output == 'Text') {
                sprtf = '%s';
                values = '"' + parser.gencode + '"';
            }
            else {
                sprtf = '%hhd';
                values = parser.gencode;
            }
            break;
    }
    if (Array.isArray(values)) {
        var i = 0;
        values.forEach(value => {
            code.before += '\nsprintf(' + buffer + ' + strlen(' + buffer + '),"' + sprtf[i] + '",' + value + ');';
            ++i;
        });
    }
    else {
        if (values)
            code.before += '\nsprintf(' + buffer + ' + strlen(' + buffer + '),"' + sprtf + '",' + values + ');';
    }
    if (values) {
        code.gencode += '\nsetStatus(' + device + ',&' + buffer + ');';
    }
    else
        code.gencode += '\nsetStatus(' + device + ',"' + helper + '");';
    code.global = parser.global;

    return JSON.stringify(code);
};


Blockly.Blocks['notification_textbox_message_helper'] = {
    init: function () {
        this.jsonInit({
            "message0": "%1",
            "args0": [
                {
                    "type": "field_input",
                    "name": "VALUE",
                    "text": "%{BKY_LT_LOG_ERR_MSG}"
                }
            ],
            "colour": "%{BKY_LT_CATEGORY_COLOUR_NOTIFICATION}",
            "output": "Text"
        });
    }
};

Blockly.JavaScript['notification_textbox_message_helper'] = function (block) {
    // Search the text for a substring.
    var message = block.getFieldValue('VALUE');

    var code = {
        before: "",
        gencode: message,
        after: "",
        global: ""
    };

    return JSON.stringify(code);
};
