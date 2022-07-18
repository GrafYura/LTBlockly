// get atributes functions
function getLeakSensorAtributes() {
    var atributes = [
        ["Leak status", "LEAK0"],
    ];

    return atributes;
}

function getDoorSensorAtributes() {
    var atributes = [
        ["Is open", "DOOR0"],
    ];

    return atributes;
}

function getSensorAtributes() {
    var atributes = [
        ["Integer value", "SENS0"],
        ["Float value", "SENS1"],
    ];

    return atributes;
}

function getJalousieAndGatesAtributes() {
    var atributes = [
        ["State", "JAL0"],
    ];

    return atributes;
}

function getVentilationAtributes() {
    var atributes = [
        ["Is on", "VENT0"],
        ["Temperature", "VENT1"],
        ["Fan", "VENT2"],
    ];

    return atributes;
}

function getConditionerAtributes() {
    var atributes = [
        ["Is on", "COND0"],
        ["Mode", "COND1"],
        ["Temperature", "COND2"],
        ["Horizontal blinds", "COND3"],
        ["Vertical blinds", "COND4"],
        ["Fan", "COND5"],
    ];

    return atributes;
}

function getValveAtributes() {
    var atributes = [
        ["State", "VALV0"]
    ];

    return atributes;
}

function getSpeakerAtributes() {
    var atributes = [
        ["State","SPEAKER0"],
        ["Volume","SPEAKER1"],
        ["Mute","SPEAKER2"],
        ["Balance","SPEAKER3"],
        ["Priority","SPEAKER4"],
    ];
    return atributes;
}


function getVentAtributes() {
    var atributes = [
        ["Is on","VENTN0"],
        ["Is fan on","VENTN1"],
        ["Is boost on","VENTN2"],
        ["Integration algorithm","VENTN3"],
        ["Set CO2","VENTN4"],
        ["Current CO2","VENTN5"],
        ["Time interval index","VENTN6"],
        ["Automation index","VENTN7"],
        ["Current fan level","VENTN8"],
    ];
    return atributes;
}

function getFancoilAtributes() {
    var atributes = [
        ["Is on","FANC0"],
        ["Is cooling","FANC1"],
        ["Is fan on","FANC2"],
        ["Is boost on","FANC3"],
        ["Integration algorithm","FANC4"],
        ["Integer set temperature","FANC5"],
        ["Fractional set temperature","FANC6"],
        ["Integer current temperature","FANC7"],
        ["Fractional current temperature","FANC8"],
        ["Time interval index","FANC9"],
        ["Automation index","FANC10"],
        ["Current fan level","FANC11"],
    ];
    return atributes;
}

function getHeatingAtributes() {
    var atributes = [
        ["Is on", "HEAT0"],
        ["Mode", "HEAT1"],
        ["Integer set temperature", "HEAT2"],
        ["Set temperature", "HEAT3"],
        ["Integer current temperature", "HEAT4"],
        ["Current temperature", "HEAT5"],
    ];

    return atributes;
}

function getRGBAtributes() {
    var atributes = [
        ["Is on", "RGB0"],
        ["Brightness", "RGB1"],
        ["Contrast", "RGB2"],
        ["Color tone", "RGB3"],
    ];

    return atributes;
}

function getDimmerAtributes() {
    var atributes = [
        ["Is on", "DIM0"],
        ["Brightness", "DIM1"],
    ];

    return atributes;
}

function getLampAtributes() {
    var atributes = [
        ["Is on", "LAMP0"],
    ];

    return atributes;
}

function getAutomationAtrbutes() {
    var atributes = [
        ["Is automation on", "AUTO0"],
        // ["Is crash", "AUTO1"],
    ];

    return atributes;
}


// set atribute field on block
function changeAtributes(block) {
    if (block.getInput('ATRIBUTES')) {
        block.removeInput('ATRIBUTES');
    }
    setAttributes(block);
}

function setAttributes(block) {
    var type = block.getFieldValue('DEVICETYPE');
    var noAtributeDevices = [
        'valve',
        'leak-sensor',
        'door-sensor',
        'jalousie',
        'gate',
    ];

    if (noAtributeDevices.includes(type)) {
        return;
    }

    var elements = [];
    switch (type) {
        case 'lamp':
            elements.push(getLampAtributes());
            elements.push(getAutomationAtrbutes());
            break;
        case 'dimer-lamp':
            elements.push(getDimmerAtributes());
            elements.push(getAutomationAtrbutes());
            break;
        case 'dimmer-lamp':
            elements.push(getDimmerAtributes());
            elements.push(getAutomationAtrbutes());
            break;
        case 'rgb-lamp':
            elements.push(getRGBAtributes());
            elements.push(getAutomationAtrbutes());
            break;
        case 'valve-heating':
            elements.push(getHeatingAtributes());
            break;
        case 'fancoil':
            elements.push(getFancoilAtributes());
            break;
        case 'vent':
            elements.push(getVentAtributes());
            break;
        case 'speaker':
            elements.push(getSpeakerAtributes());
            break;
        case 'valve':
            elements.push(getValveAtributes());
            break;
        case 'conditioner':
            elements.push(getConditionerAtributes());
            break;
        case 'AC':
            elements.push(getConditionerAtributes());
            break;
        case 'virtual':
            elements.push(getVentilationAtributes());
            break;
        case 'jalousie':
            elements.push(getJalousieAndGatesAtributes());
            //elements.push(getAutomationAtrbutes());
            break;
        case 'gate':
            elements.push(getJalousieAndGatesAtributes());
            //elements.push(getAutomationAtrbutes());
            break;
        case 'motion-sensor':
            elements.push(getSensorAtributes());
            break;
        case 'illumination-sensor':
            elements.push(getSensorAtributes());
            break;
        case 'temperature-sensor':
            elements.push(getSensorAtributes());
            break;
        case 'humidity-sensor':
            elements.push(getSensorAtributes());
            break;
        case 'door-sensor':
            elements.push(getDoorSensorAtributes());
            break;
        case 'leak-sensor':
            elements.push(getLeakSensorAtributes());
            break;
        default:
            break;
    }

    var atributes = [];
    if (elements.length > 0) {
        elements.forEach(element => {
            element.forEach(atribute => {
                atributes.push(atribute);
            });
        });
    } else {
        atributes.push(["No atributes", "NO"]);
    }
    if(!block.getInput('ATRIBUTES'))
    block.appendDummyInput('ATRIBUTES')
        .appendField("Get: ")
        .appendField(new Blockly.FieldDropdown(
            atributes), 'VALUE');
}

// change block 
function onGetDeviceStatusChange(event) {
    if (event.type == Blockly.Events.CREATE) {
        event.ids.forEach(id => {
            let block = Blockly.getMainWorkspace().getBlockById(id);
            if (block && block.type == 'get_device_status') {
                if (block.getFieldValue('DEVICETYPE') == 'virtual') {
                    var ventilations = [];
                    var allVirtual = blocklyDeviceOptionsFromBlock(block);

                    allVirtual.forEach(element => {
                        let item = blocklyLogicXml.find('[addr="' + element[1] + '"]')[0].outerHTML;
                        if (/sub-type="ventilation"/g.test(item)) {
                            ventilations.push(element);
                        }
                    });

                    if (ventilations.length == 0) {
                        ventilations = [
                            ["No devices", "No devices"]
                        ];
                    }

                    block.removeInput('DEVICES');

                    block.appendDummyInput('DEVICES')
                        .appendField("Device: ")
                        .appendField(new Blockly.FieldDropdown(
                            ventilations), 'DEVICE');
                }
                else
                {
                    var rval = block.getFieldValue("VALUE");
                    block.removeInput('ATRIBUTES');
                    setAttributes(block);
                    if(block.getField("VALUE")!==null)
                    block.getField("VALUE").setValue(rval);
                }
            }
            else
            {
            Blockly.getMainWorkspace().getAllBlocks().forEach(element => 
            {
                if (element.type == 'get_device_status')
                {
                    var rval = element.getFieldValue("VALUE");
                    element.removeInput('ATRIBUTES');
                    setAttributes(element);
                    if(element.getField("VALUE")!==null)
                    element.getField("VALUE").setValue(rval);          
                }
            });
        }
        });
    }

    if (event.type == Blockly.Events.CHANGE &&
        event.name == 'DEVICETYPE') {
        var block = Blockly.getMainWorkspace().getBlockById(event.blockId);
        if (block && block.type == 'get_device_status') {

            if (block.getFieldValue('DEVICETYPE') == 'virtual') {
                var ventilations = [];
                var allVirtual = blocklyDeviceOptionsFromBlock(block);

                allVirtual.forEach(element => {
                    let item = blocklyLogicXml.find('[addr="' + element[1] + '"]')[0].outerHTML;
                    if (/sub-type="ventilation"/g.test(item)) {
                        ventilations.push(element);
                    }
                });

                if (ventilations.length == 0) {
                    ventilations = [
                        ["No devices", "No devices"]
                    ];
                }

                block.removeInput('DEVICES');

                block.appendDummyInput('DEVICES')
                    .appendField("Device: ")
                    .appendField(new Blockly.FieldDropdown(
                        ventilations), 'DEVICE');

            } else if (event.oldValue == 'virtual') {
                block.removeInput('DEVICES');
                block.appendDummyInput('DEVICES')
                    .appendField("Device: ")
                    .appendField(new Blockly.FieldDropdown(blocklyDeviceOptions.bind(block)), 'DEVICE');
            }
            changeAtributes(block);
        }
    }
}

Blockly.Blocks['get_device_status'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage("js/blockly/img/events/events.png", 16, 16, "*"))
            .appendField("Type: ")
            .appendField(new Blockly.FieldDropdown(blocklyDeviceTypeOptions.bind(this,
                ["lamp", "dimer-lamp", "dimmer-lamp", "rgb-lamp", "valve-heating", "valve",
                    "conditioner", "AC", "virtual", "fancoil", "jalousie", "gate", "vent", "speaker",
                    "motion-sensor", "illumination-sensor",
                    "temperature-sensor", "humidity-sensor",
                    "door-sensor", "leak-sensor"
                ])), 'DEVICETYPE');
        this.appendDummyInput('DEVICES')
            .appendField("Device: ")
            .appendField(new Blockly.FieldDropdown(blocklyDeviceOptions.bind(this)), 'DEVICE');
        this.appendDummyInput('ATRIBUTES')
            .appendField("Get: ")
            .appendField(new Blockly.FieldDropdown([["No atributes", "NO"]]), 'VALUE');
        //setAttributes(this);
        this.setColour("%{BKY_LT_CATEGORY_COLOUR_STATUS}");
        this.setTooltip(Blockly.Msg["LT_EVENT_ON_DEVICE_TTEVENT"]);
        this.setOutput(true, 'Number');
        if (!Blockly.getMainWorkspace().listeners_.includes(onGetDeviceStatusChange))
            Blockly.getMainWorkspace().addChangeListener(onGetDeviceStatusChange);
    }
};

Blockly.JavaScript['get_device_status'] = function (block) {
    // Search the text for a substring.
    var device = block.getFieldValue('DEVICE');

    if (device == "No devices") {
        throw "ERROR: no device selected! Get device status block.";
    }

    var type = block.getFieldValue('DEVICETYPE');
    var value = block.getFieldValue('VALUE');
    var code = {
        before: "",
        gencode: "",
        after: "",
        global: ""
    };

    if (value) {
        switch (value) {
            case 'AUTO0':
                code.gencode = '(([' + device + '.0]>>3)&1)';
                break;
            case 'LAMP0':
                code.gencode = '([' + device + '.0]&1)';
                break;
            case 'DIM0':
                code.gencode = '([' + device + '.0]&1)';
                break;
            case 'DIM1':
                code.gencode = '[' + device + '.1]';
                break;
            case 'RGB0':
                code.gencode = '([' + device + '.0]&1)';
                break;
            case 'RGB1':
                code.gencode = '[' + device + '.1]';
                break;
            case 'RGB2':
                code.gencode = '[' + device + '.2]';
                break;
            case 'RGB3':
                code.gencode = '[' + device + '.3]';
                break;
            case 'HEAT0':
                code.gencode = '([' + device + '.0]&1)';
                break;
            case 'HEAT1':
                code.gencode = '[' + device + '.5]';
                break;
            case 'HEAT2':
                code.gencode = '[' + device + '.2]';
                break;
            case 'HEAT3':
                code.global = '\ni16 __get_device_status_buff__ = 0;\n';
                code.before += '\n__get_device_status_buff__ = [' + device + '.2];'
                code.before += '\n__get_device_status_buff__ = (__get_device_status_buff__ << 8) | [' + device + '.1];\n';
                code.gencode = '__get_device_status_buff__';
                break;
            case 'HEAT4':
                code.gencode = '[' + device + '.4]';
                break;
            case 'HEAT5':
                code.global = '\ni16 __get_device_status_buff__ = 0;\n';
                code.before += '\n__get_device_status_buff__ = [' + device + '.4];'
                code.before += '\n__get_device_status_buff__ = (__get_device_status_buff__ << 8) | [' + device + '.3];\n';
                code.gencode = '__get_device_status_buff__';
                break;
            case 'COND0':
                code.gencode = '([' + device + '.0]&1)';
                break;
            case 'COND1':
                code.gencode = '([' + device + '.0]>>4)';
                break;
            case 'COND2':
                var typeDev= blocklyGetDeviceType('[addr="' +device+ '"]');
                if(typeDev=="AC")
                code.gencode = '[' + device + '.2]';
                else
                code.gencode = '[' + device + '.1]';
                break;
            case 'COND3':
                code.gencode = '([' + device + '.3]&0x0F)';
                break;
            case 'COND4':
                code.gencode = '([' + device + '.3]>>4)';
                break;
            case 'COND5':
                code.gencode = '([' + device + '.4]&0x0F)';
                break;
            case 'VENT0':
                code.gencode = '([' + device + '.0]&1)';
                break;
            case 'VENT1':
                code.gencode = '[' + device + '.1]';
                break;
            case 'VENT2':
                code.gencode = '([' + device + '.4]&0x0F)';
                break;
            case 'SENS0':
                code.gencode = '(([' + device + '.1] < 0x7F)?[' + device + '.1]:[' + device + '.1] + 1)';
                break;
            case 'SENS1':
                code.gencode = '[' + device + ']';
                break;
            case 'FANC0':
                code.gencode = '([' + device + '.0]$1)';
                break;
            case 'FANC1':
                code.gencode = '([' + device + '.0]$2)';
                break;
            case 'FANC2':
                code.gencode = '([' + device + '.0]$4)';
                break;
            case 'FANC3':
                code.gencode = '([' + device + '.0]$8)';
                break;
            case 'FANC4':
                code.gencode = '([' + device + '.0]$240)';
                break;
            case 'FANC5':
                code.gencode = '[' + device + '.2]';
                break;
            case 'FANC6':
                code.gencode = '[' + device + '.1]';
                break;
            case 'FANC7':
                code.gencode = '[' + device + '.4]';
                break;
            case 'FANC8':
                code.gencode = '[' + device + '.3]';
                break;
            case 'FANC9':
                code.gencode = '([' + device + '.5]$0x0f)';
                break;
            case 'FANC10':
                code.gencode = '([' + device + '.5]$0xf0)';
                break;
            case 'FANC11':
                code.gencode = '[' + device + '.6]';
                break;
            case 'VENTN0':
                code.gencode = '!!([' + device + '.0]$1)';
                break;
            case 'VENTN1':
                code.gencode = '!!([' + device + '.0]$2)';
                break;
            case 'VENTN2':
                code.gencode = '!!([' + device + '.0]$8)';
                break;
            case 'VENTN3':
                code.gencode = '([' + device + '.0]$240)>>4';
                break;
            case 'VENTN4':
                code.gencode = '(([' + device + '.2]<<8)+[' + device + '.1])';
                break;
            case 'VENTN5':
                code.gencode = '(([' + device + '.4]<<8)+[' + device + '.3])';
                break;
            case 'VENTN6':
                code.gencode = '([' + device + '.5]$0x0f)';
                break;
            case 'VENTN7':
                code.gencode = '([' + device + '.5]$0xf0)';
                break;
            case 'VENTN8':
                code.gencode = '[' + device + '.6]';
                break;
            case 'SPAEKER0':
                code.gencode = '[' + device + '.0]';
                break;
            case 'SPAEKER1':
                code.gencode = '[' + device + '.1]';
                break;
            case 'SPAEKER2':
                code.gencode = '[' + device + '.2]';
                break;
            case 'SPAEKER3':
                code.gencode = '[' + device + '.3]';
                break;
            case 'SPAEKER4':
                code.gencode = '[' + device + '.4]';
                break;
            default:
                break;
        }
    } else {
        switch (type) {
            case 'gate':
                code.gencode = '[' + device + '.0]';
                break;
            case 'jalousie':
                code.gencode = '[' + device + '.0]';
                break;
            case 'leak-sensor':
                code.gencode = '[' + device + '.0]';
                break;
            case 'door-sensor':
                code.gencode = '([' + device + '.0]&1)';
                break;
            case 'valve':
                code.gencode = '([' + device + '.0]&1)';
                break;
            default:
                break;
        }
    }

    return JSON.stringify(code);
};