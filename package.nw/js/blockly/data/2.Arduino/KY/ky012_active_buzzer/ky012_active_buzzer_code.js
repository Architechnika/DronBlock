Blockly.Arduino['ky012_active_buzzer'] = function(block) {
  var dropdown_pin = block.getFieldValue('PIN');
  var value_time = Blockly.Arduino.valueToCode(block, 'TIME', Blockly.Arduino.ORDER_ATOMIC);
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  // Blockly.Arduino.definitions_['уникальное имя'] = '#include <библиотека>';

  // #define - если требуется - указать дефайны
 // Blockly.Arduino.definitions_[`ky006_def_${dropdown_pin}`] = 'pinMode (buzzer, OUTPUT) ;';

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  Blockly.Arduino.setups_[`ky006_def_${dropdown_pin}`] = `// активный пьезоизлучатель\npinMode(${dropdown_pin}, OUTPUT);\n`;

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = 'что-тто пошло не так';

  if(value_time == 0)
  {
      code = 
`
digitalWrite(${dropdown_pin}, HIGH); // включаем звучание 
`;

  }
  else if(value_time[1] == '-')
  {
      code = 
`
digitalWrite(${dropdown_pin}, LOW); // выключаем
`;

  }
  else
  {
      code = 
`
digitalWrite(${dropdown_pin}, HIGH); // включаем звучание 
delay(${value_time}); // длительность звучания
digitalWrite(${dropdown_pin}, LOW); // выключаем
`;

  }



  // TODO: Change ORDER_NONE to the correct strength.
  return code;
};