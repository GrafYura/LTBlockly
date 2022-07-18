function getShadowBlock(block_svg, block_name) {
	let shadowBlock = block_svg.workspace.newBlock(block_name);
	shadowBlock.setShadow(true);
	return shadowBlock;
}

function appendShadowBlock(block_svg, input_name, block_name) {
	let shadowBlock = getShadowBlock(block_svg, block_name);
	let ob = shadowBlock.outputConnection;
	let cc = block_svg.getInput(input_name).connection;
	cc.connect(ob);
};

function appendShadowBlockWithRender(block_svg, input_name, block_name) {
	let shadowBlock = getShadowBlock(block_svg, block_name);
	shadowBlock.initSvg();
	shadowBlock.render();
	let ob = shadowBlock.outputConnection;
	let cc = block_svg.getInput(input_name).connection;
	cc.connect(ob);
};

function appendDynamicShadowBlock(block_svg, input_name, block_name, text) {
	var numberShadowBlock = block_svg.workspace.newBlock(block_name);
	numberShadowBlock.setShadow(true);
	numberShadowBlock.initSvg();
	numberShadowBlock.render();
	var ob = numberShadowBlock.outputConnection;
	block_svg.appendValueInput(input_name).appendField(text);
	var cc = block_svg.getInput(input_name).connection;
	cc.connect(ob);
}		
