'use strict';
/*BLOKS*/

// модуль управления моментным бвигателем
Blockly.Blocks['artmotordriver'] = {
  init: function() {
    this.appendDummyInput()
	.appendField(new Blockly.FieldImage(image('ArTMotordriver'), 64, 64, "*"))
        .appendField("Мотор:")
        .appendField(new Blockly.FieldDropdown(ports), "ports")
        .appendField("вращать в ")
        .appendField(new Blockly.FieldDropdown([["⟲", "left"], ["⟳", "right"]]), "placeside");
    this.appendValueInput("SPD")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("со скоростью:");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip(
'Модуль управление двигателем.\n\
В качестве входных параметров принимает Порт, к которому подключен двигатель, и скорость вращения.\n\
Отрицательные значения скорости заставляют вращаться мотор в противоположном направлении.\
');
  }
};
