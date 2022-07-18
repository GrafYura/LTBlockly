/**
 * Add sensor
 */
function addSens(_block,_index,_subIndex) {
	_block.appendDummyInput('SENS' + _index + _subIndex)
		.appendField(tab + Blockly.Msg["LT_TEXT_SPRINTF_SENS"] + ':')
		.appendField(new Blockly.FieldDropdown(blocklyDeviceOptions.bind(_block, ['motion-sensor'])), 'SENS' + _index + _subIndex);
	if(_block.getInput('AREA' + (_index + 1))){
		_block.moveInputBefore('SENS' + _index + _subIndex,'AREA' + (_index + 1));
	}
}

function addSensSettings(_block,_index,_subIndex) {
	if(!_block.getField('SETTINGS' + _index  + _subIndex)){
		var settings = new Blockly.FieldImage("./js/blockly/img/teamplates/settings.png", 16, 16, "Settings",addSensValue.bind(_block,'SENS' + _index  + _subIndex));
		settings.EDITABLE = true;
		_block.getInput('SENS' + _index  + _subIndex)
			.appendField(settings, 'SETTINGS' + _index  + _subIndex);
	}
}

/**
 * Shift sensors
 */
function shiftSens(_block, _input, _field, _index) {
	if(_block.getField(_field + (_index + 1))){
		if(!_block.getField(_field + _index)){
			_block.getInput(_input + _index).insertFieldAt(2, new Blockly.FieldNumber(30, 0, 100), _field + _index);
		}
		_block.getField(_field + _index).setValue(_block.getFieldValue(_field + (_index + 1)));
		_block.getInput(_input + _index).removeField(_field + (_index + 1));
		shiftSens(_block,_input,_field,_index + 1);
	}else if(_block.getField(_field + _index)){
		_block.getInput(_input + _index).removeField(_field + _index);
		shiftSens(_block,_input,_field,_index + 1);
	}
}

function shiftSensThroughArea(_block, _input, _field, _index, _subIndex) {
	if(_block.getField(_field + (_index + 1) + _subIndex)){
		if(!_block.getField(_field + _index  + _subIndex)){
			_block.getInput(_input + _index  + _subIndex).insertFieldAt(2, new Blockly.FieldNumber(30, 0, 100), _field + _index  + _subIndex);
		}
		_block.getField(_field + _index + _subIndex).setValue(_block.getFieldValue(_field + (_index + 1)  + _subIndex));
		_block.getField(_input + _index + _subIndex).setValue(_block.getFieldValue(_input + (_index + 1)  + _subIndex));
		shiftSensThroughArea(_block,_input,_field,_index,_subIndex + 1);
	}else if(_block.getField(_field + _index + _subIndex)){
		_block.getInput(_input + _index + _subIndex).removeField(_field + _index + _subIndex);
		shiftSensThroughArea(_block,_input,_field,_index,_subIndex + 1);
	}else if(_block.getInput(_input + (_index + 1)  + (_subIndex + 1))){
		if(!_block.getInput(_input + _index  + _subIndex)){
			addSens(_block,_index, _subIndex);
		}
		if(_block.getField('SETTINGS' + (_index + 1)  + _subIndex)){
			if(!_block.getField('SETTINGS' + _index   + _subIndex)){
				addSensSettings(_block,_index,_subIndex);
			}
		}
		_block.getField(_input + _index + _subIndex).setValue(_block.getFieldValue(_input + (_index + 1)  + _subIndex));
		shiftSensThroughArea(_block,_input,_field,_index,_subIndex + 1);
	}else if(_block.getInput(_input + (_index + 1)  + _subIndex) && parseInt(_block.getFieldValue(_input + (_index + 1)  + _subIndex)) > 0){
		if(!_block.getInput(_input + _index  + _subIndex)){
			addSens(_block,_index, _subIndex);
		}
		if(_block.getField('SETTINGS' + (_index + 1)  + _subIndex)){
			if(!_block.getField('SETTINGS' + _index   + _subIndex)){
				addSensSettings(_block,_index,_subIndex);
			}
		}
		_block.getField(_input + _index + _subIndex).setValue(_block.getFieldValue(_input + (_index + 1)  + _subIndex));
	}else if(_block.getInput(_input + (_index + 2)  + 0)){
		shiftSensThroughArea(_block,_input,_field,_index + 1,0);
	}
}

/**
 * Add sensor settitng
 */
function addSensValue(_input, _field = null, _value = null) {
	var index = _input.substring(_input.length - 2);
	if(this.getInput(_input)){
		if(this.getField(_field)){
			if(this.getField('VAL' + index) && _value){
				this.getField('VAL' + index).setValue(_value);
			}	
		}else {
			if(this.getField('VAL' + index)){
				this.getInput(_input).removeField('VAL' + index);
			}else{
				this.getInput(_input).insertFieldAt(2, new Blockly.FieldNumber(_value?_value:30, 0, 100), 'VAL' + index);
			}
		}
	}
}

/**
 * Events for the moving_music block
 */
function moving_music_events(event) {
	var block = Blockly.getMainWorkspace().getBlockById(event.blockId);
	if (block) {
		if (block.type == 'moving_music') {
			moving_music_edit(block);
		}
	}
	else {
		Blockly.getMainWorkspace().getAllBlocks().forEach(block => {
			if (block.type == 'moving_music') {
				moving_music_edit(block);
			}
		});
	}
}

/**
 * Editing the moving_music block
 */
function moving_music_edit(_block, _input = null){
	if(!_input){
		var i = 0;
		while (_block.getInput('AREA' + i)) {
			switch (InputType(_block, _block.getFieldValue('SPEAKER' + i), null).toLowerCase()) {
				case 'integer':
					if(_block.getInput('AREA' + (i + 1))){
						shift_devices(_block, 'SPEAKER', i);
						shiftSensThroughArea(_block, 'SENS','VAL',i,0);
					} else if(InputType(_block, _block.getFieldValue('SPEAKER' + (i - 1)), null).toLowerCase() == 'integer'){
						_block.removeInput('AREA' + i);
					}
					break;
				default:
					if(!_block.getInput('SENS' + i + '0')){
						_block.appendDummyInput('SENS' + i + '0')
							.appendField(tab + Blockly.Msg["LT_TEXT_SPRINTF_SENS"] + ':')
							.appendField(new Blockly.FieldDropdown(blocklyDeviceOptions.bind(_block, ['motion-sensor'])), 'SENS' + i + '0');
					}
					if(!_block.getInput('AREA' + (i + 1)) && ((i + 1) < 15)){
						_block.appendDummyInput('AREA' + (i + 1))
							.appendField(Blockly.Msg["LT_MDEIAPOINT"] + ':')
							.appendField(new Blockly.FieldDropdown(blocklyDeviceOptions.bind(_block, ['speaker'])), 'SPEAKER' + (i + 1));
					}
					break;
			}
			++i;
		}
		--i;
		if(!_block.getInput('AREA' + i))
			--i;
		switch (InputType(_block, _block.getFieldValue('SPEAKER' + i), null).toLowerCase()) {
			case 'integer':
				var count = 0;
				while (_block.getInput('SENS' + i + count)) {
					_block.removeInput('SENS' + i + count);
					++count;
				}
				break;
			default:
				break;
		}
		i = 0;
		while (_block.getInput('SENS' + i + '0')) {
			var count = 0;
			while (_block.getInput('SENS' + i + count)) {
				switch (InputType(_block, _block.getFieldValue('SENS' + i + count), null).toLowerCase()) {
					case 'integer':
						if(_block.getField('SETTINGS' + i + count)){
							_block.getInput('SENS' + i + count).removeField('SETTINGS' + i + count);
						}
						if(_block.getInput('SENS' + i + (count + 1))){
							shift_devices(_block, 'SENS' + i, count);
							shiftSens(_block, 'SENS' + i,'VAL' + i,count);
						} else if(InputType(_block, _block.getFieldValue('SENS' + i + (count - 1)), null).toLowerCase() == 'integer'){
							_block.removeInput('SENS' + i + count);
							_block.getInput('SENS' + i + (count - 1)).removeField('VAL' + i + (count - 1));
							_block.getInput('SENS' + i + (count - 1)).removeField('SETTINGS' + i + (count - 1));
						}
						break;
					default:
						if(!_block.getInput('SENS' + i + (count + 1))){
							if(!_block.getField('SETTINGS' + i + count)){
								addSensSettings(_block,i,count);
							}
							if(count + 1 < 3){
								addSens(_block,i, count + 1);
							}
						}
						break;
				}	
				++count;
			}
			++i;
		}
	}else{
		if(!_block.getInput(_input)){
			_block.appendDummyInput(_input)
				.appendField(Blockly.Msg["LT_MDEIAPOINT"] + ':')
				.appendField(new Blockly.FieldDropdown(blocklyDeviceOptions.bind(_block, ['speaker'])), 'SPEAKER' + _input.substring(_input.length - 1));
		}
	}
}

/**
 * Rendering the moving_music block
 */
function render_moving_music(_block) {
	_block.removeInput('START');
	var img = new Blockly.FieldImage("./js/blockly/img/control/control.png", 16, 16, "Add area");
	_block.appendDummyInput()
		.appendField(img)
		.appendField(Blockly.Msg['LT_MOVING_MUSIC']);
	_block.appendDummyInput()
		.appendField(Blockly.Msg['LT_SECURITY_RECOVERY_TIME_MSG_TEXT'] + ':')
		.appendField(new Blockly.FieldNumber(10, 0, 30), 'PERIOD')
		.appendField(Blockly.Msg['LT_FUNCTION_MINUTES'].toLowerCase());
	_block.appendDummyInput('AREA0')
		.appendField(Blockly.Msg['LT_MDEIAPOINT'] + ':')
		.appendField(new Blockly.FieldDropdown(blocklyDeviceOptions.bind(_block, ['speaker'])), 'SPEAKER0');
	_block.setInputsInline(false);
	if (!Blockly.getMainWorkspace().listeners_.includes(moving_music_events))
		Blockly.getMainWorkspace().addChangeListener(moving_music_events);
}

/**
 * Initialize moving_music block
 */
Blockly.Blocks['moving_music'] = {
	init: function () {
		var img = new Blockly.FieldImage("./js/blockly/img/control/control.png", 16, 16, "Add area");
		this.appendDummyInput('START')
			.appendField(img)
			.appendField(Blockly.Msg["LT_MOVING_MUSIC"]);
		this.setColour('%{BKY_LT_CATEGORY_COLOUR_TEAMPLATES}');
		if (this.workspace == Blockly.getMainWorkspace()){
			if(!ifBlockExcist('moving_music')){
				render_moving_music(this);
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
Blockly.JavaScript['moving_music'] = function (block) {
	var code = '',
	areas = [],
	i = 0,
	folovFlag = bloclyGenerateVariableName(),
	sensorsStateChecker = '',
	eraser = '',
	scriptEvent= '',
	period = block.getFieldValue('PERIOD');
	while (block.getInput('AREA' + i)) {
		var j = 0, area = {speaker:null,sensors:[]};
		area.speaker = block.getFieldValue('SPEAKER' + i);
		while (block.getInput('SENS' + i + j)) {
			var sensor = {};
			sensor.device = block.getFieldValue('SENS' + i + j);
			if(block.getField('VAL' + i + j)){
				sensor.value = block.getFieldValue('VAL' + i + j);
			} else {
				sensor.value = 30;
			}
			area.sensors.push(sensor);
			++j;
		}
		if(parseInt(area.speaker) > 0)
			areas.push(area);
		++i;
	}
	if(areas.length > 0){
		if(areas.length <= 8){
			code += '\nu8 ' + folovFlag + ' = 0;';
		}else{
			code += '\nu16 ' + folovFlag + ' = 0;';
		}
		i = 0;
		scriptEvent += '\nV-ID/V-ADDR{';
		scriptEvent += '\nif(opt0()){\nsetStatus(' + areas[0].speaker + ',1);\n}else{';
		areas.forEach(area => {
			if(area.sensors.length > 0 && parseInt(area.sensors[0].device) > 0){
				var hex = 1 << i;
				eraser += '\nif((';
				sensorsStateChecker += '\nif(('
				area.sensors.forEach(sensor => {
					if(parseInt(sensor.device) > 0){
						if(isInteger(parseFloat(sensor.value))){
							sensorsStateChecker += '([~' + sensor.device + '.1] >= ' + sensor.value + ')';
						}else{
							sensorsStateChecker += '([~' + sensor.device + '] >= ' + convert2byte(sensor.value) + ')';
						}
						eraser += '([' + sensor.device + ':maxm:' + period + '] <= ' + convert2byte(sensor.value) + ')';
						eraser += '&&';
						sensorsStateChecker += '||';
					}
				});
				eraser = eraser.substring(0,eraser.length - 2);
				eraser += ') && (' + folovFlag + '&(~0x' + hex.toString(16) + ')) && ([V-ADDR.0]&1)){';
				eraser += '\n' + folovFlag + '&= ~0x' + hex.toString(16) + ';';
				if(!i){
					eraser += '\nsetStatus(' + area.speaker + ',{6,1});';
				}else{
					eraser += '\nsetStatus(' + area.speaker + ',0);';
				}
				eraser += '\n}';
				sensorsStateChecker = sensorsStateChecker.substring(0,sensorsStateChecker.length - 2);
				sensorsStateChecker += ') && !(' + folovFlag + '&0x' + hex.toString(16) + ') && ([V-ADDR.0]&1)){';
				sensorsStateChecker += '\n'
				if(!i){
					sensorsStateChecker += '\nsetStatus(' + area.speaker + ',{6,0});';
				}else{
					sensorsStateChecker += '\nsetStatus(' + area.speaker + ',{32,ADDR2SID(' + areas[0].speaker + '),ADDR2ID(' + areas[0].speaker + ')&0xFF,ADDR2ID(' + areas[0].speaker + ') >> 8});';
				}
				sensorsStateChecker += '\n' + folovFlag + '|= 0x' + hex.toString(16) + ';';
			}
			sensorsStateChecker += '\n}';
			scriptEvent += '\nsetStatus(' + area.speaker + ',0);';
			++i;
		});
		scriptEvent += '\n' + folovFlag + ' = 0;';
		scriptEvent += '\n}';
		scriptEvent += '\n}';
		sensorsStateChecker = '\nV-ID/{' + sensorsStateChecker + '\n}';
		eraser = '\nV-ID/s:1{' + eraser + '\n}';
	}
	return code + sensorsStateChecker + eraser + scriptEvent;
};