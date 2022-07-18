Blockly.Blocks['status_opt'] = {
	init: function () {
		this.jsonInit(
			{
				"message0": "%2%{BKY_LT_OPT} %1",
				"args0": [
					{
						"type": "field_number",
						"name": "MODE",
						"value": 0
					},
					{
						"type": "field_image",
						"src": "js/blockly/img/devices/devices.png",
						"width": 16,
						"height": 16,
						"alt": "*"
					}
				],
				"output": "Number",
				"colour": "%{BKY_LT_CATEGORY_COLOUR_STATUS}",
				"tooltip": "Get the byte that was passed to the event"
			});
	},
	output: "Number"
};
// https://icon-icons.com/icons2/37/PNG/512/hammer_3341.png
Blockly.JavaScript['status_opt'] = function (block) {
	// Search the text for a substring.
	var mode = block.getFieldValue('MODE');

	var code = {
		before: "",
		gencode: "",
		after: "",
		global: ""
	};

	code.gencode = 'opt(' + mode + ')';

	return JSON.stringify(code);
};


