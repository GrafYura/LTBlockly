'use strict';
goog.provide('Blockly.Constants.Notification');
goog.require('Blockly.Blocks');
goog.require('Blockly');

/*
** Checks previously blocks for the presence of a buffer
*/
var if_previous_buffer_exsist = function (_block, _spreadsheet = false) {
	if (_block.getParent()) {
		if (!_spreadsheet) {
			if (_block.getParent().type == 'controls_if') {
				if (!_block.getParent().buffer)
					_block.getParent().buffer = if_previous_buffer_exsist(_block.getParent());
				if (!_block.getParent().buffer)
					_block.getParent().buffer = bloclyGenerateVariableName();
				return _block.getParent().buffer;
			}
			if (_block.getParent().buffer)
				return _block.getParent().buffer;
			else {
				if(_block.getParent().getNextBlock())
					if (_block.getParent().type == 'delayed_function' && _block.getParent().getNextBlock().id == _block.id)
						return if_previous_buffer_exsist(_block.getParent());
				if (_block.getParent().event == null && _block.getParent().type != 'delayed_function')
					return if_previous_buffer_exsist(_block.getParent());
			}
		} else {
			if (_block.getParent().main_buff)
				return _block.getParent().main_buff;
			else {
				if(_block.getParent().getNextBlock())
					if (_block.getParent().type == 'delayed_function' && _block.getParent().getNextBlock().id == _block.id)
						return if_previous_buffer_exsist(_block.getParent(), true);
				if (_block.getParent().event == null && _block.getParent().type != 'delayed_function')
					return if_previous_buffer_exsist(_block.getParent(), true);
			}
		}
	}
	return null;
}
Blockly.Blocks['notification_push'] = {
	init: function () {
		this.jsonInit({
			"message0": "%2%{BKY_LT_OTHER_PUSH}%1",
			"args0": [
				{
					"type": "input_value",
					"name": "MESSAGE"
				},
				{
					"type": "field_image",
					"src": "js/blockly/img/notifications/notifications.png",
					"width": 16,
					"height": 16,
					"alt": "*"
				}
			],
			"previousStatement": null,
			"nextStatement": null,
			"mutator": "controls_notification_mutator",
			"colour": "%{BKY_LT_CATEGORY_COLOUR_NOTIFICATION}",
			"tooltip": "%{BKY_LT_NOTIFICATION_PUSH_TT}"
		});
		appendShadowBlock(this, "MESSAGE", "notification_push_message_helper");
	},
	buffer: null
};
// https://cdn1.iconfinder.com/data/icons/ui-22/24/391-512.png
Blockly.Blocks['notification_push_message_helper'] = {
	init: function () {
		this.jsonInit({
			"message0": "%1",
			"args0": [
				{
					"type": "field_input",
					"name": "VALUE",
					"text": "%{BKY_LT_OTHER_PUSH_MESSAGE}"
				}
			],
			"colour": "%{BKY_LT_CATEGORY_COLOUR_NOTIFICATION}",
			"output": "Text"
		});
	}
};
Blockly.defineBlocksWithJsonArray([
	{
		"type": "push_mutator",
		"message0": "%{BKY_LT_PUSH_MUTATOR}",
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_NOTIFICATION}"
	},
	{
		"type": "controls_id",
		"message0": "%{BKY_LT_PUSH_MUTATOR_ID}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_NOTIFICATION}"
	},
	{
		"type": "controls_ntmode",
		"message0": "%{BKY_LT_PUSH_MUTATOR_MODE}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_NOTIFICATION}"
	}
]);

Blockly.Constants.Notification.CONTROLS_MUTATOR_MIXIN = {
	idcount_: 0,
	modecount_: 0,
	mutationToDom: function () {
		var container = document.createElement('mutation');
		if (this.idcount_) {
			container.setAttribute('id', this.idcount_);
		}
		if (this.modecount_) {
			container.setAttribute('mode', this.modecount_);
		}
		return container;
	},
	domToMutation: function (xmlElement) {
		this.idcount_ = parseInt(xmlElement.getAttribute('id'), 10);
		this.modecount_ = parseInt(xmlElement.getAttribute('mode'), 10);
		this.updateShape_();
	},
	decompose: function (workspace) {
		workspace.addChangeListener(Blockly.Events.disableOrphans);
		var containerBlock = workspace.newBlock('push_mutator');
		containerBlock.initSvg();
		var connection = containerBlock.nextConnection;
		if (this.idcount_) {
			var idBlock = workspace.newBlock('controls_id');
			idBlock.initSvg();
			connection.connect(idBlock.previousConnection);
			connection = idBlock.nextConnection;
		}
		if (this.modecount_) {
			var modeBlock = workspace.newBlock('controls_ntmode');
			modeBlock.initSvg();
			connection.connect(modeBlock.previousConnection);
			connection = modeBlock.nextConnection;
		}
		return containerBlock;
	},
	compose: function (containerBlock) {
		var clauseBlock = containerBlock.nextConnection.targetBlock();
		// Count number of inputs.
		this.idcount_ = 0;
		this.modecount_ = 0;
		var idStatementConnection = null;
		var modeStatementConnection = null;
		while (clauseBlock) {
			switch (clauseBlock.type) {
				case 'controls_id':
					this.idcount_++;
					if (this.idcount_d < 1)
						idStatementConnection = clauseBlock.statementConnection_;
					break;
				case 'controls_ntmode':
					this.modecount_++;
					if (this.modecount_ < 1)
						modeStatementConnection = clauseBlock.statementConnection_;
					break;
				default:
					throw TypeError('Unknown block type: ' + clauseBlock.type);
			}
			clauseBlock = clauseBlock.nextConnection &&
				clauseBlock.nextConnection.targetBlock();
		}
		this.updateShape_();
		// Reconnect any child blocks.
		Blockly.Mutator.reconnect(idStatementConnection, this, 'ID');
		Blockly.Mutator.reconnect(modeStatementConnection, this, 'MODE');
	},
	updateShape_: function () {

		if (this.idcount_ && !this.getInput('ID')) {
			this.appendDummyInput('ID')
				.appendField('Id:')
				.appendField(new Blockly.FieldNumber('2047'), 'ID');
		} else if (!this.idcount_ && this.getInput('ID')) {
			this.removeInput('ID');
		}

		if (this.modecount_ && !this.getInput('MODE')) {
			this.appendDummyInput('MODE')
				.appendField('Mode:')
				.appendField(new Blockly.FieldDropdown([
					["%{BKY_LT_OTHER_USUAL}", "1"],
					["%{BKY_LT_OTHER_NO_MESSAGE}", "0"],
					["%{BKY_LT_OTHER_INTERCOM}", "2"],
					["%{BKY_LT_OTHER_IMPORTANT}", "4"],
					["%{BKY_LT_OTHER_CRITICAL}", "8"]]), 'MODE');
		} else if (!this.modecount_ && this.getInput('MODE')) {
			this.removeInput('MODE');
		}
	}
};

Blockly.Extensions.registerMutator('controls_notification_mutator',
	Blockly.Constants.Notification.CONTROLS_MUTATOR_MIXIN, null,
	['controls_id', 'controls_ntmode']);

Blockly.JavaScript['notification_push'] = function (block) {
	// Search the text for a substring.
	var id = block.getFieldValue('ID');
	var mode = block.getFieldValue('MODE');
	var message = Blockly.JavaScript.statementToCode(block, 'MESSAGE');
	var parser = JSON.parse(message),
		ifc = bloclyGenerateVariableName();
	if (mode === null) {
		mode = 1;
	}
	if (id === null) {
		id = '2047';
	}
	var sprtf = '';
	console.log(block.getInputTargetBlock('MESSAGE').type);
	switch (block.getInputTargetBlock('MESSAGE').type) {
		case 'notification_push_message_helper':
			if (if_previous_buffer_exsist(block)) {
				block.buffer = if_previous_buffer_exsist(block);
				ifc = block.buffer;
			}
			if (parser.gencode.length > 100) {
				throw Blockly.Msg["LT_ERROR_MAX_EXCEED"] + ' ' + parser.gencode.length + ' ' + block.type;
			}
			parser.gencode = '{' + mode + ',' + parser.gencode + '}';
			break;
		case 'sprintf':
			if (if_previous_buffer_exsist(block)) {
				block.buffer = if_previous_buffer_exsist(block);
				ifc = block.buffer;
				parser.before += '\n' + ifc + '[0] = 0;';
			}
			else {
				block.buffer = ifc;
				parser.before += '\nu8 ' + ifc + '[100];';
				parser.before += '\n' + ifc + '[0] = 0;';
			}
			sprtf = parser.gencode;
			var valuse = parser.after;
			parser.before += '\nsprintf(' + ifc + ' + strlen(' + ifc + '),"' + mode + '");';
			if (Array.isArray(sprtf)) {
				var i = 0;
				sprtf.forEach(cond => {
					parser.before += '\nsprintf(' + ifc + ' + strlen(' + ifc + '),"' + cond + '",' + valuse[i] + ');';
					++i;
				});
			}
			else {
				parser.before += '\nsprintf(' + ifc + ' + strlen(' + ifc + '),"' + sprtf + '",' + valuse + ');';
			}
			parser.gencode = '&' + ifc;
			parser.after = '';
			break;
		case 'getbyte_control':
			sprtf = '"' + mode + parser.gencode + '"';
			if (if_previous_buffer_exsist(block)) {
				block.buffer = if_previous_buffer_exsist(block);
				ifc = block.buffer;
			}
			else {
				parser.before += '\nu8 ' + ifc + '[100];';
				block.buffer = ifc;
			}
			parser.before += '\n ' + ifc + '[0] = 0;\nsprintf(' + ifc + ',' + sprtf + ',' + parser.after + ');';
			parser.gencode = '&' + ifc;
			parser.after = '';
			break;
		case 'variebles_getter':
			sprtf = '"' + mode + parser.gencode + '"';
			if (if_previous_buffer_exsist(block)) {
				block.buffer = if_previous_buffer_exsist(block);
				ifc = block.buffer;
			}
			else {
				parser.before += '\nu8 ' + ifc + '[100];';
				block.buffer = ifc;
			}
			parser.before += '\n ' + ifc + '[0] = 0;\nsprintf(' + ifc + ',' + sprtf + ',' + parser.after + ');';
			parser.gencode = '&' + ifc;
			parser.after = '';
			break;
		default:
			switch (block.getInputTargetBlock('MESSAGE').output) {
				case 'Text':
					if (if_previous_buffer_exsist(block)) {
						block.buffer = if_previous_buffer_exsist(block);
						ifc = block.buffer;
					}
					else {
						parser.before += '\nu8 ' + ifc + '[100];';
						block.buffer = ifc;
					}
					parser.before += '\n ' + ifc + '[0] = 0;\nsprintf(' + ifc + ',"' + mode + '%s",' + parser.gencode + ');';
					break;
				case 'Number':
					parser.before += '\nu8 ' + ifc + '[100];';
					block.buffer = ifc;
					parser.before += '\n ' + ifc + '[0] = 0;\nsprintf(' + ifc + ',"' + mode + '%d",' + parser.gencode + ');';
					break;
				default:
					if (if_previous_buffer_exsist(block)) {
						block.buffer = if_previous_buffer_exsist(block);
						ifc = block.buffer;
					}
					else {
						parser.before += '\nu8 ' + ifc + '[100];';
						block.buffer = ifc;
					}
					parser.before += '\n ' + ifc + '[0] = 0;\nsprintf(' + ifc + ',"' + mode + '%d",' + parser.gencode + ');';
					break;
			}
			parser.gencode = '&' + ifc;
			parser.after = '';
			break;
	}
	var code = {
		before: "",
		gencode: "",
		after: "",
		global: ""
	};
	code.before += parser.before;
	//code.gencode = '\nsetStatus(' + id + ':32,' + parser.gencode + ');\n';
	code.after += parser.after + '\nsetStatus(' + id + ':32,' + parser.gencode + ');\n';
	code.global = parser.global;
	return JSON.stringify(code);
};

Blockly.JavaScript['notification_push_message_helper'] = function (block) {
	// Search the text for a substring.
	var message = block.getFieldValue('VALUE');
	var code = {
		before: "",
		gencode: "",
		after: "",
		global: ""
	};
	if (block.getParent().type == 'messenger_control')
		code.gencode += message;
	else
		code.gencode += '"' + message + '"';
	return JSON.stringify(code);
};
