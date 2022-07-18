'use strict';
goog.provide('Blockly.Constants.Timew');
goog.require('Blockly.Blocks');
goog.require('Blockly');
Blockly.Blocks['datetime_time_in_range_day'] = {
	init: function () {
		this.jsonInit({
			"message0": "%3%{BKY_LT_DATA_TIMEINRANGE}",
			"args0": [
				{
					"type": "field_time",
					"name": "TIME1",
					"hour": 9,
					"minutes": 0,
					"alt":
					{
						"type": "field_input",
						"name": "TIME1",
						"text": "9:00"
					}
				},
				{
					"type": "field_time",
					"name": "TIME2",
					"hour": 12,
					"minutes": 0,
					"alt":
					{
						"type": "field_input",
						"name": "TIME2",
						"text": "12:00"
					}
				},
				{
					"type": "field_image",
					"src": "js/blockly/img/datetime/datetime.png",
					"width": 16,
					"height": 16,
					"alt": "*"
				}
			],
			"output": "Number",
			"mutator": "controls_timew_mutator",
			"colour": "%{BKY_LT_CATEGORY_COLOUR_DATETIME}",
			"tooltip": "%{BKY_LT_DATETIME_TT}"
		});
	},
	output: "Number"
};
// https://static.thenounproject.com/png/133028-200.png
Blockly.defineBlocksWithJsonArray([
	{
		"type": "day_mutator",
		"message0": "%{BKY_LT_DATA_MUTATOR}",
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_DATETIME}"
	},
	{
		"type": "controls_monday",
		"message0": "Weak days",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_DATETIME}"
	},
	{
		"type": "controls_tuesday",
		"message0": "%{BKY_LT_DATA_TUESDAY}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_DATETIME}"
	},
	{
		"type": "controls_wednesday",
		"message0": "%{BKY_LT_DATA_WEDNESDAY}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_DATETIME}"
	},
	{
		"type": "controls_thursday",
		"message0": "%{BKY_LT_DATA_THURSDAY}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_DATETIME}"
	},
	{
		"type": "controls_friday",
		"message0": "%{BKY_LT_DATA_FRIDAY}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_DATETIME}"
	},
	{
		"type": "controls_saturday",
		"message0": "%{BKY_LT_DATA_SATURDAY}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_DATETIME}"
	},
	{
		"type": "controls_sunday",
		"message0": "%{BKY_LT_DATA_SUNDAY}",
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_DATETIME}"
	}
]);

Blockly.Constants.Timew.CONTROLS_MUTATOR_MIXIN = {
	mondaycount_: 0,
	tuesdaycount_: 0,
	wednesdaycount_: 0,
	thursdaycount_: 0,
	fridaycount_: 0,
	saturdaycount_: 0,
	sundaycount_: 0,

	mutationToDom: function () {
		var container = document.createElement('mutation');
		if (this.mondaycount_) {
			container.setAttribute('monday', this.mondaycount_);
		}
		if (this.tuesdaycount_) {
			container.setAttribute('tuesday', this.tuesdaycount_);
		}
		if (this.wednesdaycount_) {
			container.setAttribute('wednesday', this.wednesdaycount_);
		}
		if (this.thursdaycount_) {
			container.setAttribute('thursday', this.thursdaycount_);
		}
		if (this.fridaycount_) {
			container.setAttribute('friday', this.fridaycount_);
		}
		if (this.saturdaycount_) {
			container.setAttribute('saturday', this.saturdaycount_);
		}
		if (this.sundaycount_) {
			container.setAttribute('sunday', this.sundaycount_);
		}
		return container;
	},
	domToMutation: function (xmlElement) {
		this.mondaycount_ = parseInt(xmlElement.getAttribute('monday'), 10);
		this.tuesdaycount_ = parseInt(xmlElement.getAttribute('tuesday'), 10);
		this.wednesdaycount_ = parseInt(xmlElement.getAttribute('wednesday'), 10);
		this.thursdaycount_ = parseInt(xmlElement.getAttribute('thursday'), 10);
		this.fridaycount_ = parseInt(xmlElement.getAttribute('friday'), 10);
		this.saturdaycount_ = parseInt(xmlElement.getAttribute('saturday'), 10);
		this.sundaycount_ = parseInt(xmlElement.getAttribute('sunday'), 10);
		this.updateShape_();
	},
	decompose: function (workspace) {
		workspace.addChangeListener(Blockly.Events.disableOrphans);
		var containerBlock = workspace.newBlock('day_mutator');
		containerBlock.initSvg();
		var connection = containerBlock.nextConnection;
		if (this.mondaycount_) {
			var dBlock1 = workspace.newBlock('controls_monday');
			dBlock1.initSvg();
			connection.connect(dBlock1.previousConnection);
			connection = dBlock1.nextConnection;
		}
		if (this.tuesdaycount_) {
			var dBlock2 = workspace.newBlock('controls_tuesday');
			dBlock2.initSvg();
			connection.connect(dBlock2.previousConnection);
			connection = dBlock2.nextConnection;
		}
		if (this.wednesdaycount_) {
			var dBlock3 = workspace.newBlock('controls_wednesday');
			dBlock3.initSvg();
			connection.connect(dBlock3.previousConnection);
			connection = dBlock3.nextConnection;
		}
		if (this.thursdaycount_) {
			var dBlock4 = workspace.newBlock('controls_thursday');
			dBlock4.initSvg();
			connection.connect(dBlock4.previousConnection);
			connection = dBlock4.nextConnection;
		}
		if (this.fridaycount_) {
			var dBlock5 = workspace.newBlock('controls_friday');
			dBlock5.initSvg();
			connection.connect(dBlock5.previousConnection);
			connection = dBlock5.nextConnection;
		}
		if (this.saturdaycount_) {
			var dBlock6 = workspace.newBlock('controls_saturday');
			dBlock6.initSvg();
			connection.connect(dBlock6.previousConnection);
			connection = dBlock6.nextConnection;
		}
		if (this.sundaycount_) {
			var dBlock7 = workspace.newBlock('controls_sunday');
			dBlock7.initSvg();
			connection.connect(dBlock7.previousConnection);
			connection = dBlock7.nextConnection;
		}

		return containerBlock;
	},
	compose: function (containerBlock) {
		var clauseBlock = containerBlock.nextConnection.targetBlock();
		// Count number of inputs.
		this.mondaycount_ = 0;
		this.tuesdaycount_ = 0;
		this.wednesdaycount_ = 0;
		this.thursdaycount_ = 0;
		this.fridaycount_ = 0;
		this.saturdaycount_ = 0;
		this.sundaycount_ = 0;

		var mondayStatementConnection = null;
		var tuesdayStatementConnection = null;
		var wednesdayStatementConnection = null;
		var thursdayStatementConnection = null;
		var fridayStatementConnection = null;
		var saturdayStatementConnection = null;
		var sundayStatementConnection = null;

		while (clauseBlock) {
			switch (clauseBlock.type) {
				case 'controls_monday':
					this.mondaycount_++;
					mondayStatementConnection = clauseBlock.statementConnection_;
					break;
				case 'controls_tuesday':
					this.tuesdaycount_++;
					tuesdayStatementConnection = clauseBlock.statementConnection_;
					break;
				case 'controls_wednesday':
					this.wednesdaycount_++;
					wednesdayStatementConnection = clauseBlock.statementConnection_;
					break;
				case 'controls_thursday':
					this.thursdaycount_++;
					thursdayStatementConnection = clauseBlock.statementConnection_;
					break;
				case 'controls_friday':
					this.fridaycount_++;
					fridayStatementConnection = clauseBlock.statementConnection_;
					break;
				case 'controls_saturday':
					this.saturdaycount_++;
					saturdayStatementConnection = clauseBlock.statementConnection_;
					break;
				case 'controls_sunday':
					this.sundaycount_++;
					sundayStatementConnection = clauseBlock.statementConnection_;
					break;

				default:
					throw TypeError('Unknown block type: ' + clauseBlock.type);
			}
			clauseBlock = clauseBlock.nextConnection &&
				clauseBlock.nextConnection.targetBlock();
		}
		this.updateShape_();
		// Reconnect any child blocks.
		Blockly.Mutator.reconnect(mondayStatementConnection, this, 'MONDAY');
		Blockly.Mutator.reconnect(mondayStatementConnection, this, 'TUESDAY');
		Blockly.Mutator.reconnect(mondayStatementConnection, this, 'WEDNESDAY');
		Blockly.Mutator.reconnect(mondayStatementConnection, this, 'THURSDAY');
		Blockly.Mutator.reconnect(mondayStatementConnection, this, 'FRIDAY');
		Blockly.Mutator.reconnect(mondayStatementConnection, this, 'SATURDAY');
		Blockly.Mutator.reconnect(mondayStatementConnection, this, 'SUNDAY');
	},
	updateShape_: function () {

		if (this.mondaycount_ && !this.getInput('MONDAY')) {
			this.appendDummyInput('MONDAY')
				.appendField(new Blockly.FieldCheckbox('FALSE'), 'MONDAY')
				.appendField(Blockly.Msg["LT_DATA_MONDAY"]);
			this.appendDummyInput('TUESDAY')
				.appendField(new Blockly.FieldCheckbox('FALSE'), 'TUESDAY')
				.appendField(Blockly.Msg["LT_DATA_TUESDAY"]);
			this.appendDummyInput('WEDNESDAY')
				.appendField(new Blockly.FieldCheckbox('FALSE'), 'WEDNESDAY')
				.appendField(Blockly.Msg["LT_DATA_WEDNESDAY"]);
			this.appendDummyInput('THURSDAY')
				.appendField(new Blockly.FieldCheckbox('FALSE'), 'THURSDAY')
				.appendField(Blockly.Msg["LT_DATA_THURSDAY"]);
			this.appendDummyInput('FRIDAY')
				.appendField(new Blockly.FieldCheckbox('FALSE'), 'FRIDAY')
				.appendField(Blockly.Msg["LT_DATA_FRIDAY"]);
			this.appendDummyInput('SATURDAY')
				.appendField(new Blockly.FieldCheckbox('FALSE'), 'SATURDAY')
				.appendField(Blockly.Msg["LT_DATA_SATURDAY"]);
			this.appendDummyInput('SUNDAY')
				.appendField(new Blockly.FieldCheckbox('FALSE'), 'SUNDAY')
				.appendField(Blockly.Msg["LT_DATA_SUNDAY"]);
		} else if (!this.mondaycount_ && this.getInput('MONDAY')) {
			this.removeInput('MONDAY');
			this.removeInput('TUESDAY');
			this.removeInput('WEDNESDAY');
			this.removeInput('THURSDAY');
			this.removeInput('FRIDAY');
			this.removeInput('SATURDAY');
			this.removeInput('SUNDAY');
		}
	}
};

Blockly.Extensions.registerMutator('controls_timew_mutator',
	Blockly.Constants.Timew.CONTROLS_MUTATOR_MIXIN, null,
	['controls_monday']);

Blockly.JavaScript['datetime_time_in_range_day'] = function (block) {
	// Search the text for a substring.
	var time1 = block.getFieldValue('TIME1');
	var time2 = block.getFieldValue('TIME2');

	var code = {
		before: "",
		gencode: "",
		after: "",
		global: ""
	};

	code.gencode += 'timeInRange(' + time1 + '-' + time2;

	var monday = block.getFieldValue('MONDAY');
	if (!(monday === null)) {
		var tuesday = block.getFieldValue('TUESDAY');
		var wednesday = block.getFieldValue('WEDNESDAY');
		var thursday = block.getFieldValue('THURSDAY');
		var friday = block.getFieldValue('FRIDAY');
		var saturday = block.getFieldValue('SATURDAY');
		var sunday = block.getFieldValue('SUNDAY');

		var days = '';
		if (monday == 'TRUE') {
			days += 'mo';
		}
		if (tuesday == 'TRUE') {
			if (days != '') {
				days += ', ';
			}
			days += 'tu';
		}
		if (wednesday == 'TRUE') {
			if (days != '') {
				days += ', ';
			}
			days += 'we';
		}
		if (thursday == 'TRUE') {
			if (days != '') {
				days += ', ';
			}
			days += 'th';
		}
		if (friday == 'TRUE') {
			if (days != '') {
				days += ', ';
			}
			days += 'fr';
		}
		if (saturday == 'TRUE') {
			if (days != '') {
				days += ', ';
			}
			days += 'sa';
		}
		if (sunday == 'TRUE') {
			if (days != '') {
				days += ', ';
			}
			days += 'su';
		}

		if (days != '') {
			code.gencode += '|' + days;
		}
	}

	code.gencode += ')';

	return JSON.stringify(code);
};

 /* 
./scr.sh DATA_TIMEINRANGE "Time in range %1-%2" "Время в диапазоне %1-%2"
./scr.sh DATA_MUTATOR "Days of the week" "Дни недели"
./scr.sh DATA_MONDAY "Monday" "Понедельник"
./scr.sh DATA_TUESDAY "Tuesday" "Вторник"
./scr.sh DATA_WEDNESDAY "Wednesday" "Среда"
./scr.sh DATA_THURSDAY "Thursday" "Четверг"
./scr.sh DATA_FRIDAY "Friday" "Пятница"
./scr.sh DATA_SATURDAY "Saturday" "Суббота"
./scr.sh DATA_SUNDAY "Sunday" "Воскресенье"
./scr.sh DATA_WEEKDAY "Week day:" "День недели:"
"colour": "%{BKY_DATA_COLOUR}"
*/