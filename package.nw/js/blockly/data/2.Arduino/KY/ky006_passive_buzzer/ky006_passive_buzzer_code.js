Blockly.Arduino['ky006_passive_buzzer'] = function(block) {
  var dropdown_pin = block.getFieldValue('PIN');
  var dropdown_notes = block.getFieldValue('notes');
  var value_delay = Blockly.Arduino.valueToCode(block, 'delay', Blockly.Arduino.ORDER_ATOMIC);
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
 //  Blockly.Arduino.definitions_['pass_sence'] = '#include <Pass.h>';

  // #define - если требуется - указать дефайны


  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = 
`// звучит нота
tone(${dropdown_pin}, ${dropdown_notes}, ${value_delay});
`;

    //var code = ' nnn ';
    // TODO: Change ORDER_NONE to the correct strength.
  return code;
};
