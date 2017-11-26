

'use strict';

Blockly.Blocks['arduino_serial_write'] = {
  init: function() {
    this.setColour(180);
    this.appendDummyInput()
        .appendField("Последовательный порт. Передать на скорости ")
        .appendField(new Blockly.FieldDropdown(profile.default.serial), "BAUDE");
    this.appendValueInput("CONTENT")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(" данные:");
    this.appendValueInput("LEN")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("длиной:");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Prints data to the console/serial port as human-readable ASCII text.');
  }
};