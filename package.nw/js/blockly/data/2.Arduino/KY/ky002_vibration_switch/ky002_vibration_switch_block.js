Blockly.Blocks['ky002_vibration_switch'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(arduino_image('KY/ky002_vibration_switch'), 64, 64, "*"))
        .appendField("Датчик вибрации (KY-002)")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN");
    this.setOutput(true);
    this.setColour(300);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
