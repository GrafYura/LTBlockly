/*
 ** Checks if curent block is top, or checks blocks for the presence of a buffer
 */
var if_is_top_block = function (_func_buff = false) {
	var blocks = Blockly.getMainWorkspace().getTopBlocks(),
		i = 0,
		count = 0,
		event_blocks = 0;
	if (!_func_buff) {
		while (blocks[i]) {
			if (blocks[i].event != null)
				++event_blocks;
			if (blocks[i].event)
				++count;
			++i;
		}
		if (event_blocks == count) {
			i = 0;
			while (blocks[i]) {
				if (blocks[i].event != null)
					blocks[i].event = false;
				++i;
			}
		}
		if (count == 1)
			return true;
	} else {
		while (blocks[i]) {
			if (blocks[i].func_buff != null)
				return blocks[i].func_buff;
			++i;
		}
		return null;
	}
	return false;
}

/*
 ** Edit block by event
 */
function event_dev_editor(block) {
	var cond_val = '',
		val = 0,
		i = 0;
	if ((InputType(block, block.getFieldValue('DEVICE'), null) == 'sensor') && !block.getInput('TIMER0')) {
		block.appendDummyInput('TIMER0')
			.appendField(Blockly.Msg["LT_EVENT_DEVICE_DO_ONCE_IN"])
			.appendField(new Blockly.FieldNumber(10, 5), 'TIMER_VALUE0')
			.appendField(Blockly.Msg["LT_DATA_TIME_SEC"])
			.appendField(new Blockly.FieldCheckbox('TRUE'), 'TIMER0');
		block.moveInputBefore('TIMER0', 'DEVS0');
	} else {
		if ((InputType(block, block.getFieldValue('DEVICE'), null) != 'sensor') && block.getInput('TIMER0'))
			block.removeInput('TIMER0');
	}
	top:
	while (block.getInput('COND' + i)) {
		switch (InputType(block, block.getFieldValue('DEVICE'), null)) {
			case 'sensor':
				if (i > 8) {
					block.removeInput('COND' + i);
					block.removeInput('DEVS' + i);
					block.removeInput('TIMER' + i);
				} else if (block.getField('COND' + i).getOptions().length != 6) {
					cond_val = block.getFieldValue('COND' + i);
					if (cond_val.indexOf(' == ') != -1)
						cond_val = 'GT';
					val = parseFloat(block.getFieldValue('VALUE' + i));
					if (isNaN(val))
						val = 50;
					block.removeInput('COND' + i);
					event_on_device_add_items(block, 'COND' + i,
						Blockly.Msg["LT_CATEGORY_EVENTS_EVENT_DEVICE_CONDITION"],
						[
							["\u200F>", "GT"],
							["\u2260", "NEQ"],
							["\u200F<", "LT"],
							["\u200F\u2264", "LTE"],
							["=", "EQ"],
							["\u200F\u2265", "GTE"]
						],
						'COND' + i,
						50,
						'VALUE' + i);
					block.getField('COND' + i).setValue(cond_val);
					block.getField('VALUE' + i).setValue(val);
					if (block.getInput('TIMER' + i))
						block.moveInputBefore('TIMER' + i, 'DEVS' + i);
					block.moveInputBefore('COND' + i, 'DEVS' + i);
				}
				break;
			case 'device':
				if (block.getInput('TIMER' + i))
					block.removeInput('TIMER' + i);
				if (i > 1) {
					block.removeInput('COND' + i);
					block.removeInput('DEVS' + i);
				} else {
					if (block.getField('COND' + i).getOptions().length > 2) {
						cond_val = block.getFieldValue('COND' + i);
						if (cond_val != ' == 1' && cond_val != ' == 0')
							cond_val = ' == 1';
						block.removeInput('COND' + i);
						event_on_device_add_items(block, 'COND' + i,
							Blockly.Msg["LT_CATEGORY_EVENTS_EVENT_DEVICE_CONDITION"],
							[
								[Blockly.Msg["LT_CATEGORY_EVENTS_EVENT_DEVICE_CONDITION_ON"], " == 1"],
								[Blockly.Msg["LT_CATEGORY_EVENTS_EVENT_DEVICE_CONDITION_OFF"], " == 0"]
							],
							'COND' + i);
						block.getField('COND' + i).setValue(cond_val);
						block.moveInputBefore('COND' + i, 'DEVS' + i);
					}
				}
				if (block.getField('VALUE' + i))
					block.getInput('COND' + i).removeField('VALUE' + i);
				break;
			case 'door':
				if (block.getInput('TIMER' + i))
					block.removeInput('TIMER' + i);
				if (i > 1) {
					block.removeInput('COND' + i);
					block.removeInput('DEVS' + i);
				} else {
					if (block.getField('COND' + i).getOptions().length > 2) {
						cond_val = block.getFieldValue('COND' + i);
						if (cond_val != ' == 1' && cond_val != ' == 0')
							cond_val = ' == 1';
						block.removeInput('COND' + i);
						event_on_device_add_items(block, 'COND' + i,
							Blockly.Msg["LT_CATEGORY_EVENTS_EVENT_DEVICE_CONDITION"],
							[
								[Blockly.Msg["LT_CATEGORY_EVENTS_EVENT_DEVICE_CONDITION_ON_DOOR"], " == 1"],
								[Blockly.Msg["LT_CATEGORY_EVENTS_EVENT_DEVICE_CONDITION_OFF_DOOR"], " == 0"]
							],
							'COND' + i);
						block.getField('COND' + i).setValue(cond_val);
						block.moveInputBefore('COND' + i, 'DEVS' + i);
					}
				}
				if (block.getField('VALUE' + i))
					block.getInput('COND' + i).removeField('VALUE' + i);
				break;
			case 'switch':
				if (block.getInput('TIMER' + i))
					block.removeInput('TIMER' + i);
				if (i > 2) {
					block.removeInput('COND' + i);
					block.removeInput('DEVS' + i);
				} else {
					if (block.getField('COND' + i).getOptions().length != 3) {
						cond_val = block.getFieldValue('COND' + i);
						if (cond_val != ' == 0xFF' && cond_val != ' == 0xFD' && cond_val != ' == 0xFC')
							cond_val = ' == 0xFF';
						block.removeInput('COND' + i);
						event_on_device_add_items(block, 'COND' + i,
							Blockly.Msg["LT_CATEGORY_EVENTS_EVENT_DEVICE_CONDITION"],
							[
								[Blockly.Msg["LT_EVENT_DEVICE_CONDITION_SWITCH_FF"], " == 0xFF"],
								[Blockly.Msg["LT_EVENT_DEVICE_CONDITION_SWITCH_FD"], " == 0xFD"],
								[Blockly.Msg["LT_EVENT_DEVICE_CONDITION_SWITCH_FC"], " == 0xFC"]
							],
							'COND' + i);
						block.getField('COND' + i).setValue(cond_val);
						block.moveInputBefore('COND' + i, 'DEVS' + i);
					}
				}
				if (block.getField('VALUE' + i))
					block.getInput('COND' + i).removeField('VALUE' + i);
				break;
			default:
				block.removeInput('COND' + i);
				if (i > 0)
					block.removeInput('DEVS' + i);
				break;
		}
		++i;
	}
}

/*
 ** Listen workspace events and doing actions if event block type equal to 'event_on_device'
 */
function event_on_device_listner(event) {
	var block = Blockly.getMainWorkspace().getBlockById(event.blockId);

	if (block) {
		if (event.type == Blockly.Events.CREATE &&
			block.type == 'simple_event_on_device') {


		}

		if (block.type == 'event_on_device') {
			event_dev_editor(block);
		}
	} else {
		var blocks = Blockly.getMainWorkspace().getAllBlocks();
		blocks.forEach(block_ => {
			if (block_.type == 'event_on_device') {
				event_dev_editor(block_);
			}
		});
	}
}

/*
 ** Add items to conditon
 */
function event_on_device_add_items(_block, _input, _label, _options, _field, _value = null, _value_name = null) {
	_block.appendDummyInput(_input)
		.appendField(_label)
		.appendField(new Blockly.FieldDropdown(_options), _field);
	if (_value && _value_name) {
		_block.getInput(_input)
			.appendField(new Blockly.FieldNumber(_value), _value_name);
		var index = _value_name.substring(_value_name.length - 1);
		if (!_block.getInput('TIMER' + index)) {
			_block.appendDummyInput('TIMER' + index)
				.appendField(Blockly.Msg["LT_EVENT_DEVICE_DO_ONCE_IN"])
				.appendField(new Blockly.FieldNumber(10, 5), 'TIMER_VALUE' + index)
				.appendField(Blockly.Msg["LT_DATA_TIME_SEC"])
				.appendField(new Blockly.FieldCheckbox('TRUE'), 'TIMER' + index);
			_block.moveInputBefore('TIMER' + index, 'DEVS' + index);
		}
	}
}

/*
 ** Add condition to block
 */
function add_condition() {
	var i = 0;
	top:
	while (true) {
		if (!this.getInput('COND' + i)) {
			switch (InputType(this, this.getFieldValue('DEVICE'), null)) {
				case 'sensor':
					if (i <= 7) {
						event_on_device_add_items(this, 'COND' + i,
							Blockly.Msg["LT_CATEGORY_EVENTS_EVENT_DEVICE_CONDITION"],
							[
								["\u200F>", "GT"],
								["\u2260", "NEQ"],
								["\u200F<", "LT"],
								["\u200F\u2264", "LTE"],
								["=", "EQ"],
								["\u200F\u2265", "GTE"]
							],
							'COND' + i,
							50,
							'VALUE' + i);
					} else {
						break top;
					}
					break;
				case 'device':
					if (i <= 1) {
						event_on_device_add_items(this, 'COND' + i,
							Blockly.Msg["LT_CATEGORY_EVENTS_EVENT_DEVICE_CONDITION"],
							[
								[Blockly.Msg["LT_CATEGORY_EVENTS_EVENT_DEVICE_CONDITION_ON"], " == 1"],
								[Blockly.Msg["LT_CATEGORY_EVENTS_EVENT_DEVICE_CONDITION_OFF"], " == 0"]
							],
							'COND' + i);
					} else {
						break top;
					}
					break;
				case 'door':
					if (i <= 1) {
						event_on_device_add_items(this, 'COND' + i,
							Blockly.Msg["LT_CATEGORY_EVENTS_EVENT_DEVICE_CONDITION"],
							[
								[Blockly.Msg["LT_CATEGORY_EVENTS_EVENT_DEVICE_CONDITION_ON_DOOR"], " == 1"],
								[Blockly.Msg["LT_CATEGORY_EVENTS_EVENT_DEVICE_CONDITION_OFF_DOOR"], " == 0"]
							],
							'COND' + i);
					} else {
						break top;
					}
					break;
				case 'switch':
					if (i <= 2) {
						event_on_device_add_items(this, 'COND' + i,
							Blockly.Msg["LT_CATEGORY_EVENTS_EVENT_DEVICE_CONDITION"],
							[
								[Blockly.Msg["LT_EVENT_DEVICE_CONDITION_SWITCH_FF"], " == 0xFF"],
								[Blockly.Msg["LT_EVENT_DEVICE_CONDITION_SWITCH_FD"], " == 0xFD"],
								[Blockly.Msg["LT_EVENT_DEVICE_CONDITION_SWITCH_FC"], " == 0xFC"]
							],
							'COND' + i);
					} else {
						break top;
					}
					break;
				default:
					break top;
			}
			if (!this.getInput('DEVS' + i)) {
				this.appendStatementInput('DEVS' + i)
					.appendField(Blockly.Msg["LT_CATEGORY_EVENTS_EVENT_DEVICE_CONDITION_TRUE"]);
				this.moveInputBefore('DEVS' + i, 'ADDCOND');
			}
			if (InputType(this, this.getFieldValue('DEVICE'), null) == 'sensor') {
				this.moveInputBefore('TIMER' + i, 'DEVS' + i);
			}
			this.moveInputBefore('COND' + i, 'DEVS' + i);
			break;
		} else {
			++i;
		}
	}
}

/*
 ** Remove condition from block
 */
function remove_condition() {
	var i = 0;
	while (this.getInput('COND' + i)) {
		++i;
	}
	--i;
	if (this.getInput('COND' + i))
		this.removeInput('COND' + i);
	if ((InputType(this, this.getFieldValue('DEVICE'), null) == 'sensor')) {
		if (i > 0) {
			if (this.getInput('TIMER' + i))
				this.removeInput('TIMER' + i);
		}
	} else {
		if (this.getInput('TIMER' + i))
			this.removeInput('TIMER' + i);
	}

	if (i > 0) {
		this.removeInput('DEVS' + i);
	}
}

/*
 ** Block initialization
 */
Blockly.Blocks['event_on_device'] = {
	init: function () {
		img = new Blockly.FieldImage("./js/blockly/img/control/add.png", 16, 16, "Add condition", add_condition.bind(this));
		img_neg = new Blockly.FieldImage("./js/blockly/img/control/minus.png", 16, 16, "Remove condition", remove_condition.bind(this));
		img.EDITABLE = true;
		img_neg.EDITABLE = true;
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("js/blockly/img/events/events.png", 16, 16, "*"))
			.appendField(Blockly.Msg["LT_CATEGORY_EVENTS_EVENT_DEVICE"])
			.appendField(new Blockly.FieldDropdown(blocklyDeviceTypeOptions.bind(this)), 'DEVICETYPE');
		this.appendDummyInput()
			.appendField(Blockly.Msg["LT_CATEGORY_EVENTS_EVENT_DEVICE_DEVICE"])
			.appendField(new Blockly.FieldDropdown(blocklyDeviceOptions.bind(this)), 'DEVICE')
		this.appendStatementInput('DEVS0')
			.appendField(Blockly.Msg["LT_CATEGORY_EVENTS_EVENT_DEVICE_CONDITION_TRUE"]);
		this.setColour("%{BKY_LT_CATEGORY_COLOUR_EVENTS}");
		this.setTooltip(Blockly.Msg["LT_EVENT_ON_DEVICE_TTEVENT"]);
		this.appendDummyInput('ADDCOND')
			.appendField(img)
			.appendField(img_neg);
	},
	event: false,
	func_buff: null
};

/*
 ** Parse and return condition  
 */
var GetBoolCondition = function (condition) {
	switch (condition) {
		case "EQ":
			return '==';
		case "NEQ":
			return '!=';
		case "LT":
			return '<';
		case "LTE":
			return '<=';
		case "GT":
			return '>';
		case "GTE":
			return '>=';
	}
	return condition;
},

	/*
	 ** Parse and return statement 
	 */
	get_parse_JSON = function (string) {
		var parser = [],
			i = 0;
		if (string.length < 1)
			return null;
		if (string.indexOf('{') != -1)
			string = string.substring(string.indexOf('{'));
		while (string.indexOf('}{') != -1) {
			parser.push(string.substring(0, string.indexOf('}{') + 1));
			string = string.substring(string.indexOf('}{') + 1);
		}
		parser.push(string);
		while (parser[i]) {
			parser[i] = JSON.parse(parser[i]);
			i++;
		}
		return parser;
	};

/*
 ** Block function
 */
Blockly.JavaScript['event_on_device'] = function (block) {
	let created = 0;
	Blockly.getMainWorkspace().getAllBlocks().forEach(el => {
		if (el.type == 'simple_event_on_device') {
			++created;
		}
	});

	if (created > 1) {
		//Blockly.getMainWorkspace().removeTopBlock(block);
		throw "The script cannot contain two self-processing events.";
	}
	// Search the text for a substring.
	var eventDev = block.getFieldValue('DEVICE'),
		do_parser = [],
		conditions = [],
		values = [],
		timers = [],
		i = 0,
		globals = '';
	block.event = true;
	while (block.getInput('DEVS' + i)) {
		do_parser.push(get_parse_JSON(Blockly.JavaScript.statementToCode(block, 'DEVS' + i)));
		++i;
	}
	i = 0;
	while (block.getInput('COND' + i)) {
		conditions.push(block.getFieldValue('COND' + i));
		if (block.getField('VALUE' + i))
			values.push(block.getFieldValue('VALUE' + i));
		++i;
	}
	i = 0;
	while (block.getInput('TIMER' + i)) {
		timers.push([block.getFieldValue('TIMER' + i), block.getFieldValue('TIMER_VALUE' + i)]);
		++i;
	}
	var func_name = null,
		var_name = bloclyGenerateVariableName();
	//func_blody = null;
	if (timers.length > 0) {
		globals += '\nu8 ' + var_name + ' = 0xFF;';
		func_name = bloclyGenerateVariableName();
		block.func_buff = func_name;
		globals += '\nvoid ' + func_name + '(u8 _val){';
		globals += '\n' + var_name + ' |=_val;\n}';
		//globals += func_blody;
	}
	i = 0;
	var code = '',
		helper = '',
		values_type = [];
	conditions.forEach(condition => {
		if (values[i]){
			values_type.push(InputType(block, values[i], null));
			values[i] = convert2byte(values[i]);
		}
		conditions[i] = GetBoolCondition(condition);
		++i;
	});
	i = 0;
	if (conditions[i]) {
		var j = 0;
		while (do_parser[j]) {
			do_parser[j].forEach(do_code => {
				globals += do_code.global;
			});
			++j;
		}
		j = 0;
		while (conditions[i]) {
			helper += '\nif(';
			if (timers[i] && timers[i][0] == 'TRUE') {
				helper += '(';
			}
			if (values[i]) {
					helper += '(i16)[' + eventDev + ']';
			} else {
				values[i] = '';
				if ((InputType(block, block.getFieldValue('DEVICE'), null) == 'switch')) {
					helper += 'opt(0)';
				} else {
					helper += 'opt0()';
				}
			}
			helper += conditions[i] + values[i];
			if (timers[i] && timers[i][0] == 'TRUE') {
				helper += ') && (' + var_name + ' & ' + (1 << i) + ')';
			}
			helper += '){';
			if (do_parser[j])
				do_parser[j].forEach(do_code => {
					helper += do_code.before + do_code.gencode + do_code.after;
				});
			if (timers[i] && timers[i][0] == 'TRUE') {
				helper += '\n' + var_name + ' &= ' + (~(1 << i)) + ';';
				helper += '\ndelayedCall(' + func_name + ',' + timers[i][1] + ',' + (1 << i) + ');';
			}
			helper += '\n}';
			++i;
			++j;
		};
	} else {
		if (timers[i] && timers[i][0] == 'TRUE') {
			helper += 'if(' + var_name + '[0] & ' + (1 << i) + '){';
		}
		while (do_parser[i]) {
			do_parser[i].forEach(do_code => {
				globals += do_code.global;
				helper += do_code.before + do_code.gencode + do_code.after;
			});
			++i;
		}
		if (timers[0] && timers[0][0] == 'TRUE') {
			helper += '\n' + var_name + ' &= ' + (~(1)) + ';';
			helper += '\ndelayedCall(' + func_name + ',' + timers[0][1] + ',1);\n}';
		}
	}
	code = globals + '\nV-ID/' + eventDev + ' {\n' + helper + '\n}\n';
	var devtype = InputType(block, eventDev, null);
	if(devtype == 'nofound')
	{
		var err="Device (" + eventDev + ") not found!";
		throw err;
	}
	else
	console.log(code);
	return code;
};

/**
\nu8 _var = ~_addr[0];\nu8 _val = _addr[1];\nfor(u8 i = 0; i < 8; ++i){\n\tif(((_var << i) >> (7 - i)) & ((_val << i) >> (7 - i))){\n\t\t_addr[0] |= (1 << i);\n\t\treturn;\n\t}\n}
 */