'use strict';
goog.provide('Blockly.Constants.Messenger');

goog.require('Blockly.Blocks');
goog.require('Blockly');
function changeMessenger(block, permClear=0) {
	var i = 1;
	if (block.type == 'messenger_control') {
		if (block.getInput('CAM1')) {
			while (block.getInput('CAM' + i)) {
				if (block.getFieldValue('TYPE' + i) == 'v;' && !block.getInput('TIME' + i)) {
					block.appendDummyInput('TIME' + i)
						.appendField(Blockly.Msg["LT_CATEGORY_NOTIFICATION_MESSANGER_CAM_VIDEO_TIME"])
						.appendField(new Blockly.FieldNumber(10, 1), 'TIME' + i);
					var index = i + 1;
					if (block.getInput('CAM' + index))
						block.moveInputBefore('TIME' + i, 'CAM' + index);
				}
				else if (block.getInput('TIME' + i) && block.getFieldValue('TYPE' + i) != 'v;')
					block.removeInput('TIME' + i);
				++i;
			}
		}
		i = 1;
		while(block.getInput('DEV' + i)){
			if(block.getFieldValue('MSGTYPE') == 'GOOGLEAPI'){
				if(!block.getField('DEV' + i)){
					block.getInput('DEV' + i).appendField(new Blockly.FieldTextInput('example@gmail.com'),'DEV' + i);
				}else if(block.getField('DEV' + i).constructor.toString().indexOf('FieldDropdown') != -1){
					block.getInput('DEV' + i).removeField('DEV' + i);
					block.getInput('DEV' + i).appendField(new Blockly.FieldTextInput('example@gmail.com'),'DEV' + i);
				}
			}else if((block.getFieldValue('MSGTYPE') == 'TELEGRAM') || (block.getFieldValue('MSGTYPE') == 'VIBER')){
				if(!block.getField('DEV' + i)){
					block.getInput('DEV' + i).appendField(new Blockly.FieldDropdown(blocklyGetMessengerDiviceList.bind(block, 'DEV' + i)), 'DEV' + i);
				}else if(block.getField('DEV' + i).constructor.toString().indexOf('FieldTextInput') != -1 || permClear){
					block.getInput('DEV' + i).removeField('DEV' + i);
					block.getInput('DEV' + i).appendField(new Blockly.FieldDropdown(blocklyGetMessengerDiviceList.bind(block, 'DEV' + i)), 'DEV' + i);
				}
			}
			++i;
		}
	}
}
function messengersEvent(event) {
	var block = Blockly.getMainWorkspace().getBlockById(event.blockId);
	let permClear=event.name=="MSGTYPE" && event.type=="change";
	if(event.type=="change"){
	if (block)
		changeMessenger(block, permClear);
	else
		Blockly.getMainWorkspace().getAllBlocks().forEach(bl => {
			changeMessenger(bl, permClear);
		});
	}
}
Blockly.Blocks['messenger_control'] = {
	init: function () {
		this.jsonInit(
			{
				"message0": "%{BKY_LT_CATEGORY_NOTIFICATION_MESSANGER}",
				"args0": [
					{
						"type": "field_dropdown",
						"name": "MSGTYPE",
						"options": [["Telegram", "TELEGRAM"],
									["Viber", "VIBER"],
									["Email", "GOOGLEAPI"]]
					},
					{
						"type": "input_value",
						"name": "DATA",
						"check": ""
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
				"mutator": "controls_messenger_mutator",
				"colour": "%{BKY_LT_CATEGORY_COLOUR_NOTIFICATION}",
				"tooltip": "%{BKY_LT_CATEGORY_NOTIFICATION_MESSANGER_TT}"
			});
		if(!Blockly.getMainWorkspace().listeners_.includes(messengersEvent))
			Blockly.getMainWorkspace().addChangeListener(messengersEvent);
		appendShadowBlock(this, "DATA", "notification_push_message_helper");
	},
	buffer: null
};
Blockly.defineBlocksWithJsonArray([
	{
		"type": "mutator_messenger",
		"message0": "%{BKY_LT_TEXT_SPRINTF_MUTATOR}",
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_NOTIFICATION}"
	},
	{
		"type": "controls_device",
		"message0": "%{BKY_LT_CATEGORY_NOTIFICATION_MESSANGER_RECIPIENT}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_NOTIFICATION}"
	},
	{
		"type": "controls_camera",
		"message0": "%{BKY_LT_CATEGORY_NOTIFICATION_MESSANGER_ADD_CAM}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_NOTIFICATION}"
	}
]);

Blockly.Constants.Messenger.CONTROLS_MUTATOR_MIXIN = {
	devicecount_: 0,
	camscount_: 0,
	prevdevicecount_: 0,
	prevcamscount_: 0,
	initField:null,
	mutationToDom: function () {
		var container = document.createElement('mutation');
		if (this.devicecount_) {
			container.setAttribute('device', this.devicecount_);
		}
		if (this.camscount_) {
			container.setAttribute('camera', this.camscount_);
		}
		return container;
	},
	domToMutation: function (xmlElement) {
		this.devicecount_ = parseInt(xmlElement.getAttribute('device'), 10);
		this.camscount_ = parseInt(xmlElement.getAttribute('camera'), 10);
		this.initField = xmlElement.nextElementSibling.innerText;
		this.updateShape_();
	},
	decompose: function (workspace) {
		workspace.addChangeListener(Blockly.Events.disableOrphans);
		var containerBlock = workspace.newBlock('mutator_messenger');
		containerBlock.initSvg();
		var connection = containerBlock.nextConnection;
		for (var i = 1; i <= this.devicecount_; i++) {
			var devBlock = workspace.newBlock('controls_device');
			devBlock.initSvg();
			connection.connect(devBlock.previousConnection);
			connection = devBlock.nextConnection;
		}
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
		var deviceStatementConnection = [null];
		var camstatementConnection = [null];
		while (clauseBlock) {
			switch (clauseBlock.type) {
				case 'controls_device':
					this.devicecount_++;
					deviceStatementConnection.push(clauseBlock.statementConnection_);
					break;
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
		// Reconnect any child blocks.
		for (var i = 1; i <= this.devicecount_; i++) {
			Blockly.Mutator.reconnect(deviceStatementConnection[i], this, 'DEV' + i);
		}
		for (var i = 1; i <= this.camscount_; i++) {
			Blockly.Mutator.reconnect(camstatementConnection[i], this, 'CAM' + i);
		}
		this.updateShape_();
	},
	updateShape_: function () {
		// Delete everything.
		var i = this.prevdevicecount_;
		while (this.getInput('DEV' + i) && i > this.devicecount_) {
			this.removeInput('DEV' + i);
			--i;
		}
		i = this.prevcamscount_;
		while (this.getInput('CAM' + i) && i > this.camscount_) {
			this.removeInput('CAM' + i);
			this.removeInput('TIME' + i);
			--i;
		}
		for (i = 1; i <= this.devicecount_; i++) {
			if (!this.getInput('DEV' + i)) {
				
				if(this.initField){
					if(this.initField == 'GOOGLEAPI'){
						this.appendDummyInput('DEV' + i)
							.appendField(Blockly.Msg["LT_CATEGORY_NOTIFICATION_MESSANGER_RECIPIENT"] + ':')
							.appendField(new Blockly.FieldTextInput('example@gmail.com'),'DEV' + i);
					}else{
						this.appendDummyInput('DEV' + i)
							.appendField(Blockly.Msg["LT_CATEGORY_NOTIFICATION_MESSANGER_RECIPIENT"] + ':')
							.appendField(new Blockly.FieldDropdown(blocklyGetMessengerDiviceList.bind(this, 'DEV' + i)), 'DEV' + i);
					}
				}else{
					if(this.getFieldValue('MSGTYPE') == 'GOOGLEAPI'){
						this.appendDummyInput('DEV' + i)
							.appendField(Blockly.Msg["LT_CATEGORY_NOTIFICATION_MESSANGER_RECIPIENT"] + ':')
							.appendField(new Blockly.FieldTextInput('example@gmail.com'),'DEV' + i);
					}else if(this.getFieldValue('MSGTYPE') == 'VIBER' || this.getFieldValue('MSGTYPE') == 'TELEGRAM'){
						this.appendDummyInput('DEV' + i)
							.appendField(Blockly.Msg["LT_CATEGORY_NOTIFICATION_MESSANGER_RECIPIENT"] + ':')
							.appendField(new Blockly.FieldDropdown(blocklyGetMessengerDiviceList.bind(this, 'DEV' + i)), 'DEV' + i);
					}
				}
				if (this.getInput('CAM' + this.camscount_))
					this.moveInputBefore('DEV' + i, 'CAM1');
			}
		}
		for (i = 1; i <= this.camscount_; i++) {
			if (!this.getInput('CAM' + i)) {
				this.appendDummyInput('CAM' + i)
					.appendField(Blockly.Msg["LT_CATEGORY_NOTIFICATION_MESSANGER_CAM"])
					.appendField(new Blockly.FieldDropdown(blocklyDeviceOptions.bind(this, ["rtsp"])), 'CAM' + i)
					.appendField(new Blockly.FieldDropdown([[Blockly.Msg["LT_CATEGORY_NOTIFICATION_MESSANGER_CAM_PICTURE"], "p;"],
					[Blockly.Msg["LT_CATEGORY_NOTIFICATION_MESSANGER_CAM_VIDEO"], "v;"]]), 'TYPE' + i);
				this.appendDummyInput('TIME' + i)
					.appendField(Blockly.Msg["LT_CATEGORY_NOTIFICATION_MESSANGER_CAM_VIDEO_TIME"])
					.appendField(new Blockly.FieldNumber(10, 1), 'TIME' + i);
			}
		}
		this.prevdevicecount_ = this.devicecount_;
		this.prevcamscount_ = this.camscount_;
	}
};

Blockly.Extensions.registerMutator('controls_messenger_mutator',
	Blockly.Constants.Messenger.CONTROLS_MUTATOR_MIXIN, null,
	['controls_device', 'controls_camera']);
Blockly.JavaScript['messenger_control'] = function (block) {
	// Search the text for a substring.
	var devices = [],
		message = JSON.parse(Blockly.JavaScript.statementToCode(block, 'DATA')),
		msgtype = block.getFieldValue('MSGTYPE'),
		buffer = bloclyGenerateVariableName();
	cams = [],
		camstype = [],
		times = [],
		i = 1;
	while (block.getInput('DEV' + i)) {
		devices.push(block.getFieldValue('DEV' + i));
		++i;
	}
	i = 1;
	while (block.getInput('CAM' + i)) {
		try {
			cams.push('CAMERA_URL(' + block.getFieldValue('CAM' + i) + ')');
		} catch (err) {
			throw Blockly.Msg["LT_ERROR_EMPTY_DEVICE"] + ' ' + block.type;
		}
		camstype.push(block.getFieldValue('TYPE' + i));
		if (block.getInput('TIME' + i))
			times[i - 1] = block.getFieldValue('TIME' + i);
		++i;
	}
	if (devices.length < 1)
		devices = '*';
	var helper = '', sprtf = '', values = '';
	helper += msgtype;
	helper += '|';
	helper += devices;
	helper += '|';
	i = 0;
	while (cams[i]) {
		helper += camstype[i];
		if (times[i])
			helper += times[i] + ';';
		helper += cams[i];
		if (cams[i + 1])
			helper += ',';
		++i;
	}
	helper += '|'
	switch (block.getInputTargetBlock('DATA').type) {
		case 'notification_push_message_helper':
			sprtf = null;
			helper += message.gencode;
			values = null;
			break;
		case 'getbyte_control':
			sprtf = message.gencode;
			values = message.after;
			break;
		case 'sprintf':
			sprtf = message.gencode;
			values = message.after;
			break;
		case 'variebles_getter':
			sprtf = message.gencode;
			values = message.after;
			break;
		default:
			if (block.getInputTargetBlock('DATA').output == 'Text') {
				sprtf = '%s';
				values = message.gencode;
			}
			else {
				sprtf = '%hhd';
				values = message.gencode;
			}

			break;
	}
	var code = {
		before: '',
		gencode: '',
		after: '',
		global: ''
	};
	if (if_previous_buffer_exsist(block)) {
		buffer = if_previous_buffer_exsist(block);
		block.buffer = if_previous_buffer_exsist(block);
		if (values)
			code.before += '\n' + buffer + '[0]=0;'
	}
	else {
		if (values) {
			code.before += '\nu8 ' + buffer + '[100]="";';
			block.buffer = buffer;
		}
	}
	if (values && Array.isArray(values)) {
		var i = 0;
		code.before += '\nsprintf(' + buffer + ',"' + helper + '");';
		values.forEach(value => {
			code.before += '\nsprintf(' + buffer + ' + strlen(' + buffer + '),"' + sprtf[i] + '",' + value + ');';
			++i;
		});
	}
	else if (values) {
		code.before += '\nsprintf(' + buffer + ',"' + helper + '");';
		code.before += '\nsprintf(' + buffer + ' + strlen(' + buffer + '),"' + sprtf + '",' + values + ');';
	}

	if (values) {
		code.gencode += '\nsetStatus(VOIP,&' + buffer + ');';
	}
	else
		code.gencode += '\nsetStatus(VOIP,"' + helper + '");';
	return JSON.stringify(code);
};