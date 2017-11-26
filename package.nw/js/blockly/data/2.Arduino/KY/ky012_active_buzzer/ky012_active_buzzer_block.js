Blockly.Blocks['ky012_active_buzzer'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(arduino_image('KY/ky012_active_buzzer'), 64, 64, "*"))    
        .appendField("Активный пьезоизлучатель (KY-012)");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("пин:")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN");
    this.appendValueInput("TIME")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(", включить на");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("мс");
     this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(300);
    this.setTooltip(
`Блок управления пьезоизлучателем.
Введите длительность звучания:
1 - 3000 - для включения звучания на заданный период
-1 - для постоянного включения звука
0 - для выключения`);
    this.setHelpUrl('');
  }
};