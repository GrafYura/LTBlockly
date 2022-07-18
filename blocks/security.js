class Sensors {
	constructor(address, type) {
		this.address = address;
		this.type = type;
		this.condition = null;
		this.value = null;
		this.value_type = null;
	}

}
class Areas {
	constructor(name) {
		this.name = name;
		this.sensors = [];
		this.actions = null;
		this.type = 0;
		this.condition = false;
	}
	get get_sens_condition() {
		var finaly_condition = '',
			i = 0;
		this.condition = true;
		this.sensors.forEach(sens => {
			++i;
			if (sens.type == 'device')
				finaly_condition += '([' + sens.address + '.0]&7)'; ////tuta
			if (sens.type == 'sensor') {
				if (sens.address.indexOf('[') == -1) {
					if (sens.value_type == 'float') {
						sens.value = convert2byte(sens.value);
						sens.address = '[' + sens.address + ']';
					}
					else
						sens.address = '[' + sens.address + '.1]';
				}
				finaly_condition += '(' + sens.address + sens.condition + sens.value + ')'; ////tuta
			}
			if (this.sensors[i])
				finaly_condition += '||';
		});
		return finaly_condition;

	}
}
class Notify {
	constructor() {
		this.url = null;
		this.actions = null;
	}
}
class Speakers {
	constructor(address) {
		this.address = address;
		this.volume = 100;
		this.priority = 0;
		this.softstart = 0;
	}
}
function security_remove_sens(_id) {
	var i = 0,
		addr = 'SENS' + _id;
	while (this.getInput(addr + i)) {
		switch (InputType(this, this.getFieldValue(addr + i), null)) {
			case 'integer':
				if (this.getInput(addr + (i + 1))) {
					this.removeInput(addr + i);
					var j = i;
					while (this.getInput(addr + (j + 1))) {
						this.getField(addr + (j + 1)).name = addr + j;
						if (this.getField('COND' + _id + (j + 1)))
							this.getField('COND' + _id + (j + 1)).name = 'COND' + _id + j;
						if (this.getField('VALUE' + _id + (j + 1)))
							this.getField('VALUE' + _id + (j + 1)).name = 'VALUE' + _id + j;
						this.getInput(addr + (j + 1)).name = addr + j;
						++j;
					}
				}
				break;

			default:
				break;
		}
		++i;
	}
}
function security_add_sens(_id, _value = null) {
	var i = 0,
		addr = 'SENS' + _id;
	while (this.getInput(addr + i)) {
		++i;
	}
	if (i < 3) {
		this.appendDummyInput(addr + i)
			.appendField(Blockly.Msg['LT_TEXT_SPRINTF_SENS'] + ':')
			.appendField(new Blockly.FieldDropdown(blocklyDeviceOptions.bind(this, ['motion-sensor', 'door-sensor'])), 'SENS' + _id + i);
		if (_value)
			this.getField('SENS' + _id + i).setValue(_value);
		if (this.getInput('pre_AREA' + (parseInt(_id) + 1)))
			this.moveInputBefore('SENS' + _id + i, 'pre_AREA' + (parseInt(_id) + 1));
		else
			this.moveInputBefore('SENS' + _id + i, 'ADDAREA');
		security_editor(this);
	}
}
function security_add_mediapoint(field, value) {
	var i = 0;
	if (this.getField(field)) {
		this.getField(field).setValue(value);
	}
	else {
		while (this.getInput('MEDIAPOINT_SETTINGS_' + i)) {
			++i;
		}
		var img_mediapoint_settings = new Blockly.FieldImage("./js/blockly/img/teamplates/settings.png", 16, 16, "Settings", security_add_mediapoint_settings.bind(this, 'MEDIAPOINT_SETTINGS_' + i, 'VOLUME_' + i));
		img_mediapoint_settings.EDITABLE = true;
		this.appendDummyInput('MEDIAPOINT_SETTINGS_' + i)
			.appendField(Blockly.Msg["LT_MDEIAPOINT"] + ':')
			.appendField(new Blockly.FieldDropdown(blocklyDeviceOptions.bind(this, ['speaker'])), 'MEDIAPOINT_' + i)
			.appendField(img_mediapoint_settings, 'ADD_MEDP_SETTINGS_' + i);
		this.moveInputBefore('MEDIAPOINT_SETTINGS_' + i, 'pre_AREA0');
	}
}
function security_add_text_field(input, field) {
	if (!this.getField(field)) {
		var offset = 0;
		if (field.indexOf('URL_') != -1) {
			offset = 2;
			if (field.substring(field.length - 1) == '0')
				offset = 3;
			if (this.getField('CUSTOM_MSG_' + field.substring(field.length - 1)))
				++offset;
		}
		else {
			offset = 1;
			if (field.substring(field.length - 1) == '0')
				offset = 2;
		}
		var text = 'path to file';
		if (field.indexOf('CUSTOM_MSG_') != -1)
			switch (field.substring(field.length - 1)) {
				case '0':
					text = Blockly.Msg["LT_SECURITY_TIMER_TEXT"];
					break;
				case '1':
					text = Blockly.Msg["LT_SECURITY_ON_MSG_TEXT"];
					break;
				case '2':
					text = Blockly.Msg["LT_SECURITY_OFF_MSG_TEXT"];
					break;
				case '3':
					text = Blockly.Msg["LT_SECURITY_ERROR_MSG_TEXT"];
					break;
				case '4':
					text = Blockly.Msg["LT_SECURITY_RCOVERY_MSG_TEXT"];
					break;
				case '5':
					text = Blockly.Msg["LT_SECURITY_ALARM_MSG_TEXT"];
					break;
				case '6':
					text = Blockly.Msg["LT_SECURITY_WARNING_TEXT"];
					break;
			}
		this.getInput(input).insertFieldAt(offset, new Blockly.FieldTextInput(text), field);
		if (field.indexOf('URL_') != -1)
			blocklyBrowseMediaDevices.call(this, field, 'files');
	} else if (this.getField(field) && field.indexOf('URL_') != -1)
		blocklyBrowseMediaDevices.call(this, field, 'files');
	else if (this.getField(field))
		this.getInput(input).removeField(field);
}
function security_add_settings(input, prev_input, last_input) {
	if (!this.getInput(input)) {
		this.appendStatementInput(input);
		if (!this.getInput(prev_input)) {
			this.moveInputBefore(input, last_input);
		}
		else {
			this.moveInputBefore(input, prev_input);
		}
	}
	else {
		this.removeInput(input);
	}
}
function security_add_area() {
	var i = 0;
	while (this.getInput('AREA' + i)) {
		++i;
	}
	this.appendDummyInput('pre_AREA' + i).
		appendField('_________________________________________________', 'AREALINE_' + i);
	this.appendDummyInput('AREA' + i)
		.appendField((i + 1) + ' ' + Blockly.Msg['LT_SECURITY_AREA'] + ':')
		.appendField(new Blockly.FieldTextInput((i + 1) + ' ' + Blockly.Msg['LT_SECURITY_AREA']), 'AREADSCR' + i);
	this.appendDummyInput('SENS' + i + '0')
		.appendField(Blockly.Msg['LT_TEXT_SPRINTF_SENS'] + ':')
		.appendField(new Blockly.FieldDropdown(blocklyDeviceOptions.bind(this, ['motion-sensor', 'door-sensor'])), 'SENS' + i + '0')
	this.moveInputBefore('AREA' + i, 'ADDAREA');
	this.moveInputBefore('SENS' + i + '0', 'ADDAREA');
	this.moveInputBefore('pre_AREA' + i, 'AREA' + i);
}
function security_remove_area() {
	var i = 0;
	while (this.getInput('AREA' + i)) {
		++i;
	}
	--i;
	if (i > 0) {
		this.removeInput('AREA' + i);
		this.removeInput('pre_AREA' + i);
		this.removeInput('AREA_SETTINGS' + i);
		this.removeInput('AREA_TYPE_' + i);
		var j = 0;
		while (this.getInput('SENS' + i + j)) {
			this.removeInput('SENS' + i + j);
			++j;
		}
	}
}
function security_remove_empty_mediapoints(_block, _index) {
	if (_block.getInput('MEDIAPOINT_SETTINGS_' + (_index + 1))) {
		_block.removeInput('MEDIAPOINT_SETTINGS_' + _index);
		var j = _index;
		while (_block.getInput('MEDIAPOINT_SETTINGS_' + (j + 1))) {
			if (_block.getField('VOLUME_' + j) && _block.getField('VOLUME_' + (j + 1))) {
				_block.getField('VOLUME_' + (j + 1)).name = 'VOLUME_' + j;
				_block.getField('prev_VOLUME_' + (j + 1)).name = 'VOLUME_' + j;
			}
			if (_block.getField('SOFTSTRT_' + j) && _block.getField('SOFTSTRT_' + (j + 1))) {
				_block.getField('SOFTSTRT_' + (j + 1)).name = 'SOFTSTRT_' + j;
				_block.getField('prev_SOFTSTRT_' + (j + 1)).name = 'prev_SOFTSTRT_' + j;
			}
			if (_block.getField('PRIOR_' + j) && _block.getField('PRIOR_' + (j + 1))) {
				_block.getField('PRIOR_' + (j + 1)).name = 'PRIOR_' + j;
				_block.getField('prev_PRIOR_' + (j + 1)).name = 'prev_PRIOR_' + j;
			}
			_block.getField('MEDIAPOINT_' + (j + 1)).name = 'MEDIAPOINT_' + j;
			_block.getInput('MEDIAPOINT_SETTINGS_' + (j + 1)).removeField('ADD_MEDP_SETTINGS_' + (j + 1));
			var img_mediapoint_settings = new Blockly.FieldImage("./js/blockly/img/teamplates/settings.png", 16, 16, "Settings", security_add_mediapoint_settings.bind(_block, 'MEDIAPOINT_SETTINGS_' + j, ['VOLUME_' + j, 'PRIOR_' + j, 'SOFTSTRT_' + j]));
			img_mediapoint_settings.EDITABLE = true;
			_block.getInput('MEDIAPOINT_SETTINGS_' + (j + 1)).name = 'MEDIAPOINT_SETTINGS_' + j;
			_block.getInput('MEDIAPOINT_SETTINGS_' + j).appendField(img_mediapoint_settings, 'ADD_MEDP_SETTINGS_' + j);
			++j;
		}
		while (InputType(_block, _block.getFieldValue('MEDIAPOINT_' + j), null) == 'integer'
			&& InputType(_block, _block.getFieldValue('MEDIAPOINT_' + (j - 1)), null) == 'integer') {
			_block.removeInput('MEDIAPOINT_' + j);
			--j;
		}
	}
}
function security_editor(block) {
	var i = 0, j = 0;
	while (block.getInput('SENS' + i + j)) {
		switch (InputType(block, block.getFieldValue('SENS' + i + j), null)) {
			case 'sensor':
				if (!block.getField('COND' + i + j)) {
					block.getInput('SENS' + i + j)
						.appendField(new Blockly.FieldDropdown([
							["\u200F>", "GT"],
							["\u2260", "NEQ"],
							["\u200F<", "LT"],
							["\u200F\u2264", "LTE"],
							["=", "EQ"],
							["\u200F\u2265", "GTE"]
						]), 'COND' + i + j)
						.appendField(new Blockly.FieldNumber(50), 'VALUE' + i + j);
				}
				if (!block.getInput('SENS' + i + (j + 1)) && ((j + 1) < 3))
					security_add_sens.call(block, i, '-1');
				break;
			case 'device':
				if (block.getField('COND' + i + j)) {
					block.getInput('SENS' + i + j)
						.removeField('COND' + i + j);
					block.getInput('SENS' + i + j)
						.removeField('VALUE' + i + j);
				}
				if (!block.getInput('SENS' + i + (j + 1)) && ((j + 1) < 3))
					security_add_sens.call(block, i, '-1');
				break;
			case 'integer':
				security_remove_sens.call(block, i);
				break;
			default:
				break;
		}
		++j;
		if (!block.getInput('SENS' + i + j)) {
			++i;
			j = 0;
		}
	}
	i = 0;
	while (block.getInput('NOTIFY_' + i)) {
		if (block.getField('URL_' + i) && block.getFieldValue('URL_' + i) == 'path to file')
			block.getInput('NOTIFY_' + i).removeField('URL_' + i);
		++i;
	}
	i = 0;
	while (block.getInput('MEDIAPOINT_SETTINGS_' + i)) {
		if (InputType(block, block.getFieldValue('MEDIAPOINT_' + i), null) != 'integer') {
			var img_mediapoint_settings = new Blockly.FieldImage("./js/blockly/img/teamplates/settings.png", 16, 16, "Settings", security_add_mediapoint_settings.bind(block, 'MEDIAPOINT_SETTINGS_' + (i + 1), 'VOLUME_' + (i + 1)));
			img_mediapoint_settings.EDITABLE = true;
			if (!block.getInput('MEDIAPOINT_SETTINGS_' + (i + 1))) {
				block.appendDummyInput('MEDIAPOINT_SETTINGS_' + (i + 1))
					.appendField(Blockly.Msg["LT_MDEIAPOINT"] + ':')
					.appendField(new Blockly.FieldDropdown(blocklyDeviceOptions.bind(block, ['speaker'])), 'MEDIAPOINT_' + (i + 1))
					.appendField(img_mediapoint_settings, 'ADD_MEDP_SETTINGS_' + (i + 1));
				block.moveInputBefore('MEDIAPOINT_SETTINGS_' + (i + 1), 'pre_AREA0');
			}
		}
		else {
			security_remove_empty_mediapoints(block, i);
		}
		++i;
	}
}
function security_events(event) {
	var block = Blockly.getMainWorkspace().getBlockById(event.blockId);
	if (block) {
		if (block.type == 'security_control') {
			security_editor(block);
		}
	}
	else {
		Blockly.getMainWorkspace().getAllBlocks().forEach(bl => {
			if (bl.type == 'security_control') {
				security_editor(bl);
			}
		});
	}
}
function security_add_mediapoint_settings(input, field) {
	if (!this.getField(field)) {
		var offset = 2;
		this.getInput(input).insertFieldAt(offset, Blockly.Msg["LT_MT_VOLUME"] + ':', 'pre_' + field);
		++offset;
		this.getInput(input).insertFieldAt(offset, new Blockly.FieldNumber(50, 0, 100), field);
		++offset;
		this.getInput(input).insertFieldAt(offset, '%', 'proc_' + field);

	}
	else {
		this.getInput(input).removeField('proc_' + field);
		this.getInput(input).removeField('pre_' + field);
		this.getInput(input).removeField(field);
	}
}
function render_security(thisBlock) {
	var img = new Blockly.FieldImage("./js/blockly/img/control/add.png", 16, 16, "Add area", security_add_area.bind(thisBlock)),
		img_neg = new Blockly.FieldImage("./js/blockly/img/control/minus.png", 16, 16, "Remove area", security_remove_area.bind(thisBlock)),
		img_sound_0 = new Blockly.FieldImage("./js/blockly/img/control/speaker.png", 16, 16, "Add sound", security_add_text_field.bind(thisBlock, 'NOTIFY_0', 'URL_0')),
		img_sound_1 = new Blockly.FieldImage("./js/blockly/img/control/speaker.png", 16, 16, "Add sound", security_add_text_field.bind(thisBlock, 'NOTIFY_1', 'URL_1')),
		img_sound_2 = new Blockly.FieldImage("./js/blockly/img/control/speaker.png", 16, 16, "Add sound", security_add_text_field.bind(thisBlock, 'NOTIFY_2', 'URL_2')),
		img_sound_3 = new Blockly.FieldImage("./js/blockly/img/control/speaker.png", 16, 16, "Add sound", security_add_text_field.bind(thisBlock, 'NOTIFY_3', 'URL_3')),
		img_sound_4 = new Blockly.FieldImage("./js/blockly/img/control/speaker.png", 16, 16, "Add sound", security_add_text_field.bind(thisBlock, 'NOTIFY_4', 'URL_4')),
		img_sound_5 = new Blockly.FieldImage("./js/blockly/img/control/speaker.png", 16, 16, "Add sound", security_add_text_field.bind(thisBlock, 'NOTIFY_5', 'URL_5')),
		img_sound_6 = new Blockly.FieldImage("./js/blockly/img/control/speaker.png", 16, 16, "Add sound", security_add_text_field.bind(thisBlock, 'NOTIFY_6', 'URL_6'));
	img_message_0 = new Blockly.FieldImage("./js/blockly/img/teamplates/message.png", 16, 16, "Add SECURITYTIMER", security_add_text_field.bind(thisBlock, 'NOTIFY_0', 'CUSTOM_MSG_0')),
		img_message_1 = new Blockly.FieldImage("./js/blockly/img/teamplates/message.png", 16, 16, "Add SECURITYON", security_add_text_field.bind(thisBlock, 'NOTIFY_1', 'CUSTOM_MSG_1')),
		img_message_2 = new Blockly.FieldImage("./js/blockly/img/teamplates/message.png", 16, 16, "Add SECURITYOFF", security_add_text_field.bind(thisBlock, 'NOTIFY_2', 'CUSTOM_MSG_2')),
		img_message_3 = new Blockly.FieldImage("./js/blockly/img/teamplates/message.png", 16, 16, "Add SECURITYERROR", security_add_text_field.bind(thisBlock, 'NOTIFY_3', 'CUSTOM_MSG_3')),
		img_message_4 = new Blockly.FieldImage("./js/blockly/img/teamplates/message.png", 16, 16, "Add SECURITYRECOVERY", security_add_text_field.bind(thisBlock, 'NOTIFY_4', 'CUSTOM_MSG_4')),
		img_message_5 = new Blockly.FieldImage("./js/blockly/img/teamplates/message.png", 16, 16, "Add SECURITYALARM", security_add_text_field.bind(thisBlock, 'NOTIFY_5', 'CUSTOM_MSG_5')),
		img_message_6 = new Blockly.FieldImage("./js/blockly/img/teamplates/message.png", 16, 16, "Add SECURITYWARNING", security_add_text_field.bind(thisBlock, 'NOTIFY_6', 'CUSTOM_MSG_6'));
	img_notify_settings_0 = new Blockly.FieldImage("./js/blockly/img/teamplates/settings.png", 16, 16, "Settings", security_add_settings.bind(thisBlock, 'NOTIFY_SETTINFS_0', 'NOTIFY_1', 'NOTIFY_1'));
	img_notify_settings_1 = new Blockly.FieldImage("./js/blockly/img/teamplates/settings.png", 16, 16, "Settings", security_add_settings.bind(thisBlock, 'NOTIFY_SETTINFS_1', 'NOTIFY_2', 'NOTIFY_2'));
	img_notify_settings_2 = new Blockly.FieldImage("./js/blockly/img/teamplates/settings.png", 16, 16, "Settings", security_add_settings.bind(thisBlock, 'NOTIFY_SETTINFS_2', 'NOTIFY_3', 'NOTIFY_3'));
	img_notify_settings_3 = new Blockly.FieldImage("./js/blockly/img/teamplates/settings.png", 16, 16, "Settings", security_add_settings.bind(thisBlock, 'NOTIFY_SETTINFS_3', 'NOTIFY_4', 'NOTIFY_4'));
	img_notify_settings_4 = new Blockly.FieldImage("./js/blockly/img/teamplates/settings.png", 16, 16, "Settings", security_add_settings.bind(thisBlock, 'NOTIFY_SETTINFS_4', 'NOTIFY_5', 'NOTIFY_5'));
	img_notify_settings_5 = new Blockly.FieldImage("./js/blockly/img/teamplates/settings.png", 16, 16, "Settings", security_add_settings.bind(thisBlock, 'NOTIFY_SETTINFS_5', 'NOTIFY_6', 'NOTIFY_6'));
	img_notify_settings_6 = new Blockly.FieldImage("./js/blockly/img/teamplates/settings.png", 16, 16, "Settings", security_add_settings.bind(thisBlock, 'NOTIFY_SETTINFS_6', 'pre_TIME_SETTINGS', 'pre_TIME_SETTINGS'));
	img_mediapoint_settings_0 = new Blockly.FieldImage("./js/blockly/img/teamplates/settings.png", 16, 16, "Settings", security_add_mediapoint_settings.bind(thisBlock, 'MEDIAPOINT_SETTINGS_0', 'VOLUME_0'));
	img.EDITABLE = true;
	img_sound_0.EDITABLE = true;
	img_sound_1.EDITABLE = true;
	img_sound_2.EDITABLE = true;
	img_sound_3.EDITABLE = true;
	img_sound_4.EDITABLE = true;
	img_sound_5.EDITABLE = true;
	img_sound_6.EDITABLE = true;
	img_message_0.EDITABLE = true;
	img_message_1.EDITABLE = true;
	img_message_2.EDITABLE = true;
	img_message_3.EDITABLE = true;
	img_message_4.EDITABLE = true;
	img_message_5.EDITABLE = true;
	img_message_6.EDITABLE = true;
	img_notify_settings_0.EDITABLE = true;
	img_notify_settings_1.EDITABLE = true;
	img_notify_settings_2.EDITABLE = true;
	img_notify_settings_3.EDITABLE = true;
	img_notify_settings_4.EDITABLE = true;
	img_notify_settings_5.EDITABLE = true;
	img_notify_settings_6.EDITABLE = true;
	img_neg.EDITABLE = true;
	img_notify_settings_0.EDITABLE = true;
	img_mediapoint_settings_0.EDITABLE = true;
	thisBlock.removeInput('START');
	thisBlock.appendDummyInput('NOTIFY_0')
		.appendField(new Blockly.FieldImage("./js/blockly/img/teamplates/security.png", 16, 16, "*"))
		.appendField(Blockly.Msg['LT_SECURITY_TIMER_TEXT_DESCR'] + ':')
		.appendField(img_message_0, 'SECURITYTIMER')
		.appendField(img_sound_0, 'ADDNOTIFY_0')
		.appendField(img_notify_settings_0, 'ADD_NOTIFY_SETTINGS_0');
	thisBlock.appendDummyInput('NOTIFY_1')
		.appendField(Blockly.Msg['LT_SECURITY_ON_MSG_TEXT_DESCR'] + ':')
		.appendField(img_message_1, 'SECURITYON')
		.appendField(img_sound_1, 'NOTIFY_1')
		.appendField(img_notify_settings_1, 'ADD_NOTIFY_SETTINGS_1');
	thisBlock.appendDummyInput('NOTIFY_2')
		.appendField(Blockly.Msg['LT_SECURITY_OFF_MSG_TEXT_DESCR'] + ':')
		.appendField(img_message_2, 'SECURITYOFF')
		.appendField(img_sound_2, 'NOTIFY_2')
		.appendField(img_notify_settings_2, 'ADD_NOTIFY_SETTINGS_2');
	thisBlock.appendDummyInput('NOTIFY_3')
		.appendField(Blockly.Msg['LT_SECURITY_ERROR_MSG_TEXT_DESCR'] + ':')
		.appendField(img_message_3, 'SECURITYERROR')
		.appendField(img_sound_3, 'ADDNOTIFY_3')
		.appendField(img_notify_settings_3, 'ADD_NOTIFY_SETTINGS_3');
	thisBlock.appendDummyInput('NOTIFY_4')
		.appendField(Blockly.Msg['LT_SECURITY_RCOVERY_MSG_TEXT_DESCR'] + ':')
		.appendField(img_message_4, 'SECURITYRECOVERY')
		.appendField(img_sound_4, 'ADDNOTIFY_4')
		.appendField(img_notify_settings_4, 'ADD_NOTIFY_SETTINGS_4');
	thisBlock.appendDummyInput('NOTIFY_5')
		.appendField(Blockly.Msg['LT_SECURITY_ALARM_MSG_TEXT_DESCR'] + ':')
		.appendField(img_message_5, 'SECURITYALARM')
		.appendField(img_sound_5, 'ADDNOTIFY_5')
		.appendField(img_notify_settings_5, 'ADD_NOTIFY_SETTINGS_5');
	thisBlock.appendDummyInput('NOTIFY_6')
		.appendField(Blockly.Msg['LT_SECURITY_WARNING_TEXT_DESCR'] + ':')
		.appendField(img_message_6, 'SECURITYWARNING')
		.appendField(img_sound_6, 'ADDNOTIFY_6')
		.appendField(img_notify_settings_6, 'ADD_NOTIFY_SETTINGS_6');
	thisBlock.appendDummyInput('pre_TIME_SETTINGS').
		appendField('_________________________________________________', 'TIMELINE');
	thisBlock.appendDummyInput('TIME_SETTINGS')
		.appendField(Blockly.Msg['LT_SECURITY_RECOVERY_TIME_MSG_TEXT'] + ':')
		.appendField(new Blockly.FieldNumber(5), 'RECOVERY_TIME')
		.appendField(Blockly.Msg["LT_EVENT_TIME_MINUTES"]);
	thisBlock.appendDummyInput('TIME_SETTINGS')
		.appendField(Blockly.Msg['LT_SECURITY_TIMER_TIME_MSG_TEXT'] + ':')
		.appendField(new Blockly.FieldNumber(20), 'TIMER_TIME')
		.appendField(Blockly.Msg["LT_EVENT_TIME_SECONDS"]);
	thisBlock.appendDummyInput('pre_MEDIAPOINT_SETTINGS_0').
		appendField('_________________________________________________', 'MEDIALINE');
	thisBlock.appendDummyInput('MEDIAPOINT_SETTINGS_0')
		.appendField(Blockly.Msg["LT_MDEIAPOINT"] + ':')
		.appendField(new Blockly.FieldDropdown(blocklyDeviceOptions.bind(thisBlock, ['speaker'])), 'MEDIAPOINT_0')
		.appendField(img_mediapoint_settings_0, 'ADD_MEDP_SETTINGS_0');
	thisBlock.appendDummyInput('pre_AREA0').
		appendField('_________________________________________________', 'AREALINE_0');
	thisBlock.appendDummyInput('AREA0')
		.appendField('1 ' + Blockly.Msg['LT_SECURITY_AREA'] + ':')
		.appendField(new Blockly.FieldTextInput('1 ' + Blockly.Msg['LT_SECURITY_AREA']), 'AREADSCR0');
	thisBlock.appendDummyInput('SENS00')
		.appendField(Blockly.Msg['LT_TEXT_SPRINTF_SENS'] + ':')
		.appendField(new Blockly.FieldDropdown(blocklyDeviceOptions.bind(thisBlock, ['motion-sensor', 'door-sensor'])), 'SENS00');
	thisBlock.appendDummyInput('ADDAREA')
		.appendField(img)
		.appendField(img_neg);
	thisBlock.setInputsInline(false);
	thisBlock.setColour('%{BKY_LT_CATEGORY_COLOUR_TEAMPLATES}');
	//thisBlock.setTooltip(Blockly.Msg["SRDSHT_DESCR"]);
	if (!Blockly.getMainWorkspace().listeners_.includes(security_events))
		Blockly.getMainWorkspace().addChangeListener(security_events);
}
Blockly.Blocks['security_control'] = {
	init: function () {
		var img = new Blockly.FieldImage("./js/blockly/img/teamplates/security.png", 16, 16, "Add area");
		this.appendDummyInput('START')
			.appendField(img)
			.appendField(Blockly.Msg["LT_SECURITY_DESCR"]);
		this.setColour('%{BKY_LT_CATEGORY_COLOUR_TEAMPLATES}');
		if (this.workspace == Blockly.getMainWorkspace()){
			if(!ifBlockExcist('security_control')){
				render_security(this);
			}else{
				var ereser = new Blockly.Events.BlockDelete(this);
				ereser.run(true);
			}
		}
	}
};
Blockly.JavaScript['security_control'] = function (block) {
	var security_timer = block.getField('CUSTOM_MSG_0') ? block.getFieldValue('CUSTOM_MSG_0') : Blockly.Msg["SECURITY_TIMER_TEXT"],
		security_on = block.getField('CUSTOM_MSG_1') ? block.getFieldValue('CUSTOM_MSG_1') : Blockly.Msg["SECURITY_ON_MSG_TEXT"],
		security_off = block.getField('CUSTOM_MSG_2') ? block.getFieldValue('CUSTOM_MSG_2') : Blockly.Msg["SECURITY_OFF_MSG_TEXT"],
		security_error = block.getField('CUSTOM_MSG_3') ? block.getFieldValue('CUSTOM_MSG_3') : Blockly.Msg["SECURITY_ERROR_MSG_TEXT"],
		security_recovery = block.getField('CUSTOM_MSG_4') ? block.getFieldValue('CUSTOM_MSG_4') : Blockly.Msg["SECURITY_RCOVERY_MSG_TEXT"],
		security_alarm = block.getField('CUSTOM_MSG_5') ? block.getFieldValue('CUSTOM_MSG_5') : Blockly.Msg["SECURITY_ALARM_MSG_TEXT"],
		security_warning = block.getField('CUSTOM_MSG_6') ? block.getFieldValue('CUSTOM_MSG_6') : Blockly.Msg["SECURITY_WARNING_TEXT"],
		notifications_event = [],
		speakers = [],
		recovery_time = block.getFieldValue('RECOVERY_TIME'),
		timer_time = block.getFieldValue('TIMER_TIME'),
		data_segment_vars = '\nu16 recovery_zones = 0;\nu16 flag_on = 0x8FFF;\nu16 triger_flag = 0;\nu16 recovery_flag = 0;\nu8 MSG_type = 1;\nu8 MSG[100];',
		data_segment_fuction_erase_msg = '\nvoid erase_msg()\n{\nfor(u8 i = strlen(MSG) - 1; i > 0; --i)\nMSG[i] = 0;\n}',
		data_segment_fuction_add_string_to_msg = '',
		data_segment_fuction_send_msg = '',
		data_segment_fuction_security_activation = '\nvoid security_activation()\n{',
		data_segment_fuction_security_on = '\nvoid security_on()\n{',
		data_segment_fuction_action = '\nvoid action()\n{',
		data_segment_fuction_event = '\nV-ID/V-ADDR\n{',
		code = '',
		areas = [],
		i = 0,
		j = 0,
		globals = '';
	data_segment_fuction_add_string_to_msg += '\nvoid add_string_to_msg (u8* _str)';
	data_segment_fuction_add_string_to_msg += '\n{\nif(!strcmp(_str,"' + security_alarm + '")) MSG_type = 8;';
	data_segment_fuction_add_string_to_msg += '\nif(!strcmp(_str,"' + security_timer + '")) MSG_type = 1;';
	data_segment_fuction_add_string_to_msg += '\nif(!strcmp(_str,"' + security_error + '")) MSG_type = 4;';
	data_segment_fuction_add_string_to_msg += '\nif(!strcmp(_str,"' + security_on + '")) MSG_type = 1;';
	data_segment_fuction_add_string_to_msg += '\nif(!strcmp(_str,"' + security_off + '")) MSG_type = 1;';
	data_segment_fuction_add_string_to_msg += '\nif(!strcmp(_str,"' + security_warning + '")) MSG_type = 4;';
	data_segment_fuction_add_string_to_msg += '\nif(!strcmp(_str,"' + security_recovery + '")) MSG_type = 1;';
	data_segment_fuction_add_string_to_msg += '\nstrcat(MSG,_str);\n}';
	data_segment_fuction_send_msg += '\nvoid send_msg()\n{\ncancelDelayedCall(send_msg);';
	data_segment_fuction_send_msg += '\nu8 buffer_for_MSG[250];\nif(MSG[strlen(MSG) - 1] == 44)';
	data_segment_fuction_send_msg += '\nMSG[strlen(MSG) - 1] = 0;\nsprintf(buffer_for_MSG,"%c%s",MSG_type,MSG);';
	data_segment_fuction_send_msg += '\nsetStatus(2047:32,&buffer_for_MSG);\nerase_msg();\n}';
	while (block.getInput('NOTIFY_' + i)) {
		var notify = new Notify();
		if (block.getInput('NOTIFY_SETTINFS_' + i)) {
			var notify_settings = Blockly.JavaScript.statementToCode(block, 'NOTIFY_SETTINFS_' + i);
			notify.actions = get_parse_JSON(notify_settings);
		}
		if (block.getField('URL_' + i)) {
			notify.url = block.getFieldValue('URL_' + i);
		}
		notifications_event[i] = notify;
		++i;
	}
	i = 0;
	while (block.getInput('MEDIAPOINT_SETTINGS_' + i)) {
		var speaker = new Speakers(block.getFieldValue('MEDIAPOINT_' + i));
		if (block.getField('VOLUME_' + i)) {
			speaker.volume = parseInt(block.getFieldValue('VOLUME_' + i)) * 250 / 100;
		}
		if (InputType(block, speaker.address, null) != 'integer')
			speakers.push(speaker);
		++i;
	}
	i = 0;
	while (block.getInput('AREA' + i)) {
		j = 0;
		var area = new Areas(block.getFieldValue('AREADSCR' + i));
		while (block.getField('SENS' + i + j)) {
			var sensor = new Sensors(block.getFieldValue('SENS' + i + j));
			sensor.type = InputType(block, sensor.address, null);
			if (block.getField('COND' + i + j))
				switch (block.getFieldValue('COND' + i + j)) {
					case 'EQ':
						sensor.condition = '==';
						break;
					case 'NEQ':
						sensor.condition = '!=';
						break;
					case 'LT':
						sensor.condition = '<';
						break;
					case 'LTE':
						sensor.condition = '<=';
						break;
					case 'GT':
						sensor.condition = '>';
						break;
					case 'GTE':
						sensor.condition = '>=';
						break;
				}
			if (block.getField('VALUE' + i + j)) {
				sensor.value = block.getFieldValue('VALUE' + i + j);
				sensor.value_type = InputType(block, block.getFieldValue('VALUE' + i + j), null);
			}
			else
				sensor.value_type = 'device';
			if (sensor.type != 'integer')
				area.sensors.push(sensor);
			++j;
		}
		if (block.getInput('AREA_SETTINGS' + i)) {
			var area_settings = Blockly.JavaScript.statementToCode(block, 'AREA_SETTINGS' + i)
			area.actions = get_parse_JSON(area_settings);
		}
		if (block.getInput('AREA_TYPE_' + i)) {
			area.type = block.getFieldValue('AREA_TYPE_' + i) == 'true' ? 1 : 0;
		}
		if (area.sensors.length > 0) {
			areas.push(area);
			/*
			**	init security_activation func
			*/
			data_segment_vars += '\nu16 recovery_count' + areas.length + ' = 0;';
			data_segment_fuction_security_activation += '\nif(!(' + area.get_sens_condition + '))';
			data_segment_fuction_security_activation += '\n{\nflag_on |= 0x' + parseInt((1 << i), 16) + ';\n}\nelse';
			data_segment_fuction_security_activation += '\n{\nflag_on &= ~0x' + parseInt((1 << i), 16) + ';\nflag_on &= ~0x8000;\n}';
			/*
			**	init security_on func
			*/
			data_segment_fuction_security_on += '\nif(' + area.get_sens_condition + ')\n{';
			data_segment_fuction_security_on += '\nif(!(triger_flag & 0x' + parseInt((1 << i), 16) + '))\n{';
			data_segment_fuction_security_on += '\ntriger_flag |= 0x8000;\ntriger_flag |= 0x' + parseInt((1 << i), 16) + ';';
			if (area.type) {
				data_segment_fuction_security_on += '\ncancelDelayedCall(action);';
				data_segment_fuction_security_on += '\nerase_msg();';
				data_segment_fuction_security_on += '\ndelayedCall(action, 5);';
				data_segment_fuction_security_on += '\nadd_string_to_msg("' + security_warning + '");';
				if (notifications_event[6].actions)
					notifications_event[6].actions.forEach(action => {
						data_segment_fuction_security_on += '\n' + action.before;
						data_segment_fuction_security_on += '\n' + action.gencode;
						data_segment_fuction_security_on += '\n' + action.after;
						globals += action.global;
					});
				speakers.forEach(speaker => {
					data_segment_fuction_security_on += '\nsetStatus(' + speaker.address + ',{"v=' + speaker.volume;
					data_segment_fuction_security_on += ' s=1';
					data_segment_fuction_security_on += ' r=' + speaker.priority;
					data_segment_fuction_security_on += ' ss=' + speaker.softstart;
					if (notifications_event[6].url)
						data_segment_fuction_security_on += ' url=' + notifications_event[6].url;
					data_segment_fuction_security_on += '"});';
				});
				data_segment_fuction_security_on += '\nsend_msg();';
			} else {
				data_segment_fuction_security_on += '\ncancelDelayedCall(action);\ndelayedCall(action, 5);';
			}
			data_segment_fuction_security_on += '\n}\n}\nelse\n{';
			data_segment_fuction_security_on += '\nif(triger_flag & 0x' + parseInt((1 << i), 16) + ')\n{';
			data_segment_fuction_security_on += '\n++recovery_count' + areas.length + ';';
			data_segment_fuction_security_on += '\nif(recovery_count' + areas.length + ' >= ' + (parseInt(recovery_time) * 600) + ')';
			data_segment_fuction_security_on += '\n{';
			data_segment_fuction_security_on += '\ntriger_flag &= ~0x' + parseInt((1 << i), 16) + ';';
			data_segment_fuction_security_on += '\nrecovery_count' + areas.length + ' = 0;';
			data_segment_fuction_security_on += '\nrecovery_zones |= 0x' + parseInt((1 << i), 16) + ';';
			data_segment_fuction_security_on += '\n}';
			data_segment_fuction_security_on += '\n}';
			data_segment_fuction_security_on += '\n}';
		}
		++i;
	}
	i = 0;
	data_segment_fuction_security_on += '\nif(triger_flag & 0x8000)\n{';
	data_segment_fuction_security_on += '\nrecovery_flag = 1;';
	data_segment_fuction_security_on += '\nif((recovery_flag == 1) && (triger_flag == 0x8000))\n{';
	if (notifications_event[4].actions)
		notifications_event[4].actions.forEach(action => {
			data_segment_fuction_security_on += '\n' + action.before;
			data_segment_fuction_security_on += '\n' + action.gencode;
			data_segment_fuction_security_on += '\n' + action.after;
			globals += action.global;
		});
	data_segment_fuction_security_on += '\nrecovery_flag = 0;\ntriger_flag &= ~0x8000;';
	data_segment_fuction_security_on += '\nadd_string_to_msg("' + security_recovery + '");';
	areas.forEach(area => {
		data_segment_fuction_security_on += '\nif((recovery_zones >> ' + i + ')&0x1) add_string_to_msg(" ' + area.name + ',");';
		++i;
	});
	speakers.forEach(speaker => {
		data_segment_fuction_security_on += '\nsetStatus(' + speaker.address + ',{"v=' + speaker.volume;
		data_segment_fuction_security_on += ' s=1';
		data_segment_fuction_security_on += ' r=' + speaker.priority;
		data_segment_fuction_security_on += ' ss=' + speaker.softstart;
		if (notifications_event[4].url)
			data_segment_fuction_security_on += ' url=' + notifications_event[4].url;
		data_segment_fuction_security_on += '"});';
	});
	data_segment_fuction_security_on += '\nsend_msg();';
	data_segment_fuction_security_on += '\n}';
	data_segment_fuction_security_on += '\n}';
	data_segment_fuction_security_on += '\n}';
	data_segment_fuction_security_activation += '\nif((flag_on >> 15) != 0)\n{\ndelayedCallMsR(security_on,100);\nMSG_type = 1;';
	if (notifications_event[1].actions)
		notifications_event[1].actions.forEach(action => {
			data_segment_fuction_security_on += '\n' + action.before;
			data_segment_fuction_security_on += '\n' + action.gencode;
			data_segment_fuction_security_on += '\n' + action.after;
			globals += action.global;
		});
	data_segment_fuction_security_activation += '\nadd_string_to_msg("' + security_on + '");';
	speakers.forEach(speaker => {
		data_segment_fuction_security_activation += '\nsetStatus(' + speaker.address + ',{"v=' + speaker.volume;
		data_segment_fuction_security_activation += ' s=1';
		data_segment_fuction_security_activation += ' r=' + speaker.priority;
		data_segment_fuction_security_activation += ' ss=' + speaker.softstart;
		if (notifications_event[1].url)
			data_segment_fuction_security_activation += ' url=' + notifications_event[1].url;
		data_segment_fuction_security_activation += '"});';
	});
	data_segment_fuction_security_activation += '\nsend_msg();\n}\nelse\n{';
	i = 0;
	if (notifications_event[3].actions)
		notifications_event[3].actions.forEach(action => {
			data_segment_fuction_security_activation += '\n' + action.before;
			data_segment_fuction_security_activation += '\n' + action.gencode;
			data_segment_fuction_security_activation += '\n' + action.after;
			globals += action.global;
		});
	data_segment_fuction_security_activation += '\nerase_msg();';
	data_segment_fuction_security_activation += '\nadd_string_to_msg("' + security_error + ' :");';
	areas.forEach(area => {
		data_segment_fuction_security_activation += '\nif(!(flag_on & 0x' + parseInt((1 << i), 16) + '))add_string_to_msg(" ' + area.name + ',");';
		++i;
	});
	speakers.forEach(speaker => {
		data_segment_fuction_security_activation += '\nsetStatus(' + speaker.address + ',{"v=' + speaker.volume;
		data_segment_fuction_security_activation += ' s=1';
		data_segment_fuction_security_activation += ' r=' + speaker.priority;
		data_segment_fuction_security_activation += ' ss=' + speaker.softstart;
		if (notifications_event[3].url)
			data_segment_fuction_security_activation += ' url=' + notifications_event[3].url;
		data_segment_fuction_security_activation += '"});';
	});
	data_segment_fuction_security_activation += '\nsend_msg();\nsetStatus(V-ADDR,0);\n}\n}';
	data_segment_fuction_action += '\nerase_msg();';
	data_segment_fuction_action += '\nadd_string_to_msg("' + security_alarm + ' :");';
	if (notifications_event[5].actions)
		notifications_event[5].actions.forEach(action => {
			data_segment_fuction_action += '\n' + action.before;
			data_segment_fuction_action += '\n' + action.gencode;
			data_segment_fuction_action += '\n' + action.after;
			globals += action.global;
		});
	i = 0;
	areas.forEach(area => {
		data_segment_fuction_action += '\nif(triger_flag & 0x' + parseInt((1 << i), 16) + ')\n{';
		data_segment_fuction_action += '\nadd_string_to_msg(" ' + area.name + ',");';
		if (area.actions)
			area.actions.forEach(action => {
				data_segment_fuction_action += '\n' + action.before;
				data_segment_fuction_action += '\n' + action.gencode;
				data_segment_fuction_action += '\n' + action.after;
				globals += action.global;
			});
		data_segment_fuction_action += '\n}';
		++i;
	});
	speakers.forEach(speaker => {
		data_segment_fuction_action += '\nsetStatus(' + speaker.address + ',{"v=' + speaker.volume;
		data_segment_fuction_action += ' s=1';
		data_segment_fuction_action += ' r=' + speaker.priority;
		data_segment_fuction_action += ' ss=' + speaker.softstart;
		if (notifications_event[5].url)
			data_segment_fuction_action += ' url=' + notifications_event[5].url;
		data_segment_fuction_action += '"});';
	});
	data_segment_fuction_action += '\nsend_msg();';
	data_segment_fuction_action += '\n}';
	data_segment_fuction_event += '\nif(opt0())\n{';
	if (notifications_event[0].actions)
		notifications_event[0].actions.forEach(action => {
			data_segment_fuction_event += '\n' + action.before;
			data_segment_fuction_event += '\n' + action.gencode;
			data_segment_fuction_event += '\n' + action.after;
			globals += action.global;
		});
	speakers.forEach(speaker => {
		data_segment_fuction_event += '\nsetStatus(' + speaker.address + ',{"v=' + speaker.volume;
		data_segment_fuction_event += ' s=1';
		data_segment_fuction_event += ' r=' + speaker.priority;
		data_segment_fuction_event += ' ss=' + speaker.softstart;
		if (notifications_event[0].url)
			data_segment_fuction_event += ' url=' + notifications_event[0].url;
		data_segment_fuction_event += '"});';
	});
	data_segment_fuction_event += '\ntriger_flag = 0;';
	data_segment_fuction_event += '\nerase_msg();';
	data_segment_fuction_event += '\nadd_string_to_msg("' + security_timer + ' : ' + timer_time + ' second");';
	data_segment_fuction_event += '\ndelayedCall(security_activation, ' + timer_time + ');';
	data_segment_fuction_event += '\nsend_msg();';
	data_segment_fuction_event += '\n}';
	data_segment_fuction_event += '\nelse';
	data_segment_fuction_event += '\n{';
	if (notifications_event[2].actions)
		notifications_event[2].actions.forEach(action => {
			data_segment_fuction_event += '\n' + action.before;
			data_segment_fuction_event += '\n' + action.gencode;
			data_segment_fuction_event += '\n' + action.after;
			globals += action.global;
		});
	speakers.forEach(speaker => {
		data_segment_fuction_event += '\nsetStatus(' + speaker.address + ',{"v=' + speaker.volume;
		data_segment_fuction_event += ' s=1';
		data_segment_fuction_event += ' r=' + speaker.priority;
		data_segment_fuction_event += ' ss=' + speaker.softstart;
		if (notifications_event[2].url)
			data_segment_fuction_event += ' url=' + notifications_event[2].url;
		data_segment_fuction_event += '"});';
	});
	data_segment_fuction_event += '\ncancelDelayedCall(security_activation);';
	data_segment_fuction_event += '\ncancelDelayedCall(security_on);';
	data_segment_fuction_event += '\ncancelDelayedCall(action);';
	data_segment_fuction_event += '\nerase_msg();';
	data_segment_fuction_event += '\nadd_string_to_msg("' + security_off + '");';
	data_segment_fuction_event += '\nsend_msg();';
	data_segment_fuction_event += '\nflag_on = 0x8FFF;';
	data_segment_fuction_event += '\n}';
	data_segment_fuction_event += '\n}';
	code += globals;
	code += data_segment_vars;
	code += data_segment_fuction_erase_msg;
	code += data_segment_fuction_add_string_to_msg;
	code += data_segment_fuction_send_msg;
	code += data_segment_fuction_action;
	code += data_segment_fuction_security_on;
	code += data_segment_fuction_security_activation;
	code += data_segment_fuction_event;
	//console.log(code);
	return code;
};