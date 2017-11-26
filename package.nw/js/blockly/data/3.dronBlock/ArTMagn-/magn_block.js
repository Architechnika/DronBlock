
Blockly.Blocks['artmagn'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(image('ArTMagn'), 64, 64, "*"))
        .appendField("Датчик магнитного поля с герконом (KY-025):")
        .appendField(new Blockly.FieldDropdown(ports), "ports");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Режим работы:")
        .appendField(new Blockly.FieldDropdown([["Цифровой", "1"], ["Аналоговый", "0"]]), "work_mode");
    this.setOutput(true, "Number");
    this.setColour(120);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
