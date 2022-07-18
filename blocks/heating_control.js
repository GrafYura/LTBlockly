'use strict';
goog.provide('Blockly.Constants.Heating');
goog.require('Blockly.Blocks');
goog.require('Blockly');

function findModesOnHeating(addr) {
	var item = blocklyLogicXml.find('[addr="' + addr + '"]')[0].outerHTML;

	var expr = new RegExp('.+automation .*name="([\\wА-Яа-я -,.(){}\\[\\]]+)".+', 'g');
	var names = [];
	var el;
	names.push(['Always OFF', 'always-off']);
	names.push(['Manual', '']);
	while (el = expr.exec(item)) {
		names.push([el[1], el[1]]);
	}
	// if (names.length < 1)
	// 	return [['Comfort', 'Comfort'],
	// 	['Hot', 'Hot']];
	return names;
}

function onHeatingChangeEvent(event) {
	if (event.type == Blockly.Events.CHANGE && event.name == 'DEVICE0') {
		var block = Blockly.getMainWorkspace().getBlockById(event.blockId);
		if (block.type == 'heating_control') {
			var drop = new Blockly.FieldDropdown(findModesOnHeating(block.getFieldValue('DEVICE0')));
			block.removeInput('MODE');
			block.appendDummyInput('MODE')
			.appendField(Blockly.Msg['LT_TEXT_SPRINTF_TYPE_MODE'] + ':')
			.appendField(drop, 'MODE');
		}
		else {
			Blockly.getMainWorkspace().getAllBlocks().forEach(element => 
			{
				if (element.type == 'heating_control')
				{
					if(element.getInput('MODE'))
					{
						var drop = new Blockly.FieldDropdown(findModesOnHeating(element.getFieldValue('DEVICE0')));
						element.removeInput('MODE');
						element.appendDummyInput('MODE')
						.appendField(Blockly.Msg['LT_TEXT_SPRINTF_TYPE_MODE'] + ':')
						.appendField(drop, 'MODE');
					}
				}
			});
		}

	}
	else if (event.type == Blockly.Events.CREATE) {
		var block = Blockly.getMainWorkspace().getBlockById(event.blockId);
		if (block.type == 'heating_control'){
			if(block.getInput('MODE'))
				{
					var rval=block.getFieldValue('MODE');
					var drop = new Blockly.FieldDropdown(findModesOnHeating(block.getFieldValue('DEVICE0')));
					block.removeInput('MODE');
					block.appendDummyInput('MODE')
					.appendField(Blockly.Msg['LT_TEXT_SPRINTF_TYPE_MODE'] + ':')
					.appendField(drop, 'MODE');
					block.getField("MODE").setValue(rval);
				}
			}
		else {
			Blockly.getMainWorkspace().getAllBlocks().forEach(element => 
			{
				if (element.type == 'heating_control')
				{
					if(element.getInput('MODE'))
					{
						var rval=element.getFieldValue('MODE');
						var drop = new Blockly.FieldDropdown(findModesOnHeating(element.getFieldValue('DEVICE0')));
						element.removeInput('MODE');
						element.appendDummyInput('MODE')
						.appendField(Blockly.Msg['LT_TEXT_SPRINTF_TYPE_MODE'] + ':')
						.appendField(drop, 'MODE');
						element.getField("MODE").setValue(rval);
					}
				}
			});
		}
	}
}


//Blockly.WorkspaceSvg.addChangeListener(Blockly.Events.disableOrphans);
Blockly.Blocks['heating_control'] = {
	init: function () {
		this.jsonInit(
			{
				"message0": "%2 %{BKY_LT_TEXT_SPRINTF_HEATING} %1",
				"args0": [
					{
						"type": "field_dropdown",
						"name": "DEVICE0",
						"options": blocklyDeviceOptions.bind(this, ["valve-heating"])
					},
					{
						"type": "field_image",
						"src": "js/blockly/img/control/heating.png",
						"width": 16,
						"height": 16,
						"alt": "*"
					}
				],
				"previousStatement": null,
				"nextStatement": null,
				"mutator": "controls_heating_mutator",
				"colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}",
				"tooltip": "%{BKY_LT_CONTROL_HEATING_TT}"
			});
		//disableBlocksNotConnectedToRootNode(injectWorkspace(this));
	}
};
// https://cdn4.iconfinder.com/data/icons/automotive-maintenance/100/auto_heat-512.png
//Blockly.Workspace.addChangeListener(Blockly.Events.disableOrphans);
Blockly.defineBlocksWithJsonArray([
	{
		"type": "controls_mode",
		"message0": "%{BKY_LT_TEXT_SPRINTF_TYPE_MODE}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}"
	},
	{
		"type": "controls_temp",
		"message0": "%{BKY_LT_TEXT_SPRINTF_TYPE_TEMP}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}"
	}
]);
Blockly.Constants.Heating.CONTROLS_MUTATOR_MIXIN = {
	modecount_: 0,
	actcount_: 0,
	devprevcount_: 0,
	tempcount_: 0,
	mutationToDom: function () {
		var container = document.createElement('mutation');
		if (this.modecount_) {
			container.setAttribute('mode', this.modecount_);
		}
		if (this.actcount_) {
			container.setAttribute('action', this.actcount_);
		}
		if (this.tempcount_) {
			container.setAttribute('temp', this.tempcount_);
		}
		return container;
	},
	domToMutation: function (xmlElement) {
		this.modecount_ = parseInt(xmlElement.getAttribute('mode'), 10);
		this.actcount_ = parseInt(xmlElement.getAttribute('action'), 10);
		this.tempcount_ = parseInt(xmlElement.getAttribute('temp'), 10);
		this.updateShape_();
	},
	decompose: function (workspace) {
		workspace.addChangeListener(Blockly.Events.disableOrphans);
		var containerBlock = workspace.newBlock('controls_mutator');
		containerBlock.initSvg();
		var connection = containerBlock.nextConnection;
		if (this.modecount_) {
			var modeBlock = workspace.newBlock('controls_mode');
			modeBlock.initSvg();
			connection.connect(modeBlock.previousConnection);
			connection = modeBlock.nextConnection;
		}
		if (this.actcount_) {
			var actBlock = workspace.newBlock('controls_on_off');
			actBlock.initSvg();
			connection.connect(actBlock.previousConnection);
			connection = actBlock.nextConnection;
		}
		if (this.tempcount_) {
			var tempBlock = workspace.newBlock('controls_temp');
			tempBlock.initSvg();
			connection.connect(tempBlock.previousConnection);
			connection = tempBlock.nextConnection;
		}
		return containerBlock;
	},
	compose: function (containerBlock) {
		var clauseBlock = containerBlock.nextConnection.targetBlock();
		// Count number of inputs.
		this.modecount_ = 0;
		this.actcount_ = 0;
		this.tempcount_ = 0;
		var modeStatementConnection = null;
		var actStatementConnection = null;
		var tempStatementConnection = null;
		while (clauseBlock) {
			switch (clauseBlock.type) {
				case 'controls_mode':
					this.modecount_++;
					modeStatementConnection = clauseBlock.statementConnection_;
					break;
				case 'controls_temp':
					this.tempcount_++;
					tempStatementConnection = clauseBlock.statementConnection_;
					break;
				case 'controls_on_off':
					this.actcount_++;
					actStatementConnection = clauseBlock.statementConnection_;
					break;
				default:
					throw new TypeError('Unknown block type: ' + clauseBlock.type);
			}
			clauseBlock = clauseBlock.nextConnection &&
				clauseBlock.nextConnection.targetBlock();
		}
		this.updateShape_();
		// Reconnect any child blocks.
		Blockly.Mutator.reconnect(modeStatementConnection, this, 'MODE');
		Blockly.Mutator.reconnect(actStatementConnection, this, 'ACT');
		Blockly.Mutator.reconnect(tempStatementConnection, this, 'TEMP');
	},
	updateShape_: function () {
		// Delete everything.
		if (this.modecount_ == 0 && this.getInput('MODE')) {
			this.removeInput('MODE');
		}
		if (this.actcount_ == 0 && this.getInput('ACT')) {
			this.removeInput('ACT');
		}
		if (this.tempcount_ == 0 && this.getInput('TEMP')) {
			this.removeInput('TEMP');
		}

		if (this.modecount_ && !this.getInput('MODE')) {
			this.appendDummyInput('MODE')
				.appendField(Blockly.Msg['LT_TEXT_SPRINTF_TYPE_MODE'] + ':')
				.appendField(new Blockly.FieldDropdown(
					findModesOnHeating(this.getFieldValue('DEVICE0'))), 'MODE');
		}
		if (this.actcount_ && !this.getInput('ACT')) {
			this.appendDummyInput('ACT')
				.appendField(Blockly.Msg['LT_TEXT_SPRINTF_TYPE_ONOFF'] + ':')
				.appendField(new Blockly.FieldDropdown([
					['%{BKY_LT_OTHER_OFF}', '0'],
					['%{BKY_LT_OTHER_ON}', '1']]), 'ACT');
		}
		if (this.tempcount_ && !this.getInput('TEMP')) {
			this.appendDummyInput('TEMP')
				.appendField(Blockly.Msg['LT_HEATING_TEMP'] + ':')
				.appendField(new Blockly.FieldNumber(16), 'TEMP');
		}
		this.devprevcount_ = this.devcount_;
	}
};
function disableBlocksNotConnectedToRootNode(workspace) {
	workspace.addChangeListener(Blockly.Events.disableOrphans);
}

Blockly.Extensions.registerMutator('controls_heating_mutator',
	Blockly.Constants.Heating.CONTROLS_MUTATOR_MIXIN, null,
	['controls_mode', 'controls_on_off', 'controls_temp']);
Blockly.JavaScript['heating_control'] = function (block) {
	// Search the text for a substring.
	var device = block.getFieldValue('DEVICE0');
	var act = block.getFieldValue('ACT');
	var mode = block.getFieldValue('MODE');
	var temp = block.getFieldValue('TEMP');
	var code = {
		before: "",
		gencode: "",
		after: "",
		global: ""
	};
	if (device.length < 1) {
		throw Blockly.Msg["LT_ERROR_EMPTY_DEVICE"] + ' ' + block.type;
	}
	code.gencode = code.gencode + '\nsetStatus(SRV-ID:102,"' + device + '\\0ts:' + temp + '");';
	if (!(mode === null))
		code.gencode = code.gencode + '\nsetStatus(SRV-ID:102,"' + device + '\\0' + mode + '");';
	if (!(act === null))
		code.gencode = code.gencode + '\nsetStatus(' + device + ',' + act + ');';
	return JSON.stringify(code);
};
