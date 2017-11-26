Blockly.Arduino['ide_variables_declare'] = function(block) {
  var variable_var = Blockly.Arduino.variableDB_.getName(block.getFieldValue('var'), Blockly.Variables.NAME_TYPE);
  var dropdown_varType = block.getFieldValue('varType');
  var dropdown_type = block.getFieldValue('TYPE');
  var value_value = Blockly.Arduino.valueToCode(block, 'value', Blockly.Arduino.ORDER_ATOMIC);
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  // Blockly.Arduino.definitions_['уникальное имя'] = '#include <библиотека>';

  // #define - если требуется - указать дефайны
  // Blockly.Arduino.definitions_['уникальное имя'] = '#define что-то чем-то';

  Blockly.Arduino.definitions_[variable_var] = dropdown_varType + ' ' + dropdown_type + ' ' + variable_var + ' = ' + value_value + ';\n';
  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = '';
  return code;
};