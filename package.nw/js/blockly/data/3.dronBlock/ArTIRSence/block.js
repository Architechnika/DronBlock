'use strict';
/*BLOKS*/

//goog.provide('Blockly.Blocks.ardutech.linecense');

//goog.require('Blockly.Blocks');

// модуль работы с датчиком линии
Blockly.Blocks['artirsence'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Яркость ИК датчика:")
        .appendField(new Blockly.FieldDropdown(ports), "ports");
    this.appendValueInput("cnt")
        .setCheck("Number")
        .appendField("(отсчетов на измерение)");
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(120);
    this.setTooltip('Модуль ИК датчика линии.\nВ качестве входных параметров принимает:\nПорт, к оторому подключен\nЧисло отсчетов, по которому работает.');
    this.setHelpUrl('https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#2jv3r7');
  }
};
