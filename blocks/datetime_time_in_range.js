'use strict';
goog.provide('Blockly.Constants.Timewd');
goog.require('Blockly.Blocks');
goog.require('Blockly');
Blockly.Blocks['get_datetime_time_string'] = {
	init: function() {
	this.jsonInit({
        "message0": "%{BKY_LT_DATA_TIMEINRANGE}",
        "args0": [
			{
                "type": "field_time",
                "name": "TIME1",
                "hour": 9,
                "minutes": 0,
                "alt":
                    {
                    "type": "field_input",
                    "name": "TIME1",
                    "text": "9:00"
                    }
            },
            {
                "type": "field_time",
                "name": "TIME2",
                "hour": 12,
                "minutes": 0,
                "alt":
                    {
                    "type": "field_input",
                    "name": "TIME2",
                    "text": "12:00"
                    }
            }
        ],
			"output": "Text",
            "colour": "%{BKY_LT_CATEGORY_COLOUR_DATETIME}"
		});
	},
    output: "Number"
};
Blockly.JavaScript['datetime_time_in_range'] = function(block) {
    // Search the text for a substring.
    var time1 = block.getFieldValue('TIME1');
    var time2 = block.getFieldValue('TIME2');

    var monday = block.getFieldValue('MONDAY');
    var tuesday = block.getFieldValue('TUESDAY');
    var wednesday = block.getFieldValue('WEDNESDAY');
    var thursday = block.getFieldValue('THURSDAY');
    var friday = block.getFieldValue('FRIDAY');
    var saturday = block.getFieldValue('SATURDAY');
    var sunday = block.getFieldValue('SUNDAY');

    var code = {
		before:"",
		gencode:"",
		after:"",
		global:""
	};
    
    code.gencode += 'timeInRange(' + time1 + '-' + time2;

    var days = '';
    if(!(monday === null)){
        days += 'mo';
    }
    if(!(tuesday === null)){
        if(days != ''){
            days += ', ';
        }
        days += 'tu';
    }
    if(!(wednesday === null)){
        if(days != ''){
            days += ', ';
        }
        days += 'we';
    }
    if(!(thursday === null)){
        if(days != ''){
            days += ', ';
        }
        days += 'th';
    }
    if(!(friday === null)){
        if(days != ''){
            days += ', ';
        }
        days += 'fr';
    }
    if(!(saturday === null)){
        if(days != ''){
            days += ', ';
        }
        days += 'sa';
    }
    if (!(sunday === null)){
        if(days != ''){
            days += ', ';
        }
        days += 'su';
    }

    if(days != ''){
        code.gencode += '|' + days;
    }

	code.gencode += ')';
	
	return JSON.stringify(code);
};

 /* 
./scr.sh DATA_TIMEINRANGE "Time in range %1-%2" "Время в диапазоне %1-%2"
./scr.sh DATA_MUTATOR "Days of the week" "Дни недели"
./scr.sh DATA_MONDAY "Monday" "Понедельник"
./scr.sh DATA_TUESDAY "Tuesday" "Вторник"
./scr.sh DATA_WEDNESDAY "Wednesday" "Среда"
./scr.sh DATA_THURSDAY "Thursday" "Четверг"
./scr.sh DATA_FRIDAY "Friday" "Пятница"
./scr.sh DATA_SATURDAY "Saturday" "Суббота"
./scr.sh DATA_SUNDAY "Sunday" "Воскресенье"
./scr.sh DATA_WEEKDAY "Week day:" "День недели:"
"colour": "%{BKY_DATA_COLOUR}"
*/