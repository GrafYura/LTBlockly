
Blockly.Blocks['webhook'] = {
    init: function () {
        this.jsonInit({
            "message0": "%2%{BKY_LT_WEBHOOK}%1",
            "args0": [
                {
                    "type": "field_dropdown",
                    "name": "VAL",
                    "options": blocklyGetWebhookEventsNames.call()
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
            "tooltip": "Make webhook"
        });
    }
};
// https://cdn.iconscout.com/icon/premium/png-256-thumb/home-automation-12-616943.png
Blockly.JavaScript['webhook'] = function (block) {
    // Search the text for a substring.
    var val = block.getFieldValue('VAL');
    var code = {
        before: "",
        gencode: '\nsetStatus(SRV-ID:1, "name=' + val + '");\n',
        after: "",
        global: ""
    };

    return JSON.stringify(code);
};
