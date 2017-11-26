Blockly.Arduino['arduino_linesensor'] = function(block) {
  var dropdown_pin = block.getFieldValue('PIN');
  var value_delay = Blockly.Arduino.valueToCode(block, 'DELAY', Blockly.Arduino.ORDER_ATOMIC);
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  // Blockly.Arduino.definitions_['уникальное имя'] = '#include <библиотека>';

  // #define - если требуется - указать дефайны
  Blockly.Arduino.definitions_[`ArTIRSence`]    = '#include "ArTIRSence.h"';
  Blockly.Arduino.definitions_[`ArTPort`]       = '#include "ArTPort.h"';

  Blockly.Arduino.definitions_[`define_port_${dropdown_pin}`] = 
		`ArTPort port_${dropdown_pin}(${dropdown_pin}, 0, 0);`;

  Blockly.Arduino.definitions_[`define_irsence_${dropdown_pin}`] = 
		`ArTIRSence analogIR_${dropdown_pin}(&port_${dropdown_pin});\n`;
			

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = `analogIR_${dropdown_pin}.getIntensity(${value_delay})`;

  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Arduino.ORDER_NONE];
};