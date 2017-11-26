Blockly.Blocks['ky009_3fullcolorled'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(arduino_image('KY/ky009_3fullcolorled'), 64, 64, "*"))
        .appendField("R")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN_R")
        .appendField("G")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN_G")
        .appendField("B")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN_B")
        .appendField("светодиод (KY-009)");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Цвет")
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
        .appendField("Состояние")
        .appendField(new Blockly.FieldDropdown([["ВКЛ", "1"], ["ВЫКЛ", "0"]]), "state");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(300);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};