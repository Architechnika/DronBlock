Blockly.Blocks['ide_variables_set'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Присвоить переменной")
        .appendField(new Blockly.FieldVariable(Blockly.LANG_VARIABLES_SET_ITEM), "NAME");
    this.appendValueInput("VAL")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("значение");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setInputsInline(true);
    this.setColour(270);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};