Blockly.Blocks['type_number'] = {
  init: function () {
    this.jsonInit({
      "message0": "%2%1",
      "args0": [
        {
          "type": "field_number",
          "name": "FIELDNAME",
          "value": 100
        },
        {
          "type": "field_image",
          "src": "js/blockly/img/vars/types.png",
          "width": 16,
          "height": 16,
          "alt": "*"
        }
      ],
      "output": "Number",
      "colour": '%{BKY_LT_CATEGORY_COLOUR_VARIABLES}',
      "tooltip": "%{BKY_LT_CATEGORY_VARIABLES_TYPE_NUMBER}"
    });
  },
  output: "Number"
};
// http://icons.iconarchive.com/icons/icons8/windows-8/256/Programming-Variable-icon.png
Blockly.JavaScript['type_number'] = function (block) {
  // Search the text for a substring.
  var dt = block.getFieldValue('FIELDNAME');

  var code = {
    before: "",
    gencode: dt,
    after: "",
    global: ""
  };

  return JSON.stringify(code);
};
