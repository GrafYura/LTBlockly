Blockly.Blocks['status_is_on'] = {
	init: function () {
		this.jsonInit(
			{
				"message0": "%{BKY_LT_STATUS_IS_ON}",
				"args0": [
					{
						"type": "field_dropdown",
						"name": "DEVICE",
						"options": blocklyDeviceOptions.bind(this)
					},
					{
						"type": "field_checkbox",
						"name": "SELF",
						"checked": true
					}

				],
				"output": "Number",
				"colour": "%{BKY_LT_CATEGORY_COLOUR_STATUS}"
			});
	}
};

Blockly.JavaScript['status_is_on'] = function (block) {
	// Search the text for a substring.
	var mode = block.getFieldValue('MODE');
	var self = block.getFieldValue('SELF');

	var code = {
		before: "",
		gencode: "",
		after: "",
		global: ""
	};

	if (self == 'TRUE') {
		code.gencode = '([V-ADDR]&1)';
	} else {
		code.gencode = '([' + mode + '.0]&1)';
	}

	return JSON.stringify(code);
};

