Blockly.Blocks['arduino_serial_settimeout'] = {
  init: function() {
    this.appendValueInput("TIMEOUT")
        .setCheck("Number")
        .appendField("Последовательный порт. Установить время ожидания");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(180);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};