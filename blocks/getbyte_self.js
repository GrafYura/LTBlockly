Blockly.Blocks['getbyte_self'] = {
	init: function () {
		this.jsonInit(
			{
				"message0": "%1%{BKY_LT_SELF_STATUS}",
				"args0": [
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
				"tooltip": "Returns the state of the script"//%{BKY_LT_STATUS_STATUS_TT}
			});
	},
	output: "Number"
};

Blockly.JavaScript['getbyte_self'] = function (block) {
	// Search the text for a substring.

	var code = {
		before: "",
		gencode: "[V-ADDR.0]",
		after: "",
		global: ""
	};

	return JSON.stringify(code);
};