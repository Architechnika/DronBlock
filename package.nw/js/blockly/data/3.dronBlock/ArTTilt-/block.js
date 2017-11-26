Blockly.Blocks['arttilt_sence_ky020'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(image('ArTTilt'), 64, 64, "*"))
        .appendField("Датчик наклона (KY-020):")
        .appendField(new Blockly.FieldDropdown(ports), "port");
    this.appendValueInput("delay")
        .setAlign(Blockly.ALIGN_RIGHT)
        .setCheck("Number")
        .appendField("(задержка, мс)");
    this.setOutput(true, "Boolean");
    this.setColour(120);
    this.setTooltip('Подключение:\n\
GND (-) - Сниий провод\n\
Pwr (+) - Красный провод\n\
Out (S) - Белый провод');
    this.setHelpUrl('');
  }
};
