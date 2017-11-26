Blockly.Arduino['ide_variables_set'] = function(block) {
  var variable_name = Blockly.Arduino.variableDB_.getName(block.getFieldValue('NAME'), Blockly.Variables.NAME_TYPE);
  var value_val = Blockly.Arduino.valueToCode(block, 'VAL', Blockly.Arduino.ORDER_ATOMIC);
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  // Blockly.Arduino.definitions_['уникальное имя'] = '#include <библиотека>';

  // #define - если требуется - указать дефайны
  // Blockly.Arduino.definitions_['уникальное имя'] = '#define что-то чем-то';

  if(Blockly.Arduino.definitions_[variable_name] == undefined || Blockly.Arduino.definitions_[variable_name] == '')
  {
    Blockly.Arduino.definitions_[variable_name] = 'int ' + variable_name + ';\n';
  }
  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = variable_name + ' = ' + value_val + ';\n';
  return code;
};