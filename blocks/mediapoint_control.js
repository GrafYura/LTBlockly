'use strict';
goog.provide('Blockly.Constants.Multiroom');

goog.require('Blockly.Blocks');
goog.require('Blockly');

Blockly.Blocks['mediapoint_control'] = {
	init: function () {
		this.jsonInit(
			{
				"message0": "%{BKY_LT_CATEGORY_CONTROL_MDEIAPOINT}",
				"args0": [
					{
						"type": "field_dropdown",
						"name": "DEVICE",
						"options": blocklyDeviceOptions.bind(this, ["speaker"])
					},
					{
						"type": "field_image",
						"src": "js/blockly/img/control/speaker.png",
						"width": 16,
						"height": 16,
						"alt": "*"
					}
				],
				"previousStatement": null,
				"nextStatement": null,
				"mutator": "controls_multiroom_mutator",
				"colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}",
				"tooltip": "%{BKY_LT_CONTROL_MEDIAPOINT_TT}"
			});
	}
};
// https://static.thenounproject.com/png/5029-200.png
Blockly.Blocks['mediapoint_sync'] = {
	init: function () {
		this.jsonInit(
			{
				"message0": "Master device: %1 Slave device: %2 Action: %3",
				"args0": [
					{
						"type": "field_dropdown",
						"name": "MASTER",
						"options": blocklyDeviceOptions.bind(this, ["speaker"])
					},
					{
						"type": "field_dropdown",
						"name": "SLAVE",
						"options": blocklyDeviceOptions.bind(this, ["speaker"])
					},
					{
						"type": "field_dropdown",
						"name": "ACT",
						"options": [
							["%{BKY_LT_OTHER_SYNC}", "32"],
							["%{BKY_LT_OTHER_SYNCTODEV}", "33"],
							["%{BKY_LT_OTHER_MOVETODEV}", "34"]]
					}
				],
				"previousStatement": null,
				"nextStatement": null,
				"colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}",
				"tooltip": "%{BKY_LT_SET_STATE_ON_DEVICE_TT}"
			});
	}
};
Blockly.defineBlocksWithJsonArray([
	{
		"type": "media_mutator",
		"message0": "%{BKY_LT_TEXT_SPRINTF_MUTATOR}",
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}"
	},
	{
		"type": "controls_volume",
		"message0": "%{BKY_LT_MT_VOLUME}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}"
	},
	{
		"type": "controls_url",
		"message0": "%{BKY_LT_MT_URL}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}"
	},
	{
		"type": "controls_softstart",
		"message0": "%{BKY_LT_MT_SS}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}"
	},
	{
		"type": "controls_position",
		"message0": "%{BKY_LT_MT_SFP}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}"
	}
]);

Blockly.Constants.Multiroom.CONTROLS_MUTATOR_MIXIN = {
	sofstartcount_: 0,
	volumecount_: 0,
	urlcount_: 0,
	position_: 0,
	onoffcount_: 0,
	mutationToDom: function () {
		var container = document.createElement('mutation');
		if (this.sofstartcount_) {
			container.setAttribute('sofstart', this.sofstartcount_);
		}
		if (this.volumecount_) {
			container.setAttribute('volume', this.volumecount_);
		}
		if (this.urlcount_) {
			container.setAttribute('url', this.urlcount_);
		}
		if (this.position_) {
			container.setAttribute('position', this.position_);
		}
		if (this.onoffcount_) {
			container.setAttribute('onoff', this.onoffcount_);
		}
		return container;
	},
	domToMutation: function (xmlElement) {
		this.sofstartcount_ = parseInt(xmlElement.getAttribute('sofstart'), 10);
		this.volumecount_ = parseInt(xmlElement.getAttribute('volume'), 10);
		this.urlcount_ = parseInt(xmlElement.getAttribute('url'), 10);
		this.position_ = parseInt(xmlElement.getAttribute('position'), 10);
		this.onoffcount_ = parseInt(xmlElement.getAttribute('onoff'), 10);
		this.updateShape_();
	},
	decompose: function (workspace) {
		workspace.addChangeListener(Blockly.Events.disableOrphans);
		var containerBlock = workspace.newBlock('media_mutator');
		containerBlock.initSvg();
		var connection = containerBlock.nextConnection;
		if (this.sofstartcount_) {
			var softstartBlock = workspace.newBlock('controls_softstart');
			softstartBlock.initSvg();
			connection.connect(softstartBlock.previousConnection);
			connection = softstartBlock.nextConnection;
		}
		if (this.volumecount_) {
			var urlBlock = workspace.newBlock('controls_volume');
			urlBlock.initSvg();
			connection.connect(urlBlock.previousConnection);
			connection = urlBlock.nextConnection;
		}
		if (this.urlcount_) {
			var volumeBlock = workspace.newBlock('controls_url');
			volumeBlock.initSvg();
			connection.connect(volumeBlock.previousConnection);
			connection = volumeBlock.nextConnection;
		}
		if (this.position_) {
			var positionBlock = workspace.newBlock('controls_position');
			positionBlock.initSvg();
			connection.connect(positionBlock.previousConnection);
			connection = positionBlock.nextConnection;
		}
		if (this.onoffcount_) {
			var onoffBlock = workspace.newBlock('controls_on_off');
			onoffBlock.initSvg();
			connection.connect(onoffBlock.previousConnection);
			connection = onoffBlock.nextConnection;
		}
		return containerBlock;
	},
	compose: function (containerBlock) {
		var clauseBlock = containerBlock.nextConnection.targetBlock();
		// Count number of inputs.
		this.sofstartcount_ = 0;
		this.volumecount_ = 0;
		this.urlcount_ = 0;
		this.position_ = 0;
		this.onoffcount_ = 0;
		var softstartStatementConnection = null;
		var volumeStatementConnection = null;
		var urlStatementConnection = null;
		var positionStatementConnection = null;
		var onoffStatementConnection = null;
		while (clauseBlock) {
			switch (clauseBlock.type) {
				case 'controls_softstart':
					this.sofstartcount_++;
					softstartStatementConnection = clauseBlock.statementConnection_;
					break;
				case 'controls_volume':
					this.volumecount_++;
					volumeStatementConnection = clauseBlock.statementConnection_;
					break;
				case 'controls_url':
					this.urlcount_++;
					urlStatementConnection = clauseBlock.statementConnection_;
					break;
				case 'controls_position':
					this.position_++;
					positionStatementConnection = clauseBlock.statementConnection_;
					break;
				case 'controls_on_off':
					this.onoffcount_++;
					onoffStatementConnection = clauseBlock.statementConnection_;
					break;
				default:
					throw new TypeError('Unknown block type: ' + clauseBlock.type);
			}
			clauseBlock = clauseBlock.nextConnection &&
				clauseBlock.nextConnection.targetBlock();
		}
		// Reconnect any child blocks.
		Blockly.Mutator.reconnect(softstartStatementConnection, this, 'SOFTSTART');
		Blockly.Mutator.reconnect(volumeStatementConnection, this, 'VOLUME');
		Blockly.Mutator.reconnect(urlStatementConnection, this, 'URL');
		Blockly.Mutator.reconnect(positionStatementConnection, this, 'POSITION');
		Blockly.Mutator.reconnect(onoffStatementConnection, this, 'ONOFF');
		this.updateShape_();
	},
	updateShape_: function () {
		// Delete everything.
		if (this.sofstartcount_ == 0 && this.getInput('SOFTSTART')) {
			this.removeInput('SOFTSTART');
		}
		if (this.volumecount_ == 0 && this.getInput('VOLUME')) {
			this.removeInput('VOLUME');
		}
		if (this.urlcount_ == 0 && this.getInput('URL')) {
			this.removeInput('URL');
		}
		if (this.position_ == 0 && this.getInput('POSITION')) {
			this.removeInput('POSITION');
		}
		if (this.onoffcount_ == 0 && this.getInput('ONOFF')) {
			this.removeInput('ONOFF');
		}
		if (this.sofstartcount_ && !this.getInput('SOFTSTART')) {
			this.appendDummyInput('SOFTSTART')
				.appendField(Blockly.Msg['LT_MT_TIME'] + ':')
				.appendField(new Blockly.FieldNumber('1'), 'SSTIME');
		}
		if (this.volumecount_ && !this.getInput('VOLUME')) {
			this.appendDummyInput('VOLUME')
				.appendField(Blockly.Msg['LT_MT_VOLUME'] + ':')
				.appendField(new Blockly.FieldNumber('150', 0, 250), 'VOL');
		}
		if (this.urlcount_ && !this.getInput('URL')) {
			var img = new Blockly.FieldImage("./js/blockly/media/folder-open-solid.svg", 16, 16, "Browse files", blocklyBrowseMediaDevices.bind(this, 'UR', 'files'));
			img.EDITABLE = true;
			this.appendDummyInput('URL')
				.appendField(Blockly.Msg['LT_MT_PRIORITY'] + ':')
				.appendField(new Blockly.FieldNumber('1', -1, 8), 'RC')
				.appendField(Blockly.Msg["LT_MT_URL"] + ':')
				.appendField(new Blockly.FieldTextInput('http://127.0.0.1/'), 'UR')
				.appendField(img);
		}
		if (this.position_ && !this.getInput('POSITION')) {
			this.appendDummyInput('POSITION')
				.appendField(Blockly.Msg['LT_MT_START_FROM'] + ':')
				.appendField(new Blockly.FieldNumber('0', 0), 'HOURS')
				.appendField(':')
				.appendField(new Blockly.FieldNumber('0', 0), 'MINUTES')
				.appendField(':')
				.appendField(new Blockly.FieldNumber('0', 0), 'SECONDS')
				.appendField('.')
				.appendField(new Blockly.FieldNumber('0', 0), 'MSECONDS')
		}
		if (this.onoffcount_ && !this.getInput('ONOFF')) {
			this.appendDummyInput('ONOFF')
				.appendField(Blockly.Msg["LT_CATEGORY_CONTROL_ACTION"] + ':')
				.appendField(new Blockly.FieldDropdown([
					["%{BKY_LT_OTHER_STOP}", "0"],
					["%{BKY_LT_OTHER_PLAY}", "1"],
					["%{BKY_LT_OTHER_PAUSE}", "2"],
					["%{BKY_LT_OTHER_CONTINUE}", "3"],
					["%{BKY_LT_OTHER_MUTE}", "4"]]), 'ONOFF');
		}
	}
};

Blockly.Extensions.registerMutator('controls_multiroom_mutator',
	Blockly.Constants.Multiroom.CONTROLS_MUTATOR_MIXIN, null,
	['controls_softstart', 'controls_url', 'controls_volume', 'controls_on_off', 'controls_position']);

Blockly.JavaScript['mediapoint_control'] = function (block) {
	// Search the text for a substring.
	var device = block.getFieldValue('DEVICE'),
		act = block.getFieldValue('ONOFF'),
		position = null,
		posH = block.getFieldValue('HOURS'),
		posM = block.getFieldValue('MINUTES'),
		posS = block.getFieldValue('SECONDS'),
		posMS = block.getFieldValue('MSECONDS'),
		sofstart = block.getFieldValue('SSTIME'),
		volume = block.getFieldValue('VOL'),
		rc = block.getFieldValue('RC'),
		url = block.getFieldValue('UR'),
		code = {
			before: "",
			gencode: "",
			after: "",
			global: ""
		};
	if (device.length < 1) {
		throw Blockly.Msg["LT_ERROR_EMPTY_DEVICE"] + ' ' + block.type;
	}
	if (act === null) {
		act = 's=1';
	} else {
		if (act == 4)
			act = 'm=1';
		else
			act = 's=' + act;
	}
	if (posH === null && posM === null && posS === null && posMS === null)
		position = '';
	else {
		if (posH === null) posH = 0;
		if (posM === null) posM = 0;
		if (posS === null) posS = 0;
		if (posMS === null) posMS = 0;
		position = 'p=' + posH + ':' + posM + ':' + posS + '.' + posMS;
	}
	if (sofstart === null)
		sofstart = '';
	else
		sofstart = 'ss=' + sofstart;
	if (volume === null)
		volume = '';
	else
		volume = 'v=' + volume;
	if (rc === null)
		rc = 'r=0';
	else
		rc = 'r=' + rc;
	if (url === null)
		url = '';
	else if (url!='')
		url = 'url=' + url;
	code.gencode = '\nsetStatus(' + device + ',"' + act + ' ' + volume + ' ' + position + ' ' + sofstart + ' ' + rc + ' ' + url + '");\n';
	return JSON.stringify(code);
};
Blockly.JavaScript['mediapoint_sync'] = function (block) {
	// Search the text for a substring.
	var master = block.getFieldValue('MASTER');
	var slave = block.getFieldValue('SLAVE');
	var act = block.getFieldValue('ACT');
	var index = slave.indexOf(':');
	var code = {
		before: "",
		gencode: "",
		after: "",
		global: ""
	};
	code.gencode = '\nsetStatus(' + master + ',{' + act + ','
		+ parseInt(slave.substr(index + 1), 10) + ','
		+ parseInt(slave.substr(0, index), 10) % 256 + ','
		+ parseInt(parseInt(slave.substr(0, index), 10) / 256, 10)
		+ '});\n';
	return JSON.stringify(code);
};
