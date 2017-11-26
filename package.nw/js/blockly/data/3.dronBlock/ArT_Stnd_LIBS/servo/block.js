'use strict';
/*BLOKS*/

//goog.provide('Blockly.Blocks.ardutech.servo');

//goog.require('Blockly.Blocks');

// модуль управления сервоприводом
Blockly.Blocks['artservo'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Установить сервопривод:")
        .appendField(new Blockly.FieldDropdown(ports), "ports");
    this.appendValueInput("angle")
        .setCheck("Number")
        .appendField("на угол:");
	this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip('Модуль управления сервоприводом с ограниченным вращением.\nВ качестве входных параметров принимает номер порта, к которому подключен, и угол в градусах.');
    this.setHelpUrl('https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#wbeppm');
  }
};
