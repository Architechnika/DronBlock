Blockly.Blocks['arduino_serial_available'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Доступно данных в последовательном порту");
    this.setOutput(true);
    this.setColour(180);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};