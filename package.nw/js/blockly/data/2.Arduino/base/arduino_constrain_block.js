Blockly.Blocks['arduino_constrain'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Ограничение диапазоном");
    this.appendValueInput("MIN")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Нижняя граница");
    this.appendValueInput("MAX")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Верхняя граница");
    this.appendValueInput("VAL")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Значение");
    this.setOutput(true, "Number");
    this.setColour(180);
    this.setTooltip('Ограничивает входное значение указанным диапазоном');
    this.setHelpUrl('');
  }
};