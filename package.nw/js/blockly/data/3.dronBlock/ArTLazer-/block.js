Blockly.Blocks['artlazer_sence'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(image('ArTLazer'), 64, 64, "*"))
        .appendField("Красный лазерный излучатель (KY-008):")
        .appendField(new Blockly.FieldDropdown(ports), "ports");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Состояние:")
        .appendField(new Blockly.FieldDropdown([["ВКЛ", "1"], ["ВЫКЛ", "0"]]), "state");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(330);
    this.setTooltip(
'Модуль красного лазерного излучателя.\n\
+ - красный провод\n\
- - синий провод\n\
S - белый провод\
');
    this.setHelpUrl('');
  }
};
