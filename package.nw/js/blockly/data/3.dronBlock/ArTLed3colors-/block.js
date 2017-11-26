Blockly.Blocks['artled3colors_sence'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(image('ArTLed3colors'), 64, 64, "*"))
        .appendField("3-цветный светод (KY-009):")
        .appendField(new Blockly.FieldDropdown(ports), "ports");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Цвет:")
        .appendField(new Blockly.FieldDropdown([
                                                    ["Красный", "4"],
                                                    ["Зелёный", "2"],
                                                    ["Синий", "1"],
                                                    ["Желтый", "6"], /*R + G*/
                                                    ["Голубой", "3"], /*G + B*/
                                                    ["Фиолетовый", "5"], /*B + R*/
                                                    ["Белый", "7"]
                                                ]), "color");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Состояние:")
        .appendField(new Blockly.FieldDropdown([["ВКЛ", "1"], ["ВЫКЛ", "0"]]), "state");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
