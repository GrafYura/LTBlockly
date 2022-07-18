/**
 * Events for the related_actions block
 */
function related_actions_events(event) {
	var block = Blockly.getMainWorkspace().getBlockById(event.blockId);
	if (block) {
		if (block.type == 'related_actions') {
			related_actions_edit(block);
		}
	} else {
		Blockly.getMainWorkspace().getAllBlocks().forEach(block => {
			if (block.type == 'related_actions') {
				related_actions_edit(block);
			}
		});
	}
}

/**
 * Editing the related_actions block
 */
function related_actions_edit(_block, _input = null){
	if(!_input){
		var i = 0;
		while (_block.getInput('DEV' + i)){
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
							.appendField(Blockly.Msg["LT_SLAVE"] + ' ' + Blockly.Msg["LT_TEXT_SPRINTF_DEV"].toLowerCase() + ' ' + (i + 1) + ':')
							.appendField(new Blockly.FieldDropdown(blocklyDeviceOptions.bind(_block, devices)), 'DEV' + (i + 1));
					}
					break;
			}
			++i;
		}
	}else{
		if(!_block.getInput(_input)){
			_block.appendDummyInput(_input)
				.appendField(Blockly.Msg["LT_SLAVE"] + ' ' + Blockly.Msg["LT_TEXT_SPRINTF_DEV"].toLowerCase() + ' ' + _input.substring(_input.length - 1) + ':')
				.appendField(new Blockly.FieldDropdown(blocklyDeviceOptions.bind(_block, devices)), _input);
		}
	}
}

/**
 * Rendering the related_actions block
 */
function render_related_actions(_block) {
	_block.removeInput('START');
	var img = new Blockly.FieldImage("./js/blockly/img/control/control.png", 16, 16, "Add area");
	_block.appendDummyInput()
		.appendField(img)
		.appendField(Blockly.Msg["LT_RELATED_ACTIONS"]);
	_block.appendDummyInput('DEV0')
		.appendField(Blockly.Msg["LT_MASTER"] + ' ' + Blockly.Msg["LT_TEXT_SPRINTF_DEV"].toLowerCase() + ':')
		.appendField(new Blockly.FieldDropdown(blocklyDeviceOptions.bind(_block, devices)), 'DEV0');
	_block.setInputsInline(false);
	if (!Blockly.getMainWorkspace().listeners_.includes(related_actions_events))
		Blockly.getMainWorkspace().addChangeListener(related_actions_events);
}

/**
 * Initialize related_actions block
 */
Blockly.Blocks['related_actions'] = {
	init: function () {
		var img = new Blockly.FieldImage("./js/blockly/img/control/control.png", 16, 16, "Add area");
		this.appendDummyInput('START')
			.appendField(img)
			.appendField(Blockly.Msg["LT_RELATED_ACTIONS"]);
		this.setColour('%{BKY_LT_CATEGORY_COLOUR_TEAMPLATES}');
		if (this.workspace == Blockly.getMainWorkspace()){
			render_related_actions(this);
		}
	}
};


/**
 * Code generation
 */
Blockly.JavaScript['related_actions'] = function (block) {
	var code = '',
	devices = [],
	i = 0;
	var sameBlocks = [];
	if(ifBlockExcist('related_actions')){
		Blockly.getMainWorkspace().getAllBlocks().forEach(blocks=>{
			if(block.id != blocks.id 
				&& block.type == blocks.type){
					sameBlocks.push(blocks);
				}
		});
	}
	if(block.getFieldValue('DEV0').length < 1){
		throw Blockly.Msg["LT_ERROR_EMPTY_DEVICE"] + ' ' + block.type;
	}
	if(sameBlocks.length > 0){
		sameBlocks.forEach(blocks=>{
			if(block.getFieldValue('DEV0') == blocks.getFieldValue('DEV0')){
					throw Blockly.Msg["LT_ERROR_EQUAL_MASTERS"] + ' ' + block.type;
			}
		});
	}
	while (block.getInput('DEV' + i)) {
		if(parseInt(block.getFieldValue('DEV' + i)) > 0){
			if(sameBlocks.length > 0){
				sameBlocks.forEach(blocks=>{
					if(block.getFieldValue('DEV' + i) == blocks.getFieldValue('DEV0')){
						var j = 0;
						while (blocks.getFieldValue('DEV' + j)) {
							if(block.getFieldValue('DEV0') == blocks.getFieldValue('DEV' + j))
								throw Blockly.Msg["LT_ERROR_MASTER_USING"] + ' ' + block.type;
							++j;
						}
					}
				});
			}
			devices.push({addr:block.getFieldValue('DEV' + i), type:InputType(block, block.getFieldValue('DEV' + i), null)});		
		}
		++i;
	}
	i = 0;
	while (devices[i]) {
		switch (devices[i].type) {
			case 'device':
				var newType = blocklyGetDeviceType('[addr="' + devices[i].addr + '"]');
				switch (newType) {
					case 'dimer-lamp':
						devices[i].type = 'dimmer';
						break;
					case 'rgb-lamp':
						devices[i].type = 'rgb';
						break;
					case 'conditioner':
						devices[i].type = 'conditioner';
						break;
					case 'AC':
						devices[i].type = 'conditioner';
						break;
					case 'virtual':
						devices[i].type = 'conditioner';
						break;
					default:
						break;
				}
				break;
			case 'speaker':
				devices[i].type = 'device';
				break;
			default:
				break;
		}
		if(i){
			if(devices[i] != devices[0]){
				if(devices[i].type != devices[0].type){
					switch (devices[i].type) {
						case 'dimmer':
							switch (devices[0].type) {
								case 'rgb':
									code +='\nsetStatus(' + devices[i].addr + ',{opt(0),opt(1),0});';
									break;	
								default:
									code +='\nsetStatus(' + devices[i].addr + ',opt0());';
									break;
							}
							break;
						case 'rgb':
							switch (devices[0].type) {
								case 'dimmer':
									code +='\nsetStatus(' + devices[i].addr + ',{opt(0),opt(1),0xFE,0xFE});';
									break;	
								default:
									code +='\nsetStatus(' + devices[i].addr + ',opt0());';
									break;
							}
							break;	
						default:
							code +='\nsetStatus(' + devices[i].addr + ',opt0());';
							break;
					}
				}else{
					switch (devices[0].type) {
						case 'device':
							code +='\nsetStatus(' + devices[i].addr + ',opt0());';
							break;
						case 'dimmer':
							code +='\nsetStatus(' + devices[i].addr + ',{opt(0),opt(1),0});';
							break;
						case 'rgb':
							code +='\nsetStatus(' + devices[i].addr + ',{opt(0),opt(1),opt(2),opt(3)});';
							break;
						case 'conditioner':
							code +='\nsetStatus(' + devices[i].addr + ',{opt(0),opt(1),opt(2),opt(3),opt(4)});';
							break;	
						default:
							break;
					}
				}
			}
		}
		++i;
	}
	code = 'V-ID/' + devices[0].addr + '{' + code + '\n}';
	return code;
};