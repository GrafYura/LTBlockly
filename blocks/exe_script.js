
Blockly.Blocks['set_state_on_exe'] = {
	init: function () {
		this.jsonInit({
			"message0": "%{BKY_LT_CATEGORY_CONTROL_EXE}",
			"args0": [
				{
					"type": "field_dropdown",
					"name": "EXE",
					"options": blocklyGetExeFiles.bind(this, "EXE")
				},
				{
					"type": "input_value",
					"name": "VALUE"
				},
				{
					"type": "field_image",
					"src": "js/blockly/img/control/control.png",
					"width": 16,
					"height": 16,
					"alt": "*"
				}
			],
			"previousStatement": null,
			"nextStatement": null,
			"colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}",
			"tooltip": "%{BKY_LT_CATEGORY_CONTROL_EXE_TT}"
		});
		appendShadowBlock(this, "VALUE", "text_helper_exe");
	}
};
// https://cdn2.iconfinder.com/data/icons/eshop-outline-pack/100/Noun_Project_20Icon_5px_grid-13-512.png
Blockly.Blocks['text_helper_exe'] = {
	init: function () {
		this.jsonInit({
			"message0": "%1",
			"args0": [
				{
					"type": "field_input",
					"name": "VALUE",
					"text": "Some data"
				}
			],
			"colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}",
			"output": "Text"
		});
	}
};
Blockly.JavaScript['text_helper_exe'] = function (block) {
	// Search the text for a substring.
	var message = block.getFieldValue('VALUE');
	var code = {
		before: "",
		gencode: message,
		after: "",
		global: ""
	};

	return JSON.stringify(code);
};
Blockly.JavaScript['set_state_on_exe'] = function (block) {
	// Search the text for a substring.
	var exe = block.getFieldValue('EXE');
	var value = Blockly.JavaScript.statementToCode(block, 'VALUE');
	value = JSON.parse(value);

	var code = {
		before: value.before,
		gencode: "",
		after: value.after,
		global: value.global
	};

	exe = exe.substring(0, exe.indexOf('.sh'));
	code.gencode = '\nsetStatus(SRV-ID:' + exe + ', "' + value.gencode + '");\n';

	return JSON.stringify(code);
};
