Blockly.Blocks['notification_log_error'] = {
    init: function () {
        this.jsonInit({
            "message0": "%2%{BKY_LT_LOG_ERROR}",
            "args0": [
                {
                    "type": "input_value",
                    "name": "VALUE"
                },
                {
                    "type": "field_image",
                    "src": "js/blockly/img/notifications/notifications.png",
                    "width": 16,
                    "height": 16,
                    "alt": "*"
                }
            ],
            "colour": "%{BKY_LT_CATEGORY_COLOUR_NOTIFICATION}",
            "tooltip": "%{BKY_LT_NOTIFICATION_LOG_TT}",
            "previousStatement": null,
            "nextStatement": null
        });
        appendShadowBlock(this, "VALUE", "notification_log_error_text_helper");
    }
};

Blockly.JavaScript['notification_log_error'] = function (block) {
    // Search the text for a substring.
    var value = Blockly.JavaScript.statementToCode(block, 'VALUE');
    var parser = JSON.parse(value);
    var code = {
        before: "",
        gencode: "",
        after: "",
        global: ""
    };

    code.before = parser.before;
    switch (block.getInputTargetBlock('VALUE').type) {
        case 'getbyte_control':
            code.gencode = '\nsrvError("' + parser.gencode + '", ' + parser.after + ');\n';
            break;
        case 'notification_log_error_text_helper':
            code.gencode = '\nsrvError(' + parser.gencode + ');\n';
            break;
        case 'sprintf':
            if (Array.isArray(parser.gencode)) {
                var i = 0;
                parser.gencode.forEach(cond => {
                    code.gencode += '\nsrvError("' + cond + '", ' + parser.after[i] + ');\n';
                    ++i;
                });
            }
            else {
                parser.before += '\nsprintf("' + parser.gencode + '", ' + parser.after + ');';
            }
            break;
        case 'variebles_getter':
            code.gencode = '\nsrvError("' + parser.gencode + '", ' + parser.after + ');\n';
            break;
        default:
            switch (block.getInputTargetBlock('VALUE').output) {
                case 'Text':
                    code.gencode = '\nsrvError("%s", ' + parser.gencode + ');\n';
                    break;
                default:
                    code.gencode = '\nsrvError("%d", ' + parser.gencode + ');\n';
                    break;
            }
            break;
    }
    code.global = parser.global;

    return JSON.stringify(code);
};

Blockly.Blocks['notification_log_error_text_helper'] = {
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
            "output": "Text",
            "colour": "%{BKY_LT_CATEGORY_COLOUR_NOTIFICATION}"
        });
    }
};

Blockly.JavaScript['notification_log_error_text_helper'] = function (block) {
    // Search the text for a substring.
    var value = block.getFieldValue('VALUE');

    var code = {
        before: "",
        gencode: '"' + value + '"',
        after: "",
        global: ""
    };

    return JSON.stringify(code);
};
