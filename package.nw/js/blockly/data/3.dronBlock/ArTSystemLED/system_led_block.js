Blockly.Blocks['art_system_led'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["Включить", "HIGH"], ["Выключить", "LOW"]]), "mode");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["Красный", "A5"], ["Зелёный", "A4"]]), "systemled")
        .appendField("светодиод");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(20);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
