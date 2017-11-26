Blockly.Blocks['arduino_tone'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["Включить", "1"], ["Выключить", "0"]]), "ENA")
        .appendField("тональный сигнал на")
        .appendField("пине:")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN");
    this.appendValueInput("freq")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("частота:");
    this.appendValueInput("duration")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("длительность:");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(180);
    this.setTooltip('Управляет звуковым сигналом на внешнем пине.\n' + 
                    'Частота должна иметь значение от 35 до 65535\n' + 
                    'Длительность задаётся в миллисекундах\n' + 
                    'Может не работать с пинами, не поддерживающими ШИМ');
    this.setHelpUrl('');
  }
};