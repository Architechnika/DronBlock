Blockly.Arduino['arduino_ultrasonic'] = function(block) {
  var dropdown_trig = block.getFieldValue('TRIG');
  var dropdown_echo = block.getFieldValue('ECHO');
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  Blockly.Arduino.definitions_[`ultrasonic`]           = '#include "Ultrasonic.h"';

  // #define - если требуется - указать дефайны
  /*// Trig - 12, Echo - 13
Ultrasonic ultrasonic(12, 13);*/
    Blockly.Arduino.definitions_[`define_soundsence_${dropdown_echo}`] = 
        `Ultrasonic ultrasonic_${dropdown_trig}(${dropdown_trig}, ${dropdown_echo});\n`;

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = `ultrasonic_${dropdown_trig}.Ranging(CM)`;

  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Arduino.ORDER_NONE];
};