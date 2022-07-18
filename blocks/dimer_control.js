'use strict';
goog.provide('Blockly.Constants.Dimer');
goog.require('Blockly.Blocks');
goog.require('Blockly');
Blockly.Blocks['dimer_control'] = {
	init: function () {
		this.jsonInit({
			"message0": "%{BKY_LT_CATEGORY_CONTROL_DIMMER}",
			"args0": [{
					"type": "field_dropdown",
					"name": "DEVICE",
					"options": blocklyDeviceOptions.bind(this, ["dimer-lamp", "dimmer-lamp"])
				},
				{
					"type": "field_image",
					"src": "js/blockly/img/control/dimer.png",
					"width": 16,
					"height": 16,
					"alt": "*"
				}
			],
			"previousStatement": null,
			"nextStatement": null,
			"mutator": "controls_dimer_mutator",
			"colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}",
			"tooltip": "%{BKY_LT_CONTROL_DIMER_TT}"
		});
	}
};
// https://cdn3.iconfinder.com/data/icons/joe-pictos-business-bold/100/lamp_bold_convert-512.png

Blockly.Constants.Dimer.CONTROLS_MUTATOR_MIXIN = {
	timecount_: 0,
	brightnesscount_: 0,
	onoffcount_: 0,
	mutationToDom: function () {
		var container = document.createElement('mutation');
		if (this.timecount_) {
			container.setAttribute('time', this.timecount_);
		}
		if (this.brightnesscount_) {
			container.setAttribute('brightness', this.brightnesscount_);
		}
		if (this.onoffcount_) {
			container.setAttribute('onoff', this.onoffcount_);
		}
		return container;
	},
	domToMutation: function (xmlElement) {
		this.timecount_ = parseInt(xmlElement.getAttribute('time'), 10);
		this.brightnesscount_ = parseInt(xmlElement.getAttribute('brightness'), 10);
		this.onoffcount_ = parseInt(xmlElement.getAttribute('onoff'), 10);
		this.updateShape_();
	},
	decompose: function (workspace) {
		workspace.addChangeListener(Blockly.Events.disableOrphans);
		var containerBlock = workspace.newBlock('controls_mutator');
		containerBlock.initSvg();
		var connection = containerBlock.nextConnection;
		if (this.timecount_) {
			var timeBlock = workspace.newBlock('controls_time');
			timeBlock.initSvg();
			connection.connect(timeBlock.previousConnection);
			connection = timeBlock.nextConnection;
		}
		if (this.brightnesscount_) {
			var brightnessBlock = workspace.newBlock('controls_brightness');
			brightnessBlock.initSvg();
			connection.connect(brightnessBlock.previousConnection);
			connection = brightnessBlock.nextConnection;
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
		this.timecount_ = 0;
		this.brightnesscount_ = 0;
		this.onoffcount_ = 0;
		var timeStatementConnection = null;
		var brightnessStatementConnection = null;
		var onoffStatementConnection = null;
		while (clauseBlock) {
			switch (clauseBlock.type) {
				case 'controls_time':
					this.timecount_++;
					timeStatementConnection = clauseBlock.statementConnection_;
					break;
				case 'controls_brightness':
					this.brightnesscount_++;
					brightnessStatementConnection = clauseBlock.statementConnection_;
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
		Blockly.Mutator.reconnect(timeStatementConnection, this, 'TIME');
		Blockly.Mutator.reconnect(brightnessStatementConnection, this, 'BRIGHTNESS');
		Blockly.Mutator.reconnect(onoffStatementConnection, this, 'ONOFF');
	},
	updateShape_: function () {
		// Delete everything.
		if (this.timecount_ == 0 && this.getInput('TIME')) {
			this.removeInput('TIME');
		}
		if (this.brightnesscount_ == 0 && this.getInput('BRIGHTNESS')) {
			this.removeInput('BRIGHTNESS');
		}
		if (this.onoffcount_ == 0 && this.getInput('ONOFF')) {
			this.removeInput('ONOFF');
		}
		if (this.timecount_ && !this.getInput('TIME')) {
			this.appendDummyInput('TIME')
				.appendField(Blockly.Msg['LT_OTHER_TIME'] + ':')
				.appendField(new Blockly.FieldNumber(5, 0, 255), 'TIME');
		}
		if (this.brightnesscount_ && !this.getInput('BRIGHTNESS')) {
			this.appendDummyInput('BRIGHTNESS')
				.appendField(Blockly.Msg['LT_DIMER_BRIGHTNES'] + ':')
				.appendField(new Blockly.FieldNumber(100, 0, 100), 'BRIGHTNESS')
				.appendField('%');
		}
		if (this.onoffcount_ && !this.getInput('ONOFF')) {
			this.appendDummyInput('ONOFF')
				.appendField(Blockly.Msg['LT_TEXT_SPRINTF_TYPE_ONOFF'] + ':')
				.appendField(new Blockly.FieldDropdown([
					["%{BKY_LT_OTHER_ON}", "1"],
					["%{BKY_LT_OTHER_OFF}", "0"],
					["%{BKY_LT_OTHER_TOGGLE}", "0xFF"]
				]), 'ONOFF');
		}
	}
};
Blockly.Extensions.registerMutator('controls_dimer_mutator',
	Blockly.Constants.Dimer.CONTROLS_MUTATOR_MIXIN, null,
	['controls_time', 'controls_brightness', 'controls_on_off']);
Blockly.JavaScript['dimer_control'] = function (block) {
	// Search the text for a substring.
	var onOff = block.getFieldValue('ONOFF');
	var device = block.getFieldValue('DEVICE');
	var brightness = block.getFieldValue('BRIGHTNESS');
	var time = block.getFieldValue('TIME');
	if (time) {
		time = parseInt(time);
	}
	var code = {
		before: "",
		gencode: "",
		after: "",
		global: ""
	};

	if (device.length < 1) {
		throw Blockly.Msg["ERROR_EMPTY_IF_ALLERT"] + ' ' + block.type;
	}

	var elements = [onOff != null, brightness != null, time != null];

	if (elements[0] || elements[1]) {
		code.gencode = "\nsetStatus(" + device + ", {";
		if (elements[2]) {
			if (!elements[1]) {
				code.gencode += onOff;
			} else {
				code.gencode += (elements[0] ? onOff : '0xFE') + ', ' +
					parseInt(brightness*2.5) + ', ' + time;
			}
		} else if (elements[1]) {
			code.gencode += (elements[0] ? onOff : '0xFE') + ', ' +
				parseInt(brightness*2.5) + ', 0';
		} else {
			code.gencode += onOff;
		}

		code.gencode += '});\n';
	}


	return JSON.stringify(code);
};