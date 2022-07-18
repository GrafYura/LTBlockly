'use strict';
goog.provide('Blockly.Constants.Email');

goog.require('Blockly.Blocks');
goog.require('Blockly');
Blockly.Blocks['email_control'] = {
	init: function () {
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("js/blockly/img/notifications/email.png", 16, 16, "*"))
			.appendField(Blockly.Msg['EMAIL_DSCR'] + ':')
			.appendField(new Blockly.FieldTextInput('myemail@gmail.com'), 'EMAIL');
		this.appendDummyInput()
			.appendField(Blockly.Msg['EMAIL_MSG_THEME_DSCR'] + ':')
			.appendField(new Blockly.FieldTextInput(Blockly.Msg["EMAIL_MSG_THEME_DSCR"]), 'MSGTHEME');
		this.appendValueInput('MSGTEXT')
			.appendField(Blockly.Msg["LT_CATEGORY_TEXT"] + ':');
		appendShadowBlock(this, 'MSGTEXT', "notification_push_message_helper");
		this.setPreviousStatement(true);
		this.setNextStatement(true);
		this.setInputsInline(false);
		this.setColour('%{BKY_LT_CATEGORY_COLOUR_NOTIFICATION}');
		this.setTooltip(Blockly.Msg["EMAIL_DESCR"]);
		this.jsonInit({
			"mutator": "controls_email_mutator",
		});
	}
};

Blockly.Constants.Email.CONTROLS_MUTATOR_MIXIN = {
	camscount_: 0,
	prevcamscount_: 0,
	mutationToDom: function () {
		var container = document.createElement('mutation');
		if (this.camscount_) {
			container.setAttribute('camera', this.camscount_);
		}
		return container;
	},
	domToMutation: function (xmlElement) {
		this.camscount_ = parseInt(xmlElement.getAttribute('camera'), 10);
		this.updateShape_();
	},
	decompose: function (workspace) {
		workspace.addChangeListener(Blockly.Events.disableOrphans);
		var containerBlock = workspace.newBlock('mutator_messenger');
		containerBlock.initSvg();
		var connection = containerBlock.nextConnection;
		for (var i = 1; i <= this.camscount_; i++) {
			var camBlock = workspace.newBlock('controls_camera');
			camBlock.initSvg();
			connection.connect(camBlock.previousConnection);
			connection = camBlock.nextConnection;
		}
		return containerBlock;
	},
	compose: function (containerBlock) {
		var clauseBlock = containerBlock.nextConnection.targetBlock();
		// Count number of inputs.
		this.devicecount_ = 0;
		this.camscount_ = 0;
		var camstatementConnection = [null];
		while (clauseBlock) {
			switch (clauseBlock.type) {
				case 'controls_camera':
					this.camscount_++;
					camstatementConnection.push(clauseBlock.statementConnection_);
					break;
				default:
					throw new TypeError('Unknown block type: ' + clauseBlock.type);
			}
			clauseBlock = clauseBlock.nextConnection &&
				clauseBlock.nextConnection.targetBlock();
		}
		for (var i = 1; i <= this.camscount_; i++) {
			Blockly.Mutator.reconnect(camstatementConnection[i], this, 'CAM' + i);
		}
		this.updateShape_();
	},
	updateShape_: function () {
		// Delete everything.
		i = this.prevcamscount_;
		while (this.getInput('CAM' + i) && i > this.camscount_) {
			this.removeInput('CAM' + i);
			this.removeInput('TIME' + i);
			--i;
		}
		for (i = 1; i <= this.camscount_; i++) {
			if (!this.getInput('CAM' + i)) {
				this.appendDummyInput('CAM' + i)
					.appendField(Blockly.Msg["LT_CATEGORY_NOTIFICATION_MESSANGER_CAM"])
					.appendField(new Blockly.FieldDropdown(blocklyDeviceOptions.bind(this, ["rtsp"])), 'CAM' + i)
					.appendField(new Blockly.FieldDropdown([[Blockly.Msg["LT_CATEGORY_NOTIFICATION_MESSANGER_CAM_PICTURE"], "p;"],
					[Blockly.Msg["LT_CATEGORY_NOTIFICATION_MESSANGER_CAM_VIDEO"], "v;"]]), 'TYPE' + i);
				this.moveInputBefore('CAM' + i, 'MSGTEXT');
				this.appendDummyInput('TIME' + i)
					.appendField(Blockly.Msg["LT_CATEGORY_NOTIFICATION_MESSANGER_CAM_VIDEO_TIME"])
					.appendField(new Blockly.FieldNumber(10, 1), 'TIME' + i);
			}
		}
		this.prevdevicecount_ = this.devicecount_;
		this.prevcamscount_ = this.camscount_;
	}
};
Blockly.Extensions.registerMutator('controls_email_mutator',
	Blockly.Constants.Email.CONTROLS_MUTATOR_MIXIN, null,
	['controls_camera']);
Blockly.JavaScript['email_control'] = function (block) {
	var email = block.getFieldValue('EMAIL'),
		theme = block.getFieldValue('MSGTHEME'),
		to_email = bloclyGenerateVariableName(),
		data = bloclyGenerateVariableName(),
		msg = Blockly.JavaScript.statementToCode(block, 'MSGTEXT');
	if (!(/^\w+(\.[a-zA-Z]{0,})?@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email))) {
		throw Blockly.Msg["ERROR_EMAIL"] + ' ' + block.type;
	}
	msg = JSON.parse(msg);
	var code = {
		before: '\n{\n\tu8 ' + to_email + '[250];\nu8 ' + data + '[100];\n' + to_email + '[0]=0;\n' + data + '[0]=0;',
		gencode: '',
		after: '\n}',
		global: ''
	};
	if (Array.isArray(msg.gencode)) {
		for (var j = 0; j < msg.gencode.length; j++)
			code.gencode += '\nsprintf(' + data + ' + strlen(' + data + '),"\\"' + msg.gencode[j] + '\\"",' + msg.after[j] + ');';
	}
	else
		code.gencode += '\nsprintf(' + data + ' + strlen(' + data + '),"\\"' + msg.gencode + '\\"",' + msg.after + ');';
	code.gencode += '\nsprintf(' + to_email + ',"{\"message\":{\\"nameTo\\": \\"Larnitech partner\\"");';
	code.gencode += '\nsprintf(' + to_email + ' + strlen(' + to_email + '),",\\"mailTo\\": \\"' + email + '\\"");';
	code.gencode += '\nsprintf(' + to_email + ' + strlen(' + to_email + '),",\\"subject\\": \\"' + theme + '\\"");';
	code.gencode += '\nsprintf(' + to_email + ' + strlen(' + to_email + '),",\\"text\\": \\"%s\\"}",' + data + ');';
	code.gencode += '\nsprintf(' + to_email + ' + strlen(' + to_email + '),"}");';
	//code.gencode += '\nsprintf(' + to_email +' + strlen('+to_email+'),"}");';
	code.gencode += '\nsetStatus(SRV-ID:2,&' + to_email + ');';
	return JSON.stringify(code);
}
/*
/^\w+(\.[a-zA-Z]{0,})?@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
{\"message\": {\"nameTo\": \"Larnitech partner\",\"mailTo\":\"nechitajlo72@gmail.com\",\"subject\":\"here should be subject\",\"text\":\"Test message\"}, \"attachments\":[{\"fileName\":\"test.jpg\",\"filePath\":\"test.jpg\"}]}
*/