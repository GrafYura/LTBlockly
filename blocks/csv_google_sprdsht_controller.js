var bloclyGenerateVariableName = function()
{
	var varieble = '_';
	for(var i = 0; i < 5; ++i)
	{
		var code = Math.floor(Math.random() * 58) + 65;
		if(code >= 0x5B && code <= 0x5E)
			code = 0x41;
		if(code == 0x60)
			code = 0x41;
		if(code >= 0x7B && code <= 0x7E)
			code = 0x41;
		varieble += String.fromCharCode(code);
	}
	return varieble;
} 
function lengthInUtf8Bytes(str) {
  var m = encodeURIComponent(str).match(/%[89ABab]/g);
  return str.length + (m ? m.length : 0);
}
blocklyAddColumn = function() {
	var i = 1;
	while (true) {
		if(!this.getInput('COLUMN' + i))
		{
			add_shadow(this, 'text_helper_exe', 'COLUMN' + i, (i + 1) + ' ' + Blockly.Msg['LT_SRDSHT_COLUMN'] + ':',null,null,new Blockly.FieldTextInput((i + 1)  + ' ' + Blockly.Msg['LT_SRDSHT_COLUMN']), 'COLUMNDSCR' + i);
			this.moveInputBefore('COLUMN' + i,'ADDCOLUMN');
			break;
		}
		else{
			++i;
		}
	}
};
blocklyRemoveColumn = function() {
	var i = 0;
	while (this.getInput('COLUMN' + i)) {
		++i;
	}
	--i;
	if(i != 0){
		this.removeInput('COLUMN' + i);
	}
};
Blockly.Blocks['csv_google_sprdsht_controller'] = {
	init: function () {
		var thisBlock = this, 
		img = new Blockly.FieldImage("./js/blockly/img/control/add.png", 16, 16, "Add column", blocklyAddColumn.bind(thisBlock));
		img_neg = new Blockly.FieldImage("./js/blockly/img/control/minus.png", 16, 16, "Remove column", blocklyRemoveColumn.bind(thisBlock));
		img.EDITABLE = true;
		img_neg.EDITABLE = true;
		thisBlock.appendDummyInput()
			.appendField(new Blockly.FieldImage("./js/blockly/img/control/sprd_sheet.png", 16, 16, "*"))
			.appendField(Blockly.Msg['LT_SRDSHT_PATH'] + ':')
			.appendField(new Blockly.FieldTextInput('my_spreadsheet.csv'), 'SPREADSHEET')
			.appendField(Blockly.Msg['LT_SRDSHT_DATE'] + ':')
			.appendField(new Blockly.FieldCheckbox('FALSE'), 'DATE');
		thisBlock.appendValueInput('COLUMN0')
			.appendField('1 ' + Blockly.Msg['LT_SRDSHT_COLUMN'] + ':')
			.appendField(new Blockly.FieldTextInput('1 ' + Blockly.Msg['LT_SRDSHT_COLUMN']), 'COLUMNDSCR0');
		thisBlock.getInput('COLUMN0');
		thisBlock.appendDummyInput('ADDCOLUMN')
			.appendField(img)
			.appendField(img_neg);
		appendShadowBlock(this, "COLUMN0", "text_helper_exe");
		thisBlock.setPreviousStatement(true);
		thisBlock.setNextStatement(true);
		thisBlock.setInputsInline(false);
		thisBlock.setColour('%{BKY_LT_CATEGORY_COLOUR_OTHER}');
		thisBlock.setTooltip(Blockly.Msg["LT_SRDSHT_DESCR"]);
	},
	buffer:null,
	main_buff:null
};
Blockly.JavaScript['csv_google_sprdsht_controller'] = function (block) {
	var columns = [],
	columns_dscr = [],
	to_sprdsht = bloclyGenerateVariableName(),
	data = bloclyGenerateVariableName(),
	sprdsht_path = block.getFieldValue('SPREADSHEET'), i = 0,
	main_sprtf = '',
	sprdsht_type = '',
	helper_code = '';
	if(if_previous_buffer_exsist(block, true)){
		to_sprdsht = if_previous_buffer_exsist(block, true);
		block.main_buff = to_sprdsht;
	} else {
		block.main_buff = to_sprdsht;
		main_sprtf += '\nu8 ' + to_sprdsht +'[200] = "";';
	}
	if(if_previous_buffer_exsist(block)){
		data = if_previous_buffer_exsist(block);
		block.buffer = data;
	} else {
		block.buffer = data;
		main_sprtf += '\nu8 ' + data +'[100] = "";';
	}
	main_sprtf += '\n' + to_sprdsht +'[0] = 0;';
	helper_code += '\n' + data + '[0] = 0;';
	if(/\/d\/.*\//.test(sprdsht_path)){
		sprdsht_path = sprdsht_path.match(/\/d\/.*\//)[0];
		sprdsht_path = sprdsht_path.substring(3,sprdsht_path.length - 1);
		sprdsht_type = 'google';
	}else if(!/^\S+(\.csv)\b$/.test(sprdsht_path)){
		throw Blockly.Msg["LT_ERROR_SPRDSHT_PATH"];
	}
	while (block.getInput('COLUMN' + i)) {
		columns.push(JSON.parse(Blockly.JavaScript.statementToCode(block, 'COLUMN' + i)));
		columns_dscr.push('\\"' + block.getFieldValue('COLUMNDSCR' + i) + '\\"');
		++i;
	}
	i = 0;
	var colmntest = '';
	columns.forEach(clmn =>{colmntest += clmn.gencode+'000'});
	if (lengthInUtf8Bytes(colmntest)>100)
		{
			throw 'Spreadsheet data overflow, remove ' + (lengthInUtf8Bytes(colmntest)-100) + ' ' + (((lengthInUtf8Bytes(colmntest)-100)==1)?' byte.':' bytes.'); 
		}
	else
	columns.forEach(clmn =>{
		if(clmn.gencode.length > 100){
			throw Blockly.Msg["LT_ERROR_MAX_EXCEED"] + ' ' + clmn.gencode.length + ' ' + block.type;
		}
		if(Array.isArray(clmn.gencode)){
			helper_code += '\nsprintf('+data+' + strlen('+data+'),"\\"");';
			for(var j = 0; j < clmn.gencode.length; ++j){
				helper_code += '\nsprintf('+data+' + strlen('+data+'),"' + clmn.gencode[j] + '",' + clmn.after[j] + ');';
			}
			helper_code += '\nsprintf('+data+' + strlen('+data+'),"\\"");';
		}
		else
			helper_code += '\nsprintf('+data+' + strlen('+data+'),"\\"' + clmn.gencode + '\\"",' + clmn.after + ');';
		if(columns[i + 1])
			helper_code += '\nsprintf('+data+' + strlen('+data+'),",");';
		++i;
	});
	var code = {
		before: '',
		gencode: main_sprtf + helper_code,
		after: '',
		global: ''
	};
	if(sprdsht_type != 'google'){
		code.global ='\nvoid onInit(){\nsetStatus(SRV-ID:3,"{\\"fileName\\": \\"';
		code.global += sprdsht_path + '\\",\\"init\\": \\"yes\\",\\"values\\":[';
		code.global += columns_dscr + (block.getFieldValue('DATE') == 'TRUE'?',\\"DATE\\"':'') + ']}");\n}'
		code.gencode += '\nsprintf(' + to_sprdsht +',"{\\"fileName\\": \\"';
	}else
		code.gencode += '\nsprintf(' + to_sprdsht +',"{\\"sheetId\\": \\"';
	code.gencode += sprdsht_path + '\\",\\"values\\":[%s';
	code.gencode += (block.getFieldValue('DATE') == 'TRUE'?',\\"DATE\\"':'') + ']}",&'+data+');';
	code.gencode += '\nsetStatus(SRV-ID:3,&' + to_sprdsht +');';
	return JSON.stringify(code);
}
/*
	{"sheetId": "1OJpH7kMCNSqzXnnyVOpxGvw5qINTTxu9JYBwsoJqwvg","values":["","DATE"]}
*/