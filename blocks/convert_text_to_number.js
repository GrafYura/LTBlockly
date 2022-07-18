Blockly.Blocks['convert_text_to_number'] = {
    init: function () {
        this.jsonInit({
            "message0": "%2%{BKY_LT_TEXT_CONVERTTEXT_TO_NUMB}",
            "args0": [
                {
                    "type": "input_value",
                    "name": "VALUE",
                    "check": "Text"
                },
                {
                    "type": "field_image",
                    "src": "js/blockly/img/text/text.png",
                    "width": 16,
                    "height": 16,
                    "alt": "*"
                }
            ],
            "output": "Number",
            "colour": "%{BKY_LT_CATEGORY_COLOUR_TEXT}",
            "tooltip": "Converts a string to a number (if the string contains a number)"
        });
        appendShadowBlock(this, "VALUE", "convert_text_to_number_value_helper");
        //appendShadowBlock(this, "TIME", "illumination_dimer_brightness_time_helper");
    },
    output: "Number"
};
// https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/LetterT.svg/1200px-LetterT.svg.png
Blockly.JavaScript['convert_text_to_number'] = function (block) {
    // Search the text for a substring.
    var value = Blockly.JavaScript.statementToCode(block, 'VALUE');
    value = JSON.parse(value);

    var code = {
        before: "",
        gencode: "",
        after: "",
        global: ""
    };

    if (block.getChildren()[0].type
        == 'convert_text_to_number_value_helper') {
        if (!/^\"\d+\"$/.test(value.gencode)) {
            var error = 'ERROR: invalid number in Text to number block - '
                + value.gencode + '!';
            throw error;
        }
    }

    if (/^\"\d+\"$/.test(value.gencode)) {
        var number = value.gencode.match(/^\"(\d+)\"$/)[1];
        code.gencode = number;
    } else {
        code.before = value.before;
        code.after = value.after;
        code.global = value.global;
        code.gencode += 'atol(' + value.gencode + ')';
    }

    return JSON.stringify(code);
};

Blockly.Blocks['convert_text_to_number_value_helper'] = {
    init: function () {
        this.jsonInit({
            "message0": "%1",
            "args0": [
                {
                    "type": "field_input",
                    "name": "VALUE",
                    "text": '101'

                }
            ],
            "output": "Text",
            "colour": "%{BKY_LT_CATEGORY_COLOUR_TEXT}"
        });;
    }
};

Blockly.JavaScript['convert_text_to_number_value_helper'] = function (block) {
    // Search the text for a substring.
    var value = block.getFieldValue('VALUE');

    var code = {
        before: "",
        gencode: "",
        after: "",
        global: ""
    };

    code.gencode = '"' + value + '"';
    return JSON.stringify(code);
};

/*
./scr.sh TEXT_CONVERTTEXT_TO_NUMB "Text to number %1" "Текст в число% 1"
*/
