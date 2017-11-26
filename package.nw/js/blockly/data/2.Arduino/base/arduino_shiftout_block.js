Blockly.Blocks['arduino_shiftout'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Программный SPI - передача данных \u27F9");
    this.appendDummyInput()
        .appendField("Data PIN")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "DATAPIN")
        .appendField("Clock PIN")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "CLOCKPIN")
        .appendField("ChipSelect:")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "LATCHPIN");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["Старшим вперёд", "MSBFIRST"], ["Младшим вперёд", "LSBFIRST"]]), "BITDIR");
    this.appendValueInput("DATA");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(180);
    this.setTooltip('Модуль порограммного SPI. Позволяет передавать данные между различной периферией.\n' + 
                    'ChipSelect используется всегда по низкому уровню. Можно не подключать пин (но  он всегда будет управляться)');
    this.setHelpUrl('');
  }
};