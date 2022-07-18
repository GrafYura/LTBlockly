Blockly.Blocks['sensor_door'] = {
	init: function () {
		this.jsonInit({
			"message0": "%{BKY_LT_OTHER_DOOR_SENSOR} %1",
			"args0": [
				{
					"type": "field_dropdown",
					"name": "DEVICE",
					"options": blocklyDeviceOptions.bind(this, ["door-sensor"])
				}
			],
			"output": "Number",
			"colour": '%{BKY_LT_CATEGORY_COLOUR_SENSORS}'
		});
	}
};

Blockly.JavaScript['sensor_door'] = function (block) {
	// Search the text for a substring.
	//var dt = block.getFieldValue('DEVICE');
	var message = Blockly.JavaScript.statementToCode(block, 'NEXT');
	var parser = JSON.parse(message);

	var code = {
		before: parser.before,
		gencode: "[" + device + ".0]",
		after: parser.after,
		global: parser.global
	};

	if (parser.gencode != "") {
		code.gencode += ", " + parser.gencode;
	}

	return JSON.stringify(code);
};
