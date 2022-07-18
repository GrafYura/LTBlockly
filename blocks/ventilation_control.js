'use strict';
goog.provide('Blockly.Constants.Ventilation');
goog.require('Blockly.Blocks');
goog.require('Blockly');
Blockly.Blocks['ventilation_control'] = {
	init: function () {
		this.jsonInit(
			{
				"message0": "%2%{BKY_LT_TEXT_SPRINTF_VENTILATION}: %1",
				"args0": [
					{
						"type": "field_dropdown",
						"name": "DEVICE",
						"options": blocklyDeviceOptions.bind(this, ["virtual"])
					},
					{
						"type": "field_image",
						"src": "js/blockly/img/control/ventilation.png",
						"width": 16,
						"height": 16,
						"alt": "*"
					}
				],
				"previousStatement": null,
				"nextStatement": null,
				"mutator": "controls_ventilation_mutator",
				"colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}",
				"tooltip": "%{BKY_LT_CONTROL_VENTILATION_TT}"
			});
	}
};
// https://cdn4.iconfinder.com/data/icons/automotive-maintenance/100/auto_ventilation-on-512.png

Blockly.Constants.Ventilation.CONTROLS_MUTATOR_MIXIN = {
	powercount_: 0,
	tempcount_: 0,
	onoffcount_: 0,
	mutationToDom: function () {
		var container = document.createElement('mutation');
		if (this.powercount_) {
			container.setAttribute('power', this.powercount_);
		}
		if (this.tempcount_) {
			container.setAttribute('temp', this.tempcount_);
		}
		if (this.onoffcount_) {
			container.setAttribute('onoff', this.onoffcount_);
		}
		return container;
	},
	domToMutation: function (xmlElement) {
		this.powercount_ = parseInt(xmlElement.getAttribute('power'), 10);
		this.tempcount_ = parseInt(xmlElement.getAttribute('temp'), 10);
		this.onoffcount_ = parseInt(xmlElement.getAttribute('onoff'), 10);
		this.updateShape_();
	},
	decompose: function (workspace) {
		workspace.addChangeListener(Blockly.Events.disableOrphans);
		var containerBlock = workspace.newBlock('controls_mutator');
		containerBlock.initSvg();
		var connection = containerBlock.nextConnection;
		if (this.powercount_) {
			var powerBlock = workspace.newBlock('controls_fan');
			powerBlock.initSvg();
			connection.connect(powerBlock.previousConnection);
			connection = powerBlock.nextConnection;
		}
		if (this.tempcount_) {
			var tempBlock = workspace.newBlock('controls_temp');
			tempBlock.initSvg();
			connection.connect(tempBlock.previousConnection);
			connection = tempBlock.nextConnection;
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
		this.powercount_ = 0;
		this.tempcount_ = 0;
		this.onoffcount_ = 0;
		var powerStatementConnection = null;
		var tempStatementConnection = null;
		var onoffStatementConnection = null;
		while (clauseBlock) {
			switch (clauseBlock.type) {
				case 'controls_fan':
					this.powercount_++;
					powerStatementConnection = clauseBlock.statementConnection_;
					break;
				case 'controls_temp':
					this.tempcount_++;
					tempStatementConnection = clauseBlock.statementConnection_;
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
		this.updateShape_();
		// Reconnect any child blocks.
		Blockly.Mutator.reconnect(powerStatementConnection, this, 'POWER');
		Blockly.Mutator.reconnect(tempStatementConnection, this, 'TEMP');
		Blockly.Mutator.reconnect(onoffStatementConnection, this, 'ONOFF');
	},
	updateShape_: function () {
		// Delete everything.
		if (this.powercount_ == 0 && this.getInput('POWER')) {
			this.removeInput('POWER');
		}
		if (this.tempcount_ == 0 && this.getInput('TEMP')) {
			this.removeInput('TEMP');
		}
		if (this.onoffcount_ == 0 && this.getInput('ONOFF')) {
			this.removeInput('ONOFF');
		}
		if (this.powercount_ && !this.getInput('POWER')) {
			this.appendDummyInput('POWER')
				.appendField(Blockly.Msg['LT_TEXT_SPRINTF_TYPE_FAN'] + ':')
				.appendField(new Blockly.FieldDropdown([
					[Blockly.Msg['LT_CONDITIONER_FAN_AUTO'], '0'],
					[Blockly.Msg['LT_CONDITIONER_FAN_WEAK'], '1'],
					[Blockly.Msg['LT_CONDITIONER_FAN_MEDIUM'], '2'],
					[Blockly.Msg['LT_CONDITIONER_FAN_STRONG'], '3']]), 'POWER');
		}
		if (this.tempcount_ && !this.getInput('TEMP')) {
			this.appendDummyInput('TEMP')
				.appendField(Blockly.Msg['LT_OTHER_TEMTERATURA'] + ':')
				.appendField(new Blockly.FieldNumber(20, 16, 31), 'TEMP');
		}
		if (this.onoffcount_ && !this.getInput('ONOFF')) {
			this.appendDummyInput('ONOFF')
				.appendField(Blockly.Msg['LT_TEXT_SPRINTF_TYPE_ONOFF'] + ':')
				.appendField(new Blockly.FieldDropdown([
					["%{BKY_LT_OTHER_ON}", "1"],
					["%{BKY_LT_OTHER_OFF}", "0"],
					["%{BKY_LT_OTHER_TOGGLE}", "0xFF"]]), 'ONOFF');
		}
	}
};


Blockly.Extensions.registerMutator('controls_ventilation_mutator',
	Blockly.Constants.Ventilation.CONTROLS_MUTATOR_MIXIN, null,
	['controls_fan', 'controls_temp', 'controls_on_off']);
Blockly.JavaScript['ventilation_control'] = function (block) {
	// Search the text for a substring.
	var onOff = block.getFieldValue('ONOFF'),
		device = block.getFieldValue('DEVICE'),
		temp = block.getFieldValue('TEMP'),
		power = block.getFieldValue('POWER'),
		code = {
			before: "",
			gencode: "",
			after: "",
			global: ""
		};
	if (device.length < 1) {
		throw Blockly.Msg["LT_ERROR_EMPTY_DEVICE"] + ' ' + block.type;
	}
	code.gencode = '\nsetStatus(' + device;
	var large_status = false;
	if (onOff === null) {
		onOff = '0xFE';
	}
	if (temp === null) {
		temp = '[' + device + '.1]';
	} else {
		temp = parseInt(temp) - 16;
		large_status = true;
	}
	if (power === null) {
		power = '[' + device + '.4]';
	} else {
		large_status = true;
	}
	if (!large_status) {
		code.gencode += ',' + onOff + ');';
	} else {
		code.gencode += ',{' + onOff + ',' + temp + ',' + power + '});';
	}
	return JSON.stringify(code);
};
