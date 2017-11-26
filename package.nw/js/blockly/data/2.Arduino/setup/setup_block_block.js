Blockly.Blocks['setup_block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Инициализация");
    this.appendStatementInput("setup");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(180);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};