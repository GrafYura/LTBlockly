function changeModbusTake2(block) {
    var act = block.getFieldValue('ACT');
    if (act == '3') {
        block.getInput('BYTE').setVisible(true);
    } else if (act != '3') {
        block.getInput('BYTE').setVisible(false);
    }
}

/**
 * Print registers
 */

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// BLOCKS //////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

/**
 * Modbus
 */


/**
 * Modbus take
 */

Blockly.Blocks['modbus_take_get'] = {
    init: function () {
        this.jsonInit({
            "message0": "%2ModBus %{BKY_LT_OTHER_MODBUS_ANSWER}: %1",
            "args0": [{
                "type": "field_dropdown",
                "name": "ACT",
                "options": [["%{BKY_LT_OTHER_MODBUS_GET}", "1"],
                    ["%{BKY_LT_OTHER_MODBUS_GET_COMAND}", "2"],
                    ["%{BKY_LT_OTHER_MODBUS_GET_BYTE}", "3"]
                ]
            },
            {
                "type": "field_image",
                "src": "js/blockly/img/other/modbus.png",
                "width": 16,
                "height": 16,
                "alt": "*"
            }
            ],
            'colour': '%{BKY_LT_CATEGORY_COLOUR_OTHER}',
            "tooltip": "Processing a response to a modbus request",
            "output": "Number"
        });
        this.appendDummyInput('BYTE')
            .appendField('Byte: ')
            .appendField(new Blockly.FieldNumber(0, 0, 255), 'BYTE')
            .setVisible(false);

    }

};

function onModbusChangeEvent(event) 
{
    if (event.type == Blockly.Events.CREATE) {
        var block = Blockly.getMainWorkspace().getBlockById(event.blockId);

        if (block && block.type == 'modbus_take_get') 
        {
                changeModbusTake2(block);
                block.render();
        }
        else {
            Blockly.getMainWorkspace().getAllBlocks().forEach(element => 
            {
                if (element.type == 'modbus_take_get') 
                {
                   changeModbusTake2(element);
                   element.render();
                }
           });
        }
    }
    else  if (event.type == Blockly.Events.CHANGE) {
        var block = Blockly.getMainWorkspace().getBlockById(event.blockId);

        if (block && block.type == 'modbus_take_get') 
        {
                changeModbusTake2(block);
                block.render();
        }
        else {
            Blockly.getMainWorkspace().getAllBlocks().forEach(element => 
            {
                if (element.type == 'modbus_take_get') 
                {
                   changeModbusTake2(element);
                   element.render();
                }
           });
        }
    }
}
//
//
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// GENCODE /////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

/**
 * Modbus take
 */

Blockly.JavaScript['modbus_take_get'] = function (block) {
    var act = block.getFieldValue('ACT');

    var code = {
        before: "",
        gencode: "",
        after: "",
        global: ""
    };

    switch (act) {
        case '1':
            code.gencode = 'opt(0)';
            break;
        case '2':
            code.gencode = 'opt(1)';
            break;
        case '3':
            code.gencode = 'opt(' + block.getFieldValue('BYTE') + ')';
            break;
        default:
            break;
    }

    return JSON.stringify(code);
};