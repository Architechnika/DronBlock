/**/


'use strict';

Blockly.Blocks['arduino_map'] = {
  helpUrl: 'http://arduino.cc/en/Reference/map',
  init: function() {
    this.setColour(180);
    this.appendValueInput("NUM", 'Number')
        .appendField("Перевести ") 
        .setCheck('Number');
	this.appendDummyInput()
        .appendField("из диапазона ");
	this.appendValueInput("FMIN", 'Number')
        .appendField("от:")
        .setCheck('Number');
	this.appendValueInput("FMAX", 'Number')
        .appendField("до:")
        .setCheck('Number');
    this.appendValueInput("DMIN", 'Number')
        .appendField("в диапазон от:")
        .setCheck('Number');
	this.appendValueInput("DMAX", 'Number')
        .appendField("до:")
        .setCheck('Number');
    this.setInputsInline(true);
    this.setOutput(true);
    this.setTooltip('Переводит значение из одного диапазона в другой.');
  }
};