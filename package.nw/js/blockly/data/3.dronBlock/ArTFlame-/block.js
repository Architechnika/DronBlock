Blockly.Blocks['artflame_sence'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(image('ArTFlame'), 64, 64, "*"))
        .appendField("Датчик огня (KY-026):")
        .appendField(new Blockly.FieldDropdown(ports), "port");

    this.setOutput(true, "Number");
    this.setColour(120);
    this.setTooltip('Датчик пламени. Определяет условное значение интенсивности огня');
    this.setHelpUrl('');
  }
};
