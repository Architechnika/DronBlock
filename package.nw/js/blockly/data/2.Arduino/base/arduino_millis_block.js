Blockly.Blocks['arduino_millis'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Время от запуска программы, мс");
    this.setOutput(true);
    this.setColour(180);
    this.setTooltip('Возвращает количество милисекунд, прошедших от момента запуска программы.');
    this.setHelpUrl('');
  }
};