var tab = '			';
/**
 * Checks if the same block excist
 */
function ifBlockExcist(_name){
	var counter = 0;
	Blockly.getMainWorkspace().getAllBlocks().forEach(block => {
		if (block.type == _name) {
			++counter;
		}
	});
	if(counter > 1)
		return true;
	return false;
}
/**
 * Edit modbus block
 */
function modbus_editor(block) {
	block.inputList.forEach(input => {
		switch (input.name) {
			case 'ONOFF_SETTINGS':
				if(block.getFieldValue('ONOFF_TYPE') == 'holding'){
					if(block.getInput('ONOFF_COILS'))
						block.removeInput('ONOFF_COILS');
					if(!block.getInput('ONOFF_HOLDING')){
						block.appendDummyInput('ONOFF_HOLDING')
							.appendField(tab)
							.appendField(Blockly.Msg["LT_MODBUS_CONTROLLER_OFF"] + ' ' + Blockly.Msg["LT_CATEGORY_VARIABLES_GETTER_VALUE"].toLowerCase())
							.appendField(new Blockly.FieldNumber(0,0,65535), 'OFF_VALUE')
							.appendField(Blockly.Msg["LT_MODBUS_CONTROLLER_ON"] + ' ' + Blockly.Msg["LT_CATEGORY_VARIABLES_GETTER_VALUE"].toLowerCase())
							.appendField(new Blockly.FieldNumber(1,1,65535), 'ON_VALUE');
						block.moveInputBefore('ONOFF_HOLDING','MODE');
					}
				}else if(block.getFieldValue('ONOFF_TYPE') == 'coils'){
					if(block.getInput('ONOFF_HOLDING'))
						block.removeInput('ONOFF_HOLDING');
					if(!block.getInput('ONOFF_COILS')){
						block.appendDummyInput('ONOFF_COILS')
							.appendField(tab)
							.appendField(Blockly.Msg["LT_MODBUS_CONTROLLER_OFF"] + ' ' + Blockly.Msg["LT_CATEGORY_VARIABLES_GETTER_VALUE"].toLowerCase())
							.appendField(new Blockly.FieldNumber(0,0,1), 'OFF_VALUE')
							.appendField(Blockly.Msg["LT_MODBUS_CONTROLLER_ON"] + ' ' + Blockly.Msg["LT_CATEGORY_VARIABLES_GETTER_VALUE"].toLowerCase())
							.appendField(new Blockly.FieldNumber(1,1,1), 'ON_VALUE');
						block.moveInputBefore('ONOFF_COILS','MODE');
					}
				}
				break;
			case 'MODE_SETTINGS':
				if(block.getFieldValue('MODE_TYPE') == 'holding'){
					if(!block.getInput('MODE_VALUES')){
						if(block.getInput('MODE_COILS'))
							block.removeInput('MODE_COILS');
						block.appendDummyInput('MODE_VALUES')
							.appendField(tab)
							.appendField('0:')
							.appendField(new Blockly.FieldTextInput('0'), 'COOL_VALUE')
							.appendField('1:')
							.appendField(new Blockly.FieldTextInput('0'), 'DRY_VALUE')
							.appendField('2:')
							.appendField(new Blockly.FieldTextInput('0'), 'FAN_VALUE')
							.appendField('3:')
							.appendField(new Blockly.FieldTextInput('0'), 'HEAT_VALUE')
							.appendField('4:')
							.appendField(new Blockly.FieldTextInput('0'), 'AUTO_VALUE');
						block.moveInputBefore('MODE_VALUES','TEMP');
					}
				}else if(block.getFieldValue('MODE_TYPE') == 'coils'){
					if(!block.getInput('MODE_COILS')){
						if(block.getInput('MODE_VALUES'))
							block.removeInput('MODE_VALUES');
						block.appendDummyInput('MODE_COILS')
							.appendField(tab)
							.appendField(Blockly.Msg["LT_TEXT_SPRINTF_TYPE_MODE"] + ' 0 :')
							.appendField(new Blockly.FieldDropdown([
								[Blockly.Msg['LT_CONDITIONER_MODE_FAN'], '0'],
								[Blockly.Msg['LT_CONDITIONER_MODE_COOL'], '1'],
								[Blockly.Msg['LT_CONDITIONER_MODE_DRY'], '2'],
								[Blockly.Msg['LT_CONDITIONER_MODE_HEAT'], '3'],
								[Blockly.Msg['LT_CONDITIONER_MODE_AUTO'], '4']]), 'MODE0')
							.appendField(Blockly.Msg["LT_TEXT_SPRINTF_TYPE_MODE"] + ' 1 :')
							.appendField(new Blockly.FieldDropdown([
								[Blockly.Msg['LT_CONDITIONER_MODE_FAN'], '0'],
								[Blockly.Msg['LT_CONDITIONER_MODE_COOL'], '1'],
								[Blockly.Msg['LT_CONDITIONER_MODE_DRY'], '2'],
								[Blockly.Msg['LT_CONDITIONER_MODE_HEAT'], '3'],
								[Blockly.Msg['LT_CONDITIONER_MODE_AUTO'], '4']]), 'MODE1');
						block.moveInputBefore('MODE_COILS','TEMP');
					}
				}
				break;
			case 'TEMP_SETTINGS':
				break;
			case 'HV_SETTINGS':
				if(block.getFieldValue('HV_TYPE') == 'holding'){
					if(!block.getInput('HV_VALUES')){
						if(block.getInput('HV_COILS'))
							block.removeInput('HV_COILS');
						block.appendDummyInput('HV_VALUES')
							.appendField(tab)
							.appendField('0:')
							.appendField(new Blockly.FieldTextInput('0'), 'HV_LEFT')
							.appendField('1:')
							.appendField(new Blockly.FieldTextInput('0'), 'HV_MIDD')
							.appendField('2:')
							.appendField(new Blockly.FieldTextInput('0'), 'HV_EXRIGHT')
							.appendField('3:')
							.appendField(new Blockly.FieldTextInput('0'), 'HV_RIGHT')
							.appendField('4:')
							.appendField(new Blockly.FieldTextInput('0'), 'HV_LFTRGHT')
							.appendField('5:')
							.appendField(new Blockly.FieldTextInput('0'), 'HV_EXLEFT')
							.appendField('6:')
							.appendField(new Blockly.FieldTextInput('0'), 'HV_ULTR');
						block.moveInputBefore('HV_VALUES','VV');
					}
				}else if(block.getFieldValue('HV_TYPE') == 'coils'){
					if(!block.getInput('HV_COILS')){
						if(block.getInput('HV_VALUES'))
							block.removeInput('HV_VALUES');
						block.appendDummyInput('HV_COILS')
							.appendField(tab)
							.appendField(Blockly.Msg["LT_CATEGORY_VARIABLES_GETTER_VALUE"] + ' 0 :')
							.appendField(new Blockly.FieldDropdown([
								[Blockly.Msg['LT_CONDITIONER_HV_LEFT'], '0'],
								[Blockly.Msg['LT_CONDITIONER_HV_MIDD'], '1'],
								[Blockly.Msg['LT_CONDITIONER_HV_EXRIGHT'], '2'],
								[Blockly.Msg['LT_CONDITIONER_HV_RIGHT'], '3'],
								[Blockly.Msg['LT_CONDITIONER_HV_LFTRGHT'], '4'],
								[Blockly.Msg['LT_CONDITIONER_HV_EXLEFT'], '5'],
								[Blockly.Msg['LT_CONDITIONER_HV_ULTR'], '6']]), 'HV_MODE0')
							.appendField(Blockly.Msg["LT_CATEGORY_VARIABLES_GETTER_VALUE"] + ' 1 :')
							.appendField(new Blockly.FieldDropdown([
								[Blockly.Msg['LT_CONDITIONER_HV_LEFT'], '0'],
								[Blockly.Msg['LT_CONDITIONER_HV_MIDD'], '1'],
								[Blockly.Msg['LT_CONDITIONER_HV_EXRIGHT'], '2'],
								[Blockly.Msg['LT_CONDITIONER_HV_RIGHT'], '3'],
								[Blockly.Msg['LT_CONDITIONER_HV_LFTRGHT'], '4'],
								[Blockly.Msg['LT_CONDITIONER_HV_EXLEFT'], '5'],
								[Blockly.Msg['LT_CONDITIONER_HV_ULTR'], '6']]), 'HV_MODE1');
						block.moveInputBefore('HV_COILS','VV');
					}
				}
				break;
			case 'VV_SETTINGS':
				if(block.getFieldValue('VV_TYPE') == 'holding'){
					if(!block.getInput('VV_VALUES')){
						if(block.getInput('VV_COILS'))
							block.removeInput('VV_COILS');
						block.appendDummyInput('VV_VALUES')
							.appendField(tab)
							.appendField('0:')
							.appendField(new Blockly.FieldTextInput('0'), 'VV_LEFT')
							.appendField('1:')
							.appendField(new Blockly.FieldTextInput('0'), 'VV_RIGHT')
							.appendField('2:')
							.appendField(new Blockly.FieldTextInput('0'), 'VV_MIDD')
							.appendField('3:')
							.appendField(new Blockly.FieldTextInput('0'), 'VV_EXRIGHT')
							.appendField('4:')
							.appendField(new Blockly.FieldTextInput('0'), 'VV_EXLEFT')
							.appendField('5:')
							.appendField(new Blockly.FieldTextInput('0'), 'VV_LFTRGHT')
							.appendField('6:')
							.appendField(new Blockly.FieldTextInput('0'), 'VV_ULTR');
						block.moveInputBefore('VV_VALUES','FAN');
					}
				}else if(block.getFieldValue('VV_TYPE') == 'coils'){
					if(!block.getInput('VV_COILS')){
						if(block.getInput('VV_VALUES'))
							block.removeInput('VV_VALUES');
						block.appendDummyInput('VV_COILS')
							.appendField(tab)
							.appendField(Blockly.Msg["LT_CATEGORY_VARIABLES_GETTER_VALUE"] + ' 0 :')
							.appendField(new Blockly.FieldDropdown([
								[Blockly.Msg['LT_CONDITIONER_VV_LEFT'], '0'],
								[Blockly.Msg['LT_CONDITIONER_VV_RIGHT'], '1'],
								[Blockly.Msg['LT_CONDITIONER_VV_MIDD'], '2'],
								[Blockly.Msg['LT_CONDITIONER_VV_EXRIGHT'], '3'],
								[Blockly.Msg['LT_CONDITIONER_VV_EXLEFT'], '4'],
								[Blockly.Msg['LT_CONDITIONER_VV_LFTRGHT'], '5'],
								[Blockly.Msg['LT_CONDITIONER_VV_ULTR'], '6']]), 'VV_MODE0')
							.appendField(Blockly.Msg["LT_CATEGORY_VARIABLES_GETTER_VALUE"] + ' 1 :')
							.appendField(new Blockly.FieldDropdown([
								[Blockly.Msg['LT_CONDITIONER_VV_LEFT'], '0'],
								[Blockly.Msg['LT_CONDITIONER_VV_RIGHT'], '1'],
								[Blockly.Msg['LT_CONDITIONER_VV_MIDD'], '2'],
								[Blockly.Msg['LT_CONDITIONER_VV_EXRIGHT'], '3'],
								[Blockly.Msg['LT_CONDITIONER_VV_EXLEFT'], '4'],
								[Blockly.Msg['LT_CONDITIONER_VV_LFTRGHT'], '5'],
								[Blockly.Msg['LT_CONDITIONER_VV_ULTR'], '6']]), 'VV_MODE1');
						block.moveInputBefore('VV_COILS','FAN');
					}
				}
				break;
			case 'FAN_SETTINGS':
				if(block.getFieldValue('FAN_TYPE') == 'holding'){
					if(!block.getInput('FAN_VALUES')){
						if(block.getInput('FAN_COILS'))
							block.removeInput('FAN_COILS');
						block.appendDummyInput('FAN_VALUES')
							.appendField(tab)
							.appendField('0:')
							.appendField(new Blockly.FieldTextInput('0'), 'FAN_AUTO')
							.appendField('1:')
							.appendField(new Blockly.FieldTextInput('0'), 'FAN_MEDIUM')
							.appendField('2:')
							.appendField(new Blockly.FieldTextInput('0'), 'FAN_WEAK')
							.appendField('3:')
							.appendField(new Blockly.FieldTextInput('0'), 'FAN_STRONG')
					}
				}else if(block.getFieldValue('FAN_TYPE') == 'coils'){
					if(!block.getInput('FAN_COILS')){
						if(block.getInput('FAN_VALUES'))
							block.removeInput('FAN_VALUES');
						block.appendDummyInput('FAN_COILS')
							.appendField(tab)
							.appendField(Blockly.Msg["LT_CATEGORY_VARIABLES_GETTER_VALUE"] + ' 0 :')
							.appendField(new Blockly.FieldDropdown([
								[Blockly.Msg['LT_CONDITIONER_FAN_AUTO'], '0'],
								[Blockly.Msg['LT_CONDITIONER_FAN_MEDIUM'], '1'],
								[Blockly.Msg['LT_CONDITIONER_FAN_WEAK'], '2'],
								[Blockly.Msg['LT_CONDITIONER_FAN_STRONG'], '3']]), 'FAN_MODE0')
							.appendField(Blockly.Msg["LT_CATEGORY_VARIABLES_GETTER_VALUE"] + ' 1 :')
							.appendField(new Blockly.FieldDropdown([
								[Blockly.Msg['LT_CONDITIONER_FAN_AUTO'], '0'],
								[Blockly.Msg['LT_CONDITIONER_FAN_MEDIUM'], '1'],
								[Blockly.Msg['LT_CONDITIONER_FAN_WEAK'], '2'],
								[Blockly.Msg['LT_CONDITIONER_FAN_STRONG'], '3']]), 'FAN_MODE1');
					}
				}
				break;
			default:
				if((input.name == 'ONOFF_HOLDING') && (block.getFieldValue('ONOFF_TYPE') != 'holding')){
					block.removeInput('ONOFF_HOLDING');
				}
				if((input.name == 'ONOFF_COILS') && (block.getFieldValue('ONOFF_TYPE') != 'coils')){
					block.removeInput('ONOFF_COILS');
				}
				if((input.name == 'MODE_VALUES') && (block.getFieldValue('MODE_TYPE') != 'holding')){
					block.removeInput('MODE_VALUES');
				}
				if((input.name == 'MODE_COILS') && (block.getFieldValue('MODE_TYPE') != 'coils')){
					block.removeInput('MODE_COILS');
				}
				if((input.name == 'HV_VALUES') && (block.getFieldValue('HV_TYPE') != 'holding')){
					block.removeInput('HV_VALUES');
				}
				if((input.name == 'HV_COILS') && (block.getFieldValue('HV_TYPE') != 'coils')){
					block.removeInput('HV_COILS');
				}
				if((input.name == 'VV_VALUES') && (block.getFieldValue('VV_TYPE') != 'holding')){
					block.removeInput('VV_VALUES');
				}
				if((input.name == 'VV_COILS') && (block.getFieldValue('VV_TYPE') != 'coils')){
					block.removeInput('VV_COILS');
				}
				if((input.name == 'FAN_VALUES') && (block.getFieldValue('FAN_TYPE') != 'holding')){
					block.removeInput('FAN_VALUES');
				}
				if((input.name == 'FAN_COILS') && (block.getFieldValue('FAN_TYPE') != 'coils')){
					block.removeInput('FAN_COILS');
				}
				break;
		}
	});
}

/**
 * Events for modbus block
 */
function universal_modbus_events(event){
	var block = Blockly.getMainWorkspace().getBlockById(event.blockId);
	if (block) {
		if (block.type == 'univarsal_modbus') {
			modbus_editor(block);
		}
	}else {
		Blockly.getMainWorkspace().getAllBlocks().forEach(bl => {
			if (bl.type == 'univarsal_modbus') {
				modbus_editor(bl);
			}
		});
	}
}

/**
 * Add register settings such as register type and register value
 */
function add_register_settings(_type){
	switch (_type) {
		case 'ONOFF':
			if(this.getInput('ONOFF_SETTINGS')){
				this.removeInput('ONOFF_SETTINGS');
				if(this.getInput('ONOFF_HOLDING'))
					this.removeInput('ONOFF_HOLDING');
			}else{
				this.appendDummyInput('ONOFF_SETTINGS')
					.appendField(tab)
					.appendField(Blockly.Msg["LT_MODBUS_CONTROLLER_ADDR"] + ':')
					.appendField(new Blockly.FieldNumber(0,0), 'ONOFF_ADDR')
					.appendField(Blockly.Msg["LT_CATEGORY_VARIABLES_GETTER_TYPE"])
					.appendField(new Blockly.FieldDropdown([['Holding','holding'],['Coils','coils']]), 'ONOFF_TYPE');
				this.moveInputBefore('ONOFF_SETTINGS','MODE');
			}
			break;
		case 'MODE':
			if(this.getInput('MODE_SETTINGS')){
				this.removeInput('MODE_SETTINGS');
				if(this.getInput('MODE_VALUES'))
					this.removeInput('MODE_VALUES');
				if(this.getInput('MODE_COILS'))
					this.removeInput('MODE_COILS');
			}else{
				this.appendDummyInput('MODE_SETTINGS')
					.appendField(tab)
					.appendField(Blockly.Msg["LT_MODBUS_CONTROLLER_ADDR"] + ':')
					.appendField(new Blockly.FieldNumber(1,0), 'MODE_ADDR')
					.appendField(Blockly.Msg["LT_CATEGORY_VARIABLES_GETTER_TYPE"])
					.appendField(new Blockly.FieldDropdown([['Holding','holding'],['Coils','coils']]), 'MODE_TYPE');
				this.moveInputBefore('MODE_SETTINGS','TEMP');
			}
			break;
		case 'TEMP':
			if(this.getInput('TEMP_SETTINGS')){
				this.removeInput('TEMP_SETTINGS');
				if(this.getInput('TEMP_TMIN'))
					this.removeInput('TEMP_TMIN');
				if(this.getInput('TEMP_MODE'))
					this.removeInput('TEMP_MODE');
			}else{
				this.appendDummyInput('TEMP_SETTINGS')
					.appendField(tab)
					.appendField(Blockly.Msg["LT_MODBUS_CONTROLLER_ADDR"] + ':')
					.appendField(new Blockly.FieldNumber(2,0), 'TEMP_ADDR');
				this.appendDummyInput('TEMP_TMIN')
					.appendField(tab)
					.appendField(Blockly.Msg["LT_MODBUS_CONTROLLER_TMIN"] + ':')
					.appendField(new Blockly.FieldNumber(16,0), 'TEMP_TMIN');
				this.appendDummyInput('TEMP_MODE')
					.appendField(tab)
					.appendField(Blockly.Msg["LT_MODBUS_CONTROLLER_MODE"] + ':')
					.appendField(new Blockly.FieldDropdown([
						[Blockly.Msg['LT_MODBUS_CONTROLLER_MODEDF'], '0'],
						[Blockly.Msg['LT_MODBUS_CONTROLLER_TMODEMT'], '1'],
						[Blockly.Msg['LT_MODBUS_CONTROLLER_TMODEBD'], '2'],
						[Blockly.Msg['LT_MODBUS_CONTROLLER_MODEFR'], '3']]), 'TEMP_MODE');
				this.moveInputBefore('TEMP_SETTINGS','HV');
				this.moveInputBefore('TEMP_TMIN','HV');
				this.moveInputBefore('TEMP_MODE','HV');
			}
		break;
		case 'HV':
			if(this.getInput('HV_SETTINGS')){
				this.removeInput('HV_SETTINGS');
				if(this.getInput('HV_VALUES'))
					this.removeInput('HV_VALUES');
				if(this.getInput('HV_COILS'))
					this.removeInput('HV_COILS');
			}else{
				this.appendDummyInput('HV_SETTINGS')
					.appendField(tab)
					.appendField(Blockly.Msg["LT_MODBUS_CONTROLLER_ADDR"] + ':')
					.appendField(new Blockly.FieldNumber(3,0), 'HV_ADDR')
					.appendField(Blockly.Msg["LT_CATEGORY_VARIABLES_GETTER_TYPE"])
					.appendField(new Blockly.FieldDropdown([['Holding','holding'],['Coils','coils']]), 'HV_TYPE');
				this.moveInputBefore('HV_SETTINGS','VV');
			}
			break;
		case 'VV':
			if(this.getInput('VV_SETTINGS')){
				this.removeInput('VV_SETTINGS');
				if(this.getInput('VV_VALUES'))
					this.removeInput('VV_VALUES');
				if(this.getInput('VV_COILS'))
					this.removeInput('VV_COILS');
			}else{
				this.appendDummyInput('VV_SETTINGS')
					.appendField(tab)
					.appendField(Blockly.Msg["LT_MODBUS_CONTROLLER_ADDR"] + ':')
					.appendField(new Blockly.FieldNumber(4,0), 'VV_ADDR')
					.appendField(Blockly.Msg["LT_CATEGORY_VARIABLES_GETTER_TYPE"])
					.appendField(new Blockly.FieldDropdown([['Holding','holding'],['Coils','coils']]), 'VV_TYPE');
				this.moveInputBefore('VV_SETTINGS','FAN');
			}
			break;
		case 'FAN':
			if(this.getInput('FAN_SETTINGS')){
				this.removeInput('FAN_SETTINGS');
			}else{
				this.appendDummyInput('FAN_SETTINGS')
					.appendField(tab)
					.appendField(Blockly.Msg["LT_MODBUS_CONTROLLER_ADDR"] + ':')
					.appendField(new Blockly.FieldNumber(5,0), 'FAN_ADDR')
					.appendField(Blockly.Msg["LT_CATEGORY_VARIABLES_GETTER_TYPE"])
					.appendField(new Blockly.FieldDropdown([['Holding','holding'],['Coils','coils']]), 'FAN_TYPE');
			}
			break;
		default:
			break;
	}
	modbus_editor(this);
}

/**
 * Rendering the modbus block
 */
function render_modbus(block) {
	var on_off_reg_settings = new Blockly.FieldImage("./js/blockly/img/teamplates/settings.png", 16, 16, "Settings",add_register_settings.bind(block,'ONOFF')),
	mode_reg_settings = new Blockly.FieldImage("./js/blockly/img/teamplates/settings.png", 16, 16, "Settings",add_register_settings.bind(block,'MODE')),
	temp_reg_settings = new Blockly.FieldImage("./js/blockly/img/teamplates/settings.png", 16, 16, "Settings",add_register_settings.bind(block,'TEMP')),
	hvan_reg_settings = new Blockly.FieldImage("./js/blockly/img/teamplates/settings.png", 16, 16, "Settings",add_register_settings.bind(block,'HV')),
	vvan_reg_settings = new Blockly.FieldImage("./js/blockly/img/teamplates/settings.png", 16, 16, "Settings",add_register_settings.bind(block,'VV')),
	fan_reg_settings = new Blockly.FieldImage("./js/blockly/img/teamplates/settings.png", 16, 16, "Settings",add_register_settings.bind(block,'FAN'));
	on_off_reg_settings.EDITABLE = true;
	mode_reg_settings.EDITABLE = true; 
	temp_reg_settings.EDITABLE = true; 
	hvan_reg_settings.EDITABLE = true; 
	vvan_reg_settings.EDITABLE = true; 
	fan_reg_settings.EDITABLE = true; 
	block.removeInput('START');
	block.appendDummyInput('NAME')
		.appendField(Blockly.Msg["LT_TEXT_SPRINTF_CONDITIONER"] + ' ' + Blockly.Msg["LT_FUNCTION_NAME"].toLowerCase() + ':')
		.appendField(new Blockly.FieldTextInput(Blockly.Msg["LT_TEXT_SPRINTF_CONDITIONER"]), 'NAME')
		.appendField(' ' + Blockly.Msg["LT_MODBUS_CONTROLLER_ID"].toLowerCase() + ':')
		.appendField(new Blockly.FieldNumber(1,0), 'ID');
	block.appendDummyInput('RS485')
		.appendField(Blockly.Msg["LT_TEXT_SPRINTF_DEV"] + ':')
		.appendField(new Blockly.FieldDropdown(blocklyDeviceOptions.bind(block, ['com-port'])), 'RS485')
	block.appendDummyInput('MULTIPLY')
			.appendField(Blockly.Msg["LT_USE_MODBUS_MULTIPLY_COMMAND"] + ':')
			.appendField(new Blockly.FieldCheckbox(1), 'MULTIPLY');
	block.appendDummyInput('ONOFF')
		.appendField(Blockly.Msg["LT_TEXT_SPRINTF_TYPE_ONOFF"] + ' ' + Blockly.Msg["LT_MODBUS_CONTROLLER_REG"] + ':')
		.appendField(on_off_reg_settings);
	block.appendDummyInput('MODE')
		.appendField(Blockly.Msg["LT_TEXT_SPRINTF_TYPE_MODE"] + ' ' + Blockly.Msg["LT_MODBUS_CONTROLLER_REG"] + ':')
		.appendField(mode_reg_settings);
	block.appendDummyInput('TEMP')
		.appendField(Blockly.Msg["LT_TEXT_SPRINTF_TYPE_TEMP"] + ' ' + Blockly.Msg["LT_MODBUS_CONTROLLER_REG"] + ':')
		.appendField(temp_reg_settings);
	block.appendDummyInput('HV')
		.appendField(Blockly.Msg["LT_TEXT_SPRINTF_TYPE_HB"] + ' ' + Blockly.Msg["LT_MODBUS_CONTROLLER_REG"] + ':')
		.appendField(hvan_reg_settings);
	block.appendDummyInput('VV')
		.appendField(Blockly.Msg["LT_TEXT_SPRINTF_TYPE_VB"] + ' ' + Blockly.Msg["LT_MODBUS_CONTROLLER_REG"] + ':')
		.appendField(vvan_reg_settings);
	block.appendDummyInput('FAN')
		.appendField(Blockly.Msg["LT_TEXT_SPRINTF_TYPE_FAN"] + ' ' + Blockly.Msg["LT_MODBUS_CONTROLLER_REG"] + ':')
		.appendField(fan_reg_settings);
	block.setInputsInline(false);
	block.setColour('%{BKY_LT_CATEGORY_COLOUR_TEAMPLATES}');
	block.setTooltip(Blockly.Msg["LT_MODBUS_CONTROLLER_TOOLTIP"]);
	if (!Blockly.getMainWorkspace().listeners_.includes(universal_modbus_events))
		Blockly.getMainWorkspace().addChangeListener(universal_modbus_events);
}

/**
 * Initialize modbus block
 */
Blockly.Blocks['univarsal_modbus'] = {
	init: function () {
		var img = new Blockly.FieldImage("./js/blockly/img/other/modbus.png", 16, 16, "Add area");
		this.appendDummyInput('START')
			.appendField(img)
			.appendField(Blockly.Msg["LT_MODBUS_CONTROLLER_DESCR"]);
		this.setColour('%{BKY_LT_CATEGORY_COLOUR_TEAMPLATES}');
		if (this.workspace == Blockly.getMainWorkspace()){
			if(!ifBlockExcist('univarsal_modbus')){
				render_modbus(this);
			}else{
				var ereser = new Blockly.Events.BlockDelete(this);
				ereser.run(true);
			}
			
		}
	}
};

/**
 * Get register values
 */
function getRgstrValues(_block,_names){
	var values = [];
	if(Array.isArray(_names)){
		_names.forEach(name=>{
			if(_block.getField(name))
				values.push(_block.getFieldValue(name));
		});
	}
	return values;
}

/**
 * Get conditioner values
 */
function getCndValues(_block,_values){
	var value = 0, i = 0;
	while (_values[i]) {
		if(_block.getFieldValue(_values[i]))
			value |= 1 << i;
		++i;
	}
	return '0x' + value.toString(16);
}

/**
 * If register addresses have the growing sequences
 */
function ifHasGrowingSequences(_array){
	var i = 0;
	if(Array.isArray(_array)){
		while (i < _array.length) {
			if(_array[i + 1]){
				if((_array[i] + 1) == _array[i + 1]){
					return true;
				}
			}
			++i;
		}
	}else return false;
	return false;
}

/**
 * Returns the growing sequences
 */
function getGrowingSequence(_array, _index){
	var i = _index, sequences = [];
	if(Array.isArray(_array)){
		while (i < _array.length) {
			if(_array[i + 1]){
				if((_array[i] + 1) == _array[i + 1]){
					sequences.push(_array[i]);
				}else if((_array[i - 1] + 1) == _array[i]){
					sequences.push(_array[i]);
					return  {seq:sequences, index:i + 1};
				}
			}else if((_array[i - 1] + 1) == _array[i]){
				sequences.push(_array[i]);
			}
			++i;
		}
		return sequences;
	}
	return null;
}

/**
 * Add code to the sending controller
 */
function addSendingCode(){
	var body = '\nif(('+ this.setterFlag + '& 0x' + this.val +') && ('+ this.setterFlag + '& 0x80)){';
	if(this.type == 'holding'){
		body += '\nsetStatus(' + this.rs485 + ',{' + this.modbusID + ',0x03';
	}else{
		body += '\nsetStatus(' + this.rs485 + ',{' + this.modbusID + ',0x01';
	}
	body += ',' + (this.addr >> 8) + ',' + (this.addr & 0xFF);
	if(!this.count){
		body += ',0x00,0x01,0xCC16});\n}';
	}else{
		body += ',' + (this.count >> 8) + ',' + (this.count & 0xFF) + ',0xCC16});\n}';
	}
	body += 'else if(' + this.setterFlag + '& 0x' + this.val +'){';
	body += '\n' + this.setterFlag + ' &= ~0x' + this.val + ';';
	if(this.type == 'holding'){
		body += '\nsetStatus(' + this.rs485 + ',{' + this.modbusID + ',0x10';
	}else{
		body += '\nsetStatus(' + this.rs485 + ',{' + this.modbusID + ',0xF';
	}
	body += ',' + (this.addr >> 8) + ',' + (this.addr & 0xFF);
	if(!this.count){
		body += ',0x00,0x01,0x02,(' + this.name + ' >> 8),(' + this.name + ' & 0xFF)';
	}else{
		body += ',' + (this.count >> 8) + ',' + (this.count & 0xFF);
		body += ',' + (this.count*2);
		this.name.forEach(nm => {
			body += ',(' + nm + ' >> 8),(' + nm + ' & 0xFF)';
		});
	}
	body += ',0xCC16});\n}\nelse';
	return body;
}

/**
 * Add code to the rs485 event
 */
function addRequestCode(){
	var body = '\nif('+ this.setterFlag + '& 0x' + this.val +'){';
	body += '\n' + this.setterFlag + ' = ~0x' + this.val + ';';
	if(Array.isArray(this.condition)){
		var i = 0;
		while (this.condition[i]) {
			body += this.condition[i];
			body += '\n++counter;';
			++i;
		}
	}else{
		body += this.condition;
		body += '\n++counter;';
	}
	body += '\n}else';
	return body;
}

/**
 * Generate rs parser for multiply conditions
 */
function getParserCode(_hight, _low, _rsvalue, _acvalue, _var){
	var body = '\nif(((opt(' + _hight + ') << 4)| opt(' + _low + ')) == ' + _rsvalue + '){';
	body += '\nif(' + _var + ' != ' + _acvalue + '){';
	body += '\n' + _var+ ' = ' + _acvalue + ';';
	body += '\nchange = 1;';
	body += '\n}';
	body += '\n}';
	return body;
}

/**
 * Sort function
 */
function compareNumeric(a, b) {
	if (a > b) return 1;
	if (a < b) return -1;
}

/**
 * Code generation
 */
Blockly.JavaScript['univarsal_modbus'] = function (block) {
	var rs485 = block.getFieldValue('RS485'),
		on_off = {
			addr:block.getFieldValue('ONOFF_ADDR'),
			type:block.getFieldValue('ONOFF_TYPE'),
			values:getRgstrValues(block,['OFF_VALUE','ON_VALUE']),
			name:bloclyGenerateVariableName(),
			prev_val:bloclyGenerateVariableName()
		},
		mode = {
			addr:block.getFieldValue('MODE_ADDR'),
			type:block.getFieldValue('MODE_TYPE'),
			values:getRgstrValues(block,['COOL_VALUE',
										'DRY_VALUE',
										'FAN_VALUE',
										'HEAT_VALUE',
										'AUTO_VALUE',
										'MODE0',
										'MODE1']),
			name:bloclyGenerateVariableName(),
			prev_val:bloclyGenerateVariableName()
		},
		temp = {
			addr:block.getFieldValue('TEMP_ADDR'),
			type:block.getFieldValue('TEMP_MODE'),
			tmin:block.getFieldValue('TEMP_TMIN'),
			func:null,
			name:bloclyGenerateVariableName(),
			prev_val:bloclyGenerateVariableName()
		},
		hv = {
			addr:block.getFieldValue('HV_ADDR'),
			type:block.getFieldValue('HV_TYPE'),
			values:getRgstrValues(block,['HV_LEFT',
										'HV_MIDD',
										'HV_EXRIGHT',
										'HV_RIGHT',
										'HV_LFTRGHT',
										'HV_EXLEFT',
										'HV_ULTR',
										'HV_MODE0',
										'HV_MODE1']),
			name:bloclyGenerateVariableName(),
			prev_val:bloclyGenerateVariableName()
		},
		vv = {
			addr:block.getFieldValue('VV_ADDR'),
			type:block.getFieldValue('VV_TYPE'),
			values:getRgstrValues(block,['VV_LEFT',
										'VV_RIGHT',
										'VV_MIDD',
										'VV_EXRIGHT',
										'VV_EXLEFT',
										'VV_LFTRGHT',
										'VV_ULTR',
										'VV_MODE0',
										'VV_MODE1']),
		name:bloclyGenerateVariableName(),
		prev_val:bloclyGenerateVariableName()
		},
		fan = {
			addr:block.getFieldValue('FAN_ADDR'),
			type:block.getFieldValue('FAN_TYPE'),
			values:getRgstrValues(block,['FAN_AUTO',
										'FAN_MEDIUM',
										'FAN_WEAK',
										'FAN_STRONG',
										'FAN_MODE0',
										'FAN_MODE1']),
			name:bloclyGenerateVariableName(),
			prev_val:bloclyGenerateVariableName()
		},
		conditioner = {
			name: block.getFieldValue('NAME'),
			id:null,
			modes:getCndValues(block,['COOL_VALUE',
				'DRY_VALUE',
				'FAN_VALUE',
				'HEAT_VALUE',
				'AUTO_VALUE']),
			vane_ver:getCndValues(block,['HV_LEFT',
				'HV_MIDD',
				'HV_EXRIGHT',
				'HV_RIGHT',
				'HV_LFTRGHT',
				'HV_EXLEFT',
				'HV_ULTR']),
			vane_hor:getCndValues(block,['VV_LEFT',
				'VV_RIGHT',
				'VV_MIDD',
				'VV_EXRIGHT',
				'VV_EXLEFT',
				'VV_LFTRGHT',
				'VV_ULTR']),
			funs:getCndValues(block,['FAN_AUTO',
				'FAN_MEDIUM',
				'FAN_WEAK',
				'FAN_STRONG']),
			modbusID:block.getFieldValue('ID')
		},
		code = '',
		fahrenheit= {
			name_toRS:bloclyGenerateVariableName(),
			name_fromRS:bloclyGenerateVariableName(),
			toRS:null,
			fromRS:null
		},
		mull10= {
			name_toRS:bloclyGenerateVariableName(),
			name_fromRS:bloclyGenerateVariableName(),
			toRS:null,
			fromRS:null
		},
		binDec= {
			name_toRS:bloclyGenerateVariableName(),
			name_fromRS:bloclyGenerateVariableName(),
			toRS:null,
			fromRS:null
		},
		getCondInfo = {
			name:bloclyGenerateVariableName(),
			body:''
		},
		sendingController = {
			name:bloclyGenerateVariableName(),
			body:''
		},
		conditionerEvent = {
			body:''
		},
		rsEvent = {
			body:''
		},
		timerEvent = {
			body:''
		},
		setterFlag = bloclyGenerateVariableName(),
		sendingFlag = bloclyGenerateVariableName(),
		lockFlag = bloclyGenerateVariableName(),
		registerAddresses = {
			name:bloclyGenerateVariableName(),
			value:[]
		},
		types = [],
		multiply = block.getFieldValue('MULTIPLY');
	if (rs485.length < 1) {
		throw Blockly.Msg["LT_ERROR_EMPTY_DEVICE"] + ' ' + block.type;
	}
	if(rs485)
		conditioner.id = rs485.substring(0,rs485.indexOf(':'));
	if(multiply == 'TRUE')
		multiply = true;
	else
		multiply = false;
	conditionerEvent.body = '\nV-ID/COND{\nif(exciterId() != V-ID){\n';		
	conditionerEvent.body += '\nu8 ' + lockFlag + ' = 1;';
	conditionerEvent.body += '\nu8 ' + sendingFlag + ' = 0;';
	conditionerEvent.body += '\n' + getCondInfo.name + '(opt);';	
	conditionerEvent.body += '\n' + sendingController.name + '();';	
	conditionerEvent.body += '\n}';	
	conditionerEvent.body += '\n}';	
	/**
	 * Create functions bodyes for tempertature
	 */
	fahrenheit.toRS = '\ni16 ' + fahrenheit.name_toRS + '(i16 _cs){\n return _cd*9/5 + 32;\n}';
	fahrenheit.fromRS = '\ni16 ' + fahrenheit.name_fromRS + '(i16 _frh){\n return (_frh - 32)*5/9;\n}';
	mull10.toRS = '\nu16 ' + mull10.name_toRS + '(u16 _val){\nreturn _val*10;\n}';
	mull10.fromRS = '\nu16 ' + mull10.name_fromRS + '(u16 _val){\nreturn _val/10;\n}';
	binDec.toRS = '\nu16 ' + binDec.name_toRS + '(u16 _val){\nu16 newParam;\nu16 koef = 1;';
	binDec.toRS += '\nfor(u8 i=0; _val != 0; ++i){\nnewParam+=(_val%10) * koef;';
	binDec.toRS += '\nkoef*=0x10;\n_val/=10;\n}\nreturn newParam;\n}';
	binDec.fromRS = '\nu16 ' + binDec.name_fromRS + '(u16 _val){\nu16 newParam;\nu16 koef = 1;';
	binDec.fromRS += '\nfor(u8 i=0; _val != 0; ++i){\nnewParam+=(_val%0x10) * koef;';
	binDec.fromRS += '\nkoef*=10;\n_val/=0x10;\n}\nreturn newParam;\n}';
	
	/**
	 * Create additems
	 */
	block.add_items = {
		id:conditioner.id,
		type:'conditioner',
		name:conditioner.name,
		values:[['varname','COND']],
	};
	
	/**
	 * Generate get conditioner info function,
	 * sending controller function,
	 * data segment
	 */
	getCondInfo.body = '\nvoid ' + getCondInfo.name + '(u8* _opt){';
	sendingController.body = '\nvoid ' + sendingController.name + '(){';
	rsEvent.body += '\nu8 change = 0;';
	rsEvent.body += '\nu8 ciunter = 0;';
	rsEvent.body = '\nV-ID/' + rs485 + '{\nif(' + setterFlag + ' & 0x80){';
	var setterValue = 0;
	if(on_off.addr){
		setterValue |= 1;
		code += '\nu16 ' + on_off.name + ';';
		code += '\nu16 ' + on_off.prev_val + ';';
		code += '\nu8 ' + lockFlag + ';';
		code += '\nu8 ' + sendingFlag + ';';
		code += '\nu8 change;';
		code += '\nu8 counter;';
		getCondInfo.body += '\nif((_opt[0]&1) != ' + on_off.prev_val + '){\nu16 ' + mode.prev_val + ' = _opt[0]&1;' + '\n' + setterFlag  + '|=0x1;';
		getCondInfo.body += '\nif(_opt[0]&1){\n' + on_off.name + ' = ' + on_off.values[1] + ';\n}else{\n' + on_off.name + ' = ' + on_off.values[0] + ';\n}';
		getCondInfo.body += '\n}';
		registerAddresses.value.push(parseInt(on_off.addr));
		types.push(on_off.type);
		sendingController.body += addSendingCode.call({
			setterFlag:setterFlag,
			val:1,
			rs485:rs485,
			modbusID:conditioner.modbusID,
			addr:on_off.addr,
			name:on_off.name,
			type:on_off.type
		});
		var rsData = {
			setterFlag:setterFlag,
			val:1,
			condition:''
		}
		if(on_off.type == 'holding'){
			var i = 0;
			on_off.values.forEach(value => {
				rsData.condition += getParserCode(3,4,value,i,on_off.prev_val);
				++i;
			});
		}else{
			rsData.condition += '\nif((opt(3)&1) == ' + on_off.values[0] + '{';
			rsData.condition += '\nif(' + on_off.prev_val + ' != 0){';
			rsData.condition += '\n' + on_off.prev_val + ' = 0;';
			rsData.condition += '\nchange = 1;';
			rsData.condition += '\n}';
			rsData.condition += '\n}';
			rsData.condition += '\nif((opt(3)&1) ==  ' + on_off.values[1] + '{';
			rsData.condition += '\nif(' + on_off.prev_val + ' != 1){';
			rsData.condition += '\n' + on_off.prev_val + ' = 1;';
			rsData.condition += '\nchange = 1;';
			rsData.condition += '\n}';
			rsData.condition += '\n}';
		}
		rsEvent.body += addRequestCode.call(rsData);
	}else{
		on_off.name = 0;
	}
	if(mode.addr){
		setterValue |= 2;
		code += '\nu16 ' + mode.name + ';';
		code += '\nu16 ' + mode.prev_val + ';';
		code += '\nu8 ' + lockFlag + ';';
		code += '\nu8 ' + sendingFlag + ';';
		code += '\nu8 change;';
		code += '\nu8 counter;';
		getCondInfo.body += '\nif((_opt[0] >> 4) != ' + mode.prev_val + '){\n' + mode.prev_val + ' = _opt[0] >> 4;' + '\n' + setterFlag  + '|=0x2;';
		var i = 0;
		mode.values.forEach(value =>{
			if(value){
				if(!i){
					getCondInfo.body += '\nif(!(_opt[0] >> 4)){\n' + mode.name + ' = ' + value + ';\n}';
				}else{
					getCondInfo.body += 'else if((_opt[0] >> 4) == ' + i + '){\n' + mode.name + ' = ' + value + ';\n}';
				}
				++i;
			}
		});
		getCondInfo.body += '\n}';
		registerAddresses.value.push(parseInt(mode.addr));
		block.add_items.values.push(['modes',conditioner.modes]);
		types.push(on_off.type);
		sendingController.body += addSendingCode.call({
			setterFlag:setterFlag,
			val:2,
			rs485:rs485,
			modbusID:conditioner.modbusID,
			addr:mode.addr,
			name:mode.name,
			type:mode.type
		});
		var rsData = {
			setterFlag:setterFlag,
			val:2,
			condition:''
		}
		if(mode.type == 'holding'){
			var i = 0;
			mode.values.forEach(value => {
				if(value){
					rsData.condition += getParserCode(3,4,value,i,mode.prev_val);
					++i;
				}
			});
		}else{
			rsData.condition += '\nif((opt(3)&1) == ' + mode.values[0] + '{';
			rsData.condition += '\nif(' + mode.prev_val + ' != 0){';
			rsData.condition += '\n' + mode.prev_val + ' = 0;';
			rsData.condition += '\nchange = 1;';
			rsData.condition += '\n}';
			rsData.condition += '\n}';
			rsData.condition += '\nif((opt(3)&1) ==  ' + mode.values[1] + '{';
			rsData.condition += '\nif(' + mode.prev_val + ' != 1){';
			rsData.condition += '\n' + mode.prev_val + ' = 1;';
			rsData.condition += '\nchange = 1;';
			rsData.condition += '\n}';
			rsData.condition += '\n}';
		}
		rsEvent.body +=addRequestCode.call(rsData);
	}else{
		mode.name = 0;
	}
	if(temp.addr){
		setterValue |= 4;
		code += '\ni16 ' + temp.name + ';';
		switch (temp.type) {
			case '1':
				temp.func = mull10;
				break;
			case '2':
				temp.func = binDec;
				break;
			case '3':
				temp.func = fahrenheit;
				break;
			default:
				break;
		}
		code += '\ni16 ' + temp.prev_val + ';';
		getCondInfo.body += '\nif(_opt[1] != ' + temp.prev_val + '){\n' + temp.prev_val + ' = _opt[1];' + '\n' + setterFlag  + '|=0x4;';
		if(temp.func){
			getCondInfo.body += '\n' + temp.name + ' = ' + temp.func.toRS + '(_opt[1]);';
		}else{
			getCondInfo.body += '\n' + temp.name + ' = ' + temp.tmin + ' + _opt[1];';
		}
		getCondInfo.body += '\n}';
		registerAddresses.value.push(parseInt(temp.addr));
		block.add_items.values.push(['t-min',temp.tmin]);
		types.push(on_off.type);
		sendingController.body += addSendingCode.call({
			setterFlag:setterFlag,
			val:4,
			rs485:rs485,
			modbusID:conditioner.modbusID,
			addr:temp.addr,
			name:temp.name,
			type:temp.type
		});
		var rsData = {
			setterFlag:setterFlag,
			val:4,
			condition:''
		}
		if(temp.func){
			rsData.condition += '\nif(' + temp.prev_val + ' != ' + temp.func.fromRS + '((opt(3) << 4) | opt(4))){';
			rsData.condition += '\n' + temp.prev_val + ' = ' + temp.func.fromRS + '((opt(3) << 4) | opt(4)));';
			rsData.condition += '\nchange = 1;';
			rsData.condition += '\n}';
		}else{
			rsData.condition += '\nif(' + temp.prev_val + ' != (((opt(3) << 4) | opt(4)) - ' + temp.tmin + ')){';
			rsData.condition += '\n' + temp.prev_val + ' = = (((opt(3) << 4) | opt(4)) - ' + temp.tmin + '));';
			rsData.condition += '\nchange = 1;';
			rsData.condition += '\n}';
		}
		rsEvent.body +=addRequestCode.call(rsData);
	}else{
		temp.name = 0;
	}
	if(hv.addr){
		setterValue |= 8;
		code += '\nu16 ' + hv.name + ';';
		code += '\nu16 ' + hv.prev_val + ';';
		code += '\nu8 ' + lockFlag + ';';
		code += '\nu8 ' + sendingFlag + ';';
		code += '\nu8 change;';
		code += '\nu8 counter;';
		getCondInfo.body += '\nif((_opt[3] & 0xF) != ' + hv.prev_val + '){\n' + hv.prev_val + ' = _opt[3] & 0xF;' + '\n' + setterFlag  + '|=0x8;';
		var i = 0;
		hv.values.forEach(value =>{
			if(value){
				if(!i){
					getCondInfo.body += '\nif(!(_opt[3] & 0xF)){\n' + hv.name + ' = ' + value + ';\n}';
				}else{
					getCondInfo.body += 'else if((_opt[3] & 0xF) == ' + i + '){\n' + hv.name + ' = ' + value + ';\n}';
				}
				++i;
			}
		});
		getCondInfo.body += '\n}';
		registerAddresses.value.push(parseInt(hv.addr));
		block.add_items.values.push(['vane-hor',conditioner.vane_hor]);
		types.push(on_off.type);
		sendingController.body += addSendingCode.call({
			setterFlag:setterFlag,
			val:8,
			rs485:rs485,
			modbusID:conditioner.modbusID,
			addr:hv.addr,
			name:hv.name,
			type:hv.type
		});
		var rsData = {
			setterFlag:setterFlag,
			val:8,
			condition:''
		}
		if(hv.type == 'holding'){
			var i = 0;
			hv.values.forEach(value => {
				if(value){
					rsData.condition += getParserCode(3,4,value,i,hv.prev_val);
					++i;
				}
			});
		}else{
			rsData.condition += '\nif((opt(3)&1) == ' + hv.values[0] + '{';
			rsData.condition += '\nif(' + hv.prev_val + ' != 0){';
			rsData.condition += '\n' + hv.prev_val + ' = 0;';
			rsData.condition += '\nchange = 1;';
			rsData.condition += '\n}';
			rsData.condition += '\n}';
			rsData.condition += '\nif((opt(3)&1) ==  ' + hv.values[1] + '{';
			rsData.condition += '\nif(' + hv.prev_val + ' != 1){';
			rsData.condition += '\n' + hv.prev_val + ' = 1;';
			rsData.condition += '\nchange = 1;';
			rsData.condition += '\n}';
			rsData.condition += '\n}';
		}
		rsEvent.body +=addRequestCode.call(rsData);
	}else{
		hv.name = 0;
	}
	if(vv.addr){
		setterValue |= 0x10;
		code += '\nu16 ' + vv.name + ';';
		code += '\nu16 ' + vv.prev_val + ';';
		code += '\nu8 ' + lockFlag + ';';
		code += '\nu8 ' + sendingFlag + ';';
		code += '\nu8 change;';
		code += '\nu8 counter;';
		getCondInfo.body += '\nif((_opt[3] >> 4) != ' + vv.prev_val + '){\n' + vv.prev_val + ' = _opt[3] >> 4;' + '\n' + setterFlag  + '|=0x10;';
		var i = 0;
		vv.values.forEach(value =>{
			if(value){
				if(!i){
					getCondInfo.body += '\nif(!(_opt[3] >> 4)){\n' + vv.name + ' = ' + value + ';\n}';
				}else{
					getCondInfo.body += 'else if((_opt[3] >> 4) == ' + i + '){\n' + vv.name + ' = ' + value + ';\n}';
				}
				++i;
			}
		});
		getCondInfo.body += '\n}';
		registerAddresses.value.push(parseInt(vv.addr));
		block.add_items.values.push(['vane-ver',conditioner.vane_ver]);
		types.push(on_off.type);
		sendingController.body += addSendingCode.call({
			setterFlag:setterFlag,
			val:10,
			rs485:rs485,
			modbusID:conditioner.modbusID,
			addr:vv.addr,
			name:vv.name,
			type:vv.type
		});
		var rsData = {
			setterFlag:setterFlag,
			val:10,
			condition:''
		}
		if(vv.type == 'holding'){
			var i = 0;
			vv.values.forEach(value => {
				if(value){
					rsData.condition += getParserCode(3,4,value,i,vv.prev_val);
					++i;
				}
			});
		}else{
			rsData.condition += '\nif((opt(3)&1) == ' + vv.values[0] + '{';
			rsData.condition += '\nif(' + vv.prev_val + ' != 0){';
			rsData.condition += '\n' + vv.prev_val + ' = 0;';
			rsData.condition += '\nchange = 1;';
			rsData.condition += '\n}';
			rsData.condition += '\n}';
			rsData.condition += '\nif((opt(3)&1) ==  ' + vv.values[1] + '{';
			rsData.condition += '\nif(' + vv.prev_val + ' != 1){';
			rsData.condition += '\n' + vv.prev_val + ' = 1;';
			rsData.condition += '\nchange = 1;';
			rsData.condition += '\n}';
			rsData.condition += '\n}';
		}
		rsEvent.body +=addRequestCode.call(rsData);
	}else{
		vv.name = 0;
	}
	if(fan.addr){
		setterValue |= 0x20;
		code += '\nu16 ' + fan.name + ';';
		code += '\nu16 ' + fan.prev_val + ';';
		code += '\nu8 ' + lockFlag + ';';
		code += '\nu8 ' + sendingFlag + ';';
		code += '\nu8 change;';
		code += '\nu8 counter;';
		getCondInfo.body += '\nif(_opt[4] != ' + fan.prev_val + '){\n' + fan.prev_val + ' = _opt[4];' + '\n' + setterFlag  + '|=0x20;';
		var i = 0;
		fan.values.forEach(value =>{
			if(value){
				if(!i){
					getCondInfo.body += '\nif(!_opt[4]){\n' + fan.name + ' = ' + value + ';\n}';
				}else{
					getCondInfo.body += 'else if(_opt[4] == ' + i + '){\n' + fan.name + ' = ' + value + ';\n}';
				}
				++i;
			}
		});
		getCondInfo.body += '\n}';
		registerAddresses.value.push(parseInt(fan.addr));
		block.add_items.values.push(['funs',conditioner.funs]);
		types.push(on_off.type);
		sendingController.body += addSendingCode.call({
			setterFlag:setterFlag,
			val:20,
			rs485:rs485,
			modbusID:conditioner.modbusID,
			addr:fan.addr,
			name:fan.name,
			type:fan.type
		});
		var rsData = {
			setterFlag:setterFlag,
			val:20,
			condition:''
		}
		if(fan.type == 'holding'){
			var i = 0;
			fan.values.forEach(value => {
				if(value){
					rsData.condition += getParserCode(3,4,value,i,fan.prev_val);
					++i;
				}
			});
		}else{
			rsData.condition += '\nif((opt(3)&1) == ' + fan.values[0] + '{';
			rsData.condition += '\nif(' + fan.prev_val + ' != 0){';
			rsData.condition += '\n' + fan.prev_val + ' = 0;';
			rsData.condition += '\nchange = 1;';
			rsData.condition += '\n}';
			rsData.condition += '\n}';
			rsData.condition += '\nif((opt(3)&1) ==  ' + fan.values[1] + '{';
			rsData.condition += '\nif(' + fan.prev_val + ' != 1){';
			rsData.condition += '\n' + fan.prev_val + ' = 1;';
			rsData.condition += '\nchange = 1;';
			rsData.condition += '\n}';
			rsData.condition += '\n}';
		}
		rsEvent.body +=addRequestCode.call(rsData);
	}else{
		fan.name = 0;
	}
	timerEvent.body += '\nV-ID/ms:500{\nif(!' + sendingFlag + '){';
	timerEvent.body += '\n' + sendingFlag + ' = 1;';
	timerEvent.body += '\n' + setterFlag + ' = 0x' + setterValue.toString(16) + ';';
	timerEvent.body += '\n' + sendingController.name + '();';
	timerEvent.body += '\n}';
	timerEvent.body += '\n}';
	sendingController.body += ' if(!(' + setterFlag + '&0x3F)){';
	sendingController.body += '\n' + lockFlag + ' = 0;';
	sendingController.body += '\n' + sendingFlag + ' = 0;';
	sendingController.body += '\n}';
	sendingController.body += '\n}';
	getCondInfo.body += '\n}';
	rsEvent.body = rsEvent.body.substring(0,rsEvent.body.length - 4);
	rsEvent.body += '\nif((counter == ' + registerAddresses.value.length + ') && change && !' + lockFlag + '){';
	rsEvent.body += '\ncounter = 0;\nchange = 0;';
	rsEvent.body += '\nsetStatus(COND,{' + on_off.name + ' |(' + mode.name + ' << 4),' + temp.name + ',0,' + hv.name + ' |(' + vv.name + ' << 4),' + fan.name + '});';
	rsEvent.body += '\n}else{';
	rsEvent.body += '\n' + sendingController.name + '();';
	rsEvent.body += '\n}';
	rsEvent.body += '\n}else if(' + lockFlag + '){';
	rsEvent.body += '\n' + sendingController.name + '();';
	rsEvent.body += '\n}';
	rsEvent.body += '\n}';
	
	/**
	 * Generate data segment
	 */
	code += '\nu8 ' + setterFlag + ' = 0;';
	registerAddresses.value.sort(compareNumeric);
	if(temp.func){
		code += temp.func.toRS;
		code += temp.func.fromRS;
	}
	
	/**
	 * Generate sending controller function if array is a growing sequence
	 */
	if(ifHasGrowingSequences(registerAddresses.value)){
		var sequence = [], index = 0;
		if(getGrowingSequence(registerAddresses.value,index)){
			if(!Array.isArray(getGrowingSequence(registerAddresses.value,index))){
				sequence.push(getGrowingSequence(registerAddresses.value,index).seq);
				index = getGrowingSequence(registerAddresses.value,index).index;
				while (getGrowingSequence(registerAddresses.value,index)) {
					if(Array.isArray(getGrowingSequence(registerAddresses.value,index))){
						sequence.push(getGrowingSequence(registerAddresses.value,index));
						break;
					}else{
						sequence.push(getGrowingSequence(registerAddresses.value,index).seq);
						index = getGrowingSequence(registerAddresses.value,index).index;
					}

				};
			}else{
				sequence.push(getGrowingSequence(registerAddresses.value,index));
			}
			var data = {
				setterFlag:setterFlag,
				val:0,
				rs485:rs485,
				modbusID:conditioner.modbusID,
				addr:null,
				name:[],
				type:null
			}, newCode = '', 
				newRSData = {
				setterFlag:setterFlag,
				val:0,
				condition:''
			}, newRSCode = '';
			if(Array.isArray(sequence[0])){
				var used = [];
				sequence.forEach(values =>{
					data.addr = values[0];
					data.type = null;
					data.name = [];
					newRSData.condition = '';
					newRSData.val = 0;
					types = [];
					data.val = 0;
					data.count = values.length;
					var shift = 0;
					values.forEach(value =>{
						switch (value.toString()) {
							case on_off.addr:
								data.name.push(on_off.name);
								data.val |= 0x1;
								types.push(on_off.type);
								if(on_off.type == 'holding'){
									var i = 0;
									on_off.values.forEach(value => {
										newRSData.condition += getParserCode(shift + 3,shift + 4,value,i,on_off.prev_val);
										++i;
									});
								}else{
									newRSData.condition += '\nif((opt(3)&' + (1 << shift) + ') == ' + on_off.values[0] + '{';
									newRSData.condition += '\nif(' + on_off.prev_val + ' != 0){';
									newRSData.condition += '\n' + on_off.prev_val + ' = 0;';
									newRSData.condition += '\nchange = 1;';
									newRSData.condition += '\n}';
									newRSData.condition += '\n}';
									newRSData.condition += '\nif((opt(3)&' + (1 << shift) + ') ==  ' + on_off.values[1] + '{';
									newRSData.condition += '\nif(' + on_off.prev_val + ' != 1){';
									newRSData.condition += '\n' + on_off.prev_val + ' = 1;';
									newRSData.condition += '\nchange = 1;';
									newRSData.condition += '\n}';
									newRSData.condition += '\n}';
								}
								break;
							case mode.addr:
								data.name.push(mode.name);
								data.val |= 0x2;
								types.push(mode.type);
								if(mode.type == 'holding'){
									var i = 0;
									mode.values.forEach(value => {
										if(value){
											newRSData.condition += getParserCode(shift + 3,shift + 4,value,i,mode.prev_val);
											++i;
										}
									});
								}else{
									newRSData.condition += '\nif((opt(3)&' + (1 << shift) + ') == ' + mode.values[0] + '{';
									newRSData.condition += '\nif(' + mode.prev_val + ' != 0){';
									newRSData.condition += '\n' + mode.prev_val + ' = 0;';
									newRSData.condition += '\nchange = 1;';
									newRSData.condition += '\n}';
									newRSData.condition += '\n}';
									newRSData.condition += '\nif((opt(3)&' + (1 << shift) + ') ==  ' + mode.values[1] + '{';
									newRSData.condition += '\nif(' + mode.prev_val + ' != 1){';
									newRSData.condition += '\n' + mode.prev_val + ' = 1;';
									newRSData.condition += '\nchange = 1;';
									newRSData.condition += '\n}';
									newRSData.condition += '\n}';
								}
								break;
							case temp.addr:
								data.name.push(temp.name);
								data.val |= 0x4;
								types.push('holding');
								if(temp.func){
									newRSData.condition += '\nif(' + temp.prev_val + ' != ' + temp.func.fromRS + '((opt(' + (3 + shift) + ') << 4) | opt(' + (3 + shift) + '))){';
									newRSData.condition += '\n' + temp.prev_val + ' = ' + temp.func.fromRS + '((opt(' + (3 + shift) + ') << 4) | opt(' + (3 + shift) + ')));';
									newRSData.condition += '\nchange = 1;';
									newRSData.condition += '\n}';
								}else{
									newRSData.condition += '\nif(' + temp.prev_val + ' != (((opt(' + (3 + shift) + ') << 4) | opt(' + (4 + shift) + ')) - ' + temp.tmin + ')){';
									newRSData.condition += '\n' + temp.prev_val + ' = (((opt(' + (3 + shift) + ') << 4) | opt(' + (4 + shift) + ')) - ' + temp.tmin + '));';
									newRSData.condition += '\nchange = 1;';
									newRSData.condition += '\n}';
								}
								break;
							case hv.addr:
								data.name.push(hv.name);
								data.val |= 0x8;
								types.push(hv.type);
								if(hv.type == 'holding'){
									var i = 0;
									hv.values.forEach(value => {
										if(value){
											newRSData.condition += getParserCode(shift + 3,shift + 4,value,i,hv.prev_val);
											++i;
										}
									});
								}else{
									newRSData.condition += '\nif((opt(3)&' + (1 << shift) + ') == ' + hv.values[0] + '{';
									newRSData.condition += '\nif(' + hv.prev_val + ' != 0){';
									newRSData.condition += '\n' + hv.prev_val + ' = 0;';
									newRSData.condition += '\nchange = 1;';
									newRSData.condition += '\n}';
									newRSData.condition += '\n}';
									newRSData.condition += '\nif((opt(3)&' + (1 << shift) + ') ==  ' + hv.values[1] + '{';
									newRSData.condition += '\nif(' + hv.prev_val + ' != 1){';
									newRSData.condition += '\n' + hv.prev_val + ' = 1;';
									newRSData.condition += '\nchange = 1;';
									newRSData.condition += '\n}';
									newRSData.condition += '\n}';
								}
								break;
							case vv.addr:
								data.name.push(vv.name);
								data.val |= 0x10;
								types.push(vv.type);
								if(vv.type == 'holding'){
									var i = 0;
									vv.values.forEach(value => {
										if(value){
											newRSData.condition += getParserCode(shift + 3,shift + 4,value,i,vv.prev_val);
											++i;
										}
									});
								}else{
									newRSData.condition += '\nif((opt(3)&' + (1 << shift) + ') == ' + vv.values[0] + '{';
									newRSData.condition += '\nif(' + vv.prev_val + ' != 0){';
									newRSData.condition += '\n' + vv.prev_val + ' = 0;';
									newRSData.condition += '\nchange = 1;';
									newRSData.condition += '\n}';
									newRSData.condition += '\n}';
									newRSData.condition += '\nif((opt(3)&' + (1 << shift) + ') ==  ' + vv.values[1] + '{';
									newRSData.condition += '\nif(' + vv.prev_val + ' != 1){';
									newRSData.condition += '\n' + vv.prev_val + ' = 1;';
									newRSData.condition += '\nchange = 1;';
									newRSData.condition += '\n}';
									newRSData.condition += '\n}';
								}
								break;
							case fan.addr:
								data.name.push(fan.name);
								data.val |= 0x20;
								types.push(fan.type);
								if(fan.type == 'holding'){
									var i = 0;
									fan.values.forEach(value => {
										if(value){
											newRSData.condition += getParserCode(shift + 3,shift + 4,value,i,fan.prev_val);
											++i;
										}
									});
								}else{
									newRSData.condition += '\nif((opt(3)&' + (1 << shift) + ') == ' + fan.values[0] + '{';
									newRSData.condition += '\nif(' + fan.prev_val + ' != 0){';
									newRSData.condition += '\n' + fan.prev_val + ' = 0;';
									newRSData.condition += '\nchange = 1;';
									newRSData.condition += '\n}';
									newRSData.condition += '\n}';
									newRSData.condition += '\nif((opt(3)&' + (1 << shift) + ') ==  ' + fan.values[1] + '{';
									newRSData.condition += '\nif(' + fan.prev_val + ' != 1){';
									newRSData.condition += '\n' + fan.prev_val + ' = 1;';
									newRSData.condition += '\nchange = 1;';
									newRSData.condition += '\n}';
									newRSData.condition += '\n}';
								}
								break;
							default:
								break;
						}
						shift +=2;
					});
					if(types.length){
						if(types.every(type => type == 'holding')){
							used = used.concat(values);
							data.type = 'holding';
							data.val = data.val.toString(16);
							newRSData.val = data.val;
							newCode += addSendingCode.call(data);
							newRSCode += addRequestCode.call(newRSData);
						}else if(types.every(type => type == 'coils')){
							used = used.concat(values);
							data.type = 'coils';
							data.val = data.val.toString(16);
							newRSData.val = data.val;
							newCode += addSendingCode.call(data);
							newRSCode += addRequestCode.call(newRSData);
						}
					}
				});
				if(used.length != registerAddresses.value.length){
					var shift = 0;
					registerAddresses.value.forEach(val =>{
						if(!used.includes(val)){
							newRSData.condition = '';
							newRSData.val = 0;
							switch (val.toString()) {
								case on_off.addr:
									data.addr = parseInt(on_off.addr);
									data.name = on_off.name;
									data.val = '1';
									data.type = on_off.type;
									newCode += addSendingCode.call(data);
									if(on_off.type == 'holding'){
										var i = 0;
										on_off.values.forEach(value => {
											newRSData.condition += getParserCode(shift + 3,shift + 4,value,i,on_off.prev_val);
											++i;
										});
									}else{
										newRSData.condition += '\nif((opt(3)&' + (1 << shift) + ') == ' + on_off.values[0] + '{';
										newRSData.condition += '\nif(' + on_off.prev_val + ' != 0){';
										newRSData.condition += '\n' + on_off.prev_val + ' = 0;';
										newRSData.condition += '\nchange = 1;';
										newRSData.condition += '\n}';
										newRSData.condition += '\n}';
										newRSData.condition += '\nif((opt(3)&' + (1 << shift) + ') ==  ' + on_off.values[1] + '{';
										newRSData.condition += '\nif(' + on_off.prev_val + ' != 1){';
										newRSData.condition += '\n' + on_off.prev_val + ' = 1;';
										newRSData.condition += '\nchange = 1;';
										newRSData.condition += '\n}';
										newRSData.condition += '\n}';
									}
									newRSData.val = data.val;
									newRSCode += addRequestCode.call(newRSData);
									break;
								case mode.addr:
									data.addr = parseInt(mode.addr);
									data.name = mode.name;
									data.val = '2';
									data.type = mode.type;
									newCode += addSendingCode.call(data);
									if(mode.type == 'holding'){
										var i = 0;
										mode.values.forEach(value => {
											if(value){
												newRSData.condition += getParserCode(shift + 3,shift + 4,value,i,mode.prev_val);
												++i;
											}
										});
									}else{
										newRSData.condition += '\nif((opt(3)&' + (1 << shift) + ') == ' + mode.values[0] + '{';
										newRSData.condition += '\nif(' + mode.prev_val + ' != 0){';
										newRSData.condition += '\n' + mode.prev_val + ' = 0;';
										newRSData.condition += '\nchange = 1;';
										newRSData.condition += '\n}';
										newRSData.condition += '\n}';
										newRSData.condition += '\nif((opt(3)&' + (1 << shift) + ') ==  ' + mode.values[1] + '{';
										newRSData.condition += '\nif(' + mode.prev_val + ' != 1){';
										newRSData.condition += '\n' + mode.prev_val + ' = 1;';
										newRSData.condition += '\nchange = 1;';
										newRSData.condition += '\n}';
										newRSData.condition += '\n}';
									}
									newRSData.val = data.val;
									newRSCode += addRequestCode.call(newRSData);
									break;
								case temp.addr:
									data.addr = parseInt(temp.addr);
									data.name = temp.name;
									data.val = '4';
									data.type = 'holding';
									newCode += addSendingCode.call(data);
									if(temp.func){
										newRSData.condition += '\nif(' + temp.prev_val + ' != ' + temp.func.fromRS + '((opt(3) << 4) | opt(4))){';
										newRSData.condition += '\n' + temp.prev_val + ' = ' + temp.func.fromRS + '((opt(3) << 4) | opt(4)));';
										newRSData.condition += '\nchange = 1;';
										newRSData.condition += '\n}';
									}else{
										newRSData.condition += '\nif(' + temp.prev_val + ' != (((opt(3) << 4) | opt(4)) - ' + temp.tmin + ')){';
										newRSData.condition += '\n' + temp.prev_val + ' = = (((opt(3) << 4) | opt(4)) - ' + temp.tmin + '));';
										newRSData.condition += '\nchange = 1;';
										newRSData.condition += '\n}';
									}
									newRSData.val = data.val;
									newRSCode += addRequestCode.call(newRSData);
									break;
								case hv.addr:
									data.addr = hv.addr;
									data.name = hv.name;
									data.val = '8';
									data.type = hv.type;
									newCode += addSendingCode.call(data);
									if(hv.type == 'holding'){
										var i = 0;
										hv.values.forEach(value => {
											if(value){
												newRSData.condition += getParserCode(shift + 3,shift + 4,value,i,hv.prev_val);
												++i;
											}
										});
									}else{
										newRSData.condition += '\nif((opt(3)&' + (1 << shift) + ') == ' + hv.values[0] + '{';
										newRSData.condition += '\nif(' + hv.prev_val + ' != 0){';
										newRSData.condition += '\n' + hv.prev_val + ' = 0;';
										newRSData.condition += '\nchange = 1;';
										newRSData.condition += '\n}';
										newRSData.condition += '\n}';
										newRSData.condition += '\nif((opt(3)&' + (1 << shift) + ') ==  ' + hv.values[1] + '{';
										newRSData.condition += '\nif(' + hv.prev_val + ' != 1){';
										newRSData.condition += '\n' + hv.prev_val + ' = 1;';
										newRSData.condition += '\nchange = 1;';
										newRSData.condition += '\n}';
										newRSData.condition += '\n}';
									}
									newRSData.val = data.val;
									newRSCode += addRequestCode.call(newRSData);
									break;
								case vv.addr:
									data.addr = parseInt(vv.addr);
									data.name = vv.name;
									data.val = '10';
									data.type = vv.type;
									newCode += addSendingCode.call(data);
									if(vv.type == 'holding'){
										var i = 0;
										vv.values.forEach(value => {
											if(value){
												newRSData.condition += getParserCode(shift + 3,shift + 4,value,i,vv.prev_val);
												++i;
											}
										});
									}else{
										newRSData.condition += '\nif((opt(3)&' + (1 << shift) + ') == ' + vv.values[0] + '{';
										newRSData.condition += '\nif(' + vv.prev_val + ' != 0){';
										newRSData.condition += '\n' + vv.prev_val + ' = 0;';
										newRSData.condition += '\nchange = 1;';
										newRSData.condition += '\n}';
										newRSData.condition += '\n}';
										newRSData.condition += '\nif((opt(3)&' + (1 << shift) + ') ==  ' + vv.values[1] + '{';
										newRSData.condition += '\nif(' + vv.prev_val + ' != 1){';
										newRSData.condition += '\n' + vv.prev_val + ' = 1;';
										newRSData.condition += '\nchange = 1;';
										newRSData.condition += '\n}';
										newRSData.condition += '\n}';
									}
									newRSData.val = data.val;
									newRSCode += addRequestCode.call(newRSData);
									break;
								case fan.addr:
									data.addr = parseInt(fan.addr);
									data.name = fan.name;
									data.val = '20';
									data.type = fan.type;
									newCode += addSendingCode.call(data);
									if(fan.type == 'holding'){
										var i = 0;
										fan.values.forEach(value => {
											if(value){
												newRSData.condition += getParserCode(shift + 3,shift + 4,value,i,fan.prev_val);
												++i;
											}
										});
									}else{
										newRSData.condition += '\nif((opt(3)&' + (1 << shift) + ') == ' + fan.values[0] + '{';
										newRSData.condition += '\nif(' + fan.prev_val + ' != 0){';
										newRSData.condition += '\n' + fan.prev_val + ' = 0;';
										newRSData.condition += '\nchange = 1;';
										newRSData.condition += '\n}';
										newRSData.condition += '\n}';
										newRSData.condition += '\nif((opt(3)&' + (1 << shift) + ') ==  ' + fan.values[1] + '{';
										newRSData.condition += '\nif(' + fan.prev_val + ' != 1){';
										newRSData.condition += '\n' + fan.prev_val + ' = 1;';
										newRSData.condition += '\nchange = 1;';
										newRSData.condition += '\n}';
										newRSData.condition += '\n}';
									}
									newRSData.val = data.val;
									newRSCode += addRequestCode.call(newRSData);
									break;
								default:
									break;
							}
						}
					});
				}
			}else{
				types = [];
				data.addr = sequence[0];
				data.type = null;
				data.val = 0;
				var shift = 0;
				sequence.forEach(value =>{
					switch (value.toString()) {
						case on_off.addr:
							data.name.push(on_off.name);
							data.val |= 0x1;
							types.push(on_off.type);
							if(on_off.type == 'holding'){
								var i = 0;
								on_off.values.forEach(value => {
									newRSData.condition += getParserCode(shift + 3,shift + 4,value,i,on_off.prev_val);
									++i;
								});
							}else{
								newRSData.condition += '\nif((opt(3)&' + (1 << shift) + ') == ' + on_off.values[0] + '{';
								newRSData.condition += '\nif(' + on_off.prev_val + ' != 0){';
								newRSData.condition += '\n' + on_off.prev_val + ' = 0;';
								newRSData.condition += '\nchange = 1;';
								newRSData.condition += '\n}';
								newRSData.condition += '\n}';
								newRSData.condition += '\nif((opt(3)&' + (1 << shift) + ') ==  ' + on_off.values[1] + '{';
								newRSData.condition += '\nif(' + on_off.prev_val + ' != 1){';
								newRSData.condition += '\n' + on_off.prev_val + ' = 1;';
								newRSData.condition += '\nchange = 1;';
								newRSData.condition += '\n}';
								newRSData.condition += '\n}';
							}
							break;
						case mode.addr:
							data.name.push(mode.name);
							data.val |= 0x2;
							types.push(mode.type);
							if(mode.type == 'holding'){
								var i = 0;
								mode.values.forEach(value => {
									if(value){
										newRSData.condition += getParserCode(shift + 3,shift + 4,value,i,mode.prev_val);
										++i;
									}
								});
							}else{
								newRSData.condition += '\nif((opt(3)&' + (1 << shift) + ') == ' + mode.values[0] + '{';
								newRSData.condition += '\nif(' + mode.prev_val + ' != 0){';
								newRSData.condition += '\n' + mode.prev_val + ' = 0;';
								newRSData.condition += '\nchange = 1;';
								newRSData.condition += '\n}';
								newRSData.condition += '\n}';
								newRSData.condition += '\nif((opt(3)&' + (1 << shift) + ') ==  ' + mode.values[1] + '{';
								newRSData.condition += '\nif(' + mode.prev_val + ' != 1){';
								newRSData.condition += '\n' + mode.prev_val + ' = 1;';
								newRSData.condition += '\nchange = 1;';
								newRSData.condition += '\n}';
								newRSData.condition += '\n}';
							}
							break;
						case temp.addr:
							data.name.push(temp.name);
							data.val |= 0x4;
							types.push('holding');
							if(temp.func){
								newRSData.condition += '\nif(' + temp.prev_val + ' != ' + temp.func.fromRS + '((opt(' + (3 + shift) + ') << 4) | opt(' + (3 + shift) + '))){';
								newRSData.condition += '\n' + temp.prev_val + ' = ' + temp.func.fromRS + '((opt(' + (3 + shift) + ') << 4) | opt(' + (3 + shift) + ')));';
								newRSData.condition += '\nchange = 1;';
								newRSData.condition += '\n}';
							}else{
								newRSData.condition += '\nif(' + temp.prev_val + ' != (((opt(' + (3 + shift) + ') << 4) | opt(' + (4 + shift) + ')) - ' + temp.tmin + ')){';
								newRSData.condition += '\n' + temp.prev_val + ' = (((opt(' + (3 + shift) + ') << 4) | opt(' + (4 + shift) + ')) - ' + temp.tmin + '));';
								newRSData.condition += '\nchange = 1;';
								newRSData.condition += '\n}';
							}
							break;
						case hv.addr:
							data.name.push(hv.name);
							data.val |= 0x8;
							types.push(hv.type);
							if(hv.type == 'holding'){
								var i = 0;
								hv.values.forEach(value => {
									if(value){
										newRSData.condition += getParserCode(shift + 3,shift + 4,value,i,hv.prev_val);
										++i;
									}
								});
							}else{
								newRSData.condition += '\nif((opt(3)&' + (1 << shift) + ') == ' + hv.values[0] + '{';
								newRSData.condition += '\nif(' + hv.prev_val + ' != 0){';
								newRSData.condition += '\n' + hv.prev_val + ' = 0;';
								newRSData.condition += '\nchange = 1;';
								newRSData.condition += '\n}';
								newRSData.condition += '\n}';
								newRSData.condition += '\nif((opt(3)&' + (1 << shift) + ') ==  ' + hv.values[1] + '{';
								newRSData.condition += '\nif(' + hv.prev_val + ' != 1){';
								newRSData.condition += '\n' + hv.prev_val + ' = 1;';
								newRSData.condition += '\nchange = 1;';
								newRSData.condition += '\n}';
								newRSData.condition += '\n}';
							}
							break;
						case vv.addr:
							data.name.push(vv.name);
							data.val |= 0x10;
							types.push(vv.type);
							if(vv.type == 'holding'){
								var i = 0;
								vv.values.forEach(value => {
									if(value){
										newRSData.condition += getParserCode(shift + 3,shift + 4,value,i,vv.prev_val);
										++i;
									}
								});
							}else{
								newRSData.condition += '\nif((opt(3)&' + (1 << shift) + ') == ' + vv.values[0] + '{';
								newRSData.condition += '\nif(' + vv.prev_val + ' != 0){';
								newRSData.condition += '\n' + vv.prev_val + ' = 0;';
								newRSData.condition += '\nchange = 1;';
								newRSData.condition += '\n}';
								newRSData.condition += '\n}';
								newRSData.condition += '\nif((opt(3)&' + (1 << shift) + ') ==  ' + vv.values[1] + '{';
								newRSData.condition += '\nif(' + vv.prev_val + ' != 1){';
								newRSData.condition += '\n' + vv.prev_val + ' = 1;';
								newRSData.condition += '\nchange = 1;';
								newRSData.condition += '\n}';
								newRSData.condition += '\n}';
							}
							break;
						case fan.addr:
							data.name.push(fan.name);
							data.val |= 0x20;
							types.push(fan.type);
							if(fan.type == 'holding'){
								var i = 0;
								fan.values.forEach(value => {
									if(value){
										newRSData.condition += getParserCode(shift + 3,shift + 4,value,i,fan.prev_val);
										++i;
									}
								});
							}else{
								newRSData.condition += '\nif((opt(3)&' + (1 << shift) + ') == ' + fan.values[0] + '{';
								newRSData.condition += '\nif(' + fan.prev_val + ' != 0){';
								newRSData.condition += '\n' + fan.prev_val + ' = 0;';
								newRSData.condition += '\nchange = 1;';
								newRSData.condition += '\n}';
								newRSData.condition += '\n}';
								newRSData.condition += '\nif((opt(3)&' + (1 << shift) + ') ==  ' + fan.values[1] + '{';
								newRSData.condition += '\nif(' + fan.prev_val + ' != 1){';
								newRSData.condition += '\n' + fan.prev_val + ' = 1;';
								newRSData.condition += '\nchange = 1;';
								newRSData.condition += '\n}';
								newRSData.condition += '\n}';
							}
							break;
						default:
							break;
					}
					shift +=2;
				});
				if(types.length){
					if(types.every(type => type == 'holding')){
						used = used.concat(values);
						data.type = 'holding';
						data.val = data.val.toString(16);
						newRSData.val = data.val;
						newCode += addSendingCode.call(data);
						newRSCode += addRequestCode.call(newRSData);
					}else if(types.every(type => type == 'coils')){
						used = used.concat(values);
						data.type = 'coils';
						data.val = data.val.toString(16);
						newRSData.val = data.val;
						newCode += addSendingCode.call(data);
						newRSCode += addRequestCode.call(newRSData);
					}
				}
			}
			if(newCode != ''){
				sendingController.body = '\nvoid ' + sendingController.name + '(){';
				sendingController.body += newCode;
				sendingController.body += ' if(!(' + setterFlag + '&0x3F)){';
				sendingController.body += '\n' + lockFlag + ' = 0;';
				sendingController.body += '\n' + sendingFlag + ' = 0;';
				sendingController.body += '\n}';
				sendingController.body += '\n}';
				rsEvent.body = '\nV-ID/' + rs485 + '{\nif(' + setterFlag + ' & 0x80){';
				rsEvent.body += newRSCode;
				rsEvent.body = rsEvent.body.substring(0,rsEvent.body.length - 4);
				rsEvent.body += '\nif((counter == ' + registerAddresses.value.length + ') && change && !' + lockFlag + '){';
				rsEvent.body += '\ncounter = 0;\nchange = 0;';
				rsEvent.body += '\nsetStatus(COND,{' + on_off.prev_val + ' |(' + mode.prev_val + ' << 4),' + temp.prev_val + ',0,' + hv.prev_val + ' |(' + vv.prev_val + ' << 4),' + fan.prev_val + '});';
				rsEvent.body += '\n}else{';
				rsEvent.body += '\n' + sendingController.name + '();';
				rsEvent.body += '\n}';
				rsEvent.body += '\n}else if(' + lockFlag + '){';
				rsEvent.body += '\n' + sendingController.name + '();';
				rsEvent.body += '\n}';
				rsEvent.body += '\n}';
	
			}
		}
	}
	code += sendingController.body;
	code += getCondInfo.body;
	code += conditionerEvent.body;
	code += timerEvent.body;
	code += rsEvent.body;
	return code;
};