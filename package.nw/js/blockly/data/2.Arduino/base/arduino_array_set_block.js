Blockly.Blocks['arduino_array_set'] = {
  init: function() {
    this.appendValueInput("VAL")
        .appendField("Присвоить значение");
    this.appendDummyInput()
        .appendField("ячейке массива")
        .appendField(new Blockly.FieldVariable(Blockly.LANG_VARIABLES_SET_ITEM), "ARRAY");
    this.appendValueInput("LINE")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Строка:");
    this.appendValueInput("ROW")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Столбец:");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(65);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};