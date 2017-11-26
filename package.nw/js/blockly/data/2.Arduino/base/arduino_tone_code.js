Blockly.Arduino['arduino_tone'] = function(block) {
  var dropdown_ena = block.getFieldValue('ENA');
  var dropdown_pin = block.getFieldValue('PIN');
  var value_freq = Blockly.Arduino.valueToCode(block, 'freq', Blockly.Arduino.ORDER_ATOMIC);
  var value_duration = Blockly.Arduino.valueToCode(block, 'duration', Blockly.Arduino.ORDER_ATOMIC);
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  // Blockly.Arduino.definitions_['уникальное имя'] = '#include <библиотека>';

  // #define - если требуется - указать дефайны
  // Blockly.Arduino.definitions_['уникальное имя'] = '#define что-то чем-то';

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = 'что-то пошло не так';

  if(dropdown_ena == 1)
  {
    code = 'tone(%0, %1, %2);\n'
                .replace(/%0/g, dropdown_pin)
                .replace(/%1/g, value_freq)
                .replace(/%2/g, value_duration);
  }
  else
  {
    code = 'notone(%0);\n'.replace(/%0/g, dropdown_pin);
  }
  return code;
};