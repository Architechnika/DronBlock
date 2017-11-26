
Blockly.Blocks['ky006_passive_buzzer'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(arduino_image('KY/ky006_passive_buzzer'), 64, 64, "*"))
        .appendField("Малый пассивный зуммер (KY-006):")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN")
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Нота:")
        .appendField(new Blockly.FieldDropdown(notes), "notes");
    this.appendValueInput("delay")
        .setAlign(Blockly.ALIGN_RIGHT)
        .setCheck("Number")
        .appendField("(задержка, мс)");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(300);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
