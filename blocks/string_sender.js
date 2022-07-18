Blockly.Blocks['string_sender'] = {
    init: function () {
        this.jsonInit({
            "colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}",
            "tooltip": "%{BKY_LT_STRING_SENDER_TT}"
        });
        var img = new Blockly.FieldImage("./js/blockly/img/control/ir.png", 16, 16,'*');
        var parent = this;
        var devlist=blocklyDeviceOptionsGet();
        devlist.push(["Server","SRV-ID:114"]);
        this.appendDummyInput('MAIN')
            .appendField(img)
            .appendField(Blockly.Msg["LT_STRING_SENDER"] + ' ');
        this.appendDummyInput('DEV')
            .appendField(Blockly.Msg["LT_STRING_DEV"]+ ' ')
            .appendField(new Blockly.FieldDropdown(devlist), 'DEVICE');
        this.appendDummyInput("ICUSTOM")
            .appendField(Blockly.Msg["LT_STRING_COMMAND"])
            .appendField(new Blockly.FieldTextInput(), 'COMMAND');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    },
    
}

Blockly.JavaScript['string_sender'] = function (block) {
        var command=block.getFieldValue('COMMAND');
        var dev = block.getFieldValue('DEVICE');
    var code = {
        before: "",
        gencode: "",
        after: "",
        global: ""
    };
    var isString;
    if(command.match(/0x[\da-fA-F]+/) !== null || command.match(/.*[^\d]+.*/) === null)
        isString=0;
    else 
        isString=1;
    if(!isString)
    {
        code.gencode+='\nsetStatus('+dev+', '+command+');';
    }
    else
    {
        if((command[0]=="'" && command[command.length-1]=="'") || (command[0]=='"' && command[command.length-1]=='"'))
            code.gencode+=`\nsetStatus(`+dev+`, `+command+`, `+(parseInt(command.length)-2)+`);`;
        else
        {
            var cover;
            var slash = false;
            if (command.includes('"') && command.includes("'"))
            {
                cover="'";
                slash=true;
            }
            else if(command.includes("'"))
                cover='"';
            else cover="'";
            if(slash)
            {
                command=command.replace(/\\'/g, "'");
                command=command.replace(/'/g, "\\'");
            }
            command = cover + command + cover;
            code.gencode+='\nsetStatus('+dev+', ' + command + ', '+(parseInt(command.length)-2)+');';
        }
    }
    return JSON.stringify(code);
};


