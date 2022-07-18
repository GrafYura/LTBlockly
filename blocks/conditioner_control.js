'use strict';
goog.provide('Blockly.Constants.Conditioner');
goog.require('Blockly.Blocks');
goog.require('Blockly');

Blockly.Blocks['conditioner_control'] = {
	init: function () {
		this.jsonInit(
			{
				"message0": "%2%{BKY_LT_TEXT_SPRINTF_CONDITIONER} %1",
				"args0": [
					{
						"type": "field_dropdown",
						"name": "DEVICE",
						"options": blocklyDeviceOptions.bind(this, ["conditioner", "AC"])
					},
					{
						"type": "field_image",
						"src": "js/blockly/img/control/conditioner.png",
						"width": 16,
						"height": 16,
						"alt": "*"
					}
				],
				"previousStatement": null,
				"nextStatement": null,
				"mutator": "controls_conditioner_mutator",
				"colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}",
				"tooltip": "%{BKY_LT_CONTROL_CONDITIONER_TT}"
			});
	}
};
function onAutomationEvents(event) {
    if (event.type == Blockly.Events.CHANGE && event.name == 'DEVICE') {
        var block = Blockly.getMainWorkspace().getBlockById(event.blockId);

        if (block) {
        	if (block.type == 'conditioner_control')
        		if(block.getInput('ONOFF')){
        			block.removeInput('ONOFF');
        			block.updateShape_();
        		}
        		else {
        			Blockly.getMainWorkspace().getAllBlocks().forEach(element => {
        				if (element.type == 'conditioner_control') {
        					if(element.getInput('ONOFF')){
        						element.removeInput('ONOFF');
        						element.updateShape_();
        					}
        				}
        			});
            }
        }
    }
}
// https://image.flaticon.com/icons/png/512/259/259981.png
Blockly.defineBlocksWithJsonArray([
	{
		"type": "controls_fan",
		"message0": "%{BKY_LT_TEXT_SPRINTF_TYPE_FAN}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}"
	},
	{
		"type": "controls_hvan",
		"message0": "%{BKY_LT_TEXT_SPRINTF_TYPE_HB}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}"
	},
	{
		"type": "controls_vvan",
		"message0": "%{BKY_LT_TEXT_SPRINTF_TYPE_VB}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}"
	}
]);

Blockly.Constants.Conditioner.CONTROLS_MUTATOR_MIXIN = {
	modecount_: 0,
	tempcount_: 0,
	fancount_: 0,
	hvancount_: 0,
	vvancount_: 0,
	onoffcount_: 0,
	mutationToDom: function () {
		var container = document.createElement('mutation');
		if (this.modecount_) {
			container.setAttribute('mode', this.modecount_);
		}
		if (this.tempcount_) {
			container.setAttribute('temperature', this.tempcount_);
		}
		if (this.fancount_) {
			container.setAttribute('fan', this.fancount_);
		}
		if (this.hvancount_) {
			container.setAttribute('hvan', this.hvancount_);
		}
		if (this.vvancount_) {
			container.setAttribute('vvan', this.vvancount_);
		}
		if (this.onoffcount_) {
			container.setAttribute('onoff', this.onoffcount_);
		}
		return container;
	},
	domToMutation: function (xmlElement) {
		this.modecount_ = parseInt(xmlElement.getAttribute('mode'), 10);
		this.tempcount_ = parseInt(xmlElement.getAttribute('temperature'), 10);
		this.fancount_ = parseInt(xmlElement.getAttribute('fan'), 10);
		this.hvancount_ = parseInt(xmlElement.getAttribute('hvan'), 10);
		this.vvancount_ = parseInt(xmlElement.getAttribute('vvan'), 10);
		this.onoffcount_ = parseInt(xmlElement.getAttribute('onoff'), 10);
		this.updateShape_();
	},
	decompose: function (workspace) {
		workspace.addChangeListener(Blockly.Events.disableOrphans);
		var containerBlock = workspace.newBlock('controls_mutator');
		containerBlock.initSvg();
		var connection = containerBlock.nextConnection;
		if (this.modecount_) {
			var modeBlock = workspace.newBlock('controls_mode');
			modeBlock.initSvg();
			connection.connect(modeBlock.previousConnection);
			connection = modeBlock.nextConnection;
		}
		if (this.tempcount_) {
			var tempBlock = workspace.newBlock('controls_temp');
			tempBlock.initSvg();
			connection.connect(tempBlock.previousConnection);
			connection = tempBlock.nextConnection;
		}
		if (this.fancount_) {
			var fanBlock = workspace.newBlock('controls_fan');
			fanBlock.initSvg();
			connection.connect(fanBlock.previousConnection);
			connection = fanBlock.nextConnection;
		}
		if (this.hvancount_) {
			var hvanBlock = workspace.newBlock('controls_hvan');
			hvanBlock.initSvg();
			connection.connect(hvanBlock.previousConnection);
			connection = hvanBlock.nextConnection;
		}
		if (this.vvancount_) {
			var vvanBlock = workspace.newBlock('controls_vvan');
			vvanBlock.initSvg();
			connection.connect(vvanBlock.previousConnection);
			connection = vvanBlock.nextConnection;
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
		this.modecount_ = 0;
		this.tempcount_ = 0;
		this.fancount_ = 0;
		this.hvancount_ = 0;
		this.vvancount_ = 0;
		this.onoffcount_ = 0;
		var modeStatementConnection = null;
		var tempStatementConnection = null;
		var fanStatementConnection = null;
		var hvanStatementConnection = null;
		var vvanStatementConnection = null;
		var onoffStatementConnection = null;
		while (clauseBlock) {
			switch (clauseBlock.type) {
				case 'controls_mode':
					this.modecount_++;
					modeStatementConnection = clauseBlock.statementConnection_;
					break;
				case 'controls_temp':
					this.tempcount_++;
					tempStatementConnection = clauseBlock.statementConnection_;
					break;
				case 'controls_fan':
					this.fancount_++;
					fanStatementConnection = clauseBlock.statementConnection_;
					break;
				case 'controls_hvan':
					this.hvancount_++;
					hvanStatementConnection = clauseBlock.statementConnection_;
					break;
				case 'controls_vvan':
					this.vvancount_++;
					vvanStatementConnection = clauseBlock.statementConnection_;
					break;
				case 'controls_on_off':
					this.onoffcount_++;
					onoffStatementConnection = clauseBlock.statementConnection_;
					break;
				default:
					throw TypeError('Unknown block type: ' + clauseBlock.type);
			}
			clauseBlock = clauseBlock.nextConnection &&
				clauseBlock.nextConnection.targetBlock();
		}
		this.updateShape_();
		// Reconnect any child blocks.
		Blockly.Mutator.reconnect(modeStatementConnection, this, 'MODE');
		Blockly.Mutator.reconnect(tempStatementConnection, this, 'TEMP');
		Blockly.Mutator.reconnect(fanStatementConnection, this, 'FAN');
		Blockly.Mutator.reconnect(hvanStatementConnection, this, 'HVAN');
		Blockly.Mutator.reconnect(vvanStatementConnection, this, 'VVAN');
		Blockly.Mutator.reconnect(onoffStatementConnection, this, 'ONOFF');
	},
	updateShape_: function () {
		// Delete everything.
		if (this.modecount_ == 0 && this.getInput('MODE')) {
			this.removeInput('MODE');
		}
		if (this.tempcount_ == 0 && this.getInput('TEMP')) {
			this.removeInput('TEMP');
		}
		if (this.fancount_ == 0 && this.getInput('FAN')) {
			this.removeInput('FAN');
		}
		if (this.hvancount_ == 0 && this.getInput('HVAN')) {
			this.removeInput('HVAN');
		}
		if (this.vvancount_ == 0 && this.getInput('VVAN')) {
			this.removeInput('VVAN');
		}
		if (this.onoffcount_ == 0 && this.getInput('ONOFF')) {
			this.removeInput('ONOFF');
		}
		var devType = blocklyGetDeviceType('[addr="' +this.getFieldValue('DEVICE')+ '"]');
		if (this.modecount_ && !this.getInput('MODE')) {
			this.appendDummyInput('MODE')
				.appendField(Blockly.Msg['LT_TEXT_SPRINTF_TYPE_MODE'] + ':')
				.appendField(new Blockly.FieldDropdown([
					[Blockly.Msg['LT_CONDITIONER_MODE_FAN'], '0'],
					[Blockly.Msg['LT_CONDITIONER_MODE_COOL'], '1'],
					[Blockly.Msg['LT_CONDITIONER_MODE_DRY'], '2'],
					[Blockly.Msg['LT_CONDITIONER_MODE_HEAT'], '3'],
					[Blockly.Msg['LT_CONDITIONER_MODE_AUTO'], '4']]), 'MODE');
		}
		if (this.tempcount_ && !this.getInput('TEMP')) {
			this.appendDummyInput('TEMP')
				.appendField(Blockly.Msg['LT_TEXT_SPRINTF_TYPE_TEMP'] + ':')
				.appendField(new Blockly.FieldNumber('21', 0), 'TEMP');
		}
		if (this.fancount_ && !this.getInput('FAN')) {
			this.appendDummyInput('FAN')
				.appendField(Blockly.Msg['LT_TEXT_SPRINTF_TYPE_FAN'] + ':')
				.appendField(new Blockly.FieldDropdown([
					[Blockly.Msg['LT_CONDITIONER_FAN_AUTO'], '0'],
					[Blockly.Msg['LT_CONDITIONER_FAN_WEAK'], '1'],
					[Blockly.Msg['LT_CONDITIONER_FAN_MEDIUM'], '2'],
					[Blockly.Msg['LT_CONDITIONER_FAN_STRONG'], '3'],
					[Blockly.Msg['LT_CONDITIONER_FAN_EXTRA'], '4']]), 'FAN');
		}
		if (this.hvancount_ && !this.getInput('HVAN')) {
			this.appendDummyInput('HVAN')
				.appendField(Blockly.Msg['LT_TEXT_SPRINTF_TYPE_HB'] + ':')
				.appendField(new Blockly.FieldDropdown([
					[Blockly.Msg['LT_CONDITIONER_HV_EXLEFT'], '0'],
					[Blockly.Msg['LT_CONDITIONER_HV_LEFT'], '1'],
					[Blockly.Msg['LT_CONDITIONER_HV_MIDD'], '2'],
					[Blockly.Msg['LT_CONDITIONER_HV_RIGHT'], '3'],
					[Blockly.Msg['LT_CONDITIONER_HV_EXRIGHT'], '4'],
					[Blockly.Msg['LT_CONDITIONER_HV_LFTRGHT'], '5'],
					[Blockly.Msg['LT_CONDITIONER_HV_ULTR'], '6']]), 'HVAN');
		}
		if (this.vvancount_ && !this.getInput('VVAN')) {
			this.appendDummyInput('VVAN')
				.appendField(Blockly.Msg['LT_TEXT_SPRINTF_TYPE_VB'] + ':')
				.appendField(new Blockly.FieldDropdown([
					[Blockly.Msg['LT_CONDITIONER_VV_EXLEFT'], '0'],
					[Blockly.Msg['LT_CONDITIONER_VV_LEFT'], '1'],
					[Blockly.Msg['LT_CONDITIONER_VV_MIDD'], '2'],
					[Blockly.Msg['LT_CONDITIONER_VV_RIGHT'], '3'],
					[Blockly.Msg['LT_CONDITIONER_VV_EXRIGHT'], '4'],
					[Blockly.Msg['LT_CONDITIONER_VV_LFTRGHT'], '5'],
					[Blockly.Msg['LT_CONDITIONER_VV_ULTR'], '6']]), 'VVAN');
		}
		if(devType=="AC")
		{
			if (this.onoffcount_ && !this.getInput('ONOFF')) {
				this.appendDummyInput('ONOFF')
				.appendField(Blockly.Msg['LT_TEXT_SPRINTF_TYPE_ONOFF'] + ':')
				.appendField(new Blockly.FieldDropdown([
					['%{BKY_LT_OTHER_OFF}', "0"],
					['%{BKY_LT_OTHER_ON}', "1"],
					["%{BKY_LT_OTHER_TOGGLE}", "0xFF"]]), 'ONOFF');
			}
		}
		else
		{
			if (this.onoffcount_ && !this.getInput('ONOFF')) {
				this.appendDummyInput('ONOFF')
				.appendField(Blockly.Msg['LT_TEXT_SPRINTF_TYPE_ONOFF'] + ':')
				.appendField(new Blockly.FieldDropdown([
					['%{BKY_LT_OTHER_OFF}', "0"],
					['%{BKY_LT_OTHER_ON}', "1"]]), 'ONOFF');
			}
		}
	}
};

Blockly.Extensions.registerMutator('controls_conditioner_mutator',
	Blockly.Constants.Conditioner.CONTROLS_MUTATOR_MIXIN, null,
	['controls_mode', 'controls_temp', 'controls_fan', 'controls_on_off', 'controls_hvan', 'controls_vvan']);

Blockly.JavaScript['conditioner_control'] = function (block) {
	// Search the text for a substring.
	var device = block.getFieldValue('DEVICE'),
		act = block.getFieldValue('ONOFF'),
		mode = block.getFieldValue('MODE'),
		temp = block.getFieldValue('TEMP'),
		fan = block.getFieldValue('FAN'),
		hvan = block.getFieldValue('HVAN'),
		vvan = block.getFieldValue('VVAN'),
		code = {
			before: "",
			gencode: "",
			after: "",
			global: ""
		};
	if (device.length < 1) {
		throw Blockly.Msg["LT_ERROR_EMPTY_DEVICE"] + ' ' + block.type;
	}
	var devType = blocklyGetDeviceType('[addr="' + device + '"]');
	if(devType=="conditioner")
	{
		code.gencode = '\nsetStatus(' + device;
		var large_status = false;
		if (act === null) {
			act = '[' + device + '.0]&0x0F';
		}
		if (mode === null) {
			mode = '([' + device + '.0]&0xF0)';
		} else {
			mode = parseInt(mode) << 4;
			large_status = true;
		}
		if (temp === null) {
			temp = '[' + device + '.1]';
		} else {
			var item = blocklyLogicXml.find('[addr="' + device + '"]')[0].outerHTML;
			var reg = new RegExp('.* t-min="([\\d]+)".+', 'g');
			var el=reg.exec(item);
			if(el !== null)
				var tmin=el[1];
			else 
				tmin="16";
			temp = parseInt(temp) - parseInt(tmin);
			large_status = true;
		}
		if (hvan === null) {
			hvan = '[' + device + '.3]';
		} else {
			large_status = true;
		}
		if (vvan === null) {
			vvan = '([' + device + '.3]&0xF0)';
		} else {
			vvan = parseInt(vvan) << 4;
			large_status = true;
		}
		if (fan === null) {
			fan = '[' + device + '.4]';
		} else {
			large_status = true;
		}
		if (!large_status) {
			code.gencode += ',' + act + '|' + mode + ');';
		} else {
			code.gencode += ',{' + act + '|' + mode + ',' + temp + ',0,' + hvan + '|' + vvan + ',' + fan + '});';
		}
	}
	else if(devType=="AC")
	{
		if(act!=null)
		{
			code.gencode +=  '\nsetStatus(' + device + ', '+ act +');';
		}
		if(mode!=null)
		{
			code.gencode +=  '\nsetStatus(' + device + ', {0xf, 0x10, '+ mode +'});';	
		}
		if(temp != null)
		{
			code.gencode +=  '\nsetStatus(' + device + ', {0xf, 0, 0, '+ temp +'});';	
		}
		if(fan!=null)
		{
			code.gencode +=  '\nsetStatus(' + device + ', {0xf, 32, '+ fan +'});';	
		}
		if(vvan!=null)
		{
			code.gencode +=  '\nsetStatus(' + device + ', {0xf, 64, '+ vvan +'});';	
		}
		if(hvan!=null)
		{
			code.gencode +=  '\nsetStatus(' + device + ', {0xf, 48, '+ hvan +'});';	
		}
	}
	return JSON.stringify(code);
};

/*
./scr.sh CONDITIONER_MODE_FAN "Fan mode" "Режим вентилятора"
./scr.sh CONDITIONER_MODE_COOL "Cool mode" "Режим охлаждения"
./scr.sh CONDITIONER_MODE_DRY "Dry mode" "Режим сушки"
./scr.sh CONDITIONER_MODE_HEAT "Heat mode" "Режим нагрева"
./scr.sh CONDITIONER_MODE_AUTO "Auto mode" "Автоматический режим"

./scr.sh CONDITIONER_FAN_AUTO "Auto" "Авто"
./scr.sh CONDITIONER_FAN_WEAK "Weak airflow" "Слабый воздушный поток"
./scr.sh CONDITIONER_FAN_MEDIUM "Medium airflow" "Средний воздушный поток"
./scr.sh CONDITIONER_FAN_STRONG "Strong airflow" "Сильный воздушный поток"

./scr.sh CONDITIONER_HV_EXLEFT "Extreme left" "Крайний левый"
./scr.sh CONDITIONER_HV_LEFT "Left" "Левый"
./scr.sh CONDITIONER_HV_MIDD "Middle" "Средний"
./scr.sh CONDITIONER_HV_RIGHT "Right airflow" "Правый"
./scr.sh CONDITIONER_HV_EXRIGHT "Extreme right" "Крайний правый"
./scr.sh CONDITIONER_HV_LFTRGHT "Both left and right" "Как слева, так и справа"
./scr.sh CONDITIONER_HV_ULTR "Ultra wide" "Ультра широкий"
auto
extreme high
high
middle
low
extreme low
ultra wide
./scr.sh CONDITIONER_VV_EXLEFT "Auto" "Авто"
./scr.sh CONDITIONER_VV_LEFT "Extreme high" "Экстремально высокий"
./scr.sh CONDITIONER_VV_MIDD "High" "Высокая"
./scr.sh CONDITIONER_VV_RIGHT "Middle" "Cредний"
./scr.sh CONDITIONER_VV_EXRIGHT "Low" "Низкий"
./scr.sh CONDITIONER_VV_LFTRGHT "Extreme low" "Крайне низкий"
./scr.sh CONDITIONER_VV_ULTR "Ultra wide" "Ультра широкий"

./scr.sh CONDITIONER_TOOLTIP "Controls of conditioner" "Средства управления кондиционером"
./scr.sh CONDITIONER_DSCRP "Conditioner: %1 Act: %2" "Кондиционер:% 1 Действие:% 2"

%{BKY_CONDITIONER_COLOR}
*/