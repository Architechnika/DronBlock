Blockly.Blocks['arduino_random'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Случайное значение");
    this.setOutput(true);
    this.setColour(200);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};