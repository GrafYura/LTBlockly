Blockly.Blocks['delayed_function'] = {
	init: function () {
		this.jsonInit({
			"message0": "%5%{BKY_LT_FUNCTION_DELAYED_CODE}",
			"args0": [{
				"type": "field_input",
				"name": "NAME",
				"text": getName('func')
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
			"message1": "%1",
			"args1": [{
				"type": "input_statement",
				"name": "BODY"
			}],
			"colour": "%{BKY_LT_CATEGORY_COLOUR_FUNCTIONS}",
			"previousStatement": null,
			"nextStatement": null,
			"tooltip": "Postpone the execution of blocks for a certain time"
		});
	}
};
// https://scilab.io/wp-content/uploads/2016/05/functions2.png
Blockly.JavaScript['delayed_function'] = function (block) {
	// Search the text for a substring.
	var name = block.getFieldValue('NAME');
	Blockly.getMainWorkspace().getAllBlocks().forEach(blck => {
		if (blck.type == 'delayed_function' || blck.type == 'functions') {
			if (blck.getFieldValue('NAME') == name && blck.id != block.id)
				throw Blockly.Msg["LT_ERROR_FUNC_SAME_NAME"] + ' ' + name + ' ' + block.type;
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

	var body = Blockly.JavaScript.statementToCode(block, 'BODY');
	var result = '\nvoid ' + name + '() {\n';
	var code = {
		before: "",
		gencode: "",
		after: "",
		global: ""
	};
	var time = block.getFieldValue('TIME');
	var type = block.getFieldValue('TYPE');
	var repeat = block.getFieldValue('REPEAT');
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

		parser.forEach(el => {
			code.global += el.global;
		});
		//result += code.global;
		parser.forEach(el => {
			result += el.before;
			result += el.gencode;
			result += el.after;
		});
	}
	result += '\n}\n'
	code.global += result;
	code.gencode = '\ndelayedCal' + type;
	if (repeat == 'TRUE') {
		code.gencode += 'R';
	}

	code.gencode += '(' + name + ', ' + time + ');\n'
	return JSON.stringify(code);
};