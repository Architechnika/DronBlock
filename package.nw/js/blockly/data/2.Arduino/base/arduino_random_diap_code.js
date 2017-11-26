Blockly.Arduino['arduino_random_diap'] = function(block) {
  var value_start = Blockly.Arduino.valueToCode(block, 'START', Blockly.Arduino.ORDER_ATOMIC);
  var value_end = Blockly.Arduino.valueToCode(block, 'END', Blockly.Arduino.ORDER_ATOMIC);
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  // Blockly.Arduino.definitions_['уникальное имя'] = '#include <библиотека>';

  // #define - если требуется - указать дефайны
  Blockly.Arduino.setups_['random'] = 'randomSeed(analogRead(A4));';

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = `random(${value_start}, ${value_end})`;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Arduino.ORDER_NONE];
};