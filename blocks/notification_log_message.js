Blockly.Blocks['notification_log_message'] = {
    init: function () {
        this.jsonInit({
            "message0": "%{BKY_LT_LOG_MESSAGE}",
            "args0": [
                {
                    "type": "input_value",
                    "name": "VALUE",
                    "check": "Text"
                }
            ],
            "colour": "%{BKY_LT_CATEGORY_COLOUR_NOTIFICATION}",
            "previousStatement": null,
            "nextStatement": null
        });
        appendShadowBlock(this, "VALUE", "notification_log_message_text_helper");
    }
};

Blockly.JavaScript['notification_log_message'] = function (block) {
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
    code.gencode = '\nsrvMessage(' + parser.gencode + ');';
    code.after = parser.after;
    code.global = parser.global;
    return JSON.stringify(code);
};

Blockly.Blocks['notification_log_message_text_helper'] = {
    init: function () {
        this.jsonInit({
            "message0": "%1",
            "args0": [
                {
                    "type": "field_input",
                    "name": "VALUE",
                    "text": "Message"
                }
            ],
            "output": "Text",
            "colour": "%{BKY_LT_CATEGORY_COLOUR_NOTIFICATION}"
        });
    }
};

Blockly.JavaScript['notification_log_message_text_helper'] = function (block) {
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
