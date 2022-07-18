'use strict';
goog.provide('Blockly.Constants.Getbyte');
goog.require('Blockly.Blocks');
goog.require('Blockly');
function getByteControl_edit(block) {
	var value = 0,
		condition = "";
	if (block.getInput('START')) {
		value = parseInt(block.getFieldValue('VALUE'), 10);
		condition = block.getFieldValue('CONDITION');
		block.removeInput('START');
	}
	if (block.getParent()) {
		if (block.getParent().type == 'controls_if') {
			switch (InputType(block, block.getFieldValue('DEVICE'), null)) {
				case "sensor":
					if (block.getInput('DOOR'))
						block.removeInput('DOOR');
					if (block.getInput('DEVICE'))
						block.removeInput('DEVICE');
					if (block.getInput('SWITCH'))
						block.removeInput('SWITCH');
					if (!block.getInput('SENSOR')) {
						if (condition == " == 1" || condition == " == 0" || condition == ' == 0xFF' || condition == ' == 0xFD' || condition == ' == 0xFC')
							condition = "GT";
						block.appendDummyInput('SENSOR')
							.appendField(Blockly.Msg["LT_CATEGORY_EVENTS_EVENT_DEVICE_CONDITION"])
							.appendField(new Blockly.FieldDropdown([
								["\u200F>", "GT"],
								["\u2260", "NEQ"],
								["\u200F<", "LT"],
								["\u200F\u2264", "LTE"],
								["=", "EQ"],
								["\u200F\u2265", "GTE"]
							]), 'CONDITION')
							.appendField(new Blockly.FieldNumber(value), 'VALUE');
						block.getField('CONDITION').setValue(condition);
					}
					break;
				case "co2":
					if (block.getInput('DOOR'))
						block.removeInput('DOOR');
					if (block.getInput('DEVICE'))
						block.removeInput('DEVICE');
					if (block.getInput('SWITCH'))
						block.removeInput('SWITCH');
					if (!block.getInput('SENSOR')) {
						if (condition == " == 1" || condition == " == 0" || condition == ' == 0xFF' || condition == ' == 0xFD' || condition == ' == 0xFC')
							condition = "GT";
						block.appendDummyInput('SENSOR')
							.appendField(Blockly.Msg["LT_CATEGORY_EVENTS_EVENT_DEVICE_CONDITION"])
							.appendField(new Blockly.FieldDropdown([
								["\u200F>", "GT"],
								["\u2260", "NEQ"],
								["\u200F<", "LT"],
								["\u200F\u2264", "LTE"],
								["=", "EQ"],
								["\u200F\u2265", "GTE"]
							]), 'CONDITION')
							.appendField(new Blockly.FieldNumber(value), 'VALUE');
						block.getField('CONDITION').setValue(condition);
					}
					break;
				case "device":
					if (block.getInput('DOOR'))
						block.removeInput('DOOR');
					if (block.getInput('SENSOR'))
						block.removeInput('SENSOR');
					if (block.getInput('SWITCH'))
						block.removeInput('SWITCH');
					if (!block.getInput('DEVICE')) {
						if ((condition != " == 1") && (condition != " == 0"))
							condition = " == 1";
						block.appendDummyInput('DEVICE')
							.appendField(Blockly.Msg["LT_CATEGORY_EVENTS_EVENT_DEVICE_CONDITION"])
							.appendField(new Blockly.FieldDropdown([
								[Blockly.Msg["LT_CATEGORY_EVENTS_EVENT_DEVICE_CONDITION_ON"], " == 1"],
								[Blockly.Msg["LT_CATEGORY_EVENTS_EVENT_DEVICE_CONDITION_OFF"], " == 0"]]), 'CONDITION');
						block.getField('CONDITION').setValue(condition);
					}
					break;
				case "door":
					if (block.getInput('DEVICE'))
						block.removeInput('DEVICE');
					if (block.getInput('SENSOR'))
						block.removeInput('SENSOR');
					if (block.getInput('SWITCH'))
						block.removeInput('SWITCH');
					if (!block.getInput('DOOR')) {
						if ((condition != " == 1") && (condition != " == 0"))
							condition = " == 1";
						block.appendDummyInput('DOOR')
							.appendField(Blockly.Msg["LT_CATEGORY_EVENTS_EVENT_DEVICE_CONDITION"])
							.appendField(new Blockly.FieldDropdown([
								[Blockly.Msg["LT_CATEGORY_EVENTS_EVENT_DEVICE_CONDITION_ON_DOOR"], " == 1"],
								[Blockly.Msg["LT_CATEGORY_EVENTS_EVENT_DEVICE_CONDITION_OFF_DOOR"], " == 0"]]), 'CONDITION');
						block.getField('CONDITION').setValue(condition);
					}
					break;
				case "switch":
					if (block.getInput('DOOR'))
						block.removeInput('DOOR');
					if (block.getInput('SENSOR'))
						block.removeInput('SENSOR');
					if (block.getInput('DEVICE'))
						block.removeInput('DEVICE');
					if (!block.getInput('SWITCH')) {
						if (condition != ' == 0xFF' && condition != ' == 0xFD' && condition != ' == 0xFC')
							condition = ' == 0xFF';
						block.appendDummyInput('SWITCH')
							.appendField(Blockly.Msg["LT_CATEGORY_EVENTS_EVENT_DEVICE_CONDITION"])
							.appendField(new Blockly.FieldDropdown([
								[Blockly.Msg["LT_EVENT_DEVICE_CONDITION_SWITCH_FF"], " == 0xFF"],
								[Blockly.Msg["LT_EVENT_DEVICE_CONDITION_SWITCH_FD"], " == 0xFD"],
								[Blockly.Msg["LT_EVENT_DEVICE_CONDITION_SWITCH_FC"], " == 0xFC"]]), 'CONDITION');
						block.getField('CONDITION').setValue(condition);
					}
					break;
				default:
					if (block.getInput('DOOR'))
						block.removeInput('DOOR');
					if (block.getInput('SENSOR'))
						block.removeInput('SENSOR');
					if (block.getInput('DEVICE'))
						block.removeInput('DEVICE');
					if (block.getInput('SWITCH'))
						block.removeInput('SWITCH');
					break;
			}
		}
	}
	else {
		if (block.getInput('DOOR'))
			block.removeInput('DOOR');
		if (block.getInput('SENSOR'))
			block.removeInput('SENSOR');
		if (block.getInput('DEVICE'))
			block.removeInput('DEVICE');
	}
}
function getByteControlEvent(event) {
	var block = Blockly.getMainWorkspace().getBlockById(event.blockId);
	if (block) {
		if (block.type == 'getbyte_control') {
			getByteControl_edit(block);
		}
		else {
			Blockly.getMainWorkspace().getAllBlocks().forEach(element => {
				if (element.type == 'getbyte_control') {
					getByteControl_edit(element);
				}
			});
		}
	}
}
Blockly.Blocks['getbyte_control'] = {
	init: function () {
		this.setOutput(true);
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("js/blockly/img/devices/devices.png", 16, 16, "*"))
			.appendField(Blockly.Msg["LT_CATEGORY_STATUS_DESCRIPTION"])
			.appendField(new Blockly.FieldDropdown(blocklyDeviceOptions.bind(this)), 'DEVICE');
		this.appendDummyInput('START')
			.appendField(Blockly.Msg["LT_CATEGORY_EVENTS_EVENT_DEVICE_CONDITION"])
			.appendField(new Blockly.FieldDropdown([
				["\u200F>", "GT"],
				["\u2260", "NEQ"],
				["\u200F<", "LT"],
				["\u200F\u2264", "LTE"],
				["=", "EQ"],
				["\u200F\u2265", "GTE"],
				[Blockly.Msg["LT_CATEGORY_EVENTS_EVENT_DEVICE_CONDITION_ON"], " == 1"],
				[Blockly.Msg["LT_CATEGORY_EVENTS_EVENT_DEVICE_CONDITION_OFF"], " == 0"]
			]), 'CONDITION')
			.appendField(new Blockly.FieldNumber(), 'VALUE');
		if (this.workspace != Blockly.getMainWorkspace())
			this.removeInput('START');
		this.setColour(Blockly.Msg["LT_CATEGORY_COLOUR_STATUS"]);
		this.setTooltip(Blockly.Msg["LT_STATUS_GET_STATUS_TT"]);
	},
	output: "Number"
};
Blockly.JavaScript['getbyte_control'] = function (block) {
	// Search the text for a substring.
	var device = block.getFieldValue('DEVICE'),
		mode = block.getFieldValue('MODE'),
		cond = block.getFieldValue('CONDITION'),
		val = block.getFieldValue('VALUE'),
		code = {
			before: "",
			gencode: "",
			after: "",
			global: ""
		},
		typeval = InputType(block, val, null),
		typedev = InputType(block, device, null);
	if (device.length < 1) {
		throw Blockly.Msg["LT_ERROR_EMPTY_DEVICE"] + ' ' + block.type;
	}
	switch (cond) {
		case "EQ":
			cond = '==';
			break;
		case "NEQ":
			cond = '!=';
			break;
		case "LT":
			cond = '<';
			break;
		case "LTE":
			cond = '<=';
			break;
		case "GT":
			cond = '>';
			break;
		case "GTE":
			cond = '>=';
			break;
	}
	if (block.getParent().type == 'csv_google_sprdsht_controller'
		|| block.getParent().type == 'messenger_control'
		|| block.getParent().type == 'notification_push'
		|| block.getParent().type == 'notification_log_error'
		|| block.getParent().type == 'notification_textbox'
		|| block.getParent().type == 'variebles_setter') {
		switch (typedev) {
			case 'device':
				code.gencode = '%s';
				code.after += '([' + device + '.0]&7)?"'
					+ Blockly.Msg["LT_CATEGORY_EVENTS_EVENT_DEVICE_CONDITION_ON"]
					+ '"' + ':' + '"'
					+ Blockly.Msg["LT_CATEGORY_EVENTS_EVENT_DEVICE_CONDITION_OFF"] + '"';
				break;
			case 'sensor':
				code.gencode = '%c%hhd.%02d';
				code.after += '[' + device + '.1] <= 0x7F ?0x20:((([' + device + '.1] + 1)&0xFF) == 0?0x2d:0x20),[' + device + '.1] <= 0x7F ?([' + device + '.1]):([' + device + '.1] + 1), [' + device + '.0]*100/250';
				break;
			case 'co2':
				code.gencode = '%d';
				code.after += '(([' + device + '.1]<<8) + [' + device + '.0])';
				break;
			case 'switch':
				code.gencode = '0x%02x';
				code.after += '[' + device + '.0]';
				break;
		}
	} else {
		if (block.getInput('SENSOR')) {
			if (typeval == 'float') {
				val = convert2byte(val);
				code.gencode = '[' + device + ']' + cond + val;
			}
			else if(typedev=='co2')
			{
				code.gencode = '(([' + device + '.1]<<8) + [' + device + '.0])' + cond + val;
			}
			else
				code.gencode = '[' + device + '.1]' + cond + val;
		}
		else if (block.getInput('DEVICE'))
			code.gencode = '([' + device + '.0]&7)' + cond;
		else if (block.getInput('SWITCH'))
			code.gencode = '[' + device + '.0]' + cond;
		else if (block.getInput('DOOR'))
			code.gencode = '[' + device + '.0]'+cond;
		else if(typedev=='co2')
			{
				code.gencode = '(([' + device + '.1]<<8) + [' + device + '.0])';
			}
		else
			code.gencode = device;
	}
	return JSON.stringify(code);
};


