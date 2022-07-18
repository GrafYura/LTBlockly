/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *	 http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Logic blocks for Blockly.
 *
 * This file is scraped to extract a .json file of block definitions. The array
 * passed to defineBlocksWithJsonArray(..) must be strict JSON: double quotes
 * only, no outside references, no functions, no trailing commas, etc. The one
 * exception is end-of-line comments, which the scraper will remove.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

goog.provide('Blockly.Blocks.logic');	// Deprecated
goog.provide('Blockly.Constants.Logic');
goog.require('Blockly.Blocks');
goog.require('Blockly');

function AddCompareBlock(_block, _input) {
	var cc = _block.getInput(_input).connection;
	if (!cc.isConnected()) {
		var block = _block.workspace.newBlock('logic_compare');
		//block.initSvg();
		//block.render();
		//block.childBlocks_.forEach(bl =>{
		//	bl.initSvg();
		//	bl.render();
		//});
		_block.childID = block.id;
		var ob = block.outputConnection;
		cc.connect(ob);
	}
}

function getScriptId() {
	var moduleId = parseInt($('#blockly_edit_module').val(), 10);
	if(typeof getAutoModulID == "function" && parseInt($('#blockly_edit_module').val(), 10) == -1)
    {
        var autoModuleId = getAutoModulID(el.blocklyModules);
        if(autoModuleId != "" && parseInt(autoModuleId, 10) > 0 && el.blocklyModules.indexOf(autoModuleId) != -1) moduleId = autoModuleId;
    }
    return moduleId;
}	

function getRandomVarName() {
	var text = "_";
	var possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 5; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

// Change condion with Flash return block from sys_read to different vars
function solveFlashReturnInCondition(code) {
	// Find count and indexes of Flash read
	var flashPositions = [];
	var lines = code.before.split('\n');
	for (let i = 0; i < lines.length; i++) {
		if (/^eeEmulRead\(.+&__sys_flash_read__/.test(lines[i])) {
			flashPositions.push(i);
		}
	}

	// If less then 2 flash reads - do nothing
	if (flashPositions.length < 2) {
		return code;
	}

	// If in conditions more then 1 flash read - change buff names
	var cellsNumbers = [];
	var buffers = ["__sys_flash_read__"];
	var buffCounter = 0;
	var newCode = {
		before: "",
		gencode: "",
		after: code.after,
		global: code.global
	};

	// Write before code and new vars names
	for (let i = 0; i < lines.length; i++) {
		let position = flashPositions.indexOf(i);
		if (position != -1) {
			let cellNumber = lines[i].match(/eeEmulRead\((\d+)/)[1];
			let cellIndex = cellsNumbers.indexOf(cellNumber);

			// if read cel is duplicate - get created buffer
			if (cellIndex != -1) {
				cellsNumbers.push(-1);
				buffers.push(buffers[cellIndex]);
				continue;
			} else {
				cellsNumbers.push(cellNumber);
			}

			var name = '__sys_flash_read__';
			if (position > 0) {
				// If __sys_flash_read__ is exist - add new name
				name = getRandomVarName();
				buffers.push(name);
				newCode.before += '\nu32 ' + name + ' = 0;\n';
			}

			newCode.before +=
				lines[i].replace('__sys_flash_read__', name) + '\n';
		} else {
			newCode.before += '\n' + lines[i] + '\n';
		}
	}
	// console.log(buffers);
	// Change buff names in gencode
	lines = code.gencode.split('\n');
	for (let i = 0; i < lines.length; i++) {
		if (/if {0,}.+__sys_flash_read__/.test(lines[i])) {
			// If it is a condition with __sys_flash_read__ - change
			// __sys_flash_read__ to new buffers names
			let line = lines[i];
			let index = line.indexOf('__sys_flash_read__');
			var newLine = "";

			while (index != -1) {
				// Change buff name
				line = line.replace('__sys_flash_read__', buffers[buffCounter]);
				// Add part o line to new line
				newLine += line.substring(0,
					index + buffers[buffCounter].length);
				// Cut line from changed buff name
				line = line.substring(index + buffers[buffCounter].length);
				// Find new index of __sys_flash_read__
				index = line.indexOf('__sys_flash_read__');

				// Use next buff name
				++buffCounter;
			}

			newCode.gencode += '\n' + newLine + line + '\n';
		} else {
			newCode.gencode += '\n' + lines[i] + '\n';
		}
	}
	// console.log(newCode);
	return newCode;
}

// Remove extra buffers
function removeNoUsedFlashBuffers(code) {
	// console.log(code);
	var lines = code.before.split('\n');
	var newCode = [];

	// Push used lines to newCode
	for (let i = 0; i < lines.length; i++) {
		var buffName = lines[i].match(/eeEmulRead\(.+\&(\w+)\)/);
		if (buffName) {
			buffName = buffName[1];
			if (!code.gencode.includes(buffName)
				&& buffName != '__sys_flash_read__') {
				newCode.pop();
			} else {
				newCode.push(lines[i]);
			}
		} else if (lines[i] != '') {
			newCode.push(lines[i]);
		}
	}

	// Create string from lines array
	var newBefore = "\n";
	for (let i = 0; i < newCode.length; i++) {
		newBefore += newCode[i] + '\n';
	}
	// console.log(newBefore);
	return {
		before: newBefore,
		gencode: code.gencode,
		after: code.after,
		global: code.global
	}
}

// Conver statement JSON to code dictionary
function JSONToCode(json) {
	var code = {
		before: "",
		gencode: "",
		after: "",
		global: ""
	};

	if (json != '') {
		var subJSON = json;
		var index = subJSON.indexOf('}{') + 1;
		var subCode;

		while (index != 0) {
			subCode = JSON.parse(subJSON.substring(0, index));
			code.gencode += '\n' + subCode.before + '\n'
				+ subCode.gencode + '\n' + subCode.after;
			code.global += '\n' + subCode.global + '\n';
			subJSON = subJSON.substring(index);
			index = subJSON.indexOf('}{') + 1;
		}

		subCode = JSON.parse(subJSON);
		code.gencode += '\n' + subCode.before + '\n'
			+ subCode.gencode + '\n' + subCode.after + '\n';
		code.global += '\n' + subCode.global + '\n';
	}

	return code;
}

function ControlsIfLeastner(event) {
	var evnt_block = Blockly.getMainWorkspace().getBlockById(event.blockId);
	if (evnt_block) {
		if (evnt_block.type == 'controls_if') {
			evnt_block.childID = null;
			if (evnt_block.getInput('IF0'))
				if (evnt_block.getInput('IF0').connection.isConnected())
					evnt_block.childID = evnt_block.getInputTargetBlock('IF0').id;
		}
	}else{
		Blockly.getMainWorkspace().getAllBlocks().forEach(block => {
			switch (block.type) {
				case 'controls_if':
					block.childID = null;
					if (block.getInput('IF0'))
						if (block.getInput('IF0').connection.isConnected())
							block.childID = block.getInputTargetBlock('IF0').id;
					break;
				default:
					break;
			}
		});
	}
}
function LogicLestener(event) {
	Blockly.getMainWorkspace().getAllBlocks().forEach(block => {
		switch (block.type) {
			case 'logic_compare':
				if (!block.outputConnection.isConnected()) {
					Blockly.getMainWorkspace().getAllBlocks().forEach(bl => {
						switch (bl.type) {
							case 'controls_if':
								if (bl.childID == block.id)
									block.dispose();
								break;
							default:
								break;
						}
					});
				}
				Blockly.getMainWorkspace().removeChangeListener(LogicLestener);
				break;
			default:
				break;
		}
	});
}
var convert2byte = function (value) {
	var intpart = parseInt(value, 10),
		fractpart = String(value);
	if(fractpart.indexOf('.') != -1){
		fractpart = fractpart.substring(fractpart.indexOf('.') + 1);
		if (fractpart.indexOf('.') + 2 == fractpart.length)
			fractpart += '0';
		fractpart = parseInt(fractpart, 10);
		fractpart = (fractpart * 250) / 100;
		fractpart = parseInt(fractpart, 10);
		if(parseInt(value, 10) < 0 || value < 0)
		{
			if(fractpart != 0)
			{
				--intpart;
			}
			if(intpart > 0)
				intpart *= -1;

		}
	}else{
		fractpart = 0;
	}
	return (intpart << 8) + fractpart;
},
if_buffer_excist_inside_own_stack = function (_block) {
	if (_block.hasOwnProperty('buffer')) {
		return true;
	} else {
		if (_block.getNextBlock()) {
			if (_block.hasOwnProperty('buffer')) {
				return true;
			} else {
				return if_buffer_excist_inside_own_stack(_block);
			}
		}
	}
	return false;
},
if_buffer_excist_inside_inputs = function (_block) {
	var inputs = _block.inputList, i = 0;
	while (inputs[i]) {
		if (if_buffer_excist_inside_own_stack(_block.getInputTargetBlock(inputs[i].name))) {
			return true;
		}
		++i;
	}
	return false;
}
/**
 * Unused constant for the common HSV hue for all blocks in this category.
 * @deprecated Use Blockly.Msg['LOGIC_HUE']. (2018 April 5)
 */
// https://static.thenounproject.com/png/718608-200.png
Blockly.Constants.Logic.HUE = 210;
Blockly.Blocks['logic_boolean'] = {
	init: function () {
		this.jsonInit({
			"type": "logic_boolean",
			"message0": "%2%1",
			"args0": [
				{
					"type": "field_dropdown",
					"name": "BOOL",
					"options": [
						["%{BKY_LOGIC_BOOLEAN_TRUE}", "1"],
						["%{BKY_LOGIC_BOOLEAN_FALSE}", "0"]
					]
				},
				{
					"type": "field_image",
					"src": "js/blockly/img/logic/logic.png",
					"width": 16,
					"height": 16,
					"alt": "*"
				}
			],
			"output": "Number",
			"colour": "%{BKY_LT_CATEGORY_COLOUR_LOGIC}",
			"tooltip": "%{BKY_LOGIC_BOOLEAN_TOOLTIP}",
			"helpUrl": "%{BKY_LOGIC_BOOLEAN_HELPURL}"
		});
	},
	output: "Number"
}
Blockly.Blocks['controls_if'] = {
	init: function () {
		this.jsonInit({
			"type": "controls_if",
			"message0": "%2%{BKY_CONTROLS_IF_MSG_IF} %1",
			"args0": [
				{
					"type": "input_value",
					"name": "IF0",
					"check": "Number"
				},
				{
					"type": "field_image",
					"src": "js/blockly/img/logic/logic.png",
					"width": 16,
					"height": 16,
					"alt": "*"
				}
			],
			"message1": "%{BKY_CONTROLS_IF_MSG_THEN} %1",
			"args1": [
				{
					"type": "input_statement",
					"name": "DO0"
				}
			],
			"previousStatement": null,
			"nextStatement": null,
			"colour": "%{BKY_LT_CATEGORY_COLOUR_LOGIC}",
			"helpUrl": "%{BKY_CONTROLS_IF_HELPURL}",
			"mutator": "controls_if_mutator",
			"extensions": ["controls_if_tooltip"]
		});
		if (this.workspace == Blockly.getMainWorkspace()) {
			if (!Blockly.getMainWorkspace().listeners_.includes(LogicLestener))
				Blockly.getMainWorkspace().addChangeListener(LogicLestener);
			if (!Blockly.getMainWorkspace().listeners_.includes(ControlsIfLeastner))
				Blockly.getMainWorkspace().addChangeListener(ControlsIfLeastner);
		}

	},
	buffer: null
}
Blockly.defineBlocksWithJsonArray([	// BEGIN JSON EXTRACT
	// Block for boolean data type: true and false.
	// Block for if/elseif/else condition.

	// If/else block that does not use a mutator.
	{
		"type": "controls_ifelse",
		"message0": "%{BKY_CONTROLS_IF_MSG_IF} %1",
		"args0": [
			{
				"type": "input_value",
				"name": "IF0",
				"check": "Number"
			}
		],
		"message1": "%{BKY_CONTROLS_IF_MSG_THEN} %1",
		"args1": [
			{
				"type": "input_statement",
				"name": "DO0"
			}
		],
		"message2": "%{BKY_CONTROLS_IF_MSG_ELSE} %1",
		"args2": [
			{
				"type": "input_statement",
				"name": "ELSE"
			}
		],
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_LOGIC}",
		"tooltip": "%{BKYCONTROLS_IF_TOOLTIP_2}",
		"helpUrl": "%{BKY_CONTROLS_IF_HELPURL}",
		"extensions": ["controls_if_tooltip"]
	},
	// Block for negation.
	{
		"type": "logic_negate",
		"message0": "%{BKY_LOGIC_NEGATE_TITLE}",
		"args0": [
			{
				"type": "input_value",
				"name": "BOOL",
				"check": "Number"
			}
		],
		"output": "Number",
		"colour": "%{BKY_LT_CATEGORY_COLOUR_LOGIC}",
		"tooltip": "%{BKY_LOGIC_NEGATE_TOOLTIP}",
		"helpUrl": "%{BKY_LOGIC_NEGATE_HELPURL}"
	},
	// Block for null data type.
	{
		"type": "logic_null",
		"message0": "%{BKY_LOGIC_NULL}",
		"output": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_LOGIC}",
		"tooltip": "%{BKY_LOGIC_NULL_TOOLTIP}",
		"helpUrl": "%{BKY_LOGIC_NULL_HELPURL}"
	},
	// Block for ternary operator.
	{
		"type": "logic_ternary",
		"message0": "%{BKY_LOGIC_TERNARY_CONDITION} %1",
		"args0": [
			{
				"type": "input_value",
				"name": "IF",
				"check": "Number"
			}
		],
		"message1": "%{BKY_LOGIC_TERNARY_IF_TRUE} %1",
		"args1": [
			{
				"type": "input_value",
				"name": "THEN"
			}
		],
		"message2": "%{BKY_LOGIC_TERNARY_IF_FALSE} %1",
		"args2": [
			{
				"type": "input_value",
				"name": "ELSE"
			}
		],
		"output": null,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_LOGIC}",
		"tooltip": "%{BKY_LOGIC_TERNARY_TOOLTIP}",
		"helpUrl": "%{BKY_LOGIC_TERNARY_HELPURL}",
		"extensions": ["logic_ternary"]
	}
]
	//appendShadowBlock(this, "A", "logic_compare_operand_a_helper");
	//appendShadowBlock(this, "B", "logic_compare_operand_b_helper");
);	// END JSON EXTRACT (Do not delete this comment.)

Blockly.Blocks['logic_compare'] = {
	init: function () {
		this.jsonInit({
			"message0": "%4%1 %2 %3",
			"args0": [
				{
					"type": "input_value",
					"name": "A"
				},
				{
					"type": "field_dropdown",
					"name": "OP",
					"options": [
						["=", "EQ"],
						["\u2260", "NEQ"],
						["\u200F<", "LT"],
						["\u200F\u2264", "LTE"],
						["\u200F>", "GT"],
						["\u200F\u2265", "GTE"]
					]
				},
				{
					"type": "input_value",
					"name": "B"
				},
				{
					"type": "field_image",
					"src": "js/blockly/img/logic/logic.png",
					"width": 16,
					"height": 16,
					"alt": "*"
				}
			],
			"inputsInline": true,
			"output": "Number",
			"colour": "%{BKY_LT_CATEGORY_COLOUR_LOGIC}",
			"helpUrl": "%{BKY_LOGIC_COMPARE_HELPURL}",
			"extensions": ["logic_compare", "logic_op_tooltip"]
		});
		appendShadowBlock(this, "A", "logic_compare_operand_a_helper");
		appendShadowBlock(this, "B", "logic_compare_operand_b_helper");
	},
	output: "Number"
};

Blockly.Blocks['logic_operation'] = {
	init: function () {
		this.jsonInit({
			"message0": "%4%1 %2 %3",
			"args0": [
				{
					"type": "input_value",
					"name": "A",
					"check": null
				},
				{
					"type": "field_dropdown",
					"name": "OP",
					"options": [
						["%{BKY_LOGIC_OPERATION_AND}", "AND"],
						["%{BKY_LOGIC_OPERATION_OR}", "OR"]
					]
				},
				{
					"type": "input_value",
					"name": "B",
					"check": null
				},
				{
					"type": "field_image",
					"src": "js/blockly/img/logic/logic.png",
					"width": 16,
					"height": 16,
					"alt": "*"
				}
			],
			"inputsInline": true,
			"output": "Number",
			"colour": "%{BKY_LT_CATEGORY_COLOUR_LOGIC}",
			"helpUrl": "%{BKY_LOGIC_OPERATION_HELPURL}",
			"extensions": ["logic_op_tooltip"]
		});
		appendShadowBlock(this, "A", "logic_operation_operand_a_helper");
		appendShadowBlock(this, "B", "logic_operation_operand_b_helper");
	},
	output: "Number"
};


Blockly.defineBlocksWithJsonArray([ // Mutator blocks. Do not extract.
	// Block representing the if statement in the controls_if mutator.
	{
		"type": "controls_if_if",
		"message0": "%{BKY_CONTROLS_IF_IF_TITLE_IF}",
		"nextStatement": null,
		"enableContextMenu": false,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_LOGIC}",
		"tooltip": "%{BKY_CONTROLS_IF_IF_TOOLTIP}"
	},
	// Block representing the else-if statement in the controls_if mutator.
	{
		"type": "controls_if_elseif",
		"message0": "%{BKY_CONTROLS_IF_ELSEIF_TITLE_ELSEIF}",
		"previousStatement": null,
		"nextStatement": null,
		"enableContextMenu": false,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_LOGIC}",
		"tooltip": "%{BKY_CONTROLS_IF_ELSEIF_TOOLTIP}"
	},
	// Block representing the else statement in the controls_if mutator.
	{
		"type": "controls_if_else",
		"message0": "%{BKY_CONTROLS_IF_ELSE_TITLE_ELSE}",
		"previousStatement": null,
		"enableContextMenu": false,
		"colour": "%{BKY_LT_CATEGORY_COLOUR_LOGIC}",
		"tooltip": "%{BKY_CONTROLS_IF_ELSE_TOOLTIP}"
	}
]);

/**
 * Tooltip text, keyed by block OP value. Used by logic_compare and
 * logic_operation blocks.
 * @see {Blockly.Extensions#buildTooltipForDropdown}
 * @package
 * @readonly
 */
Blockly.Constants.Logic.TOOLTIPS_BY_OP = {
	// logic_compare
	'EQ': '%{BKY_LOGIC_COMPARE_TOOLTIP_EQ}',
	'NEQ': '%{BKY_LOGIC_COMPARE_TOOLTIP_NEQ}',
	'LT': '%{BKY_LOGIC_COMPARE_TOOLTIP_LT}',
	'LTE': '%{BKY_LOGIC_COMPARE_TOOLTIP_LTE}',
	'GT': '%{BKY_LOGIC_COMPARE_TOOLTIP_GT}',
	'GTE': '%{BKY_LOGIC_COMPARE_TOOLTIP_GTE}',

	// logic_operation
	'AND': '%{BKY_LOGIC_OPERATION_TOOLTIP_AND}',
	'OR': '%{BKY_LOGIC_OPERATION_TOOLTIP_OR}'
};

Blockly.Extensions.register('logic_op_tooltip',
	Blockly.Extensions.buildTooltipForDropdown(
		'OP', Blockly.Constants.Logic.TOOLTIPS_BY_OP));

/**
 * Mutator methods added to controls_if blocks.
 * @mixin
 * @augments Blockly.Block
 * @package
 * @readonly
 */
Blockly.Constants.Logic.CONTROLS_IF_MUTATOR_MIXIN = {
	elseifCount_: 0,
	elseCount_: 0,

	/**
	 * Create XML to represent the number of else-if and else inputs.
	 * @return {Element} XML storage element.
	 * @this Blockly.Block
	 */
	mutationToDom: function () {
		if (!this.elseifCount_ && !this.elseCount_) {
			return null;
		}
		var container = document.createElement('mutation');
		if (this.elseifCount_) {
			container.setAttribute('elseif', this.elseifCount_);
		}
		if (this.elseCount_) {
			container.setAttribute('else', 1);
		}
		return container;
	},
	/**
	 * Parse XML to restore the else-if and else inputs.
	 * @param {!Element} xmlElement XML storage element.
	 * @this Blockly.Block
	 */
	domToMutation: function (xmlElement) {
		this.elseifCount_ = parseInt(xmlElement.getAttribute('elseif'), 10) || 0;
		this.elseCount_ = parseInt(xmlElement.getAttribute('else'), 10) || 0;
		this.updateShape_();
	},
	/**
	 * Populate the mutator's dialog with this block's components.
	 * @param {!Blockly.Workspace} workspace Mutator's workspace.
	 * @return {!Blockly.Block} Root block in mutator.
	 * @this Blockly.Block
	 */
	decompose: function (workspace) {
		var containerBlock = workspace.newBlock('controls_if_if');
		containerBlock.initSvg();
		var connection = containerBlock.nextConnection;
		for (var i = 1; i <= this.elseifCount_; i++) {
			var elseifBlock = workspace.newBlock('controls_if_elseif');
			elseifBlock.initSvg();
			connection.connect(elseifBlock.previousConnection);
			connection = elseifBlock.nextConnection;
		}
		if (this.elseCount_) {
			var elseBlock = workspace.newBlock('controls_if_else');
			elseBlock.initSvg();
			connection.connect(elseBlock.previousConnection);
		}
		return containerBlock;
	},
	/**
	 * Reconfigure this block based on the mutator dialog's components.
	 * @param {!Blockly.Block} containerBlock Root block in mutator.
	 * @this Blockly.Block
	 */
	compose: function (containerBlock) {
		var clauseBlock = containerBlock.nextConnection.targetBlock();
		// Count number of inputs.
		this.elseifCount_ = 0;
		this.elseCount_ = 0;
		var valueConnections = [null];
		var statementConnections = [null];
		var elseStatementConnection = null;
		while (clauseBlock) {
			switch (clauseBlock.type) {
				case 'controls_if_elseif':
					this.elseifCount_++;
					valueConnections.push(clauseBlock.valueConnection_);
					statementConnections.push(clauseBlock.statementConnection_);
					break;
				case 'controls_if_else':
					this.elseCount_++;
					elseStatementConnection = clauseBlock.statementConnection_;
					break;
				default:
					throw new TypeError('Unknown block type: ' + clauseBlock.type);
			}
			clauseBlock = clauseBlock.nextConnection &&
				clauseBlock.nextConnection.targetBlock();
		}
		this.updateShape_();
		// Reconnect any child blocks.
		for (var i = 1; i <= this.elseifCount_; i++) {
			Blockly.Mutator.reconnect(valueConnections[i], this, 'IF' + i);
			Blockly.Mutator.reconnect(statementConnections[i], this, 'DO' + i);
		}
		Blockly.Mutator.reconnect(elseStatementConnection, this, 'ELSE');
	},
	/**
	 * Store pointers to any connected child blocks.
	 * @param {!Blockly.Block} containerBlock Root block in mutator.
	 * @this Blockly.Block
	 */
	saveConnections: function (containerBlock) {
		var clauseBlock = containerBlock.nextConnection.targetBlock();
		var i = 1;
		while (clauseBlock) {
			switch (clauseBlock.type) {
				case 'controls_if_elseif':
					var inputIf = this.getInput('IF' + i);
					var inputDo = this.getInput('DO' + i);
					clauseBlock.valueConnection_ =
						inputIf && inputIf.connection.targetConnection;
					clauseBlock.statementConnection_ =
						inputDo && inputDo.connection.targetConnection;
					i++;
					break;
				case 'controls_if_else':
					var inputDo = this.getInput('ELSE');
					clauseBlock.statementConnection_ =
						inputDo && inputDo.connection.targetConnection;
					break;
				default:
					throw new TypeError('Unknown block type: ' + clauseBlock.type);
			}
			clauseBlock = clauseBlock.nextConnection &&
				clauseBlock.nextConnection.targetBlock();
		}
	},
	/**
	 * Modify this block to have the correct number of inputs.
	 * @this Blockly.Block
	 * @private
	 */
	updateShape_: function () {
		// Delete everything.
		if (this.getInput('ELSE')) {
			this.removeInput('ELSE');
		}
		var i = 1;
		while (this.getInput('IF' + i)) {
			this.removeInput('IF' + i);
			this.removeInput('DO' + i);
			i++;
		}
		// Rebuild block.
		for (var i = 1; i <= this.elseifCount_; i++) {
			this.appendValueInput('IF' + i)
				.setCheck('Number')
				.appendField(Blockly.Msg['CONTROLS_IF_MSG_ELSEIF']);
			this.appendStatementInput('DO' + i)
				.appendField(Blockly.Msg['CONTROLS_IF_MSG_THEN']);
			//AddCompareBlock(this,'IF' + i);
		}
		if (this.elseCount_) {
			this.appendStatementInput('ELSE')
				.appendField(Blockly.Msg['CONTROLS_IF_MSG_ELSE']);
		}
	}
};

Blockly.Extensions.registerMutator('controls_if_mutator',
	Blockly.Constants.Logic.CONTROLS_IF_MUTATOR_MIXIN, null,
	['controls_if_elseif', 'controls_if_else']);
/**
 * "controls_if" extension function. Adds mutator, shape updating methods, and
 * dynamic tooltip to "controls_if" blocks.
 * @this Blockly.Block
 * @package
 */
Blockly.Constants.Logic.CONTROLS_IF_TOOLTIP_EXTENSION = function () {

	this.setTooltip(function () {
		if (!this.elseifCount_ && !this.elseCount_) {
			return Blockly.Msg['CONTROLS_IF_TOOLTIP_1'];
		} else if (!this.elseifCount_ && this.elseCount_) {
			return Blockly.Msg['CONTROLS_IF_TOOLTIP_2'];
		} else if (this.elseifCount_ && !this.elseCount_) {
			return Blockly.Msg['CONTROLS_IF_TOOLTIP_3'];
		} else if (this.elseifCount_ && this.elseCount_) {
			return Blockly.Msg['CONTROLS_IF_TOOLTIP_4'];
		}
		return '';
	}.bind(this));
};

Blockly.Extensions.register('controls_if_tooltip',
	Blockly.Constants.Logic.CONTROLS_IF_TOOLTIP_EXTENSION);

/**
 * Adds dynamic type validation for the left and right sides of a logic_compare
 * block.
 * @mixin
 * @augments Blockly.Block
 * @package
 * @readonly
 */
Blockly.Constants.Logic.LOGIC_COMPARE_ONCHANGE_MIXIN = {
	/**
	 * Called whenever anything on the workspace changes.
	 * Prevent mismatched types from being compared.
	 * @param {!Blockly.Events.Abstract} e Change event.
	 * @this Blockly.Block
	 */
	onchange: function (e) {
		if (!this.prevBlocks_) {
			this.prevBlocks_ = [null, null];
		}

		var blockA = this.getInputTargetBlock('A');
		var blockB = this.getInputTargetBlock('B');
		// Disconnect blocks that existed prior to this change if they don't match.
		if (blockA && blockB &&
			!blockA.outputConnection.checkType_(blockB.outputConnection)) {
			// Mismatch between two inputs.	Revert the block connections,
			// bumping away the newly connected block(s).
			Blockly.Events.setGroup(e.group);
			var prevA = this.prevBlocks_[0];
			if (prevA !== blockA) {
				blockA.unplug();
				if (prevA && !prevA.isShadow()) {
					// The shadow block is automatically replaced during unplug().
					this.getInput('A').connection.connect(prevA.outputConnection);
				}
			}
			var prevB = this.prevBlocks_[1];
			if (prevB !== blockB) {
				blockB.unplug();
				if (prevB && !prevB.isShadow()) {
					// The shadow block is automatically replaced during unplug().
					this.getInput('B').connection.connect(prevB.outputConnection);
				}
			}
			this.bumpNeighbours_();
			Blockly.Events.setGroup(false);
		}
		this.prevBlocks_[0] = this.getInputTargetBlock('A');
		this.prevBlocks_[1] = this.getInputTargetBlock('B');
	}
};

/**
 * "logic_compare" extension function. Adds type left and right side type
 * checking to "logic_compare" blocks.
 * @this Blockly.Block
 * @package
 * @readonly
 */
Blockly.Constants.Logic.LOGIC_COMPARE_EXTENSION = function () {
	// Add onchange handler to ensure types are compatible.
	this.mixin(Blockly.Constants.Logic.LOGIC_COMPARE_ONCHANGE_MIXIN);
};

Blockly.Extensions.register('logic_compare',
	Blockly.Constants.Logic.LOGIC_COMPARE_EXTENSION);

/**
 * Adds type coordination between inputs and output.
 * @mixin
 * @augments Blockly.Block
 * @package
 * @readonly
 */
Blockly.Constants.Logic.LOGIC_TERNARY_ONCHANGE_MIXIN = {
	prevParentConnection_: null,

	/**
	 * Called whenever anything on the workspace changes.
	 * Prevent mismatched types.
	 * @param {!Blockly.Events.Abstract} e Change event.
	 * @this Blockly.Block
	 */
	onchange: function (e) {
		var blockA = this.getInputTargetBlock('THEN');
		var blockB = this.getInputTargetBlock('ELSE');
		var parentConnection = this.outputConnection.targetConnection;
		// Disconnect blocks that existed prior to this change if they don't match.
		if ((blockA || blockB) && parentConnection) {
			for (var i = 0; i < 2; i++) {
				var block = (i == 1) ? blockA : blockB;
				if (block && !block.outputConnection.checkType_(parentConnection)) {
					// Ensure that any disconnections are grouped with the causing event.
					Blockly.Events.setGroup(e.group);
					if (parentConnection === this.prevParentConnection_) {
						this.unplug();
						parentConnection.getSourceBlock().bumpNeighbours_();
					} else {
						block.unplug();
						block.bumpNeighbours_();
					}
					Blockly.Events.setGroup(false);
				}
			}
		}
		this.prevParentConnection_ = parentConnection;
	}
};

Blockly.Extensions.registerMixin('logic_ternary',
	Blockly.Constants.Logic.LOGIC_TERNARY_ONCHANGE_MIXIN);
var isInteger = function (value) {
	if (value == parseInt(value))
		return true;
	return false;
},
InputType = function (block, value, input) {
	var type;
	if (!isNaN(value)) {
		type = "integer";
		value = parseFloat(value);
		if (!isInteger(value)) {
			type = "float";
		}
	}
	else {
		if (block.getInputTargetBlock(input))
			if (/\d{1,3}:\d+$/.test(value)) {
				type = blocklyGetDeviceType('[addr="' + value.match(/\d{1,3}:\d+$/)[0] + '"]');
				if(!type.length)
					return 'nofound';
				if (type.indexOf('sensor') != -1)
					if (type.indexOf('leak') == -1 && type.indexOf('door') == -1 && type.indexOf('co2') == -1)
						type = "sensor";
					else if (type.indexOf('door') >= 0)
						type = "door";
					else if (type.indexOf('co2') >= 0)
						type = "co2";
					else
						type = "device";
				else
					type = "device";
			}
			else
				type = "var";
		else {
			if (/\d{1,3}:\d+$/.test(value)) {
				type = blocklyGetDeviceType('[addr="' + value.match(/\d{1,3}:\d+$/)[0] + '"]');
				if(!type.length)
					return 'nofound';
				if (type.indexOf('sensor') != -1)
					if (type.indexOf('door') == -1 && type.indexOf('leak') == -1 && type.indexOf('co2') == -1)
						type = "sensor";
					else if (type.indexOf('co2') >= 0)
						type = "co2";
					else{
						if (type.indexOf('com-port') == -1 && type.indexOf('ir') == -1)
							type = "device";
						else
							type = "nondevice";
					}
				else {
					if (type.indexOf('com-port') == -1 && type.indexOf('ir') == -1)
						type = "device";
					else
						type = "nondevice";
				}
			}
			else
				type = "var";
		}
	}
	if (type == 'device' && !input) {
		if (blocklyGetDeviceType('[addr="' + value.match(/\d{1,3}:\d+$/)[0] + '"]').indexOf('switch') >= 0)
			type = 'switch';
		else if (blocklyGetDeviceType('[addr="' + value.match(/\d{1,3}:\d+$/)[0] + '"]').indexOf('speaker') >= 0)
				type = 'speaker';
		else if (blocklyGetDeviceType('[addr="' + value.match(/\d{1,3}:\d+$/)[0] + '"]').indexOf('door') >= 0)
				type = 'door';
	}
	return type;
};
Blockly.JavaScript['logic_boolean'] = function (block) {
	// Search the text for a substring.
	var bool = block.getFieldValue('BOOL');
	var code = {
		before: "",
		gencode: bool,
		after: "",
		global: ""
	};
	return JSON.stringify(code);
};

Blockly.JavaScript['logic_operation'] = function (block) {
	// Search the text for a substring.
	var a = JSON.parse(Blockly.JavaScript.statementToCode(block, 'A')),
		bool = block.getFieldValue('OP'),
		b = JSON.parse(Blockly.JavaScript.statementToCode(block, 'B')),
		typea = InputType(block, a.gencode, "A"),
		typeb = InputType(block, b.gencode, "B");
	switch (typea) {
		case "door":
		case "device":
			a.gencode = '([' + a.gencode + '.0]&7)';
			break;
		case "sensor":
		case "co2":
				a.gencode = '(i16)[' + a.gencode + ']';
			break;
		case "float":
			a.gencode = convert2byte(a.gencode);
			break;
		default:
			if (typeb == "sensor" || typeb == "float")
				b.gencode = convert2byte(b.gencode);
			break;
	}
	switch (typeb) {
		case "door":
		case "device":
			b.gencode = '([' + b.gencode + '.0]&7)';
			break;
		case "co2":
		case "sensor":
				b.gencode = '(i16)[' + b.gencode + ']';
			break;
		case "float":
			b.gencode = convert2byte(b.gencode);
			break;
		default:
			if (typea == "sensor" || typea == "float")
				b.gencode = convert2byte(b.gencode);
			break;
	}
	switch (bool) {
		case 'AND':
			bool = '&&';
			break;
		case 'OR':
			bool = '||';
			break;
	}
	var code = {
		before: '\n' + a.before + '\n' + b.before + '\n',
		gencode: '',
		after: '\n' + a.after + '\n' + b.after + '\n',
		global: '\n' + a.global + '\n' + b.global
	};

	if (/^-{0,1}\d+$/.test(a.gencode) && /^-{0,1}\d+$/.test(b.gencode)) {
		a = parseFloat(a.gencode);
		b = parseFloat(b.gencode);
		let result = 0;
		switch (bool) {
			case "&&":
				result = a && b ? '1' : '0';
				break;
			case "||":
				result = a || b ? '1' : '0';
				break;
		}
		code.gencode = result;
	} else {
		code.gencode = '(' + a.gencode + ' ' + bool + ' ' + b.gencode + ')';
	}

	// console.log(code);
	return JSON.stringify(code);
};

Blockly.JavaScript['logic_compare'] = function (block) {
	// Search the text for a substring.
	var a = JSON.parse(Blockly.JavaScript.statementToCode(block, 'A')),
		bool = block.getFieldValue('OP'),
		b = JSON.parse(Blockly.JavaScript.statementToCode(block, 'B')),
		typea = InputType(block, a.gencode, "A"),
		typeb = InputType(block, b.gencode, "B");
	switch (typea) {
		case "door":
		case "device":
			a.gencode = '([' + a.gencode + '.0]&7)';
			break;
		case "co2":
		case "sensor":
				a.gencode = '(i16)[' + a.gencode + ']';
			break;
		case "float":
			a.gencode = convert2byte(a.gencode);
			break;
		default:
			if (typeb == "sensor" || typeb == "float")
				b.gencode = convert2byte(b.gencode);
			break;
	}
	switch (typeb) {
		case "door":
		case "device":
			b.gencode = '([' + b.gencode + '.0]&7)';
			break;
		case "co2":
		case "sensor":
				b.gencode = '(i16)[' + b.gencode + ']';
			break;
		case "float":
			b.gencode = convert2byte(b.gencode);
			break;
		default:
			if (typea == "sensor" || typea == "float")
				b.gencode = convert2byte(b.gencode);
			break;
	}
	switch (bool) {
		case "EQ":
			bool = '==';
			break;
		case "NEQ":
			bool = '!=';
			break;
		case "LT":
			bool = '<';
			break;
		case "LTE":
			bool = '<=';
			break;
		case "GT":
			bool = '>';
			break;
		case "GTE":
			bool = '>=';
			break;
	}
	var code = {
		before: '\n' + a.before + '\n' + b.before + '\n',
		gencode: '',
		after: '\n' + a.after + '\n' + b.after + '\n',
		global: '\n' + a.global + '\n' + b.global
	};

	if (a.gencode == b.gencode && a.before == b.before
		&& a.after == b.after && a.global == b.global) {
		if (bool.includes('=') && !bool.includes('!')) {
			code.gencode = '1';
		} else {
			code.gencode = '0';
		}
	} else if (/^-{0,1}\d+$/.test(a.gencode)
		&& /^-{0,1}\d+$/.test(b.gencode)) {
		a = parseFloat(a.gencode);
		b = parseFloat(b.gencode);
		let result = 0;
		switch (bool) {
			case "==":
				result = a == b ? '1' : '0';
				break;
			case "!=":
				result = a != b ? '1' : '0';
				break;
			case "<":
				result = a < b ? '1' : '0';
				break;
			case "<=":
				result = a <= b ? '1' : '0';
				break;
			case ">":
				result = a > b ? '1' : '0';
				break;
			case ">=":
				result = a >= b ? '1' : '0';
				break;
		}
		code.gencode = result;
	} else {
		code.gencode = '(' + a.gencode + ' ' + bool + ' ' + b.gencode + ')';
	}
	// console.log(code);
	return JSON.stringify(code);
};

Blockly.JavaScript['controls_if'] = function (block) {
	var logicTree = {
		condition: [],
		statement: []
	};

	// get all if and else if blocks
	for (let i = 0; block.getInput('IF' + i); i++) {
		try {
			logicTree.condition.push(
				JSON.parse(Blockly.JavaScript.statementToCode(block, 'IF' + i)));
		} catch (err) {
			throw Blockly.Msg["LT_ERROR_EMPTY_IF_ALLERT"] + ' ' + block.type;
		}

		logicTree.statement.push(JSONToCode(
			Blockly.JavaScript.statementToCode(block, 'DO' + i)));
	}

	// is have else block
	var elseBlock = block.getInput('ELSE');
	if (elseBlock) {
		elseBlock = JSONToCode(
			Blockly.JavaScript.statementToCode(block, 'ELSE'));
	}

	var code = {
		before: "",
		gencode: "",
		after: "",
		global: ""
	};

	var isIfExist = false;
	var isWrite = true;
	var used = new Array(logicTree.condition.length);
	for (let i = 0; i < used.length; i++) {
		used[i] = false;
	}
	// write if and elif code
	for (let i = 0; isWrite && i < logicTree.condition.length; i++) {
		let isNoZero = logicTree.condition[i].gencode.match(/^(\d+)$/);
		// if condition is false - remove
		if (isNoZero && isNoZero[1] == '0') {
			continue;
		}

		// if statement is empty - remove
		if (!/\w/.test(logicTree.statement[i].gencode)) {
			if (isNoZero && isNoZero[1] != '0') {
				isWrite = false;
			}
			continue;
		}

		if (/^\d+$/.test(logicTree.condition[i].gencode)
			&& isNoZero && isNoZero[1] != '0') {
			// if true - write and remove next logic code
			if (isIfExist) {
				// + else
				code.gencode += ' else {\n' + logicTree.statement[i].before
					+ '\n' + logicTree.statement[i].gencode + '\n'
					+ logicTree.statement[i].after + '\n} ';
			} else {
				// + if
				code.gencode = '\n' + logicTree.statement[i].before
					+ '\n' + logicTree.statement[i].gencode + '\n'
					+ logicTree.statement[i].after + '\n';
			}

			isWrite = false;
		} else {
			// if it is condition - write
			if (isIfExist) {
				// + elif
				code.gencode += ' else if ('
					+ logicTree.condition[i].gencode + ') {\n'
					+ logicTree.statement[i].before + '\n'
					+ logicTree.statement[i].gencode + '\n'
					+ logicTree.statement[i].after + '\n}';
			} else {
				// + if
				code.gencode += '\nif ('
					+ logicTree.condition[i].gencode + ') {\n'
					+ logicTree.statement[i].before + '\n'
					+ logicTree.statement[i].gencode + '\n'
					+ logicTree.statement[i].after + '\n}';
				isIfExist = true;
			}

		}

		used[i] = true;
		// add global code
		// code.global += '\n' + logicTree.condition[i].global + '\n';
		// code.global += '\n' + logicTree.statement[i].global + '\n';

		// add before code
		// code.before += '\n' + logicTree.condition[i].before + '\n';
		// code.before += '\n' + logicTree.statement[i].before + '\n';
	}

	 if (block.buffer && !if_previous_buffer_exsist(block)) {
	 	code.gencode = '\nu8 ' + block.buffer + '[100];\n' + code.gencode;
	 }

	// add before and globals
	for (let i = 0; i < used.length; i++) {
		if (used[i]) {
			// add global code
			code.global += '\n' + logicTree.condition[i].global + '\n';
			code.global += '\n' + logicTree.statement[i].global + '\n';

			// add before code
			code.before += '\n' + logicTree.condition[i].before + '\n';
		}
	}

	// Check for buffers
	for (let i = 0; i < logicTree.condition.length; i++) {
		if (!used[i] && /[ui][81632]{1,2} {1,}\*{0,1} {0,}\w+/.test(
			logicTree.condition[i].before)) {
			let lines = logicTree.condition[i].before.split('\n');
			lines.forEach(line => {
				if (/[ui][81632]{1,2} {1,}\*{0,1} {0,}\w+/.test(line)) {
					code.before = '\n' + line + '\n' + code.before + '\n';
					return;
				}
			});
			break;
		}
	}

	// write else block if need
	if (isWrite && elseBlock) {
		if (isIfExist) {
			code.gencode += ' else {\n' + elseBlock.before + '\n'
				+ elseBlock.gencode + '\n' + elseBlock.after + '\n}';
		} else {
			code.gencode += '\n' + elseBlock.before + '\n'
				+ elseBlock.gencode + '\n' + elseBlock.after;
		}

		code.global += '\n' + elseBlock.global + '\n';
	}

	// Add buffers for flash read if its need
	// console.log(code);
	code = solveFlashReturnInCondition(code);
	// console.log(code);
	code = removeNoUsedFlashBuffers(code);
	// console.log(code);

	code.gencode += '\n';

	return JSON.stringify(code);

	var condition = [], dosmth = [], parser = [], else_do = [];
	var else_ = Blockly.JavaScript.statementToCode(block, 'ELSE');
	if (else_) {
		while (else_.indexOf("}{") != -1) {
			else_do.push(JSON.parse(else_.substring(0, else_.indexOf("}{") + 1)));
			else_ = else_.substring(else_.indexOf("}{") + 1);
		}
		else_do.push(JSON.parse(else_));
	}
	var i = 0, j = 0, code = {
		before: "",
		gencode: "",
		after: "",
		global: ""
	};
	while (block.getInput('IF' + i)) {
		try {
			condition.push(JSON.parse(Blockly.JavaScript.statementToCode(block, 'IF' + i)));
		} catch (err) {
			throw Blockly.Msg["ERROR_EMPTY_IF_ALLERT"] + ' ' + block.type;
		}
		if (block.getInput('DO' + i))
			if (Blockly.JavaScript.statementToCode(block, 'DO' + i) != "")
				dosmth.push(Blockly.JavaScript.statementToCode(block, 'DO' + i));
			else
				dosmth.push(JSON.stringify(code));
		else
			dosmth.push(JSON.stringify(code));
		++i;
	}
	i = 0;
	while (dosmth[i]) {
		parser[i] = [];
		while (dosmth[i].indexOf("}{") != -1) {
			parser[i].push(JSON.parse(dosmth[i].substring(0, dosmth[i].indexOf("}{") + 1)));
			dosmth[i] = dosmth[i].substring(dosmth[i].indexOf("}{") + 1);
			++j;
		}
		parser[i].push(JSON.parse(dosmth[i]));
		++i;
	}
	i = 0;
	var beforeCode = "\n",
		afterCode = "\n",
		globalCode = "\n";
	if (block.buffer && !if_previous_buffer_exsist(block)) {
		code.gencode += 'u8 ' + block.buffer + '[100];';
	}
	if (condition[i].before != '')
		beforeCode += condition[i].before + '\n';
	if (condition[i].after != '')
		afterCode += condition[i].after + '\n';
	if (condition[i].global != '')
		globalCode += condition[i].global + '\n';

	code.gencode += '\nif (' + condition[i].gencode + ') {\n';
	var dohelper = "";
	j = 0;
	while (parser[i][j]) {
		code.global += parser[i][j].global;
		dohelper += parser[i][j].before + parser[i][j].gencode + parser[i][j].after;
		++j;
	}
	code.gencode += dohelper + '\n}';
	++i;
	while (condition[i]) {
		dohelper = "";
		if (condition[i].before != '')
			beforeCode += condition[i].before + '\n';
		if (condition[i].after != '')
			afterCode += condition[i].after + '\n';
		if (condition[i].global != '')
			globalCode += condition[i].global + '\n';
		code.gencode += ' else if (' + condition[i].gencode + ') {\n';
		j = 0;
		while (parser[i][j]) {
			//alert("parser["+ i + "][" + j + "]=" + parser[i][j].global);
			code.global += parser[i][j].global;
			dohelper += parser[i][j].before + parser[i][j].gencode + parser[i][j].after;
			++j;
		}
		//alert("helper = " + dohelper);
		code.gencode += dohelper + '\n}';
		++i;
	}
	i = 0;
	if (else_) {
		code.gencode += ' else {\n';
		while (else_do[i]) {
			code.global += else_do[i].global;
			code.gencode += else_do[i].before + else_do[i].gencode + else_do[i].after;
			i++;
		}
		code.gencode += '\n}';
	}

	code.gencode = beforeCode + code.gencode + afterCode;
	code.global += globalCode;

	return JSON.stringify(code);
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Blockly.Blocks['logic_compare_operand_a_helper'] = {
	init: function () {
		this.jsonInit({
			"message0": "%1",
			"args0": [
				{
					"type": "field_number",
					"name": "VALUE",
					"value": 11

				}
			],
			"output": "Number",
			"colour": "%{BKY_LT_CATEGORY_COLOUR_LOGIC}"
		});;
	}
};

Blockly.JavaScript['logic_compare_operand_a_helper'] = function (block) {
	// Search the text for a substring.
	var value = block.getFieldValue('VALUE');

	var code = {
		before: "",
		gencode: value,
		after: "",
		global: ""
	};

	return JSON.stringify(code);
};

Blockly.Blocks['logic_compare_operand_b_helper'] = {
	init: function () {
		this.jsonInit({
			"message0": "%1",
			"args0": [
				{
					"type": "field_number",
					"name": "VALUE",
					"value": 27

				}
			],
			"output": "Number",
			"colour": "%{BKY_LT_CATEGORY_COLOUR_LOGIC}"
		});;
	}
};

Blockly.JavaScript['logic_compare_operand_b_helper'] = function (block) {
	// Search the text for a substring.
	var value = block.getFieldValue('VALUE');

	var code = {
		before: "",
		gencode: value,
		after: "",
		global: ""
	};

	return JSON.stringify(code);
};

Blockly.Blocks['logic_operation_operand_a_helper'] = {
	init: function () {
		this.jsonInit({
			"message0": "%1",
			"args0": [
				{
					"type": "field_number",
					"name": "VALUE",
					"value": 1

				}
			],
			"output": "Number",
			"colour": "%{BKY_LT_CATEGORY_COLOUR_LOGIC}"
		});;
	}
};

Blockly.JavaScript['logic_operation_operand_a_helper'] = function (block) {
	// Search the text for a substring.
	var value = block.getFieldValue('VALUE');

	var code = {
		before: "",
		gencode: value,
		after: "",
		global: ""
	};

	return JSON.stringify(code);
};

Blockly.Blocks['logic_operation_operand_b_helper'] = {
	init: function () {
		this.jsonInit({
			"message0": "%1",
			"args0": [
				{
					"type": "field_number",
					"name": "VALUE",
					"value": 0

				}
			],
			"output": "Number",
			"colour": "%{BKY_LT_CATEGORY_COLOUR_LOGIC}"
		});;
	}
};

Blockly.JavaScript['logic_operation_operand_b_helper'] = function (block) {
	// Search the text for a substring.
	var value = block.getFieldValue('VALUE');

	var code = {
		before: "",
		gencode: value,
		after: "",
		global: ""
	};

	return JSON.stringify(code);
};
