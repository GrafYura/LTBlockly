
Blockly.Blocks['set_state_on_device'] = {
	init: function () {
		this.jsonInit({
			"message0": "%{BKY_LT_SET_STATE_ON_DEVICE_TITLE}",
			"args0": [
				{
					"type": "field_dropdown",
					"name": "DEVICETYPE",
					"options": blocklyDeviceTypeOptions.bind(this)
				},
				{
					"type": "field_dropdown",
					"name": "DEVICE",
					"options": blocklyDeviceOptions.bind(this)
				},
				{
					"type": "field_dropdown",
					"name": "STATE",
					"options": [
						["%{BKY_LT_ON}", "1"],
						["%{BKY_LT_OFF}", "0"],
						["%{BKY_LT_SWITCH}", "0xFF"]
					]
				},
				{
					"type": "input_dummy"
				},
				{
					"type": "input_dummy"
				}
			],
			"previousStatement": null,
			"nextStatement": null,
			"colour": "%{BKY_LT_CATEGORY_COLOUR_STATUS}",
			"tooltip": "%{BKY_LT_SET_STATE_ON_DEVICE_TT}"
		});
	}
};

Blockly.JavaScript['set_state_on_device'] = function (block) {
	// Search the text for a substring.
	var device = block.getFieldValue('DEVICE');
	var state = block.getFieldValue('STATE');

	var code = '\nsetStatus(' + device + ', ' + state + ');\n';
	return code;
};
