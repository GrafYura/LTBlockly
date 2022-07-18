Blockly.Blocks['simple_event_on_device'] = {
	init: function () {
		this.jsonInit({
			"colour": "%{BKY_LT_CATEGORY_COLOUR_EVENTS}",
			"tooltip": "%{BKY_LT_EVENT_ON_DEVICE_TT}"
		});
		var img = new Blockly.FieldImage("./js/blockly/img/events/events.png", 16, 16,'*');
		var parent = this;
		this.appendDummyInput('NAME')
			.appendField(img)
            .appendField(Blockly.Msg["LT_SIMPLE_EVENT_ON_DEVICE1"] + ' ')
            .appendField(new Blockly.FieldCheckbox('TRUE'), 'AUTOOFF')
        	.appendField(' time','REM1')
        	.appendField(new Blockly.FieldNumber(1,1), 'TIMER')
        	.appendField('s','REM2');
        this.appendStatementInput('DEVS1')
        	.appendField('ON');
        this.appendStatementInput('DEVS0','OFF2')
        	.appendField('OFF');

		if (this.workspace == Blockly.getMainWorkspace()){
			if(ifBlockExcist('simple_event_on_device')){
				var ereser = new Blockly.Events.BlockDelete(this);
				ereser.run(true);
			}
		}	
	},
	onchange: function(ev) {
		var vis = this.getFieldValue('AUTOOFF')=='TRUE';
		this.getField('REM1').setVisible(vis);
		this.getField('TIMER').setVisible(vis);
		this.getField('REM2').setVisible(vis);
		this.render();
		if(ev.type == Blockly.Events.CHANGE && ev.element=="disabled") 
		{
			var block = Blockly.getMainWorkspace().getBlockById(ev.blockId);
			if(block.type == 'simple_event_on_device' && block.disabled==false){
				Blockly.getMainWorkspace().getAllBlocks().forEach(el => {
					if (el.type == 'imitation') {
						el.setDisabled(true);
					}
				});}
			}
		}
};


Blockly.JavaScript['simple_event_on_device'] = function (block) {
	// Search the text for a substring.
	var autoOFF = block.getFieldValue('AUTOOFF') == 'TRUE',
		autoOFFtime = block.getFieldValue('TIMER'),
		devsON = Blockly.JavaScript.statementToCode(block, 'DEVS1'),
		devsOFF = Blockly.JavaScript.statementToCode(block, 'DEVS0'),
		parserON = [], parserOFF = [], i = 0;     
		if(autoOFFtime === null)
			autoOFFtime = 1;   
	block.event = true;
	if (devsON.indexOf('{') != -1)
		devsON = devsON.substring(devsON.indexOf('{'));
	if (devsOFF.indexOf('{') != -1)
		devsOFF = devsOFF.substring(devsOFF.indexOf('{'));
	while (devsON.indexOf('}{') != -1) {
		parserON.push(devsON.substring(0, devsON.indexOf('}{') + 1));
		devsON = devsON.substring(devsON.indexOf('}{') + 1);
	}
	if (devsON != '')
		parserON.push(devsON);
	while (devsOFF.indexOf("}{") != -1) {
		parserOFF.push(devsOFF.substring(0, devsOFF.indexOf('}{') + 1));
		devsOFF = devsOFF.substring(devsOFF.indexOf('}{') + 1);
	}
	if (devsOFF != '')
		parserOFF.push(devsOFF);
	parserON.forEach(onblock_ => {
		parserON[i] = JSON.parse(onblock_);
		++i;
	});
	i = 0;
	parserOFF.forEach(offblock_ => {
		parserOFF[i] = JSON.parse(offblock_);
		++i;
	});
	var code = "", helperON = "", helperOFF = "", globals = "";
	parserON.forEach(bl_ => {
		globals += bl_.global;
		helperON += bl_.before + bl_.gencode + bl_.after;
	});
	parserOFF.forEach(bl_ => {
		globals += bl_.global;
		helperOFF += bl_.before + bl_.gencode + bl_.after;
	});
	if (autoOFF == true)
		code = globals + '\nvoid autooff() {\nsetStatus(V-ADDR,0);\n}\nV-ID/V-ADDR {\nif(opt0()) {\n'
			+ helperON + '\ndelayedCall(autooff,' + autoOFFtime + ');\n' + '}';
	else
		code = globals + '\nV-ID/V-ADDR {\nif(opt0()) {\n' + helperON + '\n}';
	if (helperOFF.length > 1) {
		code += ' else {\n' + helperOFF + '\n}';
	}
	code += '\n}\n';
	console.log(code);
	return code;
};
