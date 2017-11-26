Blockly.Arduino['arduino_array_set'] = function(block) {
  var value_val = Blockly.Arduino.valueToCode(block, 'VAL', Blockly.Arduino.ORDER_ATOMIC);
  var variable_array = Blockly.Arduino.variableDB_.getName(block.getFieldValue('ARRAY'), Blockly.Variables.NAME_TYPE);
  var value_line = Blockly.Arduino.valueToCode(block, 'LINE', Blockly.Arduino.ORDER_ATOMIC);
  var value_row = Blockly.Arduino.valueToCode(block, 'ROW', Blockly.Arduino.ORDER_ATOMIC);
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  // Blockly.Arduino.definitions_['уникальное имя'] = '#include <библиотека>';

  // #define - если требуется - указать дефайны
  // Blockly.Arduino.definitions_['уникальное имя'] = '#define что-то чем-то';

  if(Blockly.Arduino.definitions_[variable_array] == undefined || Blockly.Arduino.definitions_[variable_array] == '')
  {
    if(value_line < 2)
    {
      Blockly.Arduino.definitions_[variable_array] = '%0 %1[%2];\n'.replace(/%0/, 'int')
                                                                .replace(/%1/, variable_array)
                                                                .replace(/%2/, value_row);
    }
    else
    {
      Blockly.Arduino.definitions_[variable_array] = '%0 %1[%2][%3];\n'.replace(/%0/, 'int')
                                                                    .replace(/%1/, variable_array)
                                                                    .replace(/%2/, value_line)
                                                                    .replace(/%3/, value_row);
    }
  }
  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = 'что-то пошло не так';

  if(value_line < 2)
  {
    code = '%0[%1] = %2;\n'.replace(/%0/, variable_array)
                          .replace(/%1/, value_row)
                          .replace(/%2/, value_val);
  }
  else
  {
    code = '%0[%1][%2] = %3;\n'.replace(/%0/, variable_array)
                          .replace(/%1/, value_line)
                          .replace(/%2/, value_row)
                          .replace(/%3/, value_val);
  }
  return code;
};