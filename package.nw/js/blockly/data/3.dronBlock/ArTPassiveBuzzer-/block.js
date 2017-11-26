
Blockly.Blocks['passive_buzzer_ky006'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(image('ArTPassiveBuzzer'), 64, 64, "*"))
        .appendField("Малый пассивный модуль зуммер (KY-006):")
        .appendField(new Blockly.FieldDropdown(ports), "ports");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Нота:")
        .appendField(new Blockly.FieldDropdown(notes), "notes");
    this.appendValueInput("delay")
        .setAlign(Blockly.ALIGN_RIGHT)
        .setCheck("Number")
        .appendField("(задержка, мс)");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip('Подключение:\n\
GND (-) - Сниий провод\n\
Pwr (+) - Не подключать\n\
Out (S) - Белый провод');
    this.setHelpUrl('');
  }
};
