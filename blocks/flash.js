var getNumVars = function () {
    var workspace = Blockly.getMainWorkspace(),
        blocks = workspace.getAllBlocks(),
        vars = [];

    blocks.forEach(el => {
        if (el.type == 'varieble_numb') {
            vars.push([el.getFieldValue('NAME'), el.getFieldValue('NAME')]);
        }
    });

    if (vars.length == 0)
        vars = [["No variables found", ""]];
    return vars;
};

function computeFlashReadReturn() {
    var blocks = Blockly.getMainWorkspace().getAllBlocks();
    var active = [];

    blocks.forEach(block => {
        if (block.type == 'flash_read'
            && block.state == 1) {
            active.push(block);
        }
    });

    if (active.length > 0) {
        active[0].isActive = true;
        for (let i = 1; i < active.length; i++) {
            active[i].isActive = false;
        }
    }
}

var deepFindFlash = function (childrens) {
    if (childrens.length != 0) {
        for (let i = 0; i < childrens.length; i++) {
            if (childrens[i].flashBuff != null) {
                return childrens[i].flashBuff;
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

var isHaveFlashBuff = function (block) {
    var parent = block;
    var childrens;

    while (true) {
        if (parent.type == 'delayed_function') {
            return null;
        }

        block = parent;
        parent = parent.getParent();

        if (parent) {
            if (parent.flashBuff) {
                return parent.flashBuff;
            }

            let tempChildrens = parent.getChildren();
            childrens = [];
            for (let i = 0; i < tempChildrens.length; i++) {
                if (tempChildrens[i].id != block.id) {
                    childrens.push(tempChildrens[i]);
                }
            }

            if (childrens.length != 0) {

                let buffName = deepFindFlash(childrens);
                if (buffName != null) return buffName;
            }

        } else {
            break;
        }
    }

    return null;
};
function changeFlashReadRead(block) {
    if (block.getParent()) {
        block.outputConnection.disconnect();
        var dx = Math.floor(Math.random() * 100) - 50;
        var dy = Math.floor(Math.random() * 50) - 25;
        block.moveBy(100 + dx, 25 + dy);
    }

    block.setOutput(false);
    block.setNextStatement(true);
    block.setPreviousStatement(true);

    block.appendDummyInput()
        .appendField(new Blockly.FieldImage(
            "js/blockly/img/other/flash.png", 16, 16, "*"))
        .appendField('Flash read')
        .appendField(new Blockly.FieldDropdown([
            ['Read', '0'],
            ['Return', '1']]), 'MODE')
        .appendField('Cell:')
        .appendField(new Blockly.FieldNumber('1', 0, 127, 1), 'CELL')
        .appendField(new Blockly.FieldDropdown(
            getNumVars.bind(this)), 'VALUE');
}

function changeFlashReadReturn(block) {
    var current = 3;
    var next = block.getNextBlock();
    if (next === null) current &= 1;
    var parent = block.getParent();
    if (parent === null) current &= 2;

    var parentConnection;

    if (current & 1) {
        parentConnection = block.previousConnection.targetConnection;
        block.previousConnection.disconnectInternal_(parent, block);
    }

    if (current & 2) {
        block.nextConnection.disconnectInternal_(block, next);
    }

    if (current == 3) {
        next.previousConnection.connect(parentConnection);
    }

    if (current) {
        var dx = Math.floor(Math.random() * 100) - 50;
        var dy = Math.floor(Math.random() * 50) - 25;
        block.moveBy(100 + dx, 25 + dy);
    }

    block.setOutput(true, 'Number');
    block.setNextStatement(false);
    block.setPreviousStatement(false);

    block.appendDummyInput()
        .appendField(new Blockly.FieldImage(
            "js/blockly/img/other/flash.png", 16, 16, "*"))
        .appendField('Flash read')
        .appendField(new Blockly.FieldDropdown([
            ['Return', '1'],
            ['Read', '0']]), 'MODE')
        .appendField('Cell:')
        .appendField(new Blockly.FieldNumber('1', 0, 127, 1), 'CELL');
}

function onFlashReadModeChange(event) {
    if (event.type == Blockly.Events.CREATE) {
        event.ids.forEach(id => {
            let block = Blockly.getMainWorkspace().getBlockById(id);
            if (block && block.type == 'flash_read') {
                setFlashReadState(block);
            }
        });
    }

    if (event.type == Blockly.Events.BLOCK_CHANGE
        || event.type == Blockly.Events.BLOCK_CREATE) {
        var block = Blockly.getMainWorkspace().getBlockById(event.blockId);
        if (block && block.type == 'flash_read') {
            setFlashReadState(block);
        }
    }
}



Blockly.Blocks['flash_number_helper'] = {
    init: function () {
        this.jsonInit({
            "message0": "%1",
            "args0": [
                {
                    "type": "field_number",
                    "name": "CELL",
                    "value": 10
                }
            ],
            "output": "Number",
            "colour": "%{BKY_LT_CATEGORY_COLOUR_OTHER}",
            "tooltip": "Read/write to/from flash memory"
        });
    }
};

Blockly.JavaScript['flash_number_helper'] = function (block) {
    // Search the text for a substring.
    var code = {
        before: "",
        gencode: block.getFieldValue('CELL'),
        after: "",
        global: ""
    };

    return JSON.stringify(code);
};

Blockly.Blocks['flash_read'] = {
    init: function () {
        this.jsonInit({
            "message0": "%2Flash read Cell: %1",
            "args0": [
                {
                    "type": "field_number",
                    "name": "CELL",
                    "value": 1,
                    "min": 1,
                    "max": 127
                },
                {
                    "type": "field_image",
                    "src": "js/blockly/img/other/flash.png",
                    "width": 16,
                    "height": 16,
                    "alt": "*"
                }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "%{BKY_LT_CATEGORY_COLOUR_OTHER}",
            "tooltip": "Read from flash memory",
        });
         this.appendDummyInput('VAR')
                .appendField(' To: ')
                .appendField(new Blockly.FieldDropdown(
                    getNumVars.bind(this)), 'VALUE');
        if (!Blockly.getMainWorkspace().listeners_.includes(onFlashReadModeChange)) {
            Blockly.getMainWorkspace().addChangeListener(onFlashReadModeChange);
        }
        //Blockly.getMainWorkspace().addChangeListener(changeFlashReadReturn);
    },
    flashBuff: null
};
Blockly.Blocks['flash_read_return'] = {
    init: function () {
        this.jsonInit({
            "message0": "%2Flash return Cell: %1",
            "args0": [
                {
                    "type": "field_number",
                    "name": "CELL",
                    "value": 1,
                    "min": 1,
                    "max": 127
                },
                {
                    "type": "field_image",
                    "src": "js/blockly/img/other/flash.png",
                    "width": 16,
                    "height": 16,
                    "alt": "*"
                }
            ],
            "colour": "%{BKY_LT_CATEGORY_COLOUR_OTHER}",
            "tooltip": "Read from flash memory",
            "output": "Number"
        });
        if (!Blockly.getMainWorkspace().listeners_.includes(onFlashReadModeChange)) {
            Blockly.getMainWorkspace().addChangeListener(onFlashReadModeChange);
        }
        //Blockly.getMainWorkspace().addChangeListener(changeFlashReadReturn);
    },
    flashBuff: null
};

Blockly.JavaScript['flash_read'] = function (block) {
    // Search the text for a substring.
    var cell = block.getFieldValue('CELL');
    var value = block.getFieldValue('VALUE');

    var code = {
        before: "",
        gencode: "",
        after: "",
        global: ""
    };
        if (value == '') throw 'ERROR: no variable selected in flash read!';
        code.gencode = '\neeEmulRead(' + cell + ', &' + value + ');\n';
    return JSON.stringify(code);
};

Blockly.JavaScript['flash_read_return'] = function (block) {
    // Search the text for a substring.
    var cell = block.getFieldValue('CELL');

    var code = {
        before: "",
        gencode: "",
        after: "",
        global: ""
    };
        var varName=bloclyGenerateVariableName();
        var buffName = isHaveFlashBuff(block);
        if (buffName == null) {
            buffName = bloclyGenerateVariableName();
            code.before = '\nu32 '+varName+' = 0;\n';
        }

        block.flashBuff = buffName;
        code.before += '\neeEmulRead(' + cell + ', &'+varName+');\n';;
        code.gencode = ''+varName+'';
        //code.global = '\nu32 __sys_flash_read__ = 0;\n';

    return JSON.stringify(code);
};

Blockly.Blocks['flash_write'] = {
    init: function () {
        this.jsonInit({
            "message0": "%3Flash write cell: %1 Value:%2",
            "args0": [
                {
                    "type": "field_number",
                    "name": "CELL",
                    "value": 1,
                    "min": 1,
                    "max": 127
                },
                {
                    "type": "input_value",
                    "name": "VALUE",
                    "check": "Number"
                },
                {
                    "type": "field_image",
                    "src": "js/blockly/img/other/flash.png",
                    "width": 16,
                    "height": 16,
                    "alt": "*"
                }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "%{BKY_LT_CATEGORY_COLOUR_OTHER}",
            "tooltip": "Write to flash memory"
        });
        appendShadowBlock(this, 'VALUE', 'flash_number_helper');
    },
    flashBuff: null
};

Blockly.JavaScript['flash_write'] = function (block) {
    // Search the text for a substring.
    var cell = block.getFieldValue('CELL');
    var value = Blockly.JavaScript.statementToCode(block, 'VALUE');

    value = JSON.parse(value);

    var code = {
        before: "",
        gencode: "",
        after: "",
        global: ""
    };

    code.gencode = '\neeEmulWrite(' + cell + ', ' + value.gencode + ');\n';

    return JSON.stringify(code);
};
