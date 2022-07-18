Blockly.Blocks['text_compare'] = {
	init: function () {
		this.jsonInit({
			"message0": "%3%{BKY_LT_TEXT_COMPARE}",
			"args0": [
				{
					"type": "input_value",
					"name": "VALUE1",
					"check": "Text"
				},
				{
					"type": "input_value",
					"name": "VALUE2",
					"check": "Text"
				},
				{
					"type": "field_image",
					"src": "js/blockly/img/text/text.png",
					"width": 16,
					"height": 16,
					"alt": "*"
				}
			],
			"output": "Number",
			"colour": '%{BKY_LT_CATEGORY_COLOUR_TEXT}',
			"tooltip": "Compares two strings. If they are equal, then it will return 0." +
				"If 1 line is greater, it will return 1." +
				"If 2 is more string, then it will return -1."
		});
		appendShadowBlock(this, "VALUE1", "text_compare_value_helper1");
		appendShadowBlock(this, "VALUE2", "text_compare_value_helper2");
	},
	output: "Number"
};

Blockly.JavaScript['text_compare'] = function (block) {
	// Search the text for a substring.
	var value1 = Blockly.JavaScript.statementToCode(block, 'VALUE1');
	var value2 = Blockly.JavaScript.statementToCode(block, 'VALUE2');
	var parser1 = JSON.parse(value1);
	var parser2 = JSON.parse(value2);

	var code = {
		before: "",
		gencode: "",
		after: "",
		global: ""
	};

	code.before = parser1.before + parser2.before;
	code.gencode = 'strcmp(' + parser1.gencode + ', ' + parser2.gencode + ')';
	code.after = parser1.after + parser2.after;
	code.global = parser1.global + parser2.global;

	return JSON.stringify(code);
};

Blockly.Blocks['text_compare_value_helper1'] = {
	init: function () {
		this.jsonInit({
			"message0": "%1",
			"args0": [
				{
					"type": "field_input",
					"name": "VALUE",
					"text": "Text"
				}
			],
			"output": "Text",
			"colour": '%{BKY_LT_CATEGORY_COLOUR_TEXT}'
		});
	}
};

Blockly.JavaScript['text_compare_value_helper1'] = function (block) {
	// Search the text for a substring.
	var value = block.getFieldValue('VALUE');

	var code = {
		before: "",
		gencode: '"' + value + '"',
		after: "",
		global: ""
	};

	return JSON.stringify(code);
};

Blockly.Blocks['text_compare_value_helper2'] = {
	init: function () {
		this.jsonInit({
			"message0": "%1",
			"args0": [
				{
					"type": "field_input",
					"name": "VALUE",
					"text": "Text"
				}
			],
			"output": "Text",
			"colour": '%{BKY_LT_CATEGORY_COLOUR_TEXT}'
		});
	}
};

Blockly.JavaScript['text_compare_value_helper2'] = function (block) {
	// Search the text for a substring.
	var value = block.getFieldValue('VALUE');

	var code = {
		before: "",
		gencode: '"' + value + '"',
		after: "",
		global: ""
	};

	return JSON.stringify(code);
};
