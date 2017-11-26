Blockly.Blocks['arduino_motor_driver'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(arduino_image('motor_driver'), 64, 64, "*"))    
        .appendField("Мотор")
        .appendField("Направление:")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "IN1")
        .appendField("Скорость:")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "IN2");
    this.appendValueInput("speed")
        //.setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(" ")
        .appendField(new Blockly.FieldDropdown([["⟳", "1"], ["⟲", "-1"]]), "side")
        .appendField("Скорость:");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(300);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};