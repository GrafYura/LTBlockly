Blockly.Blocks['datetime_get'] = {
  init: function () {
    this.jsonInit({
      "message0": "%2%{BKY_LT_DATA_GET_TIME}",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "DT",
          "options": [
            ["%{BKY_LT_DATA_TIME_MSEC}", "ms()"],
            ["%{BKY_LT_DATA_TIME_SEC}", "sec()"],
            ["%{BKY_LT_DATA_TIME_MIN}", "min()"],
            ["%{BKY_LT_DATA_TIME_HRS}", "hour()"],
            ["%{BKY_LT_DATA_TIME_DAY}", "day()"],
            ["%{BKY_LT_DATA_TIME_WDAY}", "wday()"],
            ["%{BKY_LT_DATA_TIME_MNTH}", "month()"],
            ["%{BKY_LT_DATA_TIME_YEAR}", "year()"],
            ["UNIX", "time()"]
          ]
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
      "colour": "%{BKY_LT_CATEGORY_COLOUR_DATETIME}",
      "tooltip": "Get date or time"
    });
  },
  output: "Number"
};

Blockly.JavaScript['datetime_get'] = function (block) {
  // Search the text for a substring.
  var dt = block.getFieldValue('DT');
  var code = {
    before: "",
    gencode: dt,
    after: "",
    global: ""
  };
  return JSON.stringify(code);
};
 /* 
./scr.sh DATA_GET_TIME "Get %1" "Получить %1"
./scr.sh DATA_TIME_MSEC "Miliseconds" "Миллисекунды"
./scr.sh DATA_TIME_SEC "Seconds" "Секунды"
./scr.sh DATA_TIME_MIN "Minutes" "Минуты"
./scr.sh DATA_TIME_HRS "Hours" "Часы"
./scr.sh DATA_TIME_DAY "Day" "День"
./scr.sh DATA_TIME_WDAY "Weak day" "День недели"
./scr.sh DATA_TIME_MNTH "Mounth" "Месяц"
./scr.sh DATA_TIME_YEAR "Year" "Год"
Blockly.Msg.DATA_COLOUR = "215"
*/