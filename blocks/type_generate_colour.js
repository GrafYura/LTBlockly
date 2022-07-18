Blockly.Blocks['type_generate_colour'] = {
  init: function() {
    this.jsonInit({
      "message0": "R %1 G %2 B %3",
      "args0": [
          {
            "type": "field_number",
            "name": "R",
            "value": 255,
            "min": 0,
            "max": 255
          },
          {
            "type": "field_number",
            "name": "G",
            "value": 255,
            "min": 0,
            "max": 255
          },
          {
            "type": "field_number",
            "name": "B",
            "value": 255,
            "min": 0,
            "max": 255
          }
	      ],
        "output": "Colour",
	"colour": '%{BKY_LT_CATEGORY_COLOUR_TYPES}'
    });
  }
};

Blockly.JavaScript['type_generate_colour'] = function(block) {
  // Search the text for a substring.
  var r = block.getFieldValue('R');
  var g = block.getFieldValue('G');
  var b = block.getFieldValue('B');

    var code = {
        before: '',
        gencode: '',
        after: '',
        global: '',
    }
    let num1 = parseInt(r).toString(16);
    let num2 = parseInt(g).toString(16);
    let num3 = parseInt(b).toString(16);
  code.gencode = '#' + num1 + num2 + num3;
  return JSON.stringify(code);
};
