'use strict';

//To support syntax defined in http://arduino.cc/en/Reference/HomePage

////goog.provide(''Blockly.Blocks.arduino');

////goog.require('Blockly.Blocks');


Blockly.Blocks['arduino_digital_write'] = {
  helpUrl: 'http://arduino.cc/en/Reference/DigitalWrite',
  init: function() {
    this.setColour(180);
    this.appendDummyInput()
	    .appendField("Цифровой пин")
	    .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN")
      	.appendField(new Blockly.FieldDropdown([
                                                    ["в HIGH", "HIGH"], 
                                                    ["в LOW", "LOW"],
                                                    ["подтянуть вход", "INPUT_PULLUP"]
                                                    
                                                ]), "STAT");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Устанавливает на цифровом выходе либо 1 либо 0");
  }
};

Blockly.Blocks['arduino_digital_read'] = {
  helpUrl: 'http://arduino.cc/en/Reference/DigitalRead',
  init: function() {
    this.setColour(180);
    this.appendDummyInput()
	      .appendField("Читать цифровой пин")
	      .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN");
    this.setOutput(true, 'Boolean');
    this.setTooltip('');
  }
};

Blockly.Blocks['arduino_analog_write'] = {
  helpUrl: 'http://arduino.cc/en/Reference/AnalogWrite',
  init: function() {
    this.setColour(180);
    this.appendDummyInput()
        .appendField("Аналоговый выход")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN");
    this.appendValueInput("NUM", 'Number')
        .appendField("значение")
        .setCheck('Number');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Write analog value between 0 and 255 to a specific Port');
  }
};

Blockly.Blocks['arduino_analog_read'] = {
  helpUrl: 'http://arduino.cc/en/Reference/AnalogRead',
  init: function() {
    this.setColour(180);
    this.appendDummyInput()
        .appendField("Читать аналоговый пин")
        .appendField(new Blockly.FieldDropdown(profile.default.analog), "PIN");
    this.setOutput(true, 'Number');
    this.setTooltip('Return value between 0 and 1024');
  }
};
