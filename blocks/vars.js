function add_shadow(block, name, input, label, label_descr = null, checked_ = null, additionalfield_ = null, additionalfield_descr_ = null) {
	try{
		var numberShadowBlock = block.workspace.newBlock(name);
		numberShadowBlock.setShadow(true);
		numberShadowBlock.initSvg();
		numberShadowBlock.render();
		var ob = numberShadowBlock.outputConnection;
		if (!additionalfield_) {
			if(label_descr)
				block.appendValueInput(input).appendField(label,label_descr);
			else
				block.appendValueInput(input).appendField(label);
			if(checked_)
				block.getInput(input).setCheck(checked_);
		} else {
			block.appendValueInput(input)
				.appendField(label)
				.appendField(additionalfield_, additionalfield_descr_)
		}
		var cc = block.getInput(input).connection;
		cc.connect(ob);
	}catch(err){
		console.log(err);
	}
}
var GenerateName = function (defaultName_, types_) {
	var workspace = Blockly.getMainWorkspace();
	var blocks = workspace.getAllBlocks();
	var names = [];
	blocks.forEach(tp => {
		types_.forEach(deftp => {
			if (tp.type == deftp) {
				names.push(tp.getFieldValue('NAME'));
			}
		});
	});
	var name = defaultName_;
	var count = 1;
	while (names.includes(name)) {
		name = defaultName_ + count;
		++count;
	}

	return name;
},
find_globals = function (filter_ = null) {
	var blocks = Blockly.getMainWorkspace().getAllBlocks(),
	globals = [];
	blocks.forEach(block => {
		if (is_varieble_block(block,true)) {
			if(filter_){
				if(filter_.includes(block.type))
				globals.push([block.getFieldValue("NAME"), block.getFieldValue("NAME")]);
			} else globals.push([block.getFieldValue("NAME"), block.getFieldValue("NAME")]);
		}
	});
	if (globals.length > 0)
		return globals;
	return null;
},
is_varieble_block = function(block_, global_ = false){
	if(block_.type.indexOf('varieble_') != -1){
		if(global_){
			if(block_.getFieldValue('GLOBAL') == "TRUE")
				return true	
		} else return true;
	}
	return false;
},
is_varieble_get_set_block = function(block_){
	if(block_.type.indexOf('variebles_') != -1)
		return true	
	return false;
},
get_vars = function (filter_ = null) {
	var variables = [];
	var parent = this.getParent();
	if(parent){	
		while (parent.getParent()) {
			if (is_varieble_block(parent))
				if(filter_){
					if(filter_.includes(parent.type))
						variables.push([parent.getFieldValue("NAME"), parent.getFieldValue("NAME")]);
				} else variables.push([parent.getFieldValue("NAME"), parent.getFieldValue("NAME")]);
			parent = parent.getParent();
		}
	}
	if(find_globals())
		find_globals().forEach(glob => {
			variables.push(glob);
		});
	if (variables.length < 1)
		variables.push(['No vars found', ' ']);
	return variables;
	
},
if_name_excist = function (block, name) {
	var result = false;
	Blockly.getMainWorkspace().getAllBlocks().forEach(blck => {
		if (blck.type == 'functions' || is_varieble_block(blck)){
			if (is_varieble_block(blck), true){
				if (blck.getFieldValue('NAME') == name && blck.id != block.id)
					result = true;
			} else if (blck.getFieldValue('NAME') == name && blck.id != block.id)
				result = true;
		}
			
	});
	return result;
},
get_var_type = function(name_, c_type_ = false){
	var blocks = Blockly.getMainWorkspace().getAllBlocks(),
	i = 0;
	while (blocks[i]) {
		if(is_varieble_block(blocks[i], true)){
			if(name_ == blocks[i].getFieldValue('NAME'))
				if(!c_type_)
					return blocks[i].type.substring(blocks[i].type.indexOf('_') + 1);
				else
					return blocks[i].getFieldValue('TYPE');
		} else if(is_varieble_block(blocks[i]) /*&& blocks[i].getParent()*/){
			if(name_ == blocks[i].getFieldValue('NAME')){
				if(!c_type_)
					return blocks[i].type.substring(blocks[i].type.indexOf('_') + 1);
				else
					return blocks[i].getFieldValue('TYPE');
			}
		}
		++i;
	}
};
function remove_var(name_){
	var blocks = Blockly.getMainWorkspace().getAllBlocks(),
	i = 0;
	while (blocks[i]) {
		if(is_varieble_get_set_block(blocks[i])){
			if(blocks[i].getFieldValue('VAR') == name_){
				blocks[i].getField('VAR').setValue(get_vars.call(blocks[i])[0][1]);
			}
		}
		++i;
	}
}
function remove_input(block_,name_){
	var childconnection = null;
	if(block_.getInput(name_)){
		if(block_.getInputTargetBlock(name_))
			if(block_.getInputTargetBlock(name_).type.indexOf('_helper') == -1)
				childconnection = block_.getInputTargetBlock(name_).outputConnection;
		block_.removeInput(name_);
	}
	return childconnection;
}
function add_input(block_,name_,inputs_,shadow_,checked_){
	try{
		var childconnection = null;
		if(Array.isArray(inputs_)){
			inputs_.forEach(input =>{
				var connection = remove_input(block_,input);
				if(connection)
					childconnection = connection;
			});
		}else{
			if(inputs_)
				childconnection = remove_input(block_,inputs_);
		}
		if(!block_.getInput(name_)){
			add_shadow(block_, shadow_, name_, Blockly.Msg["LT_CATEGORY_VARIABLES_GETTER_VALUE"],null,checked_);
			if(childconnection)
				block_.getInput(name_).connection.connect(childconnection);
		}
	}catch(err){
		console.log(err);
	}
	
}
function get_var_by_type(arr_,type_){
	var i = 0;
	while (arr_[i]) {
		if(get_var_type(arr_[i][1]) == type_){
			return arr_[i][1];
		}
		++i;
	}
	return null;
}
function vars_rotatition(block_, check_){
	var check = block_.getParent().check;
	if(block_.getParent().hasOwnProperty('check')){
		if(check_ != block_.getParent().check){
			if(check == 'Number')
				check = 'numb';
			if(get_var_type(block_.getParent().getFieldValue('VAR')) == 'text'){
				block_.setOutput(true,'Text');
			}else if(get_var_by_type(get_vars.call(block_),check.toLowerCase())){
				block_.getField('VAR').setValue(get_var_by_type(get_vars.call(block_),check.toLowerCase()));
				block_.setOutput(true,block_.getParent().check);
			}else{
				block_.setOutput(true,check_);
			}
		}
	}else{
		block_.setOutput(true,check_);
	}
}
//Global events
function global_events(event) {
	var blocks = Blockly.getMainWorkspace().getAllBlocks(),
	i = 0;
	while (blocks[i]) {
		if(is_varieble_block(blocks[i], true)){
			var parentconnection = null,
				childconnection = null;
			if (blocks[i].previousConnection)
				if (blocks[i].previousConnection.targetConnection) {
					parentconnection = blocks[i].previousConnection.targetConnection;
					blocks[i].previousConnection.targetConnection.disconnect();
				}
			if (blocks[i].nextConnection)
				if (blocks[i].nextConnection.targetConnection) {
					childconnection = blocks[i].nextConnection.targetConnection;
					blocks[i].nextConnection.targetConnection.disconnect();
				}
			if (parentconnection && childconnection)
				parentconnection.connect(childconnection);
			blocks[i].setNextStatement(false);
			blocks[i].setPreviousStatement(false);
			blocks[i].setDisabled(false);
		} else if(is_varieble_block(blocks[i]) && !blocks[i].getParent()){
			blocks[i].setNextStatement(true);
			blocks[i].setPreviousStatement(true);
			blocks[i].setDisabled(true);
			remove_var(blocks[i].getFieldValue('NAME'));
		} else if(is_varieble_get_set_block(blocks[i])){
			if(!blocks[i].disabled){
				if(blocks[i].getFieldValue('VAR') == ' '){
					remove_var(' ');
				} else if(!if_name_excist(blocks[i],blocks[i].getFieldValue('VAR'))){
					remove_var(blocks[i].getFieldValue('VAR'));
				}
			}
			if(blocks[i].type == 'variebles_setter'){
				setter_block_edit(blocks[i]);
			} else {
				getter_block_edit(blocks[i]);
			}
		}
		++i;
	}	
}
//Edit getter block
function getter_block_edit(block_, input_ = null) {
	if(['ARRAY','ARRTYPE'].includes(input_)){
		block_.appendDummyInput('ARRAY')
			.appendField(Blockly.Msg["LT_CATEGORY_VARIABLES_GETTER_TYPE"])
			.appendField(new Blockly.FieldDropdown([
				[Blockly.Msg["LT_CATEGORY_VARIABLES_GETTER_INDEX"], "0"],
				["&", "1"]
			]), 'ARRTYPE')
			.appendField(Blockly.Msg["LT_CATEGORY_VARIABLES_GETTER_INDEX"] + ':','INDEX_DESCR')
			.appendField(new Blockly.FieldNumber(0), 'INDEX');
	}else if(block_.getParent()){
		switch (get_var_type(block_.getFieldValue('VAR'))) {
			case 'array':
				block_.setOutput(true,null);
				if (!block_.getInput('ARRAY')) {
					block_.appendDummyInput('ARRAY')
						.appendField(Blockly.Msg["LT_CATEGORY_VARIABLES_GETTER_TYPE"])
						.appendField(new Blockly.FieldDropdown([
							[Blockly.Msg["LT_CATEGORY_VARIABLES_GETTER_INDEX"], "0"],
							["&", "1"]
						]), 'ARRTYPE')
						.appendField(Blockly.Msg["LT_CATEGORY_VARIABLES_GETTER_INDEX"] + ':','INDEX_DESCR')
						.appendField(new Blockly.FieldNumber(0), 'INDEX');
				}else{
					if(parseInt(block_.getFieldValue('ARRTYPE'))){
						block_.getInput('ARRAY').removeField('INDEX');
						block_.getInput('ARRAY').removeField('INDEX_DESCR');
					}else if(!block_.getField('INDEX')){
						block_.getInput('ARRAY').insertFieldAt(2,Blockly.Msg["LT_CATEGORY_VARIABLES_GETTER_INDEX"] + ':','INDEX_DESCR');
						block_.getInput('ARRAY').insertFieldAt(3,new Blockly.FieldNumber(0),'INDEX');
					}
				}
				break;
			case 'numb':
				vars_rotatition(block_,'Number');
				remove_input(block_,'ARRAY');
			break;
			case 'text':
				vars_rotatition(block_,'Text');
				remove_input(block_,'ARRAY');
			break;
			default:
				remove_input(block_,'ARRAY');
				break;
		}
	} else{
		remove_input(block_,'ARRAY');
		block_.getField('VAR').setValue(get_vars.call(block_)[0][1]);
		block_.setOutput(true,null);
	}
}
//Edit setter block
function setter_block_edit(block_, input_ = null) {
	if(['NUMB','TEXT','ARRAY','TEXT','ARRAY_INDEX','ARRAY'].includes(input_)){
		if(input_ == 'ARRAY_INDEX'){
			if(!block_.getInput('ARRAY')){
					block_.appendDummyInput('ARRAY_INDEX')
						.appendField(Blockly.Msg["LT_CATEGORY_VARIABLES_GETTER_INDEX"] + ':')
						.appendField(new Blockly.FieldNumber(0), 'INDEX');
					add_input(block_,'ARRAY',['TEXT','NUMB'],'value_helper');	
				}
				block_.getInput('ARRAY').setCheck(null);
				block_.check = null;
		}else{
			block_.appendValueInput(input_);

		}
	}else if(block_.getParent()){
		switch (get_var_type(block_.getFieldValue('VAR'))) {
			case 'numb':
				if(!block_.getInput('NUMB'))
					add_input(block_,'NUMB',['ARRAY','TEXT','ARRAY_INDEX'],'value_helper',null,'Number');
				block_.getInput('NUMB').setCheck('Number');
				block_.check = 'Number';
				break;
			case 'text':
				if(!block_.getInput('TEXT'))
					add_input(block_,'TEXT',['ARRAY','NUMB','ARRAY_INDEX'],'text_helper',null,'Text');
				block_.getInput('TEXT').setCheck('Text');
				block_.check = 'Text';
				break;
			case 'array':
				if(!block_.getInput('ARRAY')){
					block_.appendDummyInput('ARRAY_INDEX')
						.appendField(Blockly.Msg["LT_CATEGORY_VARIABLES_GETTER_INDEX"] + ':')
						.appendField(new Blockly.FieldNumber(0), 'INDEX');
					add_input(block_,'ARRAY',['TEXT','NUMB'],'value_helper');	
				}
				block_.getInput('ARRAY').setCheck(null);
				block_.check = null;
				switch(block_.getInputTargetBlock('ARRAY').type){
					case 'getbyte_control':
						block_.removeInput('ARRAY_INDEX');
						break;
					case 'sprintf':
						block_.removeInput('ARRAY_INDEX');
						break;
					case 'type_text':
						block_.removeInput('ARRAY_INDEX');
						break;
					case 'variebles_getter':
						if(get_var_type(block_.getInputTargetBlock('ARRAY').getFieldValue('VAR')) == 'text'){
							block_.removeInput('ARRAY_INDEX');
						}else if(parseInt(block_.getInputTargetBlock('ARRAY').getFieldValue('ARRTYPE'))){
							block_.removeInput('ARRAY_INDEX');
						}else if(!block_.getInput('ARRAY_INDEX')){
							block_.appendDummyInput('ARRAY_INDEX')
								.appendField(Blockly.Msg["LT_CATEGORY_VARIABLES_GETTER_INDEX"] + ':')
								.appendField(new Blockly.FieldNumber(0), 'INDEX');
							block_.moveInputBefore('ARRAY_INDEX','ARRAY');
						}
						break;
					default:
						if(!block_.getInput('ARRAY_INDEX')){
							block_.appendDummyInput('ARRAY_INDEX')
								.appendField(Blockly.Msg["LT_CATEGORY_VARIABLES_GETTER_INDEX"] + ':')
								.appendField(new Blockly.FieldNumber(0), 'INDEX');
							block_.moveInputBefore('ARRAY_INDEX','ARRAY');
						}
						break;
				}
				break;
			default:
				['ARRAY','TEXT','ARRAY_INDEX','ARRAY'].forEach(input =>{
					remove_input(block_,input);
				});
				break;
		}	
	}else{
		['NUMB','TEXT','ARRAY','TEXT','ARRAY_INDEX','ARRAY'].forEach(input =>{
			remove_input(block_,input);
		});
		block_.getField('VAR').setValue(get_vars.call(block_)[0][1]);
	}
	
}

Blockly.Blocks['value_helper'] = {
	init: function () {
		this.jsonInit({
			"message0": "%1",
			"args0": [{
				"type": "field_number",
				"name": "VALUE",
				"value": 0
			}],
			"colour": "%{BKY_LT_CATEGORY_COLOUR_VARIABLES}",
			"output": "Number"
		});
	}
};
Blockly.Blocks['text_helper'] = {
	init: function () {
		this.jsonInit({
			"message0": "%1",
			"args0": [{
				"type": "field_input",
				"name": "VALUE",
				"text": "Text"
			}],
			"colour": "%{BKY_LT_CATEGORY_COLOUR_VARIABLES}",
			"output": "Text"
		});
	}
};
Blockly.Blocks['varieble_numb'] = {
	init: function () {
		this.jsonInit({
			"message0": "%{BKY_LT_CATEGORY_VARIABLES_NUMBER}",
			"args0": [{
				"type": "field_dropdown",
				"name": "TYPE",
				"options": [
					["u8", "u8"],
					["i8", "i8"],
					["u16", "u16"],
					["i16", "i16"],
					["u32", "u32"],
					["i32", "i32"],
				]
			},
			{
				"type": "field_input",
				"name": "NAME",
				"text": GenerateName("Number", ['varieble_numb'])
			},
			{
				"type": "field_number",
				"name": "VALUE",
				"value": 0,
				"min": 0
			},
			{
				"type": "field_checkbox",
				"name": "GLOBAL",
				"checked": false
			},
			{
				"type": "field_image",
				"src": "js/blockly/img/vars/vars.png",
				"width": 16,
				"height": 16,
				"alt": "*"
			}
			],
			"previousStatement": null,
			"nextStatement": null,
			"colour": "%{BKY_LT_CATEGORY_COLOUR_VARIABLES}",
			"tooltip": "%{BKY_LT_CATEGORY_VARIABLES_NUMBER_TOOLTIP}"
		});
	}
};
Blockly.Blocks['varieble_array'] = {
	init: function () {
		this.jsonInit({
			"message0": "%{BKY_LT_CATEGORY_VARIABLES_ARRAY}",
			"args0": [{
				"type": "field_dropdown",
				"name": "TYPE",
				"options": [
					["u8", "u8"],
					["u16", "u16"],
					["u32", "u32"],
					["i16", "i16"],
					["i32", "i32"],
				]
			},
			{
				"type": "field_input",
				"name": "NAME",
				"text": GenerateName("Array", ['varieble_array'])
			},
			{
				"type": "field_input",
				"name": "VALUE",
				"text": "0,1,2"
			},
			{
				"type": "field_checkbox",
				"name": "GLOBAL",
				"checked": false
			},
			{
				"type": "field_image",
				"src": "js/blockly/img/vars/vars.png",
				"width": 16,
				"height": 16,
				"alt": "*"
			},
			{
				"type": "field_input",
				"name": "SIZE",
				"text": "100"
			}
			],
			"previousStatement": null,
			"nextStatement": null,
			"colour": "%{BKY_LT_CATEGORY_COLOUR_VARIABLES}",
			"tooltip": "%{BKY_LT_CATEGORY_VARIABLES_ARRAY_TOOLTIP}"
		});
	}
};
Blockly.Blocks['varieble_text'] = {
	init: function () {
		this.jsonInit({
			"message0": "%{BKY_LT_CATEGORY_VARIABLES_TEXT}",
			"args0": [{
				"type": "field_input",
				"name": "NAME",
				"text": GenerateName("Text", ['varieble_text'])
			},
			{
				"type": "field_input",
				"name": "MAX_SIZE",
				"text": "100"
			},
			{
				"type": "field_input",
				"name": "VALUE",
				"text": "your text"
			},
			{
				"type": "field_checkbox",
				"name": "GLOBAL",
				"checked": false
			},
			{
				"type": "field_image",
				"src": "js/blockly/img/vars/vars.png",
				"width": 16,
				"height": 16,
				"alt": "*"
			}
			],
			"previousStatement": null,
			"nextStatement": null,
			"colour": "%{BKY_LT_CATEGORY_COLOUR_VARIABLES}",
			"tooltip": "%{BKY_LT_CATEGORY_VARIABLES_TEXT_TOOLTIP}"
		});
	}
};
Blockly.Blocks['variebles_getter'] = {
	init: function () {
		this.jsonInit({
			"message0": "%{BKY_LT_CATEGORY_VARIABLES_GETTER}",
			"args0": [{
				"type": "field_dropdown",
				"name": "VAR",
				"options": get_vars.bind(this)
			},
			{
				"type": "field_image",
				"src": "js/blockly/img/vars/vars.png",
				"width": 16,
				"height": 16,
				"alt": "*"
			}
			],
			"output": null,
			"colour": "%{BKY_LT_CATEGORY_COLOUR_VARIABLES}",
			"tooltip": "%{BKY_LT_CATEGORY_VARIABLES_GETTER_TOOLTIP}"
		});
	}
};
Blockly.Blocks['variebles_setter'] = {
	init: function () {
		this.jsonInit({
			"message0": "%{BKY_LT_CATEGORY_VARIABLES_SETTER}",
			"args0": [{
				"type": "field_dropdown",
				"name": "VAR",
				"options": get_vars.bind(this),
			},
			{
				"type": "field_image",
				"src": "js/blockly/img/vars/vars.png",
				"width": 16,
				"height": 16,
				"alt": "*"
			}
			],
			"previousStatement": null,
			"nextStatement": null,
			"colour": "%{BKY_LT_CATEGORY_COLOUR_VARIABLES}",
			"tooltip": "%{BKY_LT_SET_STATE_ON_DEVICE_TT}",
			"tooltip": "%{BKY_LT_CATEGORY_VARIABLES_SETTER_TOOLTIP}"
		});
		//alert('hoba');
	},
	check : null
};

/*-------------------------------------------------------------Func----------------------------------------------------------------------------------------------------*/

Blockly.JavaScript['value_helper'] = function (block) {
	// Search the text for a substring.
	var val = block.getFieldValue('VALUE');
	var code = {
		before: "",
		gencode: val,
		after: "",
		global: ""
	};
	return JSON.stringify(code);
};
Blockly.JavaScript['text_helper'] = function (block) {
	// Search the text for a substring.
	var val = block.getFieldValue('VALUE');
	var code = {
		before: "",
		gencode: val,
		after: "",
		global: ""
	};
	return JSON.stringify(code);
};
Blockly.JavaScript['varieble_numb'] = function (block) {
	// Search the text for a substring.
	var type = block.getFieldValue('TYPE');
	var name = block.getFieldValue('NAME');
	var value = block.getFieldValue('VALUE');
	var glob = block.getFieldValue('GLOBAL');
	var code = {
		before: "",
		gencode: "",
		after: "",
		global: ""
	};

	if (!(/^[_a-zA-Z]\w{0,}$/.test(name))) {
		throw 'ERROR: variable name "' + name + '" is invalid!';
	}
	if (if_name_excist(block, name))
		throw Blockly.Msg["LT_ERROR_VAR_SAME_NAME"] + ' ' + name + ' ' + block.type;

	code.gencode = '\n' + type + ' ' + name + ' = ' + value + ';';
	if (glob == "TRUE")
		return code.gencode;

	return JSON.stringify(code);
};
Blockly.JavaScript['varieble_array'] = function (block) {
	// Search the text for a substring.
	var type = block.getFieldValue('TYPE'),
		name = block.getFieldValue('NAME'),
		size = block.getFieldValue('SIZE'),
		value = block.getFieldValue('VALUE'),
		glob = block.getFieldValue('GLOBAL'),
		code = {
			before: "",
			gencode: "",
			after: "",
			global: ""
		};

	if (!(/^[_a-zA-Z]\w{0,}$/.test(name))) {
		throw 'ERROR: variable name "' + name + '" is invalid!';
	}

	if (if_name_excist(block, name)) {
		throw Blockly.Msg["LT_ERROR_VAR_SAME_NAME"] + ' ' + name + ' ' + block.type;
	}
	if(/^(\d+(\,)?)+$/.test(value) && /^\d+$/.test(size)){
		code.gencode = '\n' + type + ' ' + name + '[' + size + '] = {' + value + '};';
	}else if(/^(\d+(\,)?)+$/.test(value)){
		code.gencode = '\n' + type + ' ' + name + '[]' + ' = {' + value + '};';
	}else if(/^\d+$/.test(size)){
		code.gencode = '\n' + type + ' ' + name + '[' + size + '];';
	}else{
		throw Blockly.Msg["LT_ERROR_INCORR_ARRAY"] + ' ' + name + ' ' + block.type;
	}
	if (glob == "TRUE") {
		return code.gencode;
	}

	return JSON.stringify(code);
};
Blockly.JavaScript['varieble_text'] = function (block) {
	// Search the text for a substring.
	var name = block.getFieldValue('NAME'),
		size = block.getFieldValue('MAX_SIZE'),
		value = block.getFieldValue('VALUE'),
		glob = block.getFieldValue('GLOBAL'),
		code = {
			before: "",
			gencode: "",
			after: "",
			global: ""
		};

	if (!(/^[_a-zA-Z]\w{0,}$/.test(name))) {
		throw 'ERROR: variable name "' + name + '" is invalid!';
	}

	if (value.length > 100) {
		throw Blockly.Msg["LT_ERROR_MAX_EXCEED"] + ' ' + value.length + ' ' + block.type;
	}
	if (if_name_excist(block, name))
		throw Blockly.Msg["LT_ERROR_VAR_SAME_NAME"] + ' ' + name + ' ' + block.type;

	code.gencode = '\nu8 ' + name + '[' + String(Number(size)+1) + '] = "' + value + '";';
	if (glob == "TRUE")
		return code.gencode;

	return JSON.stringify(code);
};
Blockly.JavaScript['variebles_setter'] = function (block) {
	// Search the text for a substring.
	var variable = block.getFieldValue('VAR'),
		val = null,
		index = block.getFieldValue('INDEX'),
		code = {
			before: "",
			gencode: "",
			after: "",
			global: ""
		};
	if(block.getInput('ARRAY')){
		val = Blockly.JavaScript.statementToCode(block, 'ARRAY');
		if (val)
		{
			val = JSON.parse(val);
		    code.before += val.before;
		}
		switch (block.getInputTargetBlock('ARRAY').type) {
			case 'value_helper':
				code.gencode = '\n' + variable + '[' + index + ']=' + val.gencode + ';';
				break;
			case 'sprintf':
				code.gencode = val.gencode;
				break;
			case 'getbyte_control':
				code.gencode = '\ngetStatus(' + block.getInputTargetBlock('ARRAY').getFieldValue('DEVICE') + ',&' + variable + ');';
				break;
			default:
				switch (block.getInputTargetBlock('ARRAY').output) {
					case 'Text':
						code.gencode = '\nsprintf(' + variable + ',"%s",' + val.gencode + ');';
						break;
					case 'Number':
						code.gencode = '\n' + variable + '[' + index + ']=' + val.gencode + ';';
						break;
					case 'Array':
						code.gencode = '\nmemcpy(' + variable + ',' + val.gencode + ');';
						break;
					default:
						code.gencode = '\n' + variable + '[' + index + ']=' + val.after + ';';
						break;
				}
				break;
		}
	}
	if(block.getInput('TEXT')){
		val = Blockly.JavaScript.statementToCode(block, 'TEXT');
		if (val)
		{
			val = JSON.parse(val);
		    code.before += val.before;
		}
		switch (block.getInputTargetBlock('TEXT').type) {
			case 'text_helper':
				code.gencode = '\nsprintf(' + variable + ',"%s","' + val.gencode + '");';
				break;
			case 'sprintf':
				code.gencode = val.gencode;
				break;
			case 'getbyte_control':
				code.gencode = '\nsprintf(' + variable + ',"' + val.gencode  + '",' + val.after + ');';
				break;
			default:
				switch (block.getInputTargetBlock('TEXT').output) {
					case 'Text':
						code.gencode = '\nsprintf(' + variable + ',"%s",' + val.gencode + ');';
						break;
					case 'Number':
						code.gencode = '\nsprintf(' + variable + ',"%d",' + val.gencode + ');';
						break;
					default:
						code.gencode = '\nsprintf(' + variable + ',"' + val.gencode + '",' + val.after + ');';
						break;
				}
				break;
		}
	}
	if(block.getInput('NUMB')){
		val = Blockly.JavaScript.statementToCode(block, 'NUMB');
		if (val)
		{
			val = JSON.parse(val);
		    code.before += val.before;
		}
			switch (block.getInputTargetBlock('NUMB').type) {
				case 'value_helper':
					code.gencode = '\n' + variable +'=' + val.gencode + ';';
					break;
				case 'sprintf':
					code.gencode = '';
					break;
				case 'getbyte_control':
					switch (get_var_type(variable,true)) {
						case 'u8':
							code.gencode = '\n' + variable + '=(u8)[' +  block.getInputTargetBlock('NUMB').getFieldValue('DEVICE') + '];';
							break;
						case 'u16':
							code.gencode = '\n' + variable + '=(u16)[' +  block.getInputTargetBlock('NUMB').getFieldValue('DEVICE') + '];';
							break;
						case 'u32':
							code.gencode = '\n' + variable + '=(u32)[' +  block.getInputTargetBlock('NUMB').getFieldValue('DEVICE') + '];';
							break;
						case 'i8':
							code.gencode = '\n' + variable + '=(i8)[' +  block.getInputTargetBlock('NUMB').getFieldValue('DEVICE') + '];';
							break;
						case 'i16':
							code.gencode = '\n' + variable + '=(i16)[' +  block.getInputTargetBlock('NUMB').getFieldValue('DEVICE') + '];';
							break;
						case 'i32':
							code.gencode = '\n' + variable + '=(i32)[' +  block.getInputTargetBlock('NUMB').getFieldValue('DEVICE') + '];';
							break;
						default:
							break;
					}
					break;
				default:
					switch (block.getInputTargetBlock('NUMB').output) {
						case 'Text':
							code.gencode = '';
							break;
						case 'Number':
							code.gencode = '\n' + variable + '=' + val.gencode + ';';
							break;
						default:
							code.gencode = '\n' + variable + '=' + val.after + ';';
							break;
					}
					break;
			}
	}
	if (variable == ' ') {
		throw Blockly.Msg["LT_ERROR_EMPTY_VAR"] + ' ' + variable + ' ' + block.type;
	}
	return JSON.stringify(code);
};
Blockly.JavaScript['variebles_getter'] = function (block) {
	// Search the text for a substring.
	var variable = block.getFieldValue('VAR'),
		index = block.getFieldValue('INDEX'),
		type = get_var_type(variable);
	if (variable == ' ') {
		throw Blockly.Msg["LT_ERROR_EMPTY_VAR"] + ' ' + variable + ' ' + block.type;
	}
	code = {
		before: "",
		gencode: "",
		after: "",
		global: ""
	};
	if(get_var_type(variable) == 'text')
		block.output = 'Text';
	else if(type == 'array' && !index && is_varieble_get_set_block(block.getParent()))
		block.output = 'Array';
	else
		block.output = 'Number';
	if (block.getParent().type == 'notification_push' 
	|| block.getParent().type == 'notification_log_error'
	|| block.getParent().type == 'notification_textbox'
	|| block.getParent().type == 'messenger_control'
	|| block.getParent().type == 'csv_google_sprdsht_controller') {
		if (type == 'numb')
		{
			code.gencode = '%d';
		}
		else
			code.gencode = '%s';
		if (index) {
			code.gencode = '%d';
			code.after = variable + '[' + index + ']';
		} else
			if (type == 'numb')
				code.after = variable;
			else
				code.after = '&' + variable;
	} else {
		if (index) {
			code.gencode = variable + '[' + index + ']';
		} else
			if (type == 'numb')
				code.gencode = variable;
			else
				code.gencode = '&' + variable;
	}
	return JSON.stringify(code);
};