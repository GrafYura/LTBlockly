'use strict';
goog.provide('Blockly.Constants.Dimer');
goog.require('Blockly.Blocks');
goog.require('Blockly');
Blockly.Blocks['blinds_control'] = {
	init: function () {
		this.jsonInit({
			"message0": "%{BKY_LT_CATEGORY_CONTROL_BLINDS}",
			"args0": [{
					"type": "field_dropdown",
					"name": "DEVICE",
					"options": blocklyDeviceOptions.bind(this, ["blinds"])
				},
				{
					"type": "field_image",
					"src": "js/blockly/img/control/blinds.png",
					"width": 16,
					"height": 16,
					"alt": "*"
				}
			],
			"previousStatement": null,
			"nextStatement": null,
			"colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}",
			"tooltip": "%{BKY_LT_CONTROL_BLINDS_TT}"
		});
		this.appendDummyInput("ACTION")
			.appendField(Blockly.Msg["BLINDS_SELECT"])
			.appendField(new Blockly.FieldDropdown([[Blockly.Msg["BLINDS_SET"],"0"],[Blockly.Msg["BLINDS_STOP"],"1"]]),"ACT");
		this.appendDummyInput("LEV")
			.appendField(Blockly.Msg["BLINDS_LEVEL"])
			.appendField(new Blockly.FieldNumber(0, 0, 100),'LEVEL');
	}
};
// https://cdn3.iconfinder.com/data/icons/joe-pictos-business-bold/100/lamp_bold_convert-512.png


Blockly.JavaScript['blinds_control'] = function (block) {
	// Search the text for a substring.
	var act = block.getFieldValue('ACT');
	var device = block.getFieldValue('DEVICE');
	var level = block.getFieldValue('LEVEL');
	var code = {
		before: "",
		gencode: "",
		after: "",
		global: ""
	};

	if (device.length < 1) {
		throw Blockly.Msg["ERROR_EMPTY_IF_ALLERT"] + ' ' + block.type;
	}

	if(act==1)
	{
		code.gencode +='\nsetStatus(' + device + ', 4);';
	}
	else
		code.gencode +='\nsetStatus(' + device + ', {7, ' + parseInt(parseInt(level) * 2.5) + '});';
	return JSON.stringify(code);
};