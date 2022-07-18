/**
 * Add settings field
 */
function addField(_input, _field, _type,_value = null) {
	if(!this.getField(_field)){
		var i = 0, offset = 0;
		while (this.inputList[i].name != _input) {
			++i;
		}
		if(this.inputList[i].name == _input){
			while (this.inputList[i].fieldRow[offset]) {
				++offset;
			}
			--offset;
			if(_value.hasOwnProperty('label')){
				this.getInput(_input).insertFieldAt(offset,_value.label,_field + 'LBL');
				++offset;
			}
			switch (_type.toLowerCase()) {
				case 'number':
					this.getInput(_input).insertFieldAt(offset,new Blockly.FieldNumber(_value?_value.hasOwnProperty('value')?_value.value:0:0, _value?_value.hasOwnProperty('min')?_value.min:0:0, _value?_value.hasOwnProperty('max')?_value.max:100:100),_field);
					break;
				case 'text':
					this.getInput(_input).insertFieldAt(offset,new FieldTextInput(_value?_value.hasOwnProperty('value')?_value.value:'':''),_field);
					break;
				case 'dropdown':
					this.getInput(_input).insertFieldAt(offset,new FieldDropdown(_value?_value.hasOwnProperty('options')?_value.options:["Nothing","-1"]:["Nothing","-1"]),_field);
					break;
				default:
					break;
			}
		}
	}else{
		if(this.getInput(_input)){
			if(this.getField(_field + 'LBL')){
				this.getInput(_input).removeField(_field + 'LBL');
			}
			this.getInput(_input).removeField(_field);
		}
	}
}

/**
 * Rendering the save_device_state block
 */
function render_save_device_state(_block) {
	_block.removeInput('START');
	var img = new Blockly.FieldImage("./js/blockly/img/control/control.png", 16, 16, "Add Area"),
	imgSettings = new Blockly.FieldImage("./js/blockly/img/teamplates/settings.png", 16, 16, "Add settings",addField.bind(_block,'DEVICE','TIMER','NUMBER',{value:10,min:1,max:30,label:Blockly.Msg["LT_PERIOD"] + ':'}));
	imgSettings.EDITABLE = true;
	_block.appendDummyInput()
		.appendField(img)
		.appendField(Blockly.Msg['LT_SAVE_DEVICE_STATE']);
	_block.appendDummyInput('DEVICE')
		.appendField(Blockly.Msg['LT_TEXT_SPRINTF_DEV'] + ':')
		.appendField(new Blockly.FieldDropdown(blocklyDeviceOptions.bind(_block, devices)), 'DEVICE')
		.appendField(imgSettings);
	_block.setInputsInline(false);
}

/**
 * Initialize save_device_state block
 */
Blockly.Blocks['save_device_state'] = {
	init: function () {
		var img = new Blockly.FieldImage("./js/blockly/img/control/control.png", 16, 16, "Add area");
		this.appendDummyInput('START')
			.appendField(img)
			.appendField(Blockly.Msg["LT_SAVE_DEVICE_STATE"]);
		this.setColour('%{BKY_LT_CATEGORY_COLOUR_TEAMPLATES}');
		if (this.workspace == Blockly.getMainWorkspace()){
			if(!ifBlockExcist('save_device_state')){
				render_save_device_state(this);
			}else{
				var ereser = new Blockly.Events.BlockDelete(this);
				ereser.run(true);
			}
		}
	}
};

/**
 * Code generation
 */
Blockly.JavaScript['save_device_state'] = function (block) {
	var code = '',
	device={addr:null, type:null},
	restoreSavedSatus = {name:bloclyGenerateVariableName(),body:''},
	writeToEemul = {name:bloclyGenerateVariableName(),body:''},
	saveSatus = {body:''},
	listnerReset = {name:bloclyGenerateVariableName()},
	listner = bloclyGenerateVariableName(),
	devStatus = bloclyGenerateVariableName(),
	coilAddr = 1,
	period = block.getField('PERIOD');
	device.addr = block.getFieldValue('DEVICE');
	if(device.addr.length < 1){
		throw Blockly.Msg["LT_ERROR_EMPTY_DEVICE"] + ' ' + block.type;
	}
	if(period){
		period = block.getFieldValue('PERIOD');
	}else{
		period = 10;
	}
	coilAddr = parseInt(device.addr.substring(device.addr.indexOf(':') + 1));
	coilAddr = parseInt(coilAddr * 100/250);
	coilAddr = parseInt(coilAddr * 127/100);
	coilAddr+=60000;
	writeToEemul.body +='\nif(!eeEmulWrite(' + coilAddr +',' + devStatus + '))\nsrvError("Writing by addres ' + coilAddr +' filed!");';		
	code +='\nu8 ' + listner + ' = 0;';
	code +='\nu32 ' + devStatus + ' = 0;';
	restoreSavedSatus.body += '\nu32 readVar = 0;';
	restoreSavedSatus.body += '\nif(eeEmulRead(' + coilAddr + ',&readVar))\n{';
	saveSatus.body +='\n' + devStatus + ' = 0;';
	device.type = InputType(block, block.getFieldValue('DEVICE'), null);
	switch (device.type) {
		case 'device':
			var newType = blocklyGetDeviceType('[addr="' + device.addr + '"]');
			switch (newType) {
				case 'dimer-lamp':
					device.type = 'dimmer';
					break;
				case 'rgb-lamp':
					device.type = 'rgb';
					break;
				case 'conditioner':
					device.type = 'conditioner';
					break;
				default:
					break;
			}
			break;
		case 'speaker':
			device.type = 'device';
			break;
		default:
			break;
	}
	switch (device.type) {
		case 'device':
			restoreSavedSatus.body += '\nsetStatus(' + device.addr + ',readVar&0xFF);';
			saveSatus.body +='\n' + devStatus + ' = opt(0);';
			break;
		case 'dimmer':
			restoreSavedSatus.body += '\nsetStatus(' + device.addr + ',{readVar&0xFF,(readVar >> 8)&0xFF,0});';
			saveSatus.body +='\n' + devStatus + '=(' + devStatus + ' << 8) | opt(1);';
			saveSatus.body +='\n' + devStatus + ' = (' + devStatus + ' << 8) | opt(0);';
			break;
		case 'rgb':
			restoreSavedSatus.body += '\nsetStatus(' + device.addr + ',{readVar&0xFF,(readVar >> 8)&0xFF,(readVar >> 16)&0xFF,(readVar >> 24)&0xFF});';
			saveSatus.body +='\n' + devStatus + ' = (' + devStatus + ' << 8) | opt(3);';
			saveSatus.body +='\n' + devStatus + ' = (' + devStatus + ' << 8) | opt(2);';
			saveSatus.body +='\n' + devStatus + ' = (' + devStatus + ' << 8) | opt(1);';
			saveSatus.body +='\n' + devStatus + ' = (' + devStatus + ' << 8) | opt(0);';
			break;
		case 'conditioner':
			restoreSavedSatus.body += '\nsetStatus(' + device.addr + ',{readVar&0xFF,(readVar >> 8)&0xFF,0,(readVar >> 16)&0xFF,(readVar >> 24)&0xFF});';
			saveSatus.body +='\n' + devStatus + ' = (' + devStatus + ' << 8) | opt(4);';
			saveSatus.body +='\n' + devStatus + ' = (' + devStatus + ' << 8) | opt(3);';
			saveSatus.body +='\n' + devStatus + ' = (' + devStatus + ' << 8) | opt(1);';
			saveSatus.body +='\n' + devStatus + ' = (' + devStatus + ' << 8) | opt(0);';
			break;	
		default:
			break;
	}
	restoreSavedSatus.body += '\n}else{';
	restoreSavedSatus.body += '\nsrvError("Reading by addres ' + coilAddr + ' failed!");\nreturn;\n}';
	code += '\nvoid ' + restoreSavedSatus.name + '()\n{' + restoreSavedSatus.body + '\n}';
	code += '\nvoid onInit()\n{\n' + restoreSavedSatus.name + '();\n}';
	code += '\nvoid ' + listnerReset.name + '()\n{\n' + listner + '=0;\n}';
	code += '\nvoid ' + writeToEemul.name + '()\n{\n' + writeToEemul.body + '\n}';
	code += '\nV-ID/' + device.addr + '{' + saveSatus.body + '\n' + writeToEemul.name + '();\n' + listner + ' = 1;\ndelayedCall(' + listnerReset.name + ',' + period + ');\n}';
	code += '\nV-ID/m:' + period + '{\nif(!' + listner + '){\n' + writeToEemul.name + '();\n}\n}';
	return code;
};