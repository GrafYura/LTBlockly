/**
 *	Find functions names
 */

var funcget = function () {
	var workspace = Blockly.getMainWorkspace(),
		blocks = workspace.getAllBlocks(),
		funcs = [],
		i = 0;
	while (blocks[i]) {
		if (blocks[i].type == 'functions' || blocks[i].type == 'delayed_function')
			funcs.push([blocks[i].getFieldValue('NAME'), blocks[i].getFieldValue('NAME')]);
		i++;
	}
	if (funcs.length == 0)
		funcs = [
			["No functions found", ""]
		];
	return funcs;
}

/**
 * Generete individual name
 */

var getName = function (baseName) {
	var workspace = Blockly.getMainWorkspace();
	var blocks = workspace.getAllBlocks();
	var names = [];
	blocks.forEach(el => {
		if (el.type == 'functions' || el.type == 'delayed_function' || el.type == 'functions_on_init') {
			names.push(el.getFieldValue('NAME'));
		}
	});

	var name = baseName;
	var count = 1;
	while (names.includes(name)) {
		name = baseName;
		name += count;
		++count;
	}

	return name;
}

function onInitFunctionCreate(event) {
	if (event.type == Blockly.Events.CREATE) {
		var block = Blockly.getMainWorkspace().getBlockById(event.blockId);
		if (block && block.type == 'functions_on_init') {
			var blocks = Blockly.getMainWorkspace().getAllBlocks();
			var counter = [];
			blocks.forEach(el => {
				if (el.type == 'functions_on_init') {
					counter.push(el);
				}
			});

			if (counter.length > 1) {
				block.setDeletable(true);
				block.dispose(true);
			} else {

			}
		}
	}
}

// /**
//  * Rename if busy
//  */

// var onIncorrectFunctionName = function(event){
// 	if(event.type == Blockly.Events.CHANGE && event.element == 'field'){
// 		var block = Blockly.getMainWorkspace().getBlockById(event.blockId);
// 		if(block && block.type == 'functions' || block.type == 'delayed_function'){
// 			alert('event');
// 		}	
// 	}
// }

////////////////////////////////////////////////////////////////////////////
/////////////////////////// BLOCKS /////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

/**
 * Main
 */

Blockly.Blocks['functions'] = {
	init: function () {
		this.jsonInit({
			"message0": "%2%{BKY_LT_FUNCTION_NAME}: %1",
			"args0": [{
				"type": "field_input",
				"name": "NAME",
				"text": getName('func')
			},
			{
				"type": "field_image",
				"src": "js/blockly/img/funcs/funcs.png",
				"width": 16,
				"height": 16,
				"alt": "*"
			}
			],
			"message1": "%1",
			"args1": [{
				"type": "input_statement",
				"name": "BODY"
			},],
			"colour": "%{BKY_LT_CATEGORY_COLOUR_FUNCTIONS}",
			"tooltip": "Function creation"
		});
	},
	event: false
};

/**
 * onInit
 */

Blockly.Blocks['functions_on_init'] = {
	init: function () {
		this.jsonInit({
			"message0": "%1onInit",
			"args0": [{
				"type": "field_image",
				"src": "js/blockly/img/funcs/funcs.png",
				"width": 16,
				"height": 16,
				"alt": "*"
			}],
			"message1": "%1",
			"args1": [{
				"type": "input_statement",
				"name": "BODY"
			},],
			"colour": "%{BKY_LT_CATEGORY_COLOUR_FUNCTIONS}",
			"tooltip": "Perform actions during script initialization"
		});
	},
	event: false
};

/**
 * Call
 */

Blockly.Blocks['functions_call'] = {
	init: function () {
		this.jsonInit({
			"message0": "%2%{BKY_LT_FUNCTION_CALL}: %1",
			"args0": [{
				"type": "field_dropdown",
				"name": "NAME",
				"options": funcget.bind(this)
			},
			{
				"type": "field_image",
				"src": "js/blockly/img/funcs/funcs.png",
				"width": 16,
				"height": 16,
				"alt": "*"
			}
			],
			"colour": "%{BKY_LT_CATEGORY_COLOUR_FUNCTIONS}",
			"tooltip": "Call function",
			"previousStatement": null,
			"nextStatement": null
		});
	}
};

/**
 * Delayed call
 */

Blockly.Blocks['functions_delay'] = {
	init: function () {
		this.jsonInit({
			"message0": "%5%{BKY_LT_FUNCTION_DALAY}",
			"args0": [{
				"type": "field_dropdown",
				"name": "NAME",
				"options": funcget.bind(this)
			},
			{
				"type": "field_number",
				"name": "TIME",
				"value": 5
			},
			{
				"type": "field_dropdown",
				"name": "TYPE",
				"options": [
					["%{BKY_LT_FUNCTION_SECONDS}", "l"],
					["%{BKY_LT_FUNCTION_MILISECONDS}", "lMs"],
					["%{BKY_LT_FUNCTION_MINUTES}", "lM"]
				]
			},
			{
				"type": "field_checkbox",
				"name": "REPEAT",
				"checked": false
			},
			{
				"type": "field_image",
				"src": "js/blockly/img/funcs/funcs.png",
				"width": 16,
				"height": 16,
				"alt": "*"
			}
			],
			"colour": "%{BKY_LT_CATEGORY_COLOUR_FUNCTIONS}",
			"tooltip": "Call a function after a specified time",
			"previousStatement": null,
			"nextStatement": null
		});
	}
};

/**
 * Cancel delayed call
 */

Blockly.Blocks['functions_cancel_delay'] = {
	init: function () {
		this.jsonInit({
			"message0": "%2%{BKY_LT_FUNCTION_CANCEL}: %1",
			"args0": [{
				"type": "field_dropdown",
				"name": "NAME",
				"options": funcget.bind(this)
			},
			{
				"type": "field_image",
				"src": "js/blockly/img/funcs/funcs.png",
				"width": 16,
				"height": 16,
				"alt": "*"
			}
			],
			"colour": "%{BKY_LT_CATEGORY_COLOUR_FUNCTIONS}",
			"tooltip": "Cancel delayed function call",
			"previousStatement": null,
			"nextStatement": null
		});
	}
};

////////////////////////////////////////////////////////////////////////////
/////////////////////////// GENCODE ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

/**
 * Main
 */

Blockly.JavaScript['functions'] = function (block) {
	var name = block.getFieldValue('NAME'),
		body = Blockly.JavaScript.statementToCode(block, 'BODY'),
		blocks = Blockly.getMainWorkspace().getAllBlocks(),
		event_block = 0,
		globals = "",
		result = "";
	block.event = true;
	blocks.forEach(blck => {
		if (blck.type == 'delayed_function' || blck.type == 'functions') {
			if (blck.getFieldValue('NAME') == name && blck.id != block.id)
				throw Blockly.Msg["ERROR_FUNC_SAME_NAME"] + ' ' + name + ' ' + block.type;
		} else if (blck.type == 'varieble_numb' ||
			blck.type == 'varieble_text' ||
			blck.type == 'varieble_array') {
			if (blck.getFieldValue('NAME') == block.getFieldValue('NAME')) {
				throw 'ERROR: function and varialble names "' +
				blck.getFieldValue('NAME') +
				'" is duplicate';
			}
		}
	});

	if (!(/^[_a-zA-Z]\w{0,}$/.test(name))) {
		throw 'ERROR: function name "' + name + '" is invalid!';
	}


	if (body.indexOf('{') != -1)
		body = body.substring(body.indexOf('{'));
	while (blocks[event_block] && !blocks[event_block].event)
		++event_block;
	var parser = [];
	var i = 0;
	while (body.indexOf('}{') != -1) {
		parser.push(body.substring(0, body.indexOf('}{') + 1));
		body = body.substring(body.indexOf('}{') + 1);
	}
	if (body != '')
		parser.push(body);
	while (parser[i]) {
		parser[i] = JSON.parse(parser[i]);
		i++;
	}
	// if (blocks[event_block].type == block.type)
	// 	blocks.forEach(bl_ => {
	// 		if (bl_.getFieldValue('GLOBAL') == 'TRUE') {
	// 			switch (bl_.type) {
	// 				case 'varieble_numb':
	// 					globals += '\n' + bl_.getFieldValue('TYPE') + ' ' + bl_.getFieldValue('NAME') + ' = ' + bl_.getFieldValue('VALUE') + ';';
	// 					break;
	// 				case 'varieble_array':
	// 					globals += '\n' + bl_.getFieldValue('TYPE') + ' ' + bl_.getFieldValue('NAME') + '[] = {' + bl_.getFieldValue('VALUE') + '};';
	// 					break;
	// 				case 'varieble_text':
	// 					globals += '\nu8 ' + bl_.getFieldValue('NAME') + '[] = "' + bl_.getFieldValue('VALUE') + '";';
	// 					break;
	// 				default:
	// 					break;
	// 			}
	// 		}
	// 	});
	var code = "";
	parser.forEach(el => {
		globals += el.global;
		code += el.before + el.gencode + el.after;
	});
	result = globals + '\nvoid ' + name + '() {\n' + code;
	result += '\n}\n'
	return result;
};

/**
 * onInit
 */

Blockly.JavaScript['functions_on_init'] = function (block) {
	// Search the text for a substring.
	var body = Blockly.JavaScript.statementToCode(block, 'BODY'),
		result = '\nvoid onInit() {\n',
		event_block = 0,
		blocks = Blockly.getMainWorkspace().getAllBlocks(),
		globals = "";
	block.event = true;
	if (body.indexOf('{') != -1)
		body = body.substring(body.indexOf('{'));

	while (blocks[event_block] && !blocks[event_block].event)
		++event_block;

	if (!(body === '')) {
		var parser = [];
		var i = 0;
		while (body.indexOf('}{') != -1) {
			parser.push(body.substring(0, body.indexOf('}{') + 1));
			body = body.substring(body.indexOf('}{') + 1);
		}
		parser.push(body);
		while (parser[i]) {
			parser[i] = JSON.parse(parser[i]);
			i++;
		}
		if (blocks[event_block].type == block.type)
			blocks.forEach(bl_ => {
				if (bl_.getFieldValue('GLOBAL') == 'TRUE') {
					switch (bl_.type) {
						case 'varieble_numb':
							globals += '\n' + bl_.getFieldValue('TYPE') + ' ' + bl_.getFieldValue('NAME') + ' = ' + bl_.getFieldValue('VALUE') + ';';
							break;
						case 'varieble_array':
							globals += '\n' + bl_.getFieldValue('TYPE') + ' ' + bl_.getFieldValue('NAME') + '[] = {' + bl_.getFieldValue('VALUE') + '};';
							break;
						case 'varieble_text':
							globals += '\nu8 ' + bl_.getFieldValue('NAME') + '[] = "' + bl_.getFieldValue('VALUE') + '";';
							break;
						default:
							break;
					}
				}
			});
		var code = "";
		parser.forEach(el => {
			globals += el.global;
			code += el.before + el.gencode + el.after;
		});
		result = globals + result + code;

	}
	result += '\n}\n'
	return result;
};

/**
 * Call
 */

Blockly.JavaScript['functions_call'] = function (block) {
	// Search the text for a substring.
	var name = block.getFieldValue('NAME');

	var code = {
		before: "",
		after: "",
		gencode: "",
		global: ""
	};

	code.gencode += '\n' + name + '();\n';

	return JSON.stringify(code);
};

/**
 * Delayd call
 */

Blockly.JavaScript['functions_delay'] = function (block) {
	// Search the text for a substring.
	var name = block.getFieldValue('NAME'),
		time = block.getFieldValue('TIME'),
		type = block.getFieldValue('TYPE'),
		repeat = block.getFieldValue('REPEAT'),
		code = {
			before: "",
			after: "",
			gencode: "",
			global: ""
		};

	code.gencode = '\ndelayedCal' + type;
	if (repeat == 'TRUE') {
		code.gencode += 'R';
	}
	code.gencode += '(' + name + ', ' + time + ');\n'


	return JSON.stringify(code);
};

/**
 * Cancel delayed call
 */

Blockly.JavaScript['functions_cancel_delay'] = function (block) {
	// Search the text for a substring.
	var name = block.getFieldValue('NAME');

	var code = {
		before: "",
		after: "",
		gencode: "",
		global: ""
	};

	code.gencode = '\ncancelDelayedCall(' + name + ');\n'

	return JSON.stringify(code);
};