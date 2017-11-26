Blockly.Blocks['arduino_abs'] = {
  init: function() {
    this.appendValueInput("VALUE")
        .appendField("Абсолютное значение");
    this.setOutput(true);
    this.setColour(180);
    this.setTooltip('Возвращает абсолютное значение числа на входе:\n' +
                    'Если х = 1, то возвращает 1\n' + 
                    'Если x = -1, то возвращает 1');
    this.setHelpUrl('');
  }
};