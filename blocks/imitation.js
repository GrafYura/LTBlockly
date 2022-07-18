var devices = ["lamp", "dimer-lamp", "dimmer-lamp", "script", "speaker", "conditioner", "AC", "fancoil",  "rgb-lamp", "valve-heating", "jalousie", "gate"];

/**
 * Delete empty field, and shift other fields
 */
function shift_devices(_block, _field, _index) {
	if(_block.getField(_field + (_index + 1))){
		var valve = _block.getFieldValue(_field + _index);
		_block.getField(_field + _index).setValue(_block.getFieldValue(_field + (_index + 1)));
		_block.getField(_field + (_index + 1)).setValue(valve);
		shift_devices(_block,_field,_index + 1);
	}
}

/**
 * Events for the imitation block
 */
function imitation_events(event) {
	if(event.type == Blockly.Events.CHANGE && event.element=="disabled") 
	{
		var block = Blockly.getMainWorkspace().getBlockById(event.blockId);
		if(block.type == 'imitation' && block.disabled==false){
				Blockly.getMainWorkspace().getAllBlocks().forEach(el => {
					if (el.type == 'simple_event_on_device') {
						el.setDisabled(true);
					}
				});}
	}
	if(event.type == Blockly.Events.CREATE)
	{
		var block = Blockly.getMainWorkspace().getBlockById(event.blockId);
		if(block.type == 'imitation' && block.disabled==false){
				Blockly.getMainWorkspace().getAllBlocks().forEach(el => {
					if (el.type == 'simple_event_on_device') {
						el.setDisabled(true);
					}
				});}
	}

	var block = Blockly.getMainWorkspace().getBlockById(event.blockId);
	if (block) {
		if (block.type == 'imitation') {
			imitation_edit(block);
		}
	} else {
		Blockly.getMainWorkspace().getAllBlocks().forEach(block => {
			if (block.type == 'imitation') {
				imitation_edit(block);
			}
		});
	}
}

/**
 * Editing the imitation block
 */
function imitation_edit(_block, _input = null){
	if(!_input){
		var i = 0;
		while (_block.getInput('DEV' + i)) {
			switch (InputType(_block, _block.getFieldValue('DEV' + i), null).toLowerCase()) {
				case 'integer':
					if(_block.getInput('DEV' + (i + 1))){
						shift_devices(_block, 'DEV', i);
					} else if(InputType(_block, _block.getFieldValue('DEV' + (i - 1)), null).toLowerCase() == 'integer'){
						_block.removeInput('DEV' + i);
					}
					break;
				default:
					if(!_block.getInput('DEV' + (i + 1))){
						_block.appendDummyInput('DEV' + (i + 1))
							.appendField(Blockly.Msg["LT_TEXT_SPRINTF_DEV"] + ':')
							.appendField(new Blockly.FieldDropdown(blocklyDeviceOptions.bind(_block, devices)), 'DEV' + (i + 1));
					}
					break;
			}
			++i;
		}
	}else{
		if(!_block.getInput(_input)){
			_block.appendDummyInput(_input)
				.appendField(Blockly.Msg["LT_TEXT_SPRINTF_DEV"] + ':')
				.appendField(new Blockly.FieldDropdown(blocklyDeviceOptions.bind(_block, devices)), _input);
		}
	}
}

/**
 * Rendering the imitation block
 */
function render_imitation(_block) {
	//_block.removeInput('START');
	//var img = new Blockly.FieldImage("./js/blockly/img/control/control.png", 16, 16, "Add area");
	_block.appendDummyInput()
		.appendField(Blockly.Msg["LT_IMITATION_AUTOOFF"] + ':');
	_block.appendDummyInput()
		.appendField(tab + Blockly.Msg["LT_IMITATION_BEG"])
		.appendField(new Blockly.FieldCheckbox('TRUE'), 'STARTAUTOOFF');
	_block.appendDummyInput()
		.appendField(tab + Blockly.Msg["LT_IMITATION_END"])
		.appendField(new Blockly.FieldCheckbox('TRUE'), 'FINISHAUTOOFF');
	_block.appendDummyInput()
		.appendField(Blockly.Msg["LT_PERIOD"])
		.appendField(new Blockly.FieldNumber(1,0), 'PERIOD')
		.appendField(Blockly.Msg["LT_SECONDS"]);
	_block.appendDummyInput('DEV0')
		.appendField(Blockly.Msg["LT_TEXT_SPRINTF_DEV"] + ':')
		.appendField(new Blockly.FieldDropdown(blocklyDeviceOptions.bind(_block, devices)), 'DEV0');
	_block.setInputsInline(false);
	if (!Blockly.getMainWorkspace().listeners_.includes(imitation_events))
		Blockly.getMainWorkspace().addChangeListener(imitation_events);
}

/**
 * Initialize imitation block
 */
Blockly.Blocks['imitation'] = {
	init: function () {
		var img = new Blockly.FieldImage("./js/blockly/img/control/control.png", 16, 16, "Add area");
		this.appendDummyInput('START')
			.appendField(img)
			.appendField(Blockly.Msg["LT_IMITATION"]);
		this.setColour('%{BKY_LT_CATEGORY_COLOUR_TEAMPLATES}');
		if (this.workspace == Blockly.getMainWorkspace()){
			if(!ifBlockExcist('imitation')){
				render_imitation(this);
			}else{
				var ereser = new Blockly.Events.BlockDelete(this);
				ereser.run(true);
			}
		}
	}
};

/**
 * Generate random numbers
 */

function getNumbers() {
	return Math.floor(Math.random() * 16);
}

/**
 * Code generation
 */
Blockly.JavaScript['imitation'] = function (block) {
	var code = '',
	procFunc = {
		name:bloclyGenerateVariableName(),
		body:''
	},offAll = {
		name:bloclyGenerateVariableName(),
		body:''
	}
	var i = 0;
	procFunc.body += '\nvoid ' + procFunc.name + '(){';
	offAll.body += '\nvoid ' + offAll.name + '(){';
	while (block.getField('DEV' + i)) {
		if(block.getFieldValue('DEV' + i) != '-1'){
			offAll.body += '\nsetStatus(' + block.getFieldValue('DEV' + i) + ',0);' ;
			procFunc.body += '\nsetStatus(' + block.getFieldValue('DEV' + i) + ',rand()&1);\n' ;
		}
		++i;
	}
	procFunc.body += '\n}'
	offAll.body += '\n}'
	code += offAll.body;
	code += procFunc.body;
	code += '\nV-ID/V-ADDR{\nif(opt0()){';
	if(block.getFieldValue('STARTAUTOOFF') == 'TRUE'){
		code += '\n' + offAll.name + '();';
	}
	code += '\ndelayedCallR(' + procFunc.name + ',' + block.getFieldValue('PERIOD') + ');';
	code += '\n}else{';
	if(block.getFieldValue('FINISHAUTOOFF') == 'TRUE'){
		code += '\n' + offAll.name + '();';
	}
	code += '\ncancelDelayedCall(' + procFunc.name + ');';
	code += '\n}';
	code += '\n}';
	console.log(code);
	return code;
};