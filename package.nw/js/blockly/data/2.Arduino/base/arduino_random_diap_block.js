Blockly.Blocks['arduino_random_diap'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Случайное значение из диапазона");
    this.appendValueInput("START")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("от");
    this.appendValueInput("END")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("до");
    this.setOutput(true);
    this.setColour(200);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};