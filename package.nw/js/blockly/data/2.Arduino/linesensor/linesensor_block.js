Blockly.Blocks['arduino_linesensor'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(arduino_image('linesensor'), 64, 64, "*"))   
        .appendField("Датчик линии пин:")
        .appendField(new Blockly.FieldDropdown(profile.default.analog), "PIN");
    this.appendValueInput("DELAY")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("фильтр отсчётов");
    this.setOutput(true);
    this.setColour(300);
    this.setTooltip('фильтр осчётов определяет по скольки измерениям считать среднее арифметическое показаний датчика');
    this.setHelpUrl('');
  }
};