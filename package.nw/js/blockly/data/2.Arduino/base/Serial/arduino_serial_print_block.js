Blockly.Blocks['arduino_serial_print'] = {
  helpUrl: 'http://www.arduino.cc/en/Serial/Print',
  init: function() {
    this.setColour(180);
    this.appendValueInput("CONTENT", 'String')
        .appendField("Последовательный порт. Передать ")
        .appendField(new Blockly.FieldDropdown([
                                                ["строку", "print"], 
                                                ["строку с окончанием", "println"]
                                                ]), "SPMETHOD")
        .appendField(" на скорости:")
        .appendField(new Blockly.FieldDropdown(profile.default.serial), "BAUDE");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Prints data to the console/serial port as human-readable ASCII text.');
  }
};


