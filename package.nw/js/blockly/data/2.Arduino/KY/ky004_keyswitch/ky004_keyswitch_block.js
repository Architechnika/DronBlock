Blockly.Blocks['ky004_keyswitch'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(arduino_image('KY/ky004_keyswitch'), 64, 64, "*"))
        .appendField("Кнопка (KY-004), пин:")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN");
    this.appendValueInput("time")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("фильтр:");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("мс");
    this.setInputsInline(true);
    this.setOutput(true);
    this.setColour(300);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
