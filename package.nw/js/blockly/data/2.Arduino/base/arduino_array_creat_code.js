Blockly.Arduino['arduino_array_creat'] = function(block) {
  var variable_array = Blockly.Arduino.variableDB_.getName(block.getFieldValue('ARRAY'), Blockly.Variables.NAME_TYPE);
  var dropdown_data_type = block.getFieldValue('DATA_TYPE');
  var value_line = Blockly.Arduino.valueToCode(block, 'LINE', Blockly.Arduino.ORDER_ATOMIC);
  var value_row = Blockly.Arduino.valueToCode(block, 'ROW', Blockly.Arduino.ORDER_ATOMIC);
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  // Blockly.Arduino.definitions_['уникальное имя'] = '#include <библиотека>';

  // #define - если требуется - указать дефайны
  // Blockly.Arduino.definitions_['уникальное имя'] = '#define что-то чем-то';

  if(value_line < 2)
  {
    Blockly.Arduino.definitions_[variable_array] = 
      `${dropdown_data_type} ${variable_array}[${value_row}];\n`;
  }
  else
  {
    Blockly.Arduino.definitions_[variable_array] = 
      `${dropdown_data_type} ${variable_array}[${value_line}][${value_row}];\n`;
  }
  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = '';
  return code;
};