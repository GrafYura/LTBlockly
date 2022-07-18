/**
 * Main event
 */

function simpleModbusEvent(event) {

    /**
     * Add DATA inputs
     */
    if (event.type == Blockly.Events.CREATE) {
        Blockly.getMainWorkspace().getAllBlocks().forEach(block => {
            if (block.type == 'modbus') {
                if(block.getFieldValue('CMD') == '0x10'){
                var count=0;
                count = parseInt(block.getFieldValue('COUNT'), 10);
                for (let i = 0; i < count; i++) {
                    block.getInput('DATAI' + i).setVisible(true);
                }
                block.getField("COUNTTXT").setVisible(true);
                block.getField("COUNT").setVisible(true);
                block.getField("ACTTXT").setVisible(false);
                block.getField("ACT").setVisible(false);
            }
            else if (block.getFieldValue('CMD') == '0x03')
            {
                block.getField("COUNTTXT").setVisible(true);
                block.getField("COUNT").setVisible(true);
                block.getField("ACTTXT").setVisible(false);
                block.getField("ACT").setVisible(false);

            }
            else if (block.getFieldValue('CMD') == '0x01')
            {
                block.getField("COUNTTXT").setVisible(false);
                block.getField("COUNT").setVisible(false);
                block.getField("ACTTXT").setVisible(false);
                block.getField("ACT").setVisible(false);
                
            }
            else if (block.getFieldValue('CMD') == '0x05')
            {
                block.getField("COUNTTXT").setVisible(false);
                block.getField("COUNT").setVisible(false);
                block.getField("ACTTXT").setVisible(true);
                block.getField("ACT").setVisible(true);
            }
        }
            block.render();
        });
    }

    /**
     * Read or write
     */

    if (event.type == Blockly.Events.CHANGE) {
        var block = Blockly.getMainWorkspace().getBlockById(event.blockId);
        if (block && block.type == 'modbus') {
            var cmd = block.getFieldValue('CMD');
            if(cmd=='0x01' && event.name == 'CMD')
            {
                for (let i = 0; block.getInput('DATAI' + i); i++) {
                    block.getInput('DATAI' + i).setVisible(false);
                }
                 block.getField("COUNTTXT").setVisible(false);
                block.getField("COUNT").setVisible(false);
                block.getField("ACTTXT").setVisible(false);
                block.getField("ACT").setVisible(false);
            }
            else if(cmd=='0x05' && event.name == 'CMD')
            {
                for (let i = 0; block.getInput('DATAI' + i); i++) {
                    block.getInput('DATAI' + i).setVisible(false);
                }
                 block.getField("COUNTTXT").setVisible(false);
                block.getField("COUNT").setVisible(false);
                block.getField("ACTTXT").setVisible(true);
                block.getField("ACT").setVisible(true);
            }
            else if (cmd == '0x10' &&
                (event.name == 'COUNT' ||
                    event.name == 'CMD')) {
                if (event.name == 'COUNT') {
                    const oldVal = parseInt(event.oldValue);
                    const newVal = parseInt(event.newValue);
                    //console.log(event);
                    if (newVal > oldVal) {
                        for (let i = oldVal; i < newVal; i++) {
                            //console.log(i);
                            block.getInput('DATAI' + i).setVisible(true);
                        }
                    } else if (newVal < oldVal) {
                        for (let i = oldVal; i >= newVal; i--) {
                            block.getInput('DATAI' + i).setVisible(false);
                        }
                    }
                } else {
                    const count = block.getFieldValue('COUNT');
                    for (let i = 0; i < count; i++) {
                        block.getInput('DATAI' + i).setVisible(true);
                    }
                }
                 block.getField("COUNTTXT").setVisible(true);
                block.getField("COUNT").setVisible(true);
                block.getField("ACTTXT").setVisible(false);
                block.getField("ACT").setVisible(false);
            } else if (cmd == '0x03') {
                for (let i = 0; block.getInput('DATAI' + i); i++) {
                    block.getInput('DATAI' + i).setVisible(false);
                }
                 block.getField("COUNTTXT").setVisible(true);
                block.getField("COUNT").setVisible(true);
                block.getField("ACTTXT").setVisible(false);
                block.getField("ACT").setVisible(false);
            }
            block.render();
        }
        else {
            Blockly.getMainWorkspace().getAllBlocks().forEach(element => 
            {
                if (element.type == 'modbus') {
                    var cmd = element.getFieldValue('CMD');
                    if(cmd=='0x01' && event.name == 'CMD')
            {
                for (let i = 0; element.getInput('DATAI' + i); i++) {
                    element.getInput('DATAI' + i).setVisible(false);
                }
                 element.getField("COUNTTXT").setVisible(false);
                element.getField("COUNT").setVisible(false);
                block.getField("ACTTXT").setVisible(false);
                block.getField("ACT").setVisible(false);
            }
            else if(cmd=='0x05' && event.name == 'CMD')
            {
                for (let i = 0; element.getInput('DATAI' + i); i++) {
                    element.getInput('DATAI' + i).setVisible(false);
                }
                 element.getField("COUNTTXT").setVisible(false);
                element.getField("COUNT").setVisible(false);
                block.getField("ACTTXT").setVisible(true);
                block.getField("ACT").setVisible(true);
            }
                    if (cmd == '0x10' &&
                        (event.name == 'COUNT' ||
                            event.name == 'CMD')) {
                        if (event.name == 'COUNT') {
                            const oldVal = parseInt(event.oldValue);
                            const newVal = parseInt(event.newValue);
                    //console.log(event);
                    if (newVal > oldVal) {
                        for (let i = oldVal; i < newVal; i++) {
                            //console.log(i);
                            element.getInput('DATAI' + i).setVisible(true);
                        }
                    } else if (newVal < oldVal) {
                        for (let i = oldVal; i >= newVal; i--) {
                            element.getInput('DATAI' + i).setVisible(false);
                        }
                    }
                } else {
                    const count = element.getFieldValue('COUNT');
                    for (let i = 0; i < count; i++) {
                        element.getInput('DATAI' + i).setVisible(true);
                    }
                }
                element.getField("COUNTTXT").setVisible(true);
                element.getField("COUNT").setVisible(true);
                block.getField("ACTTXT").setVisible(false);
                block.getField("ACT").setVisible(false);
            } else if (cmd == '0x03') {
                for (let i = 0; element.getInput('DATAI' + i); i++) {
                    element.getInput('DATAI' + i).setVisible(false);
                }
                element.getField("COUNTTXT").setVisible(true);
                element.getField("COUNT").setVisible(true);
                block.getField("ACTTXT").setVisible(false);
                block.getField("ACT").setVisible(false);
            }
        }
        element.render();
    });
        }
    }
}

/**
 * Number to bytes 
 */

function toRegFormat(resultnumber) {
    var result = resultnumber.toString(16);
    if (result.length <= 2) {
        result = '00' + result;
    }

    result = '0x' + result + ', ';

    return result;
}

/**
 * Print registers
 */

function printRegs() {
    var res = '\n{\n';
    res += '\nu8 *__status__ = opt;'
    res += '\nu8 __sta__[100]="";\n'
    res += '\nfor(u8 __i__ = 0; __i__ < optl; ++__i__) {'
    res += '\nsprintf(__sta__+strlen(__sta__), "%.2X", __status__[__i__]);'
    res += '\n}\n'
    res += '\nsprintf(__sta__ + strlen(__sta__), "\\10");'
    res += '\nsrvError(&__sta__);'
    res += '\n}\n';

    return res;
}

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// BLOCKS //////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

/**
 * Modbus
 */

Blockly.Blocks['modbus'] = {
    init: function () {
        this.jsonInit({
            "message0": "%5%{BKY_LT_OTHER_MODBUS}",
            "args0": [{
                "type": "field_dropdown",
                "name": "DEVICE",
                "options": blocklyDeviceOptions.bind(this, ["com-port"])
            },
            {
                "type": "field_number",
                "name": "SENDTO",
                "value": 1,
                "min": 0
            },
            {
                "type": "field_dropdown",
                "name": "CMD",
                "options": [
                    ["%{BKY_LT_OTHER_MODBUS_READ}", "0x03"],
                    ["%{BKY_LT_OTHER_MODBUS_READCOIL}", "0x01"],
                    ["%{BKY_LT_OTHER_MODBUS_WRITE}", "0x10"],
                    ["%{BKY_LT_OTHER_MODBUS_WRITECOIL}", "0x05"]
                ]
            },
            {
                "type": "field_number",
                "name": "FROM",
                "value": 0,
                "min": 0
            },
            {
                "type": "field_image",
                "src": "js/blockly/img/other/modbus.png",
                "width": 16,
                "height": 16,
                "alt": "*"
            }
            ],
            "previousStatement": null,
            "nextStatement": null,
            'colour': '%{BKY_LT_CATEGORY_COLOUR_OTHER}',
            "tooltip": "Sending a request for the modbus protocol"
        });
        this.getInput(0).appendField(" Count:", "COUNTTXT")
        .appendField(new Blockly.FieldNumber(1,1,255), "COUNT");
        this.getInput(0).appendField(" Action:", "ACTTXT")
        .appendField(new Blockly.FieldDropdown([
                                    [Blockly.Msg['LT_ON'], "0xFF00"],
                                    [Blockly.Msg['LT_OFF'], "0x0000"]]), "ACT");
        this.getField("ACTTXT").setVisible(false);
        this.getField("ACT").setVisible(false);
         for (let i = 0; i < 128; i++) {
            this.appendDummyInput('DATAI' + i)
            .appendField('Value ' + (i + 1) + ': ')
            .appendField(new Blockly.FieldNumber(0), 'DATA' + i).setVisible(false);
        }

        // for (let i = 0; i < 128; i++) {
        //     this.appendDummyInput('DATA' + i)
        //         .appendField('Value ' + (i + 1) + ': ')
        //         .appendField(new Blockly.FieldNumber(0), 'DATA' + i);
        // }
    }
};

/**
 * Modbus take
 */

Blockly.Blocks['modbus_take'] = {
    init: function () {
        this.jsonInit({
            "message0": "%1ModBus %{BKY_LT_OTHER_MODBUS_ANSWER_SHOW}",
            "args0": [
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
            "previousStatement": null,
            "nextStatement": null,
        });
    }
};

//
//
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// GENCODE /////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

/**
 * Modbus
 */

Blockly.JavaScript['modbus'] = function (block) {
    var device = block.getFieldValue('DEVICE');
    var sendTo = block.getFieldValue('SENDTO');
    var cmd = block.getFieldValue('CMD');
    var from = block.getFieldValue('FROM');
    var count = block.getFieldValue('COUNT');
    var action = block.getFieldValue('ACT');
    if(!device.length)
        throw "Error, ModBus not selected.";
    if (cmd=='0x01' || cmd=='0x05')
        count='1';
    if (device.length < 1) {
        $.msalert(Blockly.Msg["ERROR_EMPTY_DEVICE"] + ' ' + block.type);
        throw new Blockly.Msg["ERROR_EMPTY_DEVICE"] + ' ' + block.type;
    }
    var code = {
        before: "",
        gencode: "",
        after: "",
        global: ""
    };
    count = parseInt(count);
    if(cmd == '0x10' && count==1)
        cmd='0x06';

    code.gencode = '\nsetStatus(' + device + ', {' + sendTo + ', ' + cmd + ', ';
    code.gencode += toRegFormat(parseInt(from, 10));


    if (cmd == '0x10') 
    {
        code.gencode += toRegFormat(count);
        code.gencode += count * 2 + ', ';
        for (let i = 0; i < count; i++) 
        {
           let val = block.getFieldValue('DATA' + i);
           code.gencode += toRegFormat(parseInt(val, 10));
        }
    }
    else if (cmd == '0x06') 
    {
        let val = block.getFieldValue('DATA0');
        code.gencode += toRegFormat(parseInt(val, 10));
    }
    else if(cmd == '0x03' || cmd=='0x01')
    {
        code.gencode += toRegFormat(count);
    }
    else if(cmd=='0x05')
    {
        code.gencode += action + ', '
    }
   code.gencode += '0xCC16});\n';

   return JSON.stringify(code);
};

/**
 * Modbus take
 */

Blockly.JavaScript['modbus_take'] = function (block) {
    var code = {
        before: "",
        gencode: "",
        after: "",
        global: ""
    };
        code.gencode = printRegs();
    return JSON.stringify(code);
};