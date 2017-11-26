Blockly.Blocks['ide_break'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Прервать выполнение");
    this.setPreviousStatement(true);
    this.setColour(120);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};