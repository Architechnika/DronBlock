Blockly.Blocks['arduino_array_creat'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Объявить массив:")
        .appendField(new Blockly.FieldVariable(Blockly.LANG_VARIABLES_SET_ITEM), "ARRAY");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Тип данных:")
        .appendField(new Blockly.FieldDropdown([["Целое знаковое", "int"], ["Целое беззнаковое", "unsigned int"], ["Дробное", "float"], ["Дробное точное", "double"]]), "DATA_TYPE");
    this.appendValueInput("LINE")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Строк:");
    this.appendValueInput("ROW")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Столбцов:");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(65);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};