Blockly.Arduino['ky010_opticalbroke'] = function(block) {
  var dropdown_pin = block.getFieldValue('PIN');
  var value_time = Blockly.Arduino.valueToCode(block, 'TIME', Blockly.Arduino.ORDER_ATOMIC);
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  Blockly.Arduino.definitions_['include_triggerInput'] = '#include "triggerInput.h"';

  // #define - если требуется - указать дефайны
  Blockly.Arduino.definitions_[`ky010_${dropdown_pin}`] =
      `// Фотопрерыватель\nTriggerInput trig_${dropdown_pin}(${dropdown_pin});\n`;

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = `trig_${dropdown_pin}.getTrigged(${value_time})`;
  // TODO: Change ORDER_NONE to the correct strength. 
  return [code, Blockly.Arduino.ORDER_NONE];
};