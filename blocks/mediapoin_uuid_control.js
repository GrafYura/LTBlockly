'use strict';
goog.provide('Blockly.Constants.Multiroom_UUID');

goog.require('Blockly.Blocks');
goog.require('Blockly');

Blockly.Blocks['mediapoint_uuid_control'] = {
	init: function () {
		this.jsonInit(
			{
				"message0": "%{BKY_LT_CATEGORY_CONTROL_MDEIAPOINT_UUID}",
				"args0": [
					{
						"type": "field_dropdown",
						"name": "UUID",
						"options": blocklyGetMultiroomServers.bind(this, "UUID")
					},
					{
						"type": "field_image",
						"src": "https://static.thenounproject.com/png/5029-200.png",
						"width": 16,
						"height": 16,
						"alt": "*"
					}
				],
				"previousStatement": null,
				"nextStatement": null,
				"mutator": "controls_multiroom_UUID_mutator",
				"colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}",
				"tooltip": "%{BKY_LT_CONTROL_UUID_TT}"
			});
	}
};
Blockly.defineBlocksWithJsonArray([
	{
		"type": "controls_mute",
		"message0": "%{BKY_LT_OTHER_MUTE_UUID}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}"
	}
]);

Blockly.Constants.Multiroom_UUID.CONTROLS_MUTATOR_MIXIN = {
	mutecount_: 0,
	volumecount_: 0,
	urlcount_: 0,
	mutationToDom: function () {
		var container = document.createElement('mutation');
		if (this.mutecount_) {
			container.setAttribute('mute', this.mutecount_);
		}
		if (this.volumecount_) {
			container.setAttribute('volume', this.volumecount_);
		}
		if (this.urlcount_) {
			container.setAttribute('url', this.urlcount_);
		}
		return container;
	},
	domToMutation: function (xmlElement) {
		this.mutecount_ = parseInt(xmlElement.getAttribute('mute'), 10);
		this.volumecount_ = parseInt(xmlElement.getAttribute('volume'), 10);
		this.urlcount_ = parseInt(xmlElement.getAttribute('url'), 10);
		this.updateShape_();
	},
	decompose: function (workspace) {
		workspace.addChangeListener(Blockly.Events.disableOrphans);
		var containerBlock = workspace.newBlock('controls_mutator');
		containerBlock.initSvg();
		var connection = containerBlock.nextConnection;
		if (this.mutecount_) {
			var softstartBlock = workspace.newBlock('controls_mute');
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
		return containerBlock;
	},
	compose: function (containerBlock) {
		var clauseBlock = containerBlock.nextConnection.targetBlock();
		// Count number of inputs.
		this.mutecount_ = 0;
		this.volumecount_ = 0;
		this.urlcount_ = 0;
		var muteStatementConnection = null;
		var volumeStatementConnection = null;
		var urlStatementConnection = null;
		while (clauseBlock) {
			switch (clauseBlock.type) {
				case 'controls_mute':
					this.mutecount_++;
					muteStatementConnection = clauseBlock.statementConnection_;
					break;
				case 'controls_volume':
					this.volumecount_++;
					volumeStatementConnection = clauseBlock.statementConnection_;
					break;
				case 'controls_url':
					this.urlcount_++;
					urlStatementConnection = clauseBlock.statementConnection_;
					break;
				default:
					throw new TypeError('Unknown block type: ' + clauseBlock.type);
			}
			clauseBlock = clauseBlock.nextConnection &&
				clauseBlock.nextConnection.targetBlock();
		}
		this.updateShape_();
		// Reconnect any child blocks.
		Blockly.Mutator.reconnect(muteStatementConnection, this, 'MUTE');
		Blockly.Mutator.reconnect(volumeStatementConnection, this, 'VOLUME');
		Blockly.Mutator.reconnect(urlStatementConnection, this, 'URL');
	},
	updateShape_: function () {
		if (this.mutecount_ == 0 && this.getInput('MUTE')) {
			this.removeInput('MUTE');
		}
		if (this.volumecount_ == 0 && this.getInput('VOLUME')) {
			this.removeInput('VOLUME');
		}
		if (this.urlcount_ == 0 && this.getInput('URL')) {
			this.removeInput('URL');
		}
		if (this.mutecount_ && !this.getInput('MUTE')) {
			this.appendDummyInput('MUTE')
				.appendField(Blockly.Msg["LT_OTHER_MUTE_UUID"] + ':')
				.appendField(new Blockly.FieldDropdown([
					[Blockly.Msg["LT_OTHER_ON"], "0"],
					[Blockly.Msg["LT_OTHER_OFF"], "1"]]), 'MUTE')
		}
		if (this.volumecount_ && !this.getInput('VOLUME')) {
			this.appendDummyInput('VOLUME')
				.appendField(Blockly.Msg['LT_MT_VOLUME'] + ':')
				.appendField(new Blockly.FieldNumber('20', 0, 100), 'VOL');
		}
		if (this.urlcount_ && !this.getInput('URL')) {
			var img = new Blockly.FieldImage("./js/blockly/media/folder-open-solid.svg", 16, 16, "Browse files", blocklyBrowseMediaDevices.bind(this, 'URL', 'files'));
			img.EDITABLE = true;
			this.appendDummyInput('URL')
				.appendField(Blockly.Msg["LT_MT_URL"] + ':')
				.appendField(new Blockly.FieldTextInput('http://tuner.hit104.com:80	'), 'URL')
				.appendField(img);
		}
	}
};

Blockly.Extensions.registerMutator('controls_multiroom_UUID_mutator',
	Blockly.Constants.Multiroom_UUID.CONTROLS_MUTATOR_MIXIN, null,
	['controls_url', 'controls_volume', 'controls_mute']);
Blockly.JavaScript['mediapoint_uuid_control'] = function (block) {
	// Search the text for a substring.
	var uuid = block.getFieldValue('UUID'),
	mute = block.getFieldValue('MUTE'),
	volume = block.getFieldValue('VOL'),
	url = block.getFieldValue('URL'),
	code = {
		before: "",
		gencode: "",
		after: "",
		global: ""
	};
	if(uuid.length < 1){
		throw Blockly.Msg["LT_ERROR_EMPTY_DEVICE"] + ' ' + block.type;
	}
	if (url) {
		code.gencode += '\nsetStatus(2043:1,{"' + uuid + '","cmdply","' + url + '"});\n';
	}
	if (volume) {
		code.gencode += '\nsetStatus(2043:1,{"' + uuid + '","cmdvol",' + volume + '});\n';
	}
	if (mute) {
		code.gencode += '\nsetStatus(2043:1,{"' + uuid + '","cmdmut",' + mute + '});\n';
	}
	return JSON.stringify(code);
};