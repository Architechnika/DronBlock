Blockly.Blocks['arduino_array_get'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Значение ячейки массива")
        .appendField(new Blockly.FieldVariable(Blockly.LANG_VARIABLES_SET_ITEM), "array");
    this.appendValueInput("LINE")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Строка:");
    this.appendValueInput("ROW")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Столбец:");
    this.setOutput(true);
    this.setColour(65);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};