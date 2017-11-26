Blockly.Blocks['ky003_hall_magnetic'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(arduino_image('KY/ky003_hall_magnetic'), 64, 64, "*"))
        .appendField("Датчик Холла (KY-003)")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN");
    this.setOutput(true);
    this.setColour(300);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
