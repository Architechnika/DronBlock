Blockly.Arduino['ky002_vibration_switch'] = function(block) {
  var dropdown_pin = block.getFieldValue('PIN');
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  Blockly.Arduino.definitions_['include_triggerInput'] = '#include "triggerInput.h"';

  // #define - если требуется - указать дефайны
  Blockly.Arduino.definitions_[`ky002_${dropdown_pin}`] = 
      `// Датчик вибрации\nTriggerInput trig_${dropdown_pin}(${dropdown_pin});\n`;

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_[`ky002_${dropdown_pin}`] = `pinMode(${dropdown_pin}, INPUT) ;`;

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = `trig_${dropdown_pin}.getRAW()`;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Arduino.ORDER_NONE];
};
