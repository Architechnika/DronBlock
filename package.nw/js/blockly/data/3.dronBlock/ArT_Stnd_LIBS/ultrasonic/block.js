'use strict';
/*BLOKS*/

//goog.provide('Blockly.Blocks.ardutech.ultrasonic');

//goog.require('Blockly.Blocks');

// модуль стения расстояния УЗ датчика HC-04
Blockly.Blocks['artsoundsence'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Расстояние УЗ датчика")
        .appendField(new Blockly.FieldDropdown(ports), "ports");
    this.setOutput(true, "Number");
    this.setColour(120);
    this.setTooltip('Модуль ультразвукового датчика расстояния от 1см до 4метров.\nВ качество входного параметра необходимо указать порт, к которому он подключен (указан на плате).');
    this.setHelpUrl('https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#riqr4z');
  }
};

