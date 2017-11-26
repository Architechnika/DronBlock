Blockly.Blocks['artbarrier_sence'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(image('ArTBarrier'), 64, 64, "*"))
        .appendField("Датчик препятствия (KY-032):")
        .appendField(new Blockly.FieldDropdown(ports), "port")
    this.appendValueInput("delay")
        .setAlign(Blockly.ALIGN_RIGHT)
        .setCheck("Number")
        .appendField("Задержка чтения");
    this.setOutput(true, "Boolean");
    this.setColour(120);
    this.setTooltip(
'Цифровой датчик препятствия\n\
Подключение:\n\
+ - красный провод\n\
- - синий провод\n\
OUT - белый провод\n\
EN - желтый провод\
');
    this.setHelpUrl('');
  }
};
