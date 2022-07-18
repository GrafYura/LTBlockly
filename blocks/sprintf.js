'use strict';
goog.provide('Blockly.Constants.Srintf');
goog.require('Blockly.Blocks');
goog.require('Blockly');
function add_device_to_sprintf(block) {
	var data_field = block.getField('DATA'),
	index = 0, data = block.getFieldValue('DATA'),
	help_text ='';
	while (data.indexOf('%') != -1) {
		index = data.indexOf('%');
		data = data.substring(++index);
	}
	index = parseInt(data[0]);
	if(isNaN(index))
		index = 1;
	else
		++index;
	data = block.getFieldValue('DATA');
	if(data.length > 0)
		help_text = ' ';
	data += help_text + Blockly.Msg['LT_TEXT_SPRINTF_DEV'] + ' %' + index
	data_field.setValue(data);
}
function remove_device_from_sprintf(block, index) {
	var data_field = block.getField('DATA'),
	data = block.getFieldValue('DATA');
	if(data.indexOf('%' + index) == -1){
		index = 0;
	}
	else
		index = data.indexOf('%' + index) + 2;
	data = data.substring(0,index);
	data_field.setValue(data);
}
Blockly.Blocks['sprintf'] = {
	init: function () {
		this.jsonInit({
			"message0": "%2sprintf: %1",
			"args0": [
				{
					"type": "field_input",
					"name": "DATA",
					"text": "Devices:"
				},
				{
					"type": "field_image",
					"src": "js/blockly/img/text/text.png",
					"width": 16,
					"height": 16,
					"alt": "*"
				}
			],
			"output": "Text",
			"mutator": "controls_sprintf_mutator",
			"colour": "%{BKY_LT_CATEGORY_COLOUR_TEXT}",
			"tooltip": "%{BKY_LT_TEXT_SPRINTF_TOOLTIP}"
		});
	},
	output: 'Text'
};
Blockly.defineBlocksWithJsonArray([
	{
		"type": "mutator_sprtf",
		"message0": "%{BKY_LT_TEXT_SPRINTF_MUTATOR}",
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_TEXT}"
	},
	{
		"type": "type_onoff",
		"message0": "%{BKY_LT_TEXT_SPRINTF_ONOFF}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_TEXT}"
	},
	{
		"type": "type_dimmer",
		"message0": "%{BKY_LT_TEXT_SPRINTF_DIMMER}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_TEXT}"
	},
	{
		"type": "type_rgb",
		"message0": "%{BKY_LT_TEXT_SPRINTF_RGB}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_TEXT}"
	},
	{
		"type": "type_sensor",
		"message0": "%{BKY_LT_TEXT_SPRINTF_SENS}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_TEXT}"
	},
	{
		"type": "type_conditioner",
		"message0": "%{BKY_LT_TEXT_SPRINTF_CONDITIONER}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_TEXT}"
	},
	{
		"type": "type_heating",
		"message0": "%{BKY_LT_TEXT_SPRINTF_HEATING}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_TEXT}"
	}
	,
	{
		"type": "type_variable",
		"message0": "%{BKY_LT_CATEGORY_VARIABLES}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_TEXT}"
	}
]);

Blockly.Constants.Srintf.CONTROLS_MUTATOR_MIXIN = {
	onoffcount_: 0,
	dimmcount_: 0,
	rgbcount_: 0,
	senscount_: 0,
	condcount_: 0,
	heatcount_: 0,
	varcount_: 0,
	prevonoffcount_: 0,
	prevdimmcount_: 0,
	prevrgbcount_: 0,
	prevsenscount_: 0,
	prevcondcount_: 0,
	prevheatcount_: 0,
	prevvarcount_: 0,
	mutationToDom: function () {
		var container = document.createElement('mutation');
		if (this.onoffcount_) {
			container.setAttribute('onoff', this.onoffcount_);
		}
		if (this.dimmcount_) {
			container.setAttribute('dimmer', this.dimmcount_);
		}
		if (this.rgbcount_) {
			container.setAttribute('rgb', this.rgbcount_);
		}
		if (this.senscount_) {
			container.setAttribute('sensor', this.senscount_);
		}
		if (this.condcount_) {
			container.setAttribute('conditioner', this.condcount_);
		}
		if (this.heatcount_) {
			container.setAttribute('heating', this.heatcount_);
		}
		if (this.varcount_) {
			container.setAttribute('variable', this.varcount_);
		}
		return container;
	},
	domToMutation: function (xmlElement) {
		this.onoffcount_ = parseInt(xmlElement.getAttribute('onoff'), 10);
		this.dimmcount_ = parseInt(xmlElement.getAttribute('dimmer'), 10);
		this.rgbcount_ = parseInt(xmlElement.getAttribute('rgb'), 10);
		this.senscount_ = parseInt(xmlElement.getAttribute('sensor'), 10);
		this.condcount_ = parseInt(xmlElement.getAttribute('conditioner'), 10);
		this.heatcount_ = parseInt(xmlElement.getAttribute('heating'), 10);
		this.varcount_ = parseInt(xmlElement.getAttribute('variable'), 10);
		this.updateShape_();
	},
	decompose: function (workspace) {
		workspace.addChangeListener(Blockly.Events.disableOrphans);
		var containerBlock = workspace.newBlock('mutator_sprtf');
		containerBlock.initSvg();
		var connection = containerBlock.nextConnection;
		for (var i = 1; i <= this.onoffcount_; i++) {
			var onoffBlock = workspace.newBlock('type_onoff');
			onoffBlock.initSvg();
			connection.connect(onoffBlock.previousConnection);
			connection = onoffBlock.nextConnection;
		}
		for (var i = 1; i <= this.dimmcount_; i++) {
			var dimmBlock = workspace.newBlock('type_dimmer');
			dimmBlock.initSvg();
			connection.connect(dimmBlock.previousConnection);
			connection = dimmBlock.nextConnection;
		}
		for (var i = 1; i <= this.rgbcount_; i++) {
			var rgbBlock = workspace.newBlock('type_rgb');
			rgbBlock.initSvg();
			connection.connect(rgbBlock.previousConnection);
			connection = rgbBlock.nextConnection;
		}
		for (var i = 1; i <= this.senscount_; i++) {
			var sensBlock = workspace.newBlock('type_sensor');
			sensBlock.initSvg();
			connection.connect(sensBlock.previousConnection);
			connection = sensBlock.nextConnection;
		}
		for (var i = 1; i <= this.condcount_; i++) {
			var condBlock = workspace.newBlock('type_conditioner');
			condBlock.initSvg();
			connection.connect(condBlock.previousConnection);
			connection = condBlock.nextConnection;
		}
		for (var i = 1; i <= this.heatcount_; i++) {
			var heatBlock = workspace.newBlock('type_heating');
			heatBlock.initSvg();
			connection.connect(heatBlock.previousConnection);
			connection = heatBlock.nextConnection;
		}
		for (var i = 1; i <= this.varcount_; i++) {
			var varBlock = workspace.newBlock('type_variable');
			varBlock.initSvg();
			connection.connect(varBlock.previousConnection);
			connection = varBlock.nextConnection;
		}
		return containerBlock;
	},
	compose: function (containerBlock) {
		var clauseBlock = containerBlock.nextConnection.targetBlock();
		// Count number of inputs.
		this.onoffcount_ = 0;
		this.dimmcount_ = 0;
		this.rgbcount_ = 0;
		this.senscount_ = 0;
		this.condcount_ = 0;
		this.heatcount_ = 0;
		this.varcount_ = 0;
		var onoffStatementConnection = [],
		dimmStatementConnection = [],
		rgbStatementConnection = [],
		sensStatementConnection = [],
		condStatementConnection = [],
		heatStatementConnection = [],
		varStatementConnection = [];
		while (clauseBlock) {
			switch (clauseBlock.type) {
				case 'type_onoff':
					this.onoffcount_++;
					onoffStatementConnection.push(clauseBlock.statementConnection_);
					break;
				case 'type_dimmer':
					this.dimmcount_++;
					dimmStatementConnection.push(clauseBlock.statementConnection_);
					break;
				case 'type_rgb':
					this.rgbcount_++;
					rgbStatementConnection.push(clauseBlock.statementConnection_);
					break;
				case 'type_sensor':
					this.senscount_++;
					sensStatementConnection.push(clauseBlock.statementConnection_);
					break;
				case 'type_conditioner':
					this.condcount_++;
					condStatementConnection.push(clauseBlock.statementConnection_);
					break;
				case 'type_heating':
					this.heatcount_++;
					heatStatementConnection.push(clauseBlock.statementConnection_);
					break;
				case 'type_variable':
					this.varcount_++;
					varStatementConnection.push(clauseBlock.statementConnection_);
					break;
				default:
					throw TypeError('Unknown block type: ' + clauseBlock.type);
			}
			clauseBlock = clauseBlock.nextConnection &&
				clauseBlock.nextConnection.targetBlock();
		}
		// Reconnect any child blocks.
		for (var i = 0; i < this.onoffcount_; i++) {
			Blockly.Mutator.reconnect(onoffStatementConnection[i], this, 'ONOFF' + i);
		}
		for (var i = 0; i < this.dimmcount_; i++) {
			Blockly.Mutator.reconnect(dimmStatementConnection[i], this, 'DIMM' + i);
		}
		for (var i = 0; i < this.rgbcount_; i++) {
			Blockly.Mutator.reconnect(rgbStatementConnection[i], this, 'RGB' + i);
		}
		for (var i = 0; i < this.senscount_; i++) {
			Blockly.Mutator.reconnect(sensStatementConnection[i], this, 'SENS' + i);
		}
		for (var i = 0; i < this.condcount_; i++) {
			Blockly.Mutator.reconnect(condStatementConnection[i], this, 'COND' + i);
		}
		for (var i = 0; i < this.heatcount_; i++) {
			Blockly.Mutator.reconnect(heatStatementConnection[i], this, 'HEAT' + i);
		}
		for (var i = 0; i < this.varcount_; i++) {
			Blockly.Mutator.reconnect(varStatementConnection[i], this, 'VAR' + i);
		}
		this.updateShape_();
	},
	updateShape_: function () {
		// Delete everything.
		var allcount = 0;
		var i = this.prevonoffcount_ - 1;
		allcount += this.prevonoffcount_;
		allcount +=	this.prevdimmcount_;
		allcount +=	this.prevrgbcount_ ;
		allcount +=	this.prevsenscount_ ;
		allcount +=	this.prevcondcount_;
		allcount +=	this.prevheatcount_;
		allcount += this.prevvarcount_;
		while (this.getInput('ONOFF' + i) && i >= this.onoffcount_) {
			this.removeInput('ONOFF' + i);
			--i;
			remove_device_from_sprintf(this,allcount - 1);
			--allcount;
		}
		i = this.prevdimmcount_ - 1;
		while (this.getInput('DIMM' + i) && i >= this.dimmcount_) {
			this.removeInput('DIMM' + i);
			--i;
			remove_device_from_sprintf(this,allcount - 1);
			allcount--;
		}
		i = this.prevrgbcount_ - 1;
		while (this.getInput('RGB' + i) && i >= this.rgbcount_) {
			this.removeInput('RGB' + i);
			--i;
			remove_device_from_sprintf(this,allcount - 1);
			allcount--;
		}
		i = this.prevsenscount_ - 1;
		while (this.getInput('SENS' + i) && i >= this.senscount_) {
			this.removeInput('SENS' + i);
			--i;
			remove_device_from_sprintf(this,allcount - 1);
			allcount--;
		}
		i = this.prevcondcount_ - 1;
		while (this.getInput('COND' + i) && i >= this.condcount_) {
			this.removeInput('COND' + i);
			--i;
			remove_device_from_sprintf(this,allcount - 1);
			--allcount;
		}
		i = this.prevheatcount_ - 1;
		while (this.getInput('HEAT' + i) && i >= this.heatcount_) {
			this.removeInput('HEAT' + i);
			--i;
			remove_device_from_sprintf(this,allcount - 1);
			allcount--;
		}
		i = this.prevvarcount_ - 1;
		while (this.getInput('VAR' + i) && i >= this.varcount_) {
			this.removeInput('VAR' + i);
			--i;
			remove_device_from_sprintf(this,allcount - 1);
			allcount--;
		}
		for (i = 0; i < this.varcount_; i++) {
			if (!this.getInput('VAR' + i)) {
				this.appendDummyInput('VAR' + i)
					.appendField(Blockly.Msg["LT_TEXT_SPRINTF_VARIABLE"] + ':')
					.appendField(new Blockly.FieldDropdown(get_vars.bind(this, ["varieble_numb", "varieble_text", "varieble_array"])), 'VAR' + i);
				add_device_to_sprintf(this);
			}
		}
		for (i = 0; i < this.heatcount_; i++) {
			if (!this.getInput('HEAT' + i)) {
				this.appendDummyInput('HEAT' + i)
					.appendField(Blockly.Msg['LT_TEXT_SPRINTF_TYPE'] + ':')
					.appendField(new Blockly.FieldDropdown([
						[Blockly.Msg['LT_TEXT_SPRINTF_TYPE_ONOFF'], "0"],
						["1/0", "1"],
						[Blockly.Msg['LT_TEXT_SPRINTF_TYPE_MODE'], "2"],
						[Blockly.Msg['LT_TEXT_SPRINTF_TYPE_TEMP'], "3"],
						[Blockly.Msg['LT_TEXT_SPRINTF_TYPE_SENSTEMP'], "4"]]), 'HEATTYPE' + i)
					.appendField(Blockly.Msg['LT_TEXT_SPRINTF_HEATING'] + ':')
					.appendField(new Blockly.FieldDropdown(blocklyDeviceOptions.bind(this, ["valve-heating"])), 'HEAT' + i);
				if(this.getInput('VAR0'))
					this.moveInputBefore( 'HEAT' + i,'VAR0');
				add_device_to_sprintf(this);
			}
		}
		for (i = 0; i < this.condcount_; i++) {
			if (!this.getInput('COND' + i)) {
				this.appendDummyInput('COND' + i)
					.appendField(Blockly.Msg['LT_TEXT_SPRINTF_TYPE'] + ':')
					.appendField(new Blockly.FieldDropdown([
						[Blockly.Msg['LT_TEXT_SPRINTF_TYPE_ONOFF'], "0"],
						["1/0", "1"],
						[Blockly.Msg['LT_TEXT_SPRINTF_TYPE_MODE'], "2"],
						[Blockly.Msg['LT_TEXT_SPRINTF_TYPE_TEMP'], "3"],
						[Blockly.Msg['LT_TEXT_SPRINTF_TYPE_FAN'], "4"],
						[Blockly.Msg['LT_TEXT_SPRINTF_TYPE_HB'], "5"],
						[Blockly.Msg['LT_TEXT_SPRINTF_TYPE_VB'], "6"]]), 'CONDTYPE' + i)
					.appendField(Blockly.Msg['LT_TEXT_SPRINTF_CONDITIONER'] + ':')
					.appendField(new Blockly.FieldDropdown(blocklyDeviceOptions.bind(this, ["conditioner"])), 'COND' + i);
				if(this.getInput('VAR0'))
					this.moveInputBefore( 'COND' + i,'VAR0');
				if(this.getInput('HEAT0'))
					this.moveInputBefore( 'COND' + i,'HEAT0');
				add_device_to_sprintf(this);
			}
		}
		for (i = 0; i < this.senscount_; i++) {
			if (!this.getInput('SENS' + i)) {
				this.appendDummyInput('SENS' + i)
					.appendField(Blockly.Msg['LT_TEXT_SPRINTF_TYPE'] + ':')
					.appendField(new Blockly.FieldDropdown([
						[Blockly.Msg['LT_TEXT_SPRINTF_TYPE_FLT'], "2"],
						[Blockly.Msg['LT_TEXT_SPRINTF_TYPE_INTPRT'], "0"],
						[Blockly.Msg['LT_TEXT_SPRINTF_TYPE_FRCT'], "1"]]), 'SENSTYPE' + i)
					.appendField(Blockly.Msg['LT_TEXT_SPRINTF_SENS'] + ':')
					.appendField(new Blockly.FieldDropdown(blocklyDeviceOptions.bind(this, ["motion-sensor", "humidity-sensor", "illumination-sensor", "temperature-sensor"])), 'SENS' + i);
				if(this.getInput('VAR0'))
					this.moveInputBefore( 'SENS' + i,'VAR0');
				if(this.getInput('HEAT0'))
					this.moveInputBefore( 'SENS' + i,'HEAT0');
				if(this.getInput('COND0'))
					this.moveInputBefore( 'SENS' + i,'COND0');
				add_device_to_sprintf(this);
			}
		}
		for (i = 0; i < this.rgbcount_; i++) {
			if (!this.getInput('RGB' + i)) {
				this.appendDummyInput('RGB' + i)
					.appendField(Blockly.Msg['LT_TEXT_SPRINTF_TYPE'] + ':')
					.appendField(new Blockly.FieldDropdown([
						[Blockly.Msg['LT_TEXT_SPRINTF_TYPE_ONOFF'], "0"],
						["1/0", "1"],
						[Blockly.Msg['LT_TEXT_SPRINTF_TYPE_BRGHST'], "2"],
						[Blockly.Msg['LT_TEXT_SPRINTF_TYPE_COLOR'], "3"]]), 'RGBTYPE' + i)
					.appendField(Blockly.Msg['LT_TEXT_SPRINTF_RGB'] + ':')
					.appendField(new Blockly.FieldDropdown(blocklyDeviceOptions.bind(this, ["rgb-lamp"])), 'RGB' + i);
				if(this.getInput('VAR0'))
					this.moveInputBefore( 'RGB' + i,'VAR0');
				if(this.getInput('HEAT0'))
					this.moveInputBefore( 'RGB' + i,'HEAT0');
				if(this.getInput('COND0'))
					this.moveInputBefore( 'RGB' + i,'COND0');
				if(this.getInput('SENS0'))
					this.moveInputBefore( 'RGB' + i,'SENS0');
				add_device_to_sprintf(this);
			}
		}
		for (i = 0; i < this.dimmcount_; i++) {
			if (!this.getInput('DIMM' + i)) {
				this.appendDummyInput('DIMM' + i)
					.appendField(Blockly.Msg['LT_TEXT_SPRINTF_TYPE'] + ':')
					.appendField(new Blockly.FieldDropdown([
						[Blockly.Msg['LT_TEXT_SPRINTF_TYPE_ONOFF'], "0"],
						["1/0", "1"],
						[Blockly.Msg['LT_TEXT_SPRINTF_TYPE_BRGHST'], "2"]]), 'DIMMTYPE' + i)
					.appendField(Blockly.Msg['LT_TEXT_SPRINTF_DIMMER'] + ':')
					.appendField(new Blockly.FieldDropdown(blocklyDeviceOptions.bind(this, ["dimer-lamp", "dimmer-lamp"])), 'DIMM' + i);
				if(this.getInput('VAR0'))
					this.moveInputBefore( 'DIMM' + i,'VAR0');
				if(this.getInput('HEAT0'))
					this.moveInputBefore( 'DIMM' + i,'HEAT0');
				if(this.getInput('COND0'))
					this.moveInputBefore( 'DIMM' + i,'COND0');
				if(this.getInput('SENS0'))
					this.moveInputBefore( 'DIMM' + i,'SENS0');
				if(this.getInput('RGB0'))
					this.moveInputBefore( 'DIMM' + i,'RGB0');
				add_device_to_sprintf(this);
			}
		}
		for (i = 0; i < this.onoffcount_; i++) {
			if (!this.getInput('ONOFF' + i)) {
				this.appendDummyInput('ONOFF' + i)
					.appendField(Blockly.Msg['LT_TEXT_SPRINTF_TYPE'] + ':')
					.appendField(new Blockly.FieldDropdown([
						[Blockly.Msg['LT_TEXT_SPRINTF_TYPE_ONOFF'], "0"],
						["1/0", "1"]]), 'ONOFFTYPE' + i)
					.appendField(Blockly.Msg['LT_TEXT_SPRINTF_DEV'] + ':')
					.appendField(new Blockly.FieldDropdown(blocklyDeviceOptions.bind(this, ["lamp", "dimer-lamp", "dimmer-lamp", "script", "speaker", "conditioner", "rgb-lamp", "leak-sensor", "valve-heating", "jalousie", "gate"])), 'ONOFF' + i);
				if(this.getInput('VAR0'))
					this.moveInputBefore( 'ONOFF' + i,'VAR0');
				if(this.getInput('HEAT0'))
					this.moveInputBefore( 'ONOFF' + i,'HEAT0');
				if(this.getInput('COND0'))
					this.moveInputBefore( 'ONOFF' + i,'COND0');
				if(this.getInput('SENS0'))
					this.moveInputBefore( 'ONOFF' + i,'SENS0');
				if(this.getInput('RGB0'))
					this.moveInputBefore( 'ONOFF' + i,'RGB0');
				if(this.getInput('DIMM0'))
					this.moveInputBefore( 'ONOFF' + i,'DIMM0');
				add_device_to_sprintf(this);
			}
		}
		this.prevonoffcount_ = this.onoffcount_;
		this.prevdimmcount_ = this.dimmcount_;
		this.prevrgbcount_ = this.rgbcount_;
		this.prevsenscount_ = this.senscount_;
		this.prevcondcount_ = this.condcount_;
		this.prevheatcount_ = this.heatcount_;
		this.prevvarcount_ = this.varcount_;
	}
};

Blockly.Extensions.registerMutator('controls_sprintf_mutator',
	Blockly.Constants.Srintf.CONTROLS_MUTATOR_MIXIN, null,
	['type_onoff', 'type_dimmer', 'type_rgb', 'type_sensor', 'type_conditioner', 'type_heating', 'type_variable']);


Blockly.JavaScript['sprintf'] = function (block) {
	// Search the text for a substring.
	var data = block.getFieldValue('DATA'),
	values = [],onoff = [],onofftype = [],
	dimm = [],dimmtype = [],rgb = [],
	rgbtype = [],sens = [],senstype = [],
	cond = [],condtype = [],heat = [],
	heattype = [],variables = [],variablestype = [], indexes = [],
	onoffcount = 0,dimmcount = 0,rgbcount = 0,
	senscount = 0,condcount = 0,heatcount = 0,
	varcount = 0,i = 0,count = 0,min,sprintf_data = [];
	/*
	** Get all devices in block 
	*/
	while (!(block.getFieldValue('ONOFF' + i) === null)) {
		onoff.push(block.getFieldValue('ONOFF' + i));
		onofftype.push(block.getFieldValue('ONOFFTYPE' + i));
		i++;
		count++;
	}
	i = 0;
	while (!(block.getFieldValue('DIMM' + i) === null)) {
		dimm.push(block.getFieldValue('DIMM' + i));
		dimmtype.push(block.getFieldValue('DIMMTYPE' + i));
		i++;
		count++;
	}
	i = 0;
	while (!(block.getFieldValue('RGB' + i) === null)) {
		rgb.push(block.getFieldValue('RGB' + i));
		rgbtype.push(block.getFieldValue('RGBTYPE' + i));
		i++;
		count++;
	}
	i = 0;
	while (!(block.getFieldValue('SENS' + i) === null)) {
		sens.push(block.getFieldValue('SENS' + i));
		senstype.push(block.getFieldValue('SENSTYPE' + i));
		i++;
		count++;
	}
	i = 0;
	while (!(block.getFieldValue('COND' + i) === null)) {
		cond.push(block.getFieldValue('COND' + i));
		condtype.push(block.getFieldValue('CONDTYPE' + i));
		i++;
		count++;
	}
	i = 0;
	while (!(block.getFieldValue('HEAT' + i) === null)) {
		heat.push(block.getFieldValue('HEAT' + i));
		heattype.push(block.getFieldValue('HEATTYPE' + i));
		i++;
		count++;
	}
	i = 0;
	while (block.getField('VAR' + i)) {
		variables.push(block.getFieldValue('VAR' + i));
		variablestype.push(get_var_type(block.getFieldValue('VAR' + i)));
		i++;
		count++;
	}
	i = 1;
	console.log("123213");
	var expr = new RegExp("%([0-9]+)", 'g');
	var el;
	while (el = expr.exec(data)) {
		indexes.push(el[1]);
	}

	//}
	while (~data.indexOf("%" + i)) {
		if (onoff[onoffcount]) {
			if (onofftype[onoffcount] == "0")
				data = data.substring(0, data.indexOf("%" + i)) + "onoff%s|" + data.substring(data.indexOf("%" + i) + 2);
			else
				data = data.substring(0, data.indexOf("%" + i)) + "onoff%hhd|" + data.substring(data.indexOf("%" + i) + 2);
			onoffcount++;
		} else if (dimm[dimmcount]) {
			if (dimmtype[dimmcount] == "0")
				data = data.substring(0, data.indexOf("%" + i)) + "dimm%s|" + data.substring(data.indexOf("%" + i) + 2);
			else
				data = data.substring(0, data.indexOf("%" + i)) + "dimm%hhd|" + data.substring(data.indexOf("%" + i) + 2);
			dimmcount++;
		} else if (rgb[rgbcount]) {
			switch (rgbtype[rgbcount]) {
				case "0":
					data = data.substring(0, data.indexOf("%" + i)) + "rgb%s|" + data.substring(data.indexOf("%" + i) + 2);
					break;
				case "3":
					data = data.substring(0, data.indexOf("%" + i)) + "rgb%X|" + data.substring(data.indexOf("%" + i) + 2);
					break;
				default:
					data = data.substring(0, data.indexOf("%" + i)) + "rgb%hhd|" + data.substring(data.indexOf("%" + i) + 2);
					break;
			}
			rgbcount++;
		} else if (sens[senscount]) {
			if (senstype[senscount] == "2")
				data = data.substring(0, data.indexOf("%" + i)) + "sens%c%hhd.%02hhd|" + data.substring(data.indexOf("%" + i) + 2);
			else
				data = data.substring(0, data.indexOf("%" + i)) + "sens%c%hhd|" + data.substring(data.indexOf("%" + i) + 2);
			senscount++;
		} else if (cond[condcount]) {
			if (condtype[condcount] == 1 || condtype[condcount] == 3)
				data = data.substring(0, data.indexOf("%" + i)) + "cond%hhd|" + data.substring(data.indexOf("%" + i) + 2);
			else
				data = data.substring(0, data.indexOf("%" + i)) + "cond%s|" + data.substring(data.indexOf("%" + i) + 2);
			condcount++;
		} else if (heat[heatcount]) {
			switch (heattype[heatcount]) {
				case "0":
					data = data.substring(0, data.indexOf("%" + i)) + "heat%s|" + data.substring(data.indexOf("%" + i) + 2);
					break;
				case "4":
					data = data.substring(0, data.indexOf("%" + i)) + "heat%hhd.%2d|" + data.substring(data.indexOf("%" + i) + 2);
					break;
				default:
					data = data.substring(0, data.indexOf("%" + i)) + "heat%hhd|" + data.substring(data.indexOf("%" + i) + 2);
					break;
			}
			heatcount++;
		} else if (variables[varcount]) {
			switch (variablestype[varcount]) {
				case "numb":
					data = data.substring(0, data.indexOf("%" + i)) + "var_val%hhd|" + data.substring(data.indexOf("%" + i) + 2);
					break;
				case "text":
					data = data.substring(0, data.indexOf("%" + i)) + "var_val%s|" + data.substring(data.indexOf("%" + i) + 2);
					break;
				case "array":
					data = data.substring(0, data.indexOf("%" + i)) + "var_val%hhd|" + data.substring(data.indexOf("%" + i) + 2);
					break;
				default:
					data = data.substring(0, data.indexOf("%" + i)) + "var_val%hhd|" + data.substring(data.indexOf("%" + i) + 2);
					break;
			}
			varcount++;
		}
		i++;
	}
	--i;
	if(count != i)
		throw Blockly.Msg["LT_ERROR_COUNT_NOT_EQUAL"] + ' ' + block.type;
	onoffcount = 0;
	dimmcount = 0;
	rgbcount = 0;
	senscount = 0;
	condcount = 0;
	heatcount = 0;
	varcount = 0;
	while ((onoff[onoffcount]
		|| dimm[dimmcount]
		|| rgb[rgbcount]
		|| sens[senscount]
		|| cond[condcount]
		|| heat[heatcount]
		|| variables[varcount])
		&& (i > onoffcount
			&& i > dimmcount
			&& i > rgbcount
			&& i > senscount
			&& i > condcount
			&& i > heatcount
			&& i > varcount)) {
		min = data.length;
		if (data.indexOf("onoff%") < min && data.indexOf("onoff%") != -1)
			min = data.indexOf("onoff%");
		if (data.indexOf("dimm%") < min && data.indexOf("dimm%") != -1)
			min = data.indexOf("dimm%");
		if (data.indexOf("rgb%") < min && data.indexOf("rgb%") != -1)
			min = data.indexOf("rgb%");
		if (data.indexOf("sens%") < min && data.indexOf("sens%") != -1)
			min = data.indexOf("sens%");
		if (data.indexOf("cond%") < min && data.indexOf("cond%") != -1)
			min = data.indexOf("cond%");
		if (data.indexOf("heat%") < min && data.indexOf("heat%") != -1)
			min = data.indexOf("heat%");
		if (data.indexOf("var_val%") < min && data.indexOf("var_val%") != -1)
			min = data.indexOf("var_val%");
		if (data.indexOf("onoff%") == min && onoff[onoffcount]) {
			if(onoff[onoffcount].length < 1){
				throw Blockly.Msg["LT_ERROR_EMPTY_DEVICE"] + ' ' + block.type;
			}
			if (onofftype[onoffcount] == "0") {
				values.push("[" + onoff[onoffcount] + ".0]&0x1?\"On\":\"Off\"");
			}
			else
				values.push("[" + onoff[onoffcount] + ".0]&0x1");
			data = data.substring(0, min) + data.substring(min + 5);
			onoffcount++;
		}
		if (data.indexOf("dimm%") == min && dimm[dimmcount]) {
			if(dimm[dimmcount].length < 1){
				throw Blockly.Msg["LT_ERROR_EMPTY_DEVICE"] + ' ' + block.type;
			}
			switch (dimmtype[dimmcount]) {
				case "0":
					values.push("[" + dimm[dimmcount] + ".0]&0x1?\"On\":\"Off\"");
					break;
				case "1":
					values.push("[" + dimm[dimmcount] + ".0]&0x1");
					break;
				case "2":
					values.push("([" + dimm[dimmcount] + ".1]*100)/250");
					break;
			}
			data = data.substring(0, min) + data.substring(min + 4);
			dimmcount++;
		}
		if (data.indexOf("rgb%") == min && rgb[rgbcount]) {
			if(rgb[rgbcount].length < 1){
				throw Blockly.Msg["LT_ERROR_EMPTY_DEVICE"] + ' ' + block.type;
			}
			switch (rgbtype[rgbcount]) {
				case "0":
					values.push("[" + rgb[rgbcount] + ".0]&0x1?\"On\":\"Off\"");
					break;
				case "1":
					values.push("[" + rgb[rgbcount] + ".0]&0x1");
					break;
				case "2":
					values.push("([" + rgb[rgbcount] + ".1]*100)/250");
					break;
				case "3":
					values.push("[" + rgb[rgbcount] + ".3]");
					break;
			}
			data = data.substring(0, min) + data.substring(min + 3);
			rgbcount++;
		}
		if (data.indexOf("sens%") == min && sens[senscount]) {
			if(senstype[senscount].length < 1){
				throw Blockly.Msg["LT_ERROR_EMPTY_DEVICE"] + ' ' + block.type;
			}
			switch (senstype[senscount]) {
				case "0":
					values.push('[' + sens[senscount] + '.1] <= 0x7F ?0x20:((([' + sens[senscount] + '.1] + 1)&0xFF) == 0?0x2d:0x20),[' + sens[senscount] + '.1] <= 0x7F ?([' + sens[senscount] + '.1]):([' + sens[senscount] + '.1] + 1)');
					break;
				case "1":
					values.push("[" + sens[senscount] + ".0]");
					break;
				case "2":
					values.push('[' + sens[senscount] + '.1] <= 0x7F ?0x20:((([' + sens[senscount] + '.1] + 1)&0xFF) == 0?0x2d:0x20),[' + sens[senscount] + '.1] <= 0x7F ?([' + sens[senscount] + '.1]):([' + sens[senscount] + '.1] + 1), [' + sens[senscount] + '.0]*100/250');
					break;
			}
			data = data.substring(0, min) + data.substring(min + 4);
			senscount++;
		}
		if (data.indexOf("cond%") == min && cond[condcount]) {
			if(cond[condcount].length < 1){
				throw Blockly.Msg["LT_ERROR_EMPTY_DEVICE"] + ' ' + block.type;
			}
			switch (condtype[condcount]) {
				case "0":
					values.push("[" + cond[condcount] + ".0]&0x1?\"On\":\"Off\"");
					break;
				case "1":
					values.push("[" + cond[condcount] + ".0]&0x1");
					break;
				case "2":
					values.push("([" + cond[condcount] + ".0] >> 4) == 0 ? \"Fan\":([" + cond[condcount] + ".0] >> 4) == 1 ? \"Cool\":([" + cond[condcount] + ".0] >> 4) == 2 ? \"Dry\":([" + cond[condcount] + ".0] >> 4) == 3 ? \"Heat\":\"Auto\"");
					break;
				case "3":
					values.push("[" + cond[condcount] + ".1]");
					break;
				case "4":
					values.push("[" + cond[condcount] + ".4] == 0 ? \"Auto\":[" + cond[condcount] + ".4] == 1 ? \"Weak air flow\":[" + cond[condcount] + ".4] == 2 ? \"Medium air flow\":\"Strong air flow\"");
					break;
				case "5":
					values.push("[" + cond[condcount] + ".3]&0xF == 0 ? \"Extreme left\":[" + cond[condcount] + ".3]&0xF == 1 ? \"Left\":[" + cond[condcount] + ".3]&0xF == 2 ? \"Middle\":[" + cond[condcount] + ".3]&0xF == 3 ? \"Right\":[" + cond[condcount] + ".3]&0xF == 4 ? \"Extreme right\":[" + cond[condcount] + ".3]&0xF == 5 ? \"Both left and right\":\"Ultra wide\"");
					break;
				case "5":
					values.push("([" + cond[condcount] + ".3] << 4) == 0 ? \"Auto\":([" + cond[condcount] + ".3] << 4) == 1 ? \"Extreme high\":([" + cond[condcount] + ".3] << 4) == 2 ? \"High\":([" + cond[condcount] + ".3] << 4) == 3 ? \"Middle\":([" + cond[condcount] + ".3] << 4) == 4 ? \"Low\":([" + cond[condcount] + ".3] << 4) == 5 ? \"Extreme low\":\"Ultra wide\"");
					break;
			}
			data = data.substring(0, min) + data.substring(min + 4);
			condcount++;
		}
		if (data.indexOf("heat%") == min && heat[heatcount]) {
			if(heattype[heatcount].length < 1){
				throw Blockly.Msg["LT_ERROR_EMPTY_DEVICE"] + ' ' + block.type;
			}
			switch (heattype[heatcount]) {
				case "0":
					values.push("[" + heat[heatcount] + ".1]");
					break;
				case "1":
					values.push("[" + heat[heatcount] + ".0]");
					break;
				case "2":
					values.push("[" + heat[heatcount] + ".0] << 4");
					break;
				case "3":
					values.push("[" + heat[heatcount] + ".2],[" + heat[heatcount] + ".1]");
					break;
				case "4":
					values.push("[" + heat[heatcount] + ".4],[" + heat[heatcount] + ".3]");
					break;
			}
			data = data.substring(0, min) + data.substring(min + 4);
			heatcount++;
		}
		if (data.indexOf("var_val%") == min && variables[varcount]) {
			if(variables[varcount] == ' '){
				throw Blockly.Msg["LT_ERROR_EMPTY_VAR"] + ' ' + variables[varcount] + ' ' + block.type;
			}
			switch (variablestype[varcount]) {
				case "text":
					values.push("&" + variables[varcount]);
					break;
				default:
					values.push(variables[varcount]);
					break;
			}
			data = data.substring(0, min) + data.substring(min + 7);
			varcount++;
		}
	}
	i = data.indexOf('|',0);
	if(i > 0){
		i = 0;
		while (i != -1) {
			sprintf_data.push(data.substring(i, data.indexOf('|',i)));
			i = data.indexOf('|',i);
			if(i != -1){
				++i;
			}
			if(i >= (data.length) - 1){
				break;
			}
		}
	}else{
		sprintf_data.push(data);
	}
	
	
	while (data.indexOf('|') != -1) {
		data = data.substring(0,data.indexOf('|')) + data.substring(data.indexOf('|') + 1);
	}
	if(data.length > 100){
		throw Blockly.Msg["LT_ERROR_MAX_EXCEED"] + ' ' + data.length + ' ' + block.type;
	}
	var sprtf_Buff = bloclyGenerateVariableName();
	var code = {
		before: '\n{\nu8 ' + sprtf_Buff + '[100];\n' + sprtf_Buff + '[0] = 0;',
		gencode: "",
		after: '\n}',
		global: ""
	};
	if(values.length == 0){
		values.push('');
	}
	if (block.getParent().type == 'variebles_setter') {
		if(Array.isArray(values))
		{
			var j = 0;
			values.forEach(val=>{
				code.gencode += '\nsprintf(' + block.getParent().getFieldValue('VAR') + ',"' + sprintf_data[j] + '",' + values[parseInt(indexes[i])-1] + ');';
				++j;
			});
		}
	}
	else if (block.getParent().hasOwnProperty('buffer') || block.getParent().type == 'notification_log_error') {
		code.gencode = sprintf_data;
		i = 0;
		var vals=[];
		values.forEach(val => {
			vals.push(values[parseInt(indexes[i]-1)]);
			++i;
		});
		code.after = vals;
		code.before = '';
	} else {
		if(values.length > 0){
			i = 0;
			values.forEach(val => {
				code.before += '\nsprintf(' + sprtf_Buff + ' + strlen(' + sprtf_Buff + '),"' + sprintf_data[i] + '",' + values[parseInt(indexes[i])-1] + ');';
				++i;
			});
		}
		else{
			code.before += '\nsprintf(' + sprtf_Buff + ' + strlen(' + sprtf_Buff + '),"' + data + '");';
		}
		code.gencode = '&' + sprtf_Buff;
	}
	return JSON.stringify(code);
};