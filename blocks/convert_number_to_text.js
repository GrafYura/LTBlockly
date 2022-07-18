
var deepFind = function (childrens) {
    if (childrens.length != 0) {
        for (let i = 0; i < childrens.length; i++) {
            if (childrens[i].textBuff != null) {
                return childrens[i].textBuff;
            }
        }

        for (let i = 0; i < childrens.length; i++) {
            let buffName = deepFind(childrens[i].getChildren());
            if (buffName != null) {
                return buffName;
            }
        }
    }

    return null;
};

var isHaveTextBuff = function (block) {
    var parent = block;
    var childrens;

    while (true) {
        if (parent.type == 'delayed_function') {
            return null;
        }

        block = parent;
        parent = parent.getParent();

        if (parent) {
            if (parent.textBuff) {
                return parent.textBuff;
            }

            let tempChildrens = parent.getChildren();
            childrens = [];
            for (let i = 0; i < tempChildrens.length; i++) {
                if (tempChildrens[i].id != block.id) {
                    childrens.push(tempChildrens[i]);
                }
            }

            if (childrens.length != 0) {

                let buffName = deepFind(childrens);
                if (buffName != null) return buffName;
            }

        } else {
            break;
        }
    }

    return null;
};

Blockly.Blocks['convert_number_to_text'] = {
    init: function () {
        this.jsonInit({
            "message0": "%2%{BKY_LT_TEXT_CONVERTNUMB_TO_TEXT}",
            "args0": [
                {
                    "type": "input_value",
                    "name": "VALUE",
                    "check": "Number"
                },
                {
                    "type": "field_image",
                    "src": "js/blockly/img/text/text.png",
                    "width": 16,
                    "height": 16,
                    "alt": "*"
                }
            ],
            "output": "Text",
            "colour": "%{BKY_LT_CATEGORY_COLOUR_TEXT}",
            "tooltip": "Convert number to string"
        });
        appendShadowBlock(this, "VALUE", "convert_number_to_text_value_helper");
    },
    textBuff: null,
    output: "Text"
};

Blockly.JavaScript['convert_number_to_text'] = function (block) {
    // Search the text for a substring.
    var value = Blockly.JavaScript.statementToCode(block, 'VALUE');
    value = JSON.parse(value);

    var code = {
        before: value.before,
        gencode: "",
        after: value.after,
        global: value.global
    };

    var childBlock = block.getChildren()[0];
    if (childBlock.type == "convert_number_to_text_value_helper") {
        code.gencode += '"' + value.gencode + '"';
        return JSON.stringify(code);
    }
    var buff = isHaveTextBuff(block);
    if (buff) {
        block.textBuff = buff;
        code.before += "\n" + buff + "[0] = 0;";
    } else {
        buff = bloclyGenerateVariableName();
        block.textBuff = buff;
        code.before += '\nu8 ' + buff + '[10] = "";'
    }
    code.before += '\nsprintf(' + buff + ', "%d", ' + value.gencode + ');';
    code.gencode = buff;

    return JSON.stringify(code);
};

Blockly.Blocks['convert_number_to_text_value_helper'] = {
    init: function () {
        this.jsonInit({
            "message0": "%1",
            "args0": [
                {
                    "type": "field_number",
                    "name": "VALUE",
                    "value": 100

                }
            ],
            "output": "Number",
            "colour": "%{BKY_LT_CATEGORY_COLOUR_TEXT}"
        });
    }
};

Blockly.JavaScript['convert_number_to_text_value_helper'] = function (block) {
    // Search the text for a substring.
    var value = block.getFieldValue('VALUE');

    var code = {
        before: "",
        gencode: value,
        after: "",
        global: ""
    };

    return JSON.stringify(code);
};

/*
./scr.sh TEXT_CONVERTNUMB_TO_TEXT "Number to text %1" "Число в текст %1"
*/
