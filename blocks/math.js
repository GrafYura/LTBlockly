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
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Math blocks for Blockly.
 *
 * This file is scraped to extract a .json file of block definitions. The array
 * passed to defineBlocksWithJsonArray(..) must be strict JSON: double quotes
 * only, no outside references, no functions, no trailing commas, etc. The one
 * exception is end-of-line comments, which the scraper will remove.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

goog.provide('Blockly.Blocks.math'); // Deprecated
goog.provide('Blockly.Constants.Math');

goog.require('Blockly.Blocks');
goog.require('Blockly');


/**
 * Unused constant for the common HSV hue for all blocks in this category.
 * @deprecated Use Blockly.Msg['MATH_HUE']. (2018 April 5)
 */
Blockly.Constants.Math.HUE = 230;

Blockly.Blocks['math_arithmetic'] = {
	init: function () {
		this.jsonInit({
			"message0": "%4%1 %2 %3",
			"args0": [{
				"type": "input_value",
				"name": "A",
				"check": "Number"
			},
			{
				"type": "field_dropdown",
				"name": "OP",
				"options": [
					["%{BKY_MATH_ADDITION_SYMBOL}", "ADD"],
					["%{BKY_MATH_SUBTRACTION_SYMBOL}", "MINUS"],
					["%{BKY_MATH_MULTIPLICATION_SYMBOL}", "MULTIPLY"],
					["%{BKY_MATH_DIVISION_SYMBOL}", "DIVIDE"],
					["%{BKY_MATH_POWER_SYMBOL}", "POWER"],
					["|", "OR"],
					["&", "AND"],
					["%", "REMAINDER"]
				]
			},
			{
				"type": "input_value",
				"name": "B",
				"check": "Number"
			},
			{
				"type": "field_image",
				"src": "https://static.thenounproject.com/png/718608-200.png",
				"width": 16,
				"height": 16,
				"alt": "*"
			}
			],
			"inputsInline": true,
			"output": "Number",
			"colour": "%{BKY_LT_CATEGORY_COLOUR_LOGIC}",
			"helpUrl": "%{BKY_MATH_ARITHMETIC_HELPURL}",
			"extensions": ["math_op_tooltip"]
		});
		appendShadowBlock(this, "A", "logic_compare_operand_a_helper");
		appendShadowBlock(this, "B", "logic_compare_operand_b_helper");
	},
	output: "Number"
};

/**
 * Mapping of math block OP value to tooltip message for blocks
 * math_arithmetic, math_simple, math_trig, and math_on_lists.
 * @see {Blockly.Extensions#buildTooltipForDropdown}
 * @package
 * @readonly
 */
Blockly.Constants.Math.TOOLTIPS_BY_OP = {
	// math_arithmetic
	'ADD': '%{BKY_MATH_ARITHMETIC_TOOLTIP_ADD}',
	'MINUS': '%{BKY_MATH_ARITHMETIC_TOOLTIP_MINUS}',
	'MULTIPLY': '%{BKY_MATH_ARITHMETIC_TOOLTIP_MULTIPLY}',
	'DIVIDE': '%{BKY_MATH_ARITHMETIC_TOOLTIP_DIVIDE}',
	'POWER': '%{BKY_MATH_ARITHMETIC_TOOLTIP_POWER}',

	// math_simple
	'ROOT': '%{BKY_MATH_SINGLE_TOOLTIP_ROOT}',
	'ABS': '%{BKY_MATH_SINGLE_TOOLTIP_ABS}',
	'NEG': '%{BKY_MATH_SINGLE_TOOLTIP_NEG}',
	'LN': '%{BKY_MATH_SINGLE_TOOLTIP_LN}',
	'LOG10': '%{BKY_MATH_SINGLE_TOOLTIP_LOG10}',
	'EXP': '%{BKY_MATH_SINGLE_TOOLTIP_EXP}',
	'POW10': '%{BKY_MATH_SINGLE_TOOLTIP_POW10}',

	// math_trig
	'SIN': '%{BKY_MATH_TRIG_TOOLTIP_SIN}',
	'COS': '%{BKY_MATH_TRIG_TOOLTIP_COS}',
	'TAN': '%{BKY_MATH_TRIG_TOOLTIP_TAN}',
	'ASIN': '%{BKY_MATH_TRIG_TOOLTIP_ASIN}',
	'ACOS': '%{BKY_MATH_TRIG_TOOLTIP_ACOS}',
	'ATAN': '%{BKY_MATH_TRIG_TOOLTIP_ATAN}',

	// math_on_lists
	'SUM': '%{BKY_MATH_ONLIST_TOOLTIP_SUM}',
	'MIN': '%{BKY_MATH_ONLIST_TOOLTIP_MIN}',
	'MAX': '%{BKY_MATH_ONLIST_TOOLTIP_MAX}',
	'AVERAGE': '%{BKY_MATH_ONLIST_TOOLTIP_AVERAGE}',
	'MEDIAN': '%{BKY_MATH_ONLIST_TOOLTIP_MEDIAN}',
	'MODE': '%{BKY_MATH_ONLIST_TOOLTIP_MODE}',
	'STD_DEV': '%{BKY_MATH_ONLIST_TOOLTIP_STD_DEV}',
	'RANDOM': '%{BKY_MATH_ONLIST_TOOLTIP_RANDOM}'
};

Blockly.Extensions.register('math_op_tooltip',
	Blockly.Extensions.buildTooltipForDropdown(
		'OP', Blockly.Constants.Math.TOOLTIPS_BY_OP));


/**
 * Mixin for mutator functions in the 'math_is_divisibleby_mutator'
 * extension.
 * @mixin
 * @augments Blockly.Block
 * @package
 */
Blockly.Constants.Math.IS_DIVISIBLEBY_MUTATOR_MIXIN = {
	/**
	 * Create XML to represent whether the 'divisorInput' should be present.
	 * @return {Element} XML storage element.
	 * @this Blockly.Block
	 */
	mutationToDom: function () {
		var container = document.createElement('mutation');
		var divisorInput = (this.getFieldValue('PROPERTY') == 'DIVISIBLE_BY');
		container.setAttribute('divisor_input', divisorInput);
		return container;
	},
	/**
	 * Parse XML to restore the 'divisorInput'.
	 * @param {!Element} xmlElement XML storage element.
	 * @this Blockly.Block
	 */
	domToMutation: function (xmlElement) {
		var divisorInput = (xmlElement.getAttribute('divisor_input') == 'true');
		this.updateShape_(divisorInput);
	},
	/**
	 * Modify this block to have (or not have) an input for 'is divisible by'.
	 * @param {boolean} divisorInput True if this block has a divisor input.
	 * @private
	 * @this Blockly.Block
	 */
	updateShape_: function (divisorInput) {
		// Add or remove a Value Input.
		var inputExists = this.getInput('DIVISOR');
		if (divisorInput) {
			if (!inputExists) {
				this.appendValueInput('DIVISOR')
					.setCheck('Number');
			}
		} else if (inputExists) {
			this.removeInput('DIVISOR');
		}
	}
};

/**
 * 'math_is_divisibleby_mutator' extension to the 'math_property' block that
 * can update the block shape (add/remove divisor input) based on whether
 * property is "divisble by".
 * @this Blockly.Block
 * @package
 */
Blockly.Constants.Math.IS_DIVISIBLE_MUTATOR_EXTENSION = function () {
	this.getField('PROPERTY').setValidator(function (option) {
		var divisorInput = (option == 'DIVISIBLE_BY');
		this.sourceBlock_.updateShape_(divisorInput);
	});
};

Blockly.Extensions.registerMutator('math_is_divisibleby_mutator',
	Blockly.Constants.Math.IS_DIVISIBLEBY_MUTATOR_MIXIN,
	Blockly.Constants.Math.IS_DIVISIBLE_MUTATOR_EXTENSION);

// Update the tooltip of 'math_change' block to reference the variable.
Blockly.Extensions.register('math_change_tooltip',
	Blockly.Extensions.buildTooltipWithFieldText(
		'%{BKY_MATH_CHANGE_TOOLTIP}', 'VAR'));

/**
 * Mixin with mutator methods to support alternate output based if the
 * 'math_on_list' block uses the 'MODE' operation.
 * @mixin
 * @augments Blockly.Block
 * @package
 * @readonly
 */
Blockly.Constants.Math.LIST_MODES_MUTATOR_MIXIN = {
	/**
	 * Modify this block to have the correct output type.
	 * @param {string} newOp Either 'MODE' or some op than returns a number.
	 * @private
	 * @this Blockly.Block
	 */
	updateType_: function (newOp) {
		if (newOp == 'MODE') {
			this.outputConnection.setCheck('Array');
		} else {
			this.outputConnection.setCheck('Number');
		}
	},
	/**
	 * Create XML to represent the output type.
	 * @return {Element} XML storage element.
	 * @this Blockly.Block
	 */
	mutationToDom: function () {
		var container = document.createElement('mutation');
		container.setAttribute('op', this.getFieldValue('OP'));
		return container;
	},
	/**
	 * Parse XML to restore the output type.
	 * @param {!Element} xmlElement XML storage element.
	 * @this Blockly.Block
	 */
	domToMutation: function (xmlElement) {
		this.updateType_(xmlElement.getAttribute('op'));
	}
};

/**
 * Extension to 'math_on_list' blocks that allows support of
 * modes operation (outputs a list of numbers).
 * @this Blockly.Block
 * @package
 */
Blockly.Constants.Math.LIST_MODES_MUTATOR_EXTENSION = function () {
	this.getField('OP').setValidator(function (newOp) {
		this.updateType_(newOp);
	}.bind(this));
};

Blockly.Extensions.registerMutator('math_modes_of_list_mutator',
	Blockly.Constants.Math.LIST_MODES_MUTATOR_MIXIN,
	Blockly.Constants.Math.LIST_MODES_MUTATOR_EXTENSION);
Blockly.JavaScript['math_arithmetic'] = function (block) {
	// Search the text for a substring.
	//alert("tyta");
	var a = JSON.parse(Blockly.JavaScript.statementToCode(block, 'A'));
	var op = block.getFieldValue('OP');
	var b = JSON.parse(Blockly.JavaScript.statementToCode(block, 'B')),
		typea = InputType(block, a.gencode, "A"),
		typeb = InputType(block, b.gencode, "B");
	var code = {
		before: a.before + b.before,
		gencode: "",
		after: a.after + b.after,
		global: a.global + b.global
	};
	switch (op) {
		case 'ADD':
			op = "+";
			break;
		case 'MINUS':
			op = "-";
			break;
		case 'MULTIPLY':
			op = "*";
			break;
		case 'DIVIDE':
			op = "/";
			break;
		case 'POWER':
			op = "^";
			break;
		case 'OR':
			op = "|";
			break;
		case 'AND':
			op = "&";
			break;
		case 'REMAINDER':
			op = "%";
			break;
	}
	if (b.gencode == '0' && op == '/') {
		throw Blockly.Msg["LT_ERROR_MATH_DIV_ZERO"] + ' ' + block.type;
	}

	if (/^-{0,1}\d+$/.test(a.gencode) && /^-{0,1}\d+$/.test(b.gencode)) {
		a = parseInt(a.gencode);
		b = parseInt(b.gencode);
		let result = 0;
		switch (op) {
			case '+':
				result = a + b;
				break;
			case '-':
				result = a - b;
				break;
			case '*':
				result = a * b;
				break;
			case '/':
				result = a / b;
				break;
			case '^':
				result = a ^ b;
				break;
			case '|':
				result = a | b;
				break;
			case '&':
				result = a & b;
				break;
			case '%':
				result = a % b;
				break;
		}
		code.gencode = parseInt(result.toString());
	} else {
		switch (typea) {
			case "device":
				a.gencode = '[' + a.gencode + '.0]&7';
				break;
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
			case "device":
				b.gencode = '[' + b.gencode + '.0]&7';
				break;
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
		code.gencode = '(' + a.gencode + ' ' + op + ' ' + b.gencode + ')';
	}
	return JSON.stringify(code);
};