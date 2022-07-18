Blockly.Blocks['type_coment'] = {
  init: function () {
    this.jsonInit({
      "message0": "%2%1",
      "args0": [
        {
          "type": "field_input",
          "name": "FIELDNAME",
          "text": "%{BKY_LT_OTHER_COMENT}"
        },
        {
          "type": "field_image",
          "src": "js/blockly/img/other/coment.png",
          "width": 16,
          "height": 16,
          "alt": "*"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": '%{BKY_LT_CATEGORY_COLOUR_OTHER}',
      "tooltip": "Block comments"
    });
  }
};

Blockly.JavaScript['type_coment'] = function (block) {
  // Search the text for a substring.
  var dt = block.getFieldValue('FIELDNAME');
  var code = {
    before: "",
    gencode: "",
    after: "",
    global: ""
  };

  code.gencode = '\n// ' + dt + '\n';

  return JSON.stringify(code);
};
