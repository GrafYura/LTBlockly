Blockly.Blocks['type_text'] = {
	init: function () {
		this.jsonInit({
			"message0": "%2%1",
			"args0": [
				{
					"type": "field_input",
					"name": "FIELDNAME",
					"text": "Text"
				},
				{
					"type": "field_image",
					"src": "js/blockly/img/vars/types.png",
					"width": 16,
					"height": 16,
					"alt": "*"
				}
			],
			"output": "Text",
			"colour": '%{BKY_LT_CATEGORY_COLOUR_VARIABLES}',
			"tooltip": "%{BKY_LT_CATEGORY_VARIABLES_TYPE_TEXT}"
		});
	}
	,
	output: "Text"
};

Blockly.JavaScript['type_text'] = function (block) {
	// Search the text for a substring.
	var dt = block.getFieldValue('FIELDNAME');

	var code = {
		before: "",
		gencode: '"' + dt + '"',
		after: "",
		global: ""
	};

	return JSON.stringify(code);
};
