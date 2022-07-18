function findIrCommands(block) {
    var addr = block.getFieldValue('REMOTE');
    var item = blocklyLogicXml.find('[addr="' + addr + '"]')[0];
    if(item)
        item = item.outerHTML;
    var expr = new RegExp('.*<remote-signal.+identifier="([\\w\\-]+)".+value="([\\d\\w]+)"', 'g');
    var cmds = [];
    var el = null;

    while (el = expr.exec(item)) {
        cmds.push([el[1], el[2]]);
    }
    //alert(names);
    //console.log(names);
    return cmds;
};

Blockly.Blocks['ir_sender'] = {
    init: function () {
        this.jsonInit({
            "colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}",
            "tooltip": "%{BKY_LT_IR_SENDER_TT}"
        });
        var img = new Blockly.FieldImage("./js/blockly/img/control/ir.png", 16, 16,'*');
        var parent = this;
        this.appendDummyInput('MAIN')
            .appendField(img)
            .appendField(Blockly.Msg["LT_IR_SENDER"] + ' ')
            .appendField(new Blockly.FieldCheckbox('false'), 'CUSTOM');
        this.appendDummyInput("IRT")
            .appendField(Blockly.Msg["LT_IRT"]+ ':')
            .appendField(new Blockly.FieldDropdown(blocklyDeviceOptions.bind(this, ["ir-transmitter"])), 'IRT');
            this.appendDummyInput("ICUSTOM")
            .appendField(Blockly.Msg["LT_IR CUSTOM_COMMAND"])
            .appendField(new Blockly.FieldTextInput(), 'CCOMMAND')
            .setVisible(false);
        this.appendDummyInput("IREMOTE")
            .appendField(Blockly.Msg["LT_SELECT_REMOTE_CONTROL"] + ' ')
            .appendField(new Blockly.FieldDropdown(blocklyDeviceOptions.bind(this, ["remote-control"])), 'REMOTE');
        var listRemote = findIrCommands(this);
        this.appendDummyInput("IREMOTE2");
        if(listRemote.length)
        {
            this.getInput("IREMOTE2")
            .appendField(Blockly.Msg["LT_IR_REMOTE_COMMAND"], "L2")
            .appendField(new Blockly.FieldDropdown(findIrCommands(this)),"COMMAND");
        }
        else
        {
            this.getInput("IREMOTE2")
            .appendField(Blockly.Msg["LT_IR_REMOTE_NO_COMMAND"], "LE");
        }
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    },
    onchange: function(ev) {
        if(ev.blockId == this.id)
        {
            if(ev.type == Blockly.Events.CHANGE)
            {
                if(ev.name=="CUSTOM")
                {
                    var custom = this.getFieldValue('CUSTOM')=='TRUE';
                    this.getInput("IREMOTE").setVisible(!custom);
                    this.getInput("IREMOTE2").setVisible(!custom);
                    this.getInput("ICUSTOM").setVisible(custom);
                    this.render();            
                }
                else if(ev.name=="REMOTE")
                {
                    var list = findIrCommands(this);
                    this.getInput("IREMOTE2")
                        .removeField('COMMAND');
                    if(list.length)
                    {
                        this.getInput("IREMOTE2")
                        .removeField('LE');
                        if(!this.getField("L2"))
                        this.getInput("IREMOTE2")
                        .appendField(Blockly.Msg["LT_IR_REMOTE_COMMAND"], "L2");
                        this.getInput("IREMOTE2")
                        .appendField(new Blockly.FieldDropdown(list),"COMMAND");
                    }
                    else
                    {
                        
                        this.getInput("IREMOTE2")
                        .removeField("L2");
                        if(!this.getField("LE"))
                        this.getInput("IREMOTE2")
                        .appendField(Blockly.Msg["LT_IR_REMOTE_NO_COMMAND"], "LE");
                    }
                    this.render();
                }
            }
            else if(ev.type == Blockly.Events.CREATE)
                {
                    var custom = this.getFieldValue('CUSTOM')=='TRUE';
                    this.getInput("IREMOTE").setVisible(!custom);
                    this.getInput("IREMOTE2").setVisible(!custom);
                    this.getInput("ICUSTOM").setVisible(custom);
                    if(!custom)
                    {
                    var list = findIrCommands(this);
                    var rval = this.getFieldValue('COMMAND');
                    this.getInput("IREMOTE2")
                        .removeField('COMMAND');
                    if(list.length)
                    {
                        this.getInput("IREMOTE2")
                        .removeField('LE');
                        if(!this.getField("L2"))
                        this.getInput("IREMOTE2")
                        .appendField(Blockly.Msg["LT_IR_REMOTE_COMMAND"], "L2");
                        this.getInput("IREMOTE2")
                        .appendField(new Blockly.FieldDropdown(list),"COMMAND");
                        this.getField("COMMAND").setValue(rval);
                    }
                    else
                    {
                        
                        this.getInput("IREMOTE2")
                        .removeField("L2");
                        if(!this.getField("LE"))
                        this.getInput("IREMOTE2")
                        .appendField(Blockly.Msg["LT_IR_REMOTE_NO_COMMAND"], "LE");
                    }
                }
                    this.render();
                }
        }
        else
        Blockly.getMainWorkspace().getAllBlocks().forEach(element => 
        {
            if (element.id == this.id)
            {
                if(ev.type == Blockly.Events.CREATE)
                {
                    var custom = this.getFieldValue('CUSTOM')=='TRUE';
                    this.getInput("IREMOTE").setVisible(!custom);
                    this.getInput("IREMOTE2").setVisible(!custom);
                    this.getInput("ICUSTOM").setVisible(custom);
                    if(!custom)
                    {
                    var list = findIrCommands(this);
                    var rval = this.getFieldValue('COMMAND');
                    this.getInput("IREMOTE2")
                        .removeField('COMMAND');
                    if(list.length)
                    {
                        this.getInput("IREMOTE2")
                        .removeField('LE');
                        if(!this.getField("L2"))
                        this.getInput("IREMOTE2")
                        .appendField(Blockly.Msg["LT_IR_REMOTE_COMMAND"], "L2");
                        this.getInput("IREMOTE2")
                        .appendField(new Blockly.FieldDropdown(list),"COMMAND");
                        this.getField("COMMAND").setValue(rval);
                    }
                    else
                    {
                        
                        this.getInput("IREMOTE2")
                        .removeField("L2");
                        if(!this.getField("LE"))
                        this.getInput("IREMOTE2")
                        .appendField(Blockly.Msg["LT_IR_REMOTE_NO_COMMAND"], "LE");
                    }
                }
                    this.render();
                }
            }
        });
}
}

Blockly.JavaScript['ir_sender'] = function (block) {
        var custom = block.getFieldValue('CUSTOM')=='TRUE';
        var sygnal=null;
        var IRT = block.getFieldValue('IRT');
    var code = {
        before: "",
        gencode: "",
        after: "",
        global: ""
    };
    if(custom)
        sygnal=block.getFieldValue("CCOMMAND");
    else
        sygnal=block.getFieldValue("COMMAND");
    code.gencode="\n setStatus(" +IRT +", 0x"+sygnal+");";
    return JSON.stringify(code);
};
