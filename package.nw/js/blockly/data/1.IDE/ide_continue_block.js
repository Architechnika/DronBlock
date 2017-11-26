Blockly.Blocks['ide_continue'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Продолжить выполнение");
    this.setPreviousStatement(true);
    this.setColour(120);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};