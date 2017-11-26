Blockly.Blocks['main_programm_block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Инициализация");
    this.appendStatementInput("setup")
        .setCheck(null);
    this.appendDummyInput()
        .appendField("Действия");
    this.appendStatementInput("loop")
        .setCheck(null);
    this.setColour(20);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};