Blockly.Blocks['programm_block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Инициализация");
    this.appendStatementInput("setup");
    this.appendDummyInput()
        .appendField("Основная программа");
    this.appendStatementInput("loop");
    this.setColour(20);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};