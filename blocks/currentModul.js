function getAutoModulID(modulesList) {
    var blocks = Blockly.getMainWorkspace().getAllBlocks();
    var modulsID = [];
    var counts = [];
    var parsed = [];

    blocks.forEach(block => {
        block.inputList.forEach(input => {
            if (input.fieldRow != undefined && input.fieldRow.forEach != undefined) input.fieldRow.forEach(field => {
                parsed.push(field.getValue());
            });
        });
    });

    var regexp = /(\d{1,4}):\d{1,3}/;
    parsed.forEach(el => {
        let res = regexp.exec(el);
        if (res && modulesList.indexOf(res[1]) != -1) {

            res = res[1];
            let index = modulsID.indexOf(res);
            if (index != -1) {
                ++counts[index];
            } else {
                modulsID.push(res);
                counts.push(1);
            }
        }
    });

    var maxValIndex = 0;
    for (let index = 0; index < counts.length; index++) {
        maxValIndex = counts[maxValIndex] > counts[index] ? maxValIndex : index;
    }
    if (modulsID.length > 0) {
        return modulsID[maxValIndex];
    } else {
        return "";
    }
}