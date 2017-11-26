Blockly.Blocks['ky005_iremissionsensor'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(arduino_image('KY/ky005_iremissionsensor'), 64, 64, "*"))
        .appendField("ИК приёмник (KY-005), пин:")
        .appendField(new Blockly.FieldDropdown(profile.default.analog), "PIN");
    this.setInputsInline(true);
    this.setOutput(true);
    this.setColour(300);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};