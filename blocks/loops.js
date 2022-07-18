
/**
 * Func for find variables
 */

var varget = function () {
    var workspace = Blockly.getMainWorkspace(),
        blocks = workspace.getAllBlocks(),
        vars = [], i = 0;
    while (blocks[i]) {
        if (blocks[i].type == 'varieble_numb')
            vars.push([blocks[i].getFieldValue('NAME'), blocks[i].getFieldValue('NAME')]);
        i++;
    }
    if (vars.length == 0)
        vars = [["No variables found", ""]];
    return vars;
}

////////////////////////////////////////////////////////////////////////////
////////////////////////////// BLOCKS //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

/**
 * Loop
 */
// http://cdn.onlinewebfonts.com/svg/img_272530.png
Blockly.Blocks['loop'] = {
    init: function () {
        this.jsonInit({
            "message0": "%2%{BKY_LT_LOOP_HEAD}",
            "args0": [
                {
                    "type": "field_number",
                    "name": "VALUE",
                    "value": 10,
                    "min": 2
                },
                {
                    "type": "field_image",
                    "src": "js/blockly/img/loop/loop.png",
                    "width": 16,
                    "height": 16,
                    "alt": "*"
                }
            ],
            "message1": "%{BKY_LT_LOOP_DO}: %1",
            "args1": [
                {
                    "type": "input_statement",
                    "name": "BODY"
                }
            ],
            "nextStatement": null,
            "previousStatement": null,
            "colour": "%{BKY_LT_CATEGORY_COLOUR_LOOP}",
            "tooltip": "Cycle, perform actions a specified number of times"
        });
    }
};

/**
 * From
 */

Blockly.Blocks['loop_from_helper'] = {
    init: function () {
        this.jsonInit({
            "message0": "%1",
            "args0": [
                {
                    "type": "field_number",
                    "name": "VALUE",
                    "value": 1
                }
            ],
            "output": "Number",
            "colour": "%{BKY_LT_CATEGORY_COLOUR_LOOP}"
        });
    }
};

/**
 * To
 */

Blockly.Blocks['loop_to_helper'] = {
    init: function () {
        this.jsonInit({
            "message0": "%1",
            "args0": [
                {
                    "type": "field_number",
                    "name": "VALUE",
                    "value": 10
                }
            ],
            "output": "Number",
            "colour": "%{BKY_LT_CATEGORY_COLOUR_LOOP}"
        });
    }
};

/**
 * By
 */

Blockly.Blocks['loop_by_helper'] = {
    init: function () {
        this.jsonInit({
            "message0": "%1",
            "args0": [
                {
                    "type": "field_number",
                    "name": "VALUE",
                    "value": 1
                }
            ],
            "output": "Number",
            "colour": "%{BKY_LT_CATEGORY_COLOUR_LOOP}"
        });
    }
};

/**
 * Break
 */

Blockly.Blocks['loop_break'] = {
    init: function () {
        this.jsonInit({
            "message0": "%1%{BKY_LT_LOOP_BREAK}",
            "args0": [
                {
                    "type": "field_image",
                    "src": "js/blockly/img/loop/loop.png",
                    "width": 16,
                    "height": 16,
                    "alt": "*"
                }
            ],
            "nextStatement": null,
            "previousStatement": null,
            "colour": "%{BKY_LT_CATEGORY_COLOUR_LOOP}",
            "tooltip": "Stop looping"
        });
    }
};

/**
 * Continue
 */

Blockly.Blocks['loop_continue'] = {
    init: function () {
        this.jsonInit({
            "message0": "%1%{BKY_LT_LOOP_CONTINUE}",
            "args0": [
                {
                    "type": "field_image",
                    "src": "js/blockly/img/loop/loop.png",
                    "width": 16,
                    "height": 16,
                    "alt": "*"
                }
            ],
            "nextStatement": null,
            "previousStatement": null,
            "colour": "%{BKY_LT_CATEGORY_COLOUR_LOOP}",
            "tooltip": "Start next loop run"
        });
    }
};

////////////////////////////////////////////////////////////////////////////
////////////////////////////// GENCODE /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

/**
 * Loop
 */

Blockly.JavaScript['loop'] = function (block) {
    // Search the text for a substring.
    var value = block.getFieldValue('VALUE');
    var body_ = Blockly.JavaScript.statementToCode(block, 'BODY');
    var parser = [];
    var code = {
        before: "",
        gencode: "",
        after: "",
        global: ""
    };
    //alert(var_);
    if (!(body_ === '')) {
        //alert('1');
        var parser = [];
        var i = 0;
        while (body_.indexOf('}{') != -1) {
            parser.push(body_.substring(0, body_.indexOf('}{') + 1));
            body_ = body_.substring(body_.indexOf('}{') + 1);
        }
        parser.push(body_);
        while (parser[i]) {
            parser[i] = JSON.parse(parser[i]);
            i++;
        }
        //alert('2');
        parser.forEach(el => {
            code.gencode += el.before + el.gencode + el.after;
            code.global += el.global;
        });
        code.gencode = '\n{\nfor(u8 __loop_counter__ = 0; __loop_counter__ < '
            + value + ';++__loop_counter__){\n' + code.gencode + '\n}\n}\n';
    }

    return JSON.stringify(code);
};

/**
 * From
 */

Blockly.JavaScript['loop_from_helper'] = function (block) {
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

/**
 * To
 */

Blockly.JavaScript['loop_to_helper'] = function (block) {
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

/**
 * By
 */

Blockly.JavaScript['loop_by_helper'] = function (block) {
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

/**
 * Break
 */

Blockly.JavaScript['loop_break'] = function (block) {
    // Search the text for a substring.
    var code = {
        before: "",
        gencode: "\nbreak;\n",
        after: "",
        global: ""
    };

    return JSON.stringify(code);
};

/**
 * Continue
 */

Blockly.JavaScript['loop_continue'] = function (block) {
    // Search the text for a substring.
    var code = {
        before: "",
        gencode: "\ncontinue;\n",
        after: "",
        global: ""
    };

    return JSON.stringify(code);
};
