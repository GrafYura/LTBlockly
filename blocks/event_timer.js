Blockly.Blocks['event_timer'] = {
	init: function () {
		this.jsonInit({
			"message0": "%5%{BKY_LT_EVENT_TIME_PERIOD}",
			"args0": [
				{
					"type": "field_dropdown",
					"name": "TIMER",
					"options": [
						["%{BKY_LT_EVENT_TIME_MINUTES}", "m"],
						["%{BKY_LT_EVENT_TIME_SECONDS}", "s"]]
				},
				{
					"type": "field_number",
					"name": "PERIOD",
					"value": 1.5,
					"min": 0.1
				},
				{ "type": "input_statement", "name": "BODY" },
				{
					"type": "input_dummy"
				},
				{
					"type": "field_image",
					"src": "js/blockly/img/events/events.png",
					"width": 16,
					"height": 16,
					"alt": "*"
				}
			],
			"colour": "%{BKY_LT_CATEGORY_COLOUR_EVENTS}",
			"tooltip": "%{BKY_LT_EVENT_ON_DEVICE_TTIMER}"
		});
	},
	event: false
};
//https://cdn0.iconfinder.com/data/icons/superuser-web-kit-thin/512/686932-signin_login_enter_entry_sign_log_in-512.png
Blockly.JavaScript['event_timer'] = function (block) {
	// Search the text for a substring.
	var body = Blockly.JavaScript.statementToCode(block, 'BODY'),
		timer = block.getFieldValue('TIMER'),
		period = block.getFieldValue('PERIOD'),
		parser = [],
		// blocks = Blockly.getMainWorkspace().getAllBlocks(),
		i = 0;
	block.event = true;
	let breaketIndex = body.indexOf('{');
	if (breaketIndex != -1)
		body = body.substring(breaketIndex);
	if (period.includes('.') && timer == 's') {
		period = parseFloat(period) * 1000;
		period = parseInt(period);
		timer = 'ms';
	} else if (period.includes('.') && timer == 'm') {
		period = parseFloat(period) * 60;
		period = parseInt(period);
		timer = 's';
	}
	while (body.indexOf('}{') != -1) {
		parser.push(body.substring(0, body.indexOf('}{') + 1));
		body = body.substring(body.indexOf('}{') + 1);
	}
	if (body.length > 1)
		parser.push(body);
	while (parser[i]) {
		parser[i] = JSON.parse(parser[i]);
		i++;
	}
	// i = 0;
	// var globalBlocks = [];
	// while (blocks[i]) {
	// 	if (blocks[i].getFieldValue('GLOBAL') == 'TRUE') {
	// 		globalBlocks.push(blocks[i]);
	// 	}
	// 	++i;
	// }
	// i = 0;
	var code = "", helper = "", globals = "";
	// if (if_is_top_block()) {
	// 	blocks.forEach(bl_ => {
	// 		if (bl_.getFieldValue('GLOBAL') == 'TRUE') {
	// 			switch (bl_.type) {
	// 				case 'varieble_numb':
	// 					globals += '\n' + bl_.getFieldValue('TYPE') + ' ' + bl_.getFieldValue('NAME') + ' = ' + bl_.getFieldValue('VALUE') + ';';
	// 					break;
	// 				case 'varieble_array':
	// 					globals += '\n' + bl_.getFieldValue('TYPE') + ' ' + bl_.getFieldValue('NAME') + '[] = {' + bl_.getFieldValue('VALUE') + '};';
	// 					break;
	// 				case 'varieble_text':
	// 					globals += '\nu8 ' + bl_.getFieldValue('NAME') + '[] = "' + bl_.getFieldValue('VALUE') + '";';
	// 					break;
	// 				default:
	// 					break;
	// 			}
	// 		}
	// 	});
	// }
	parser.forEach(el => {
		globals += el.global;
		helper += el.before + el.gencode + el.after;
	});
	var code = globals + '\nV-ID/' + timer + ':' + period + ' {\n' + helper + '\n}\n';

	// blocks.forEach(element => {
	// 	if (element.type == 'modbus') {
	// 		console.log(element)
	// 	}
	// });
	// console.log(block);
	console.log(code);
	return code;
};
