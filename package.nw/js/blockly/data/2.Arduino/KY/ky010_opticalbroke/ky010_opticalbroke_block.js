Blockly.Blocks['ky010_opticalbroke'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(arduino_image('KY/ky010_opticalbroke'), 64, 64, "*")) 
        .appendField("Фотодатчик (KY-010)");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("пин:")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN");
    this.appendValueInput("TIME")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(", фильтр:");
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