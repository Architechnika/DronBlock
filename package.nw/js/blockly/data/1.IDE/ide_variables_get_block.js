Blockly.Blocks['ide_variables_get'] = {
  init: function() {
    this.appendDummyInput()
//        .appendField("Читать переменную")
        .appendField(new Blockly.FieldVariable(Blockly.LANG_VARIABLES_SET_ITEM), "NAME");
    this.setOutput(true);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};