var globCOLOUR = '#ff0000',
	globRED = 100,
	globGREEN = 100,
	globBLUE = 100,
	globH = 100,
	globS = 100,
	globV = 100;

function onRGBEdit(block) {
	var type = parseInt(block.getFieldValue('COLORTYPE'), 10);
	if (block.getField('COLOURPALTR') && block.getField('RED') && block.getField('H')) {
		globCOLOUR = block.getFieldValue('COLOURPALTR');
		globRED = parseInt(block.getFieldValue('RED'), 10);
		globGREEN = parseInt(block.getFieldValue('GREEN'), 10);
		globBLUE = parseInt(block.getFieldValue('BLUE'), 10);
		globH = parseInt(block.getFieldValue('H'), 10);
		globS = parseInt(block.getFieldValue('S'), 10);
		globV = parseInt(block.getFieldValue('V'), 10);
		block.getInput('COLOUR').removeField('H');
		block.getInput('COLOUR').removeField('S');
		block.getInput('COLOUR').removeField('V');
		block.getInput('COLOUR').removeField('RED');
		block.getInput('COLOUR').removeField('GREEN');
		block.getInput('COLOUR').removeField('BLUE');
		block.getInput('COLOUR').removeField('COLOURPALTR');
	}
	switch (type) {
		case 0:
			if (!block.getField('COLOURPALTR')) {
				block.removeInput('COLOUR');
				block.appendDummyInput('COLOUR')
					.appendField(new Blockly.FieldDropdown([
						["Colour", "0"],
						["RGB", "1"],
						["HSV", "2"]
					]), 'COLORTYPE')
					.appendField(Blockly.Msg['LT_OTHER_COLOUR'] + ':')
					.appendField(new Blockly.FieldColour(globCOLOUR), 'COLOURPALTR');
				var f = block.getField('COLORTYPE');
				f.setValue("0");
			}
			break;
		case 1:
			if (!block.getField('RED')) {
				block.removeInput('COLOUR');
				block.appendDummyInput('COLOUR')
					.appendField(new Blockly.FieldDropdown([
						["Colour", "0"],
						["RGB", "1"],
						["HSV", "2"]
					]), 'COLORTYPE')
					.appendField(Blockly.Msg['LT_OTHER_COLOUR'] + ':')
					.appendField(new Blockly.FieldNumber(globRED, 0, 255), 'RED')
					.appendField(new Blockly.FieldNumber(globGREEN, 0, 255), 'GREEN')
					.appendField(new Blockly.FieldNumber(globBLUE, 0, 255), 'BLUE');
				var f = block.getField('COLORTYPE');
				f.setValue("1");
			}
			break;
		case 2:
			if (!block.getField('H')) {
				block.removeInput('COLOUR');
				block.appendDummyInput('COLOUR')
					.appendField(new Blockly.FieldDropdown([
						["Colour", "0"],
						["RGB", "1"],
						["HSV", "2"]
					]), 'COLORTYPE')
					.appendField(Blockly.Msg['LT_OTHER_COLOUR'] + ':')
					.appendField(new Blockly.FieldNumber(globH, 0, 250), 'H')
					.appendField(new Blockly.FieldNumber(globS, 0, 250), 'S')
					.appendField(new Blockly.FieldNumber(globV, 0, 250), 'V');
				var f = block.getField('COLORTYPE');
				f.setValue("2");
			}
			break;
		default:
			break;
	}
}

function onRGBEvents(event) {
	var block = Blockly.getMainWorkspace().getBlockById(event.blockId);
	if (block)
		if (block.type == 'rgb_control') {
			if (block.getInput('COLOUR')) {
				onRGBEdit(block);
			}
		}
	else {
		Blockly.getMainWorkspace().getAllBlocks().forEach(element => {
			// changeMessenger(element);
			if (element.type == 'rgb_control') {
				if (element.getInput('COLOUR')) {
					onRGBEdit(element);
				}
			}
		});
	}
}
var getRGB_from_hex = function (hexcolor_) {
	var red, green, blue;
	red = parseInt(hexcolor_.substring(1, 3), 16);
	green = parseInt(hexcolor_.substring(3, 5), 16);
	blue = parseInt(hexcolor_.substring(5), 16);
	return {r:red, g:green, b:blue};
}
'use strict';
goog.provide('Blockly.Constants.Rgb');
goog.require('Blockly.Blocks');
goog.require('Blockly');
Blockly.Blocks['rgb_control'] = {
	init: function () {
		this.jsonInit({
			"message0": "%2%{BKY_LT_TEXT_SPRINTF_RGB} %1",
			"args0": [{
					"type": "field_dropdown",
					"name": "DEVICE",
					"options": blocklyDeviceOptions.bind(this, ["rgb-lamp"])
				},
				{
					"type": "field_image",
					"src": "js/blockly/img/control/rgb.png",
					"width": 16,
					"height": 16,
					"alt": "*"
				}
			],
			"previousStatement": null,
			"nextStatement": null,
			"mutator": "controls_rgb_mutator",
			"colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}",
			"tooltip": "%{BKY_LT_CONTROL_RGB_TT}"
		});
	}
};
// https://cdn2.iconfinder.com/data/icons/pix-glyph-set/50/520524-rgb-512.png
Blockly.defineBlocksWithJsonArray([{
		"type": "controls_mutator",
		"message0": "%{BKY_LT_TEXT_SPRINTF_MUTATOR}",
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}"
	},
	{
		"type": "controls_on_off",
		"message0": "%{BKY_LT_TEXT_SPRINTF_TYPE_ONOFF}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}"
	},
	{
		"type": "controls_brightness",
		"message0": "%{BKY_LT_OTHER_BRIGHTNESS}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}"
	},
	{
		"type": "controls_colour",
		"message0": "%{BKY_LT_OTHER_COLOUR}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}"
	},
	{
		"type": "controls_time",
		"message0": "%{BKY_LT_OTHER_TIME}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}"
	}
]);

Blockly.Constants.Rgb.CONTROLS_MUTATOR_MIXIN = {
	colourcount_: 0,
	timecount_: 0,
	brightnesscount_: 0,
	onoffcount_: 0,
	mutationToDom: function () {
		var container = document.createElement('mutation');
		if (this.colourcount_) {
			container.setAttribute('colour', this.colourcount_);
		}
		if (this.timecount_) {
			container.setAttribute('time', this.timecount_);
		}
		if (this.brightnesscount_) {
			container.setAttribute('brightness', this.brightnesscount_);
		}
		if (this.onoffcount_) {
			container.setAttribute('onoff', this.onoffcount_);
		}
		return container;
	},
	domToMutation: function (xmlElement) {
		this.colourcount_ = parseInt(xmlElement.getAttribute('colour'), 10);
		this.timecount_ = parseInt(xmlElement.getAttribute('time'), 10);
		this.brightnesscount_ = parseInt(xmlElement.getAttribute('brightness'), 10);
		this.onoffcount_ = parseInt(xmlElement.getAttribute('onoff'), 10);
		this.updateShape_();
	},
	decompose: function (workspace) {
		workspace.addChangeListener(Blockly.Events.disableOrphans);
		var containerBlock = workspace.newBlock('controls_mutator');
		containerBlock.initSvg();
		var connection = containerBlock.nextConnection;
		if (this.colourcount_) {
			var colourBlock = workspace.newBlock('controls_colour');
			colourBlock.initSvg();
			connection.connect(colourBlock.previousConnection);
			connection = colourBlock.nextConnection;
		}
		if (this.timecount_) {
			var timeBlock = workspace.newBlock('controls_time');
			timeBlock.initSvg();
			connection.connect(timeBlock.previousConnection);
			connection = timeBlock.nextConnection;
		}
		if (this.brightnesscount_) {
			var brightnessBlock = workspace.newBlock('controls_brightness');
			brightnessBlock.initSvg();
			connection.connect(brightnessBlock.previousConnection);
			connection = brightnessBlock.nextConnection;
		}
		if (this.onoffcount_) {
			var onoffBlock = workspace.newBlock('controls_on_off');
			onoffBlock.initSvg();
			connection.connect(onoffBlock.previousConnection);
			connection = onoffBlock.nextConnection;
		}
		return containerBlock;
	},
	compose: function (containerBlock) {
		var clauseBlock = containerBlock.nextConnection.targetBlock();
		// Count number of inputs.
		this.colourcount_ = 0;
		this.timecount_ = 0;
		this.brightnesscount_ = 0;
		this.onoffcount_ = 0;
		var colourStatementConnection = null;
		var timeStatementConnection = null;
		var brightnessStatementConnection = null;
		var onoffStatementConnection = null;
		while (clauseBlock) {
			switch (clauseBlock.type) {
				case 'controls_colour':
					this.colourcount_++;
					colourStatementConnection = clauseBlock.statementConnection_;
					break;
				case 'controls_time':
					this.timecount_++;
					timeStatementConnection = clauseBlock.statementConnection_;
					break;
				case 'controls_brightness':
					this.brightnesscount_++;
					brightnessStatementConnection = clauseBlock.statementConnection_;
					break;
				case 'controls_on_off':
					this.onoffcount_++;
					onoffStatementConnection = clauseBlock.statementConnection_;
					break;
				default:
					throw new TypeError('Unknown block type: ' + clauseBlock.type);
			}
			clauseBlock = clauseBlock.nextConnection &&
				clauseBlock.nextConnection.targetBlock();
		}
		this.updateShape_();
		// Reconnect any child blocks.
		Blockly.Mutator.reconnect(colourStatementConnection, this, 'COLOUR');
		Blockly.Mutator.reconnect(timeStatementConnection, this, 'TIME');
		Blockly.Mutator.reconnect(brightnessStatementConnection, this, 'BRIGHTNESS');
		Blockly.Mutator.reconnect(onoffStatementConnection, this, 'ONOFF');
	},
	updateShape_: function () {
		if (this.colourcount_ && !this.getInput('COLOUR')) {
			this.appendDummyInput('COLOUR')
				.appendField(new Blockly.FieldDropdown([
					["Colour", "0"],
					["RGB", "1"],
					["HSV", "2"]
				]), 'COLORTYPE')
				.appendField(Blockly.Msg['LT_OTHER_COLOUR'] + ':')
				.appendField(new Blockly.FieldColour('#ff0000'), 'COLOURPALTR')
				.appendField(new Blockly.FieldNumber(100, 0, 250), 'RED')
				.appendField(new Blockly.FieldNumber(100, 0, 250), 'GREEN')
				.appendField(new Blockly.FieldNumber(100, 0, 250), 'BLUE')
				.appendField(new Blockly.FieldNumber(100, 0, 250), 'H')
				.appendField(new Blockly.FieldNumber(100, 0, 250), 'S')
				.appendField(new Blockly.FieldNumber(100, 0, 250), 'V');
		} else if (!this.colourcount_ && this.getInput('COLOUR')) {
			this.removeInput('COLOUR');
		}

		if (this.timecount_ && !this.getInput('TIME')) {
			this.appendDummyInput('TIME')
				.appendField(Blockly.Msg['LT_OTHER_TIME'] + ':')
				.appendField(new Blockly.FieldNumber(5, 0, 255), 'TIME');
		} else if (!this.timecount_ && this.getInput('TIME')) {
			this.removeInput('TIME');
		}

		if (this.brightnesscount_ && !this.getInput('BRIGHTNESS')) {
			this.appendDummyInput('BRIGHTNESS')
				.appendField(Blockly.Msg['LT_OTHER_BRIGHTNESS'] + ':')
				.appendField(new Blockly.FieldNumber(100, 0, 100), 'BRIGHTNESS')
				.appendField('%');
		} else if (!this.brightnesscount_ && this.getInput('BRIGHTNESS')) {
			this.removeInput('BRIGHTNESS');
		}

		if (this.onoffcount_ && !this.getInput('ONOFF')) {
			this.appendDummyInput('ONOFF')
				.appendField(Blockly.Msg['LT_TEXT_SPRINTF_TYPE_ONOFF'] + ':')
				.appendField(new Blockly.FieldDropdown([
					["%{BKY_LT_OTHER_ON}", "1"],
					["%{BKY_LT_OTHER_OFF}", "0"],
					["%{BKY_LT_OTHER_TOGGLE}", "0xFF"]
				]), 'ONOFF');
		} else if (!this.onoffcount_ && this.getInput('ONOFF')) {
			this.removeInput('ONOFF');
		}
	}
};


Blockly.Extensions.registerMutator('controls_rgb_mutator',
	Blockly.Constants.Rgb.CONTROLS_MUTATOR_MIXIN, null,
	['controls_colour', 'controls_time', 'controls_brightness', 'controls_on_off']);
Blockly.JavaScript['rgb_control'] = function (block) {
	// Search the text for a substring.
	var onOff = block.getFieldValue('ONOFF'),
		device = block.getFieldValue('DEVICE'),
		brightness = parseInt(parseInt(block.getFieldValue('BRIGHTNESS'))*2.5),
		colour = block.getFieldValue('COLOURPALTR'),
		time = block.getFieldValue('TIME'),
		red = block.getFieldValue('RED'),
		green = block.getFieldValue('GREEN'),
		blue = block.getFieldValue('BLUE'),
		h = block.getFieldValue('H'),
		s = block.getFieldValue('S'),
		v = block.getFieldValue('V'),
		rgb = bloclyGenerateVariableName(),
		code = {
			before: '',
			gencode: '',
			after: '',
			global: ''
		};

	if (time) {
		code.before += '\nu8 ' + rgb + '[5] = {'
		time = parseInt(time) * 10;
	}else{
		code.before += '\nu8 ' + rgb + '[4] = {'
	}
	if (device.length < 1) {
		$.msalert(Blockly.Msg["LT_ERROR_EMPTY_DEVICE"] + ' ' + block.type);
		throw new Blockly.Msg["LT_ERROR_EMPTY_DEVICE"] + ' ' + block.type;
	}
	var large_status = 0;
	if (!onOff) {
		onOff = '0xFE';
	}
	code.before += onOff;
	if (colour) {
		colour = getRGB_from_hex(colour);
		code.gencode += '\nrgb2vsh(&' + rgb + ' + 1);'
		code.before +=',' + colour.r + ',' + colour.g + ',' + colour.b;
		v = rgb + '[0]';
		s = rgb + '[1]';
		h = rgb + '[2]';
		large_status = 3;
	} else if (red) {
		code.gencode += '\nrgb2vsh(&' + rgb + ' + 1);'
		code.before +=',' + red + ',' + green + ',' + blue;
		v = rgb + '[0]';
		s = rgb + '[1]';
		h = rgb + '[2]';
		large_status = 3;
	} else if (h) {
		code.before +=',' + v + ',' + s + ',' + h;
		large_status = 3;
	}else if (brightness) {
		large_status |= 2;
		code.before +=',' + brightness + ',0xFE' + ',' + '0xFE';
	} else {
		code.before += ',0xFE,0xFE,0xFE';
	}
	if (time) {
		code.before +=',' + time;
		large_status |= 4;
	}
	code.before += '};';
	code.gencode += '\nsetStatus(' + device + ',';
	switch (large_status) {
		case 0:
			code.gencode += onOff + ');';
			break;
		default:
			code.gencode +='&' + rgb + ');';
			break;
	}
	return JSON.stringify(code);
};