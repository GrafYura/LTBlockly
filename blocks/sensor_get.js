'use strict';
goog.provide('Blockly.Constants.Sensorget');
goog.require('Blockly.Blocks');
goog.require('Blockly');
Blockly.Blocks['sensor_get'] = {
	init: function () {
		this.jsonInit(
			{
				"message0": "%{BKY_LT_OTHER_SENSOR} %1",
				"args0": [
					{
						"type": "field_dropdown",
						"name": "DEVICE",
						"options": blocklyDeviceOptions.bind(this, ["motion-sensor", "leak-sensor", "humidity-sensor", "illumination-sensor", "temperature-sensor"])
					}
				],
				"output": "Number",
				"mutator": "sensor_get_mutator",
				"colour": "%{BKY_LT_CATEGORY_COLOUR_SENSORS}"
			});
	}
};

Blockly.defineBlocksWithJsonArray([
	{
		"type": "sensor_get_mutator",
		"message0": "%{BKY_LT_PUSH_MUTATOR}",
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_SENSORS}"
	},
	{
		"type": "controls_type",
		"message0": "Type",
		"previousStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_SENSORS}"
	}
]);

Blockly.Constants.Sensorget.CONTROLS_MUTATOR_MIXIN = {
	typecount_: 0,
	mutationToDom: function () {
		var container = document.createElement('mutation');
		if (this.typecount_) {
			container.setAttribute('type', this.typecount_);
		}

		return container;
	},
	domToMutation: function (xmlElement) {
		this.typecount_ = parseInt(xmlElement.getAttribute('type'), 10);
		this.updateShape_();
	},
	decompose: function (workspace) {
		workspace.addChangeListener(Blockly.Events.disableOrphans);
		var containerBlock = workspace.newBlock('sensor_get_mutator');
		containerBlock.initSvg();
		var connection = containerBlock.nextConnection;
		if (this.typecount_) {
			var typeBlock = workspace.newBlock('controls_type');
			typeBlock.initSvg();
			connection.connect(typeBlock.previousConnection);
			connection = typeBlock.nextConnection;
		}
		return containerBlock;
	},
	compose: function (containerBlock) {
		var clauseBlock = containerBlock.nextConnection.targetBlock();
		// Count number of inputs.
		this.typecount_ = 0;
		var typeStatementConnection = null;
		while (clauseBlock) {
			switch (clauseBlock.type) {
				case 'controls_type':
					this.typecount_++;
					typeStatementConnection = clauseBlock.statementConnection_;
					break;
				default:
					throw TypeError('Unknown block type: ' + clauseBlock.type);
			}
			clauseBlock = clauseBlock.nextConnection &&
				clauseBlock.nextConnection.targetBlock();
		}
		this.updateShape_();
		// Reconnect any child blocks.
		Blockly.Mutator.reconnect(typeStatementConnection, this, 'TYPE');
	},
	updateShape_: function () {
		// Delete everything.
		if (this.getInput('TYPE')) {
			this.removeInput('TYPE');
		}

		if (this.typecount_) {
			this.appendDummyInput('TYPE')
				.appendField('Type:')
				.appendField(new Blockly.FieldDropdown([
					['%{BKY_LT_OTHER_FRATIONAL_PART}', '0'],
					['%{BKY_LT_OTHER_INTEGER_PART}', '1']]), 'TYPE');
		}

	}
};


Blockly.Extensions.registerMutator('sensor_get_mutator',
	Blockly.Constants.Sensorget.CONTROLS_MUTATOR_MIXIN, null,
	['controls_type']);
Blockly.JavaScript['sensor_get'] = function (block) {
	// Search the text for a substring.
	var device = block.getFieldValue('DEVICE');
	var typev = block.getFieldValue('TYPE');
	var value = Blockly.JavaScript.statementToCode(block, 'VALUE');
	var parser = JSON.parse(value);

	var code = {
		before: parser.before,
		gencode: "",
		after: parser.after,
		global: parser.global
	};

	if (typev === null) {
		code.gencode = "flt2u32([" + device + ".1].[" + device + ".0])";
	} else {
		code.gencode = "[" + device + "." + typev + "]";
	}

	if (parser.gencode != '') {
		code.gencode += ", " + parser.gencode;
	}
	return JSON.stringify(code);
};
