Blockly.Blocks['arduinno_shftin'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Программный SPI - чтение данных \u27F8");
    this.appendDummyInput()
        .appendField("Data PIN")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "DATAPIN")
        .appendField("Clock PIN")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "CLOCKPIN")
        .appendField("ChipSelect PIN")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "LATCHPIN");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["Старшим вперёд", "MSBFIRST"], ["Младшим вперёд", "LSBFIRST"]]), "BITDIR");
    this.setOutput(true);
    this.setColour(180);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};