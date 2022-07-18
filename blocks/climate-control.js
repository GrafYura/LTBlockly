'use strict';
goog.provide('Blockly.Constants.Heating');
goog.require('Blockly.Blocks');
goog.require('Blockly');

function findModesOnCC(block) {
	var addr = block.getFieldValue('DEVICEADDR');
	var item = blocklyLogicXml.find('[addr="' + addr + '"]')[0];
	if(item !== 0)
		item = item.outerHTML;
	var expr = new RegExp('.+automation .*name="([\\wА-Яа-я -,.(){}\\[\\]]+)".+', 'g');
	var names = [];
	names.length=0;
	var el;
    while (el = expr.exec(item)) {
		names.push([el[1], el[1]]);
	}
   	//alert(names);
   	//console.log(names);
	return names;
	// if (names.length < 1)
	// 	return [['Comfort', 'Comfort'],
	// 	['Hot', 'Hot']];
}

function onAutomationEvents(event) 
{
	if (event.type == Blockly.Events.CHANGE && event.name == 'DEVICEADDR') 
	{
		var block = Blockly.getMainWorkspace().getBlockById(event.blockId);
		if (block.type == 'climate_control') {
			var drop = new Blockly.FieldDropdown(findModesOnCC(block));
			block.removeInput('MODE');
			block.appendDummyInput('MODE')
			.appendField(Blockly.Msg['LT_TEXT_SPRINTF_TYPE_MODE'] + ':')
			.appendField(drop, 'MODE');
		}
		else {
			Blockly.getMainWorkspace().getAllBlocks().forEach(element => 
			{
				if (element.type == 'climate_control')
				{
					if(element.getInput('MODE'))
					{
						var drop = new Blockly.FieldDropdown(findModesOnCC(element));
						element.removeInput('MODE');
						element.appendDummyInput('MODE')
						.appendField(Blockly.Msg['LT_TEXT_SPRINTF_TYPE_MODE'] + ':')
						.appendField(drop, 'MODE');
					}
				}
			});
		}

	}
	else if (event.type == Blockly.Events.CREATE) {
		block = Blockly.getMainWorkspace().getBlockById(event.blockId);
		if (block.type == 'climate_control'){
			if(block.getInput('MODE'))
				{
					var rval=block.getFieldValue('MODE');
					var drop = new Blockly.FieldDropdown(findModesOnCC(block));
					block.removeInput('MODE');
					block.appendDummyInput('MODE')
					.appendField(Blockly.Msg['LT_TEXT_SPRINTF_TYPE_MODE'] + ':')
					.appendField(drop, 'MODE');
					block.getField("MODE").setValue(rval);
				}
			}
		else {
			Blockly.getMainWorkspace().getAllBlocks().forEach(element => 
			{
				if (element.type == 'climate_control')
				{
					if(element.getInput('MODE'))
					{
						var rval=element.getFieldValue('MODE');
						drop = new Blockly.FieldDropdown(findModesOnCC(element));
						element.removeInput('MODE');
						element.appendDummyInput('MODE')
						.appendField(Blockly.Msg['LT_TEXT_SPRINTF_TYPE_MODE'] + ':')
						.appendField(drop, 'MODE');
						element.getField("MODE").setValue(rval);
					}
				}
			});
		}
	}
}


//Blockly.WorkspaceSvg.addChangeListener(Blockly.Events.disableOrphans);
Blockly.Blocks['climate_control'] = {
	init: function () {
		this.jsonInit(
			{
				"message0": "%2 %{BKY_LT_TEXT_SPRINTF_CC} %1",
				"args0": [
					{
						"type": "field_dropdown",
						"name": "DEVICEADDR",
						"options": blocklyDeviceOptions.bind(this, ["climate-control"])
					},
					{
						"type": "field_image",
						"src": "js/blockly/img/control/CC.png",
						"width": 16,
						"height": 16,
						"alt": "*"
					}
				],
				"previousStatement": null,
				"nextStatement": null,
				"mutator": "controls_cc_mutator",
				"colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}",
				"tooltip": "%{BKY_LT_CONTROL_CC_TT}"
			});
		//disableBlocksNotConnectedToRootNode(injectWorkspace(this));
	}
};
// https://cdn4.iconfinder.com/data/icons/automotive-maintenance/100/auto_heat-512.png
//Blockly.Workspace.addChangeListener(Blockly.Events.disableOrphans);
Blockly.defineBlocksWithJsonArray([
	{
		"type": "controls_mode",
		"message0": "%{BKY_LT_TEXT_SPRINTF_TYPE_MODE}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}"
	},
	{
		"type": "controls_temp_low",
		"message0": "%{BKY_LT_CC_TEMP0}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}"
	},
	{
		"type": "controls_temp_high",
		"message0": "%{BKY_LT_CC_TEMP1}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}"
	},
	{
		"type": "controls_hum_low",
		"message0": "%{BKY_LT_CC_HUM0}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}"
	},
	{
		"type": "controls_hum_high",
		"message0": "%{BKY_LT_CC_HUM1}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}"
	},
	{
		"type": "controls_cc_co2",
		"message0": "%{BKY_LT_CC_CO2}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}"
	},
	{
		"type": "controls_wf",
		"message0": "%{BKY_LT_CC_WF}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_CONTROL}"
	}

]);
Blockly.Constants.Heating.CONTROLS_MUTATOR_MIXIN = {
	modecount_: 0,
	actcount_: 0,
	devprevcount_: 0,
	temp0count_: 0,
	temp1count_: 0,
	hum0count_: 0,
	hum1count_: 0,
	co2count_: 0,
	wfcount_: 0,
	mutationToDom: function () {
		var container = document.createElement('mutation');
		if (this.modecount_) {
			container.setAttribute('mode', this.modecount_);
		}
		if (this.actcount_) {
			container.setAttribute('action', this.actcount_);
		}
		if (this.temp0count_) {
			container.setAttribute('temp0', this.temp0count_);
		}
		if (this.temp1count_) {
			container.setAttribute('temp1', this.temp1count_);
		}
		if (this.hum0count_) {
			container.setAttribute('hum0', this.hum0count_);
		}
		if (this.hum1count_) {
			container.setAttribute('hum1', this.hum1count_);
		}
		if (this.co2count_) {
			container.setAttribute('co2', this.co2count_);
		}
		if (this.wfcount_) {
			container.setAttribute('wf', this.wfcount_);
		}
		return container;
	},
	domToMutation: function (xmlElement) {
		this.modecount_ = parseInt(xmlElement.getAttribute('mode'), 10);
		this.actcount_ = parseInt(xmlElement.getAttribute('action'), 10);
		this.temp0count_ = parseInt(xmlElement.getAttribute('temp0'), 10);
		this.temp1count_ = parseInt(xmlElement.getAttribute('temp1'), 10);
		this.hum0count_ = parseInt(xmlElement.getAttribute('hum0'), 10);
		this.hum1count_ = parseInt(xmlElement.getAttribute('hum1'), 10);
		this.co2count_ = parseInt(xmlElement.getAttribute('co2'), 10);
		this.wfcount_ = parseInt(xmlElement.getAttribute('wf'), 10);
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
		if (this.actcount_) {
			var actBlock = workspace.newBlock('controls_on_off');
			actBlock.initSvg();
			connection.connect(actBlock.previousConnection);
			connection = actBlock.nextConnection;
		}
		if (this.temp0count_) {
			var temp0Block = workspace.newBlock('controls_temp_low');
			temp0Block.initSvg();
			connection.connect(temp0Block.previousConnection);
			connection = temp0Block.nextConnection;
		}
		if (this.temp1count_) {
			var temp1Block = workspace.newBlock('controls_temp_high');
			temp1Block.initSvg();
			connection.connect(temp1Block.previousConnection);
			connection = temp1Block.nextConnection;
		}
		if (this.hum0count_) {
			var hum0Block = workspace.newBlock('controls_hum_low');
			hum0Block.initSvg();
			connection.connect(hum0Block.previousConnection);
			connection = hum0Block.nextConnection;
		}
		if (this.hum1count_) {
			var hum1Block = workspace.newBlock('controls_hum_high');
			hum1Block.initSvg();
			connection.connect(hum1Block.previousConnection);
			connection = hum1Block.nextConnection;
		}
		if (this.co2count_) {
			var co2Block = workspace.newBlock('controls_cc_co2');
			co2Block.initSvg();
			connection.connect(co2Block.previousConnection);
			connection = co2Block.nextConnection;
		}
		if (this.wfcount_) {
			var wfBlock = workspace.newBlock('controls_wf');
			wfBlock.initSvg();
			connection.connect(wfBlock.previousConnection);
			connection = wfBlock.nextConnection;
		}
		return containerBlock;
	},
	compose: function (containerBlock) {
		var clauseBlock = containerBlock.nextConnection.targetBlock();
		// Count number of inputs.
		this.modecount_ = 0;
		this.actcount_ = 0;
		this.temp0count_ = 0;
		this.temp1count_ = 0;
		this.hum0count_ = 0;
		this.hum1count_ = 0;
		this.co2count_ = 0;
		this.wfcount_ = 0;
		var modeStatementConnection = null;
		var actStatementConnection = null;
		var temp0StatementConnection = null;
		var temp1StatementConnection = null;
		var hum0StatementConnection = null;
		var hum1StatementConnection = null;
		var co2StatementConnection = null;
		var wfStatementConnection = null;
		while (clauseBlock) {
			switch (clauseBlock.type) {
				case 'controls_mode':
					this.modecount_++;
					modeStatementConnection = clauseBlock.statementConnection_;
					break;
				case 'controls_temp_low':
					this.temp0count_++;
					temp0StatementConnection = clauseBlock.statementConnection_;
					break;
				case 'controls_temp_high':
					this.temp1count_++;
					temp1StatementConnection = clauseBlock.statementConnection_;
					break;
				case 'controls_hum_low':
					this.hum0count_++;
					hum0StatementConnection = clauseBlock.statementConnection_;
					break;
				case 'controls_hum_high':
					this.hum1count_++;
					hum1StatementConnection = clauseBlock.statementConnection_;
					break;
				case 'controls_cc_co2':
					this.co2count_++;
					co2StatementConnection = clauseBlock.statementConnection_;
					break;
				case 'controls_wf':
					this.wfcount_++;
					wfStatementConnection = clauseBlock.statementConnection_;
					break;
				case 'controls_on_off':
					this.actcount_++;
					actStatementConnection = clauseBlock.statementConnection_;
					break;
				default:
					throw new TypeError('Unknown block type: ' + clauseBlock.type);
			}
			clauseBlock = clauseBlock.nextConnection &&
				clauseBlock.nextConnection.targetBlock();
		}
		this.updateShape_();
		// Reconnect any child blocks.
		Blockly.Mutator.reconnect(modeStatementConnection, this, 'MODE');
		Blockly.Mutator.reconnect(actStatementConnection, this, 'ACT');
		Blockly.Mutator.reconnect(temp0StatementConnection, this, 'TEMP0');
		Blockly.Mutator.reconnect(temp1StatementConnection, this, 'TEMP1');
		Blockly.Mutator.reconnect(hum0StatementConnection, this, 'HUM0');
		Blockly.Mutator.reconnect(hum1StatementConnection, this, 'HUM1');
		Blockly.Mutator.reconnect(co2StatementConnection, this, 'CO2');
		Blockly.Mutator.reconnect(wfStatementConnection, this, 'WF');
	},
	updateShape_: function () {
		// Delete everything.
		//console.log(this.inputList[0].fieldRow[2].value_);
		//console.log(this);
		//console.log(this.getFieldValue("DEVICEADDR"));
		if (this.modecount_ === 0 && this.getInput('MODE')) {
			this.removeInput('MODE');
		}
		if (this.actcount_ === 0 && this.getInput('ACT')) {
			this.removeInput('ACT');
		}
		if (this.temp0count_ === 0 && this.getInput('TEMP0')) {
			this.removeInput('TEM0P');
		}
		if (this.temp1count_ === 0 && this.getInput('TEMP1')) {
			this.removeInput('TEMP1');
		}
		if (this.hum0count_ === 0 && this.getInput('HUM0')) {
			this.removeInput('HUM0');
		}
		if (this.hum1count_ === 0 && this.getInput('HUM1')) {
			this.removeInput('HUM1');
		}
		if (this.co2count_ === 0 && this.getInput('CO2')) {
			this.removeInput('CO2');
		}
		if (this.wfcount_ === 0 && this.getInput('WF')) {
			this.removeInput('WF');
		}
		var attrs = findModesOnCC(this);
		
		if (this.modecount_ && !this.getInput('MODE')) {
			this.appendDummyInput('MODE')
				.appendField(Blockly.Msg['LT_TEXT_SPRINTF_TYPE_MODE'] + ':')
				.appendField(new Blockly.FieldDropdown(
					attrs), 'MODE');
		}
		if (this.actcount_ && !this.getInput('ACT')) {
			this.appendDummyInput('ACT')
				.appendField(Blockly.Msg['LT_TEXT_SPRINTF_TYPE_ONOFF'] + ':')
				.appendField(new Blockly.FieldDropdown([
					['%{BKY_LT_OTHER_OFF}', '0'],
					['%{BKY_LT_OTHER_ON}', '1'],
					["%{BKY_LT_OTHER_TOGGLE}", "0xFF"]]), 'ACT');
		}
		if (this.temp0count_ && !this.getInput('TEMP0')) {
			this.appendDummyInput('TEMP0')
				.appendField(Blockly.Msg['LT_CC_TEMP0'] + ':')
				.appendField(new Blockly.FieldNumber(16,0,125), 'TEMP0');
		}
		if (this.temp1count_ && !this.getInput('TEMP1')) {
			this.appendDummyInput('TEMP1')
				.appendField(Blockly.Msg['LT_CC_TEMP1'] + ':')
				.appendField(new Blockly.FieldNumber(22,0,125), 'TEMP1');
		}
		if (this.hum0count_ && !this.getInput('HUM0')) {
			this.appendDummyInput('HUM0')
				.appendField(Blockly.Msg['LT_CC_HUM0'] + ':')
				.appendField(new Blockly.FieldNumber(25,0,100), 'HUM0');
		}
		if (this.hum1count_ && !this.getInput('HUM1')) {
			this.appendDummyInput('HUM1')
				.appendField(Blockly.Msg['LT_CC_HUM1'] + ':')
				.appendField(new Blockly.FieldNumber(60,0,100), 'HUM1');
		}
		if (this.co2count_ && !this.getInput('CO2')) {
			this.appendDummyInput('CO2')
				.appendField(Blockly.Msg['LT_CC_CO2'] + ':')
				.appendField(new Blockly.FieldNumber(600,400,2000), 'CO2');
		}
		if (this.wfcount_ && !this.getInput('WF')) {
			this.appendDummyInput('WF')
				.appendField(Blockly.Msg['LT_CC_WF'] + ':')
				.appendField(new Blockly.FieldNumber(22,0,125), 'WF');
		}
		this.devprevcount_ = this.devcount_;
	}
};
function disableBlocksNotConnectedToRootNode(workspace) {
	workspace.addChangeListener(Blockly.Events.disableOrphans);
}

Blockly.Extensions.registerMutator('controls_cc_mutator',
	Blockly.Constants.Heating.CONTROLS_MUTATOR_MIXIN, null,
	['controls_mode', 'controls_on_off', 'controls_temp_low', 'controls_temp_high', 'controls_hum_low', 'controls_hum_high', 'controls_cc_co2', 'controls_wf']);
Blockly.JavaScript['climate_control'] = function (block) {
	// Search the text for a substring.
	var device = block.getFieldValue('DEVICEADDR');
	var act = block.getFieldValue('ACT');
	var mode = block.getFieldValue('MODE');
	var temp0 = block.getFieldValue('TEMP0');
	var temp1 = block.getFieldValue('TEMP1');
	var hum0 = block.getFieldValue('HUM0');
	var hum1 = block.getFieldValue('HUM1');
	var co2 = block.getFieldValue('CO2');
	var wf = block.getFieldValue('WF');
	var delayedname = null;
	delayedname = bloclyGenerateVariableName();
	var code = {
		before: "",
		gencode: "",
		after: "",
		global: ""
	};
	if (device.length < 1) {
		throw Blockly.Msg["LT_ERROR_EMPTY_DEVICE"] + ' ' + block.type;
	}
	if (mode !== null)
		code.gencode += '\nsetStatus(SRV-ID:102,"' + device + '\\0' + mode + '");';
	if(temp0 !== null || temp1 !== null || hum0 !== null || hum1 !== null || co2 !== null || wf !== null)
	{
		code.gencode += '\nsetStatus(SRV-ID:108, ' + `"{'request':'status-set', 'addr':'`+device+`', 'status':{`;
		if(temp0 !== null)
			code.gencode +=" 'setpoint-heat':"+temp0;
		if(temp1 !== null)
		{
			if(temp0!==null)
				code.gencode +=','
			code.gencode +=" 'setpoint-cool':"+temp1;
		}
		if(hum0 !== null)
		{
			if(temp0!==null || temp1!==null)
				code.gencode +=','
			code.gencode +=" 'setpoint-humidify':"+hum0;
		}
		if(hum1 !== null)
		{
			if(temp0!==null || hum0!==null || temp1!==null)
				code.gencode +=','
			code.gencode +=" 'setpoint-dry':"+hum1;
		}
		if(co2 !== null)
		{
			if(hum1 !== null || temp0!==null || hum0!==null || temp1!==null)
				code.gencode +=','
			code.gencode +=" 'setpoint-co2':"+co2;
		}
		if(wf !== null)
		{
			if(co2 !== null || hum1 !== null || temp0!==null || hum0!==null || temp1!==null)
				code.gencode +=','
			code.gencode +=" 'setpoint-warm-floor':"+wf;
		}
		code.gencode+=`}}");`;
	}
	if(act!==null)
	{
		code.gencode+='\ndelayedCall(' + delayedname + ', 1);';
		code.global+= '\nvoid ' + delayedname +'()\n{';
		code.global += '\nsetStatus(' + device + ', ' + act + ');\n}\n';
	}
	return JSON.stringify(code);
};