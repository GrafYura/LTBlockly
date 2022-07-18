
Blockly.Blocks['sonos'] = {
    init: function () {

        this.appendDummyInput('PLAYER')
            .appendField(new Blockly.FieldImage("js/blockly/img/control/speaker.png", 16, 16, "*"), 'IMG')
            .appendField(Blockly.Msg["LT_CONTROL_SONOS"] + ':')
            .appendField(new Blockly.FieldDropdown(blocklyGetSonosPlayers.bind(this, 'PLAYER')), 'PLAYER');

        this.appendDummyInput('PLAYLIST')
            .appendField(Blockly.Msg['LT_CATEGORY_CONTROL_PLAYLIST'] + ':')
            .appendField(new Blockly.FieldDropdown(blocklyGetSonosPlaylists.bind(this, 'PLAYLIST')), 'PLAYLIST');

        this.appendDummyInput('VOLUME')
            .appendField(Blockly.Msg['LT_MT_VOLUME'] + ':')
            .appendField(new Blockly.FieldNumber(100, 0, 100), 'VOLUME');

        this.appendDummyInput('MODE')
            .appendField(Blockly.Msg["LT_TEXT_SPRINTF_TYPE_MODE"] + ':')
            .appendField(new Blockly.FieldDropdown([
                [Blockly.Msg["LT_SONOS_REPEAT"], "repeat"],
                [Blockly.Msg["LT_SONOS_REPEATONETIMES"], "repeatOne"],
                [Blockly.Msg["LT_SONOS_SHUFFLE"], "shuffle"],
                [Blockly.Msg["LT_SONOS_CROSSFADE"], "crossfade"]]), 'MODE');

        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('%{BKY_LT_CATEGORY_COLOUR_CONTROL}');
        this.setTooltip(Blockly.Msg['LT_CONTROL_SONOS_TT']);

    }
};

Blockly.JavaScript['sonos'] = function (block) {
    // Search the text for a substring.
    var player = block.getFieldValue('PLAYER');
    var list = block.getFieldValue('PLAYLIST');
    var volume = block.getFieldValue('VOLUME');
    var mode = block.getFieldValue('MODE');

    var code = {
        before: "",
        gencode: "",
        after: "",
        global: ""
    };
    if(typeof player !== 'string' || player.length < 1){
		throw Blockly.Msg["LT_ERROR_EMPTY_DEVICE"] + ' ' + block.type;
    }
    if(typeof list !== 'string' || list.length < 1){
		throw Blockly.Msg["LT_ERROR_EMPTY_PLAYLIST"] + ' ' + block.type;
	}
    if (player !== ' ' && list !== ' ') {
        var res = '\'{"player":"' + player + '","playlist":"' + list + '","volume":' + volume + ',"playmodes":["' + mode + '"]}\'';
        code.gencode = '\nsetStatus(SRV-ID:4, ' + res + ');\n';
    }
    return JSON.stringify(code);
};
