Blockly.Blocks['arduino_ultrasonic'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(arduino_image('ultrasonic'), 64, 64, "*"))   
        .appendField("Ультразвуковой датчик");
    this.appendDummyInput()
        .appendField("trig:")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "TRIG")
        .appendField("echo:")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "ECHO");
    this.setOutput(true);
    this.setColour(300);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};