Blockly.Arduino['arduino_serial_settimeout'] = function(block) {
  var value_timeout = Blockly.Arduino.valueToCode(block, 'TIMEOUT', Blockly.Arduino.ORDER_ATOMIC);
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  // Blockly.Arduino.definitions_['уникальное имя'] = '#include <библиотека>';

  // #define - если требуется - указать дефайны
  // Blockly.Arduino.definitions_['уникальное имя'] = '#define что-то чем-то';

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['setup_serial_' + dropdown_baude] = 'Serial.begin(' + dropdown_baude + ');\n';

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = `Serial.setTimeout(${value_timeout});\n`;
  return code;
};