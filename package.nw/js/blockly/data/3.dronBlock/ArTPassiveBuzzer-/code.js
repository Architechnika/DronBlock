Blockly.Arduino['passive_buzzer_ky006'] = function(block) {
  var dropdown_ports = block.getFieldValue('ports');
  var dropdown_notes = block.getFieldValue('notes');
  var value_delay = Blockly.Arduino.valueToCode(block, 'delay', Blockly.Arduino.ORDER_ATOMIC);
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
 //  Blockly.Arduino.definitions_['pass_sence'] = '#include <Pass.h>';

  // #define - если требуется - указать дефайны
   Blockly.Arduino.definitions_['define_port_%0'.replace(/%0/g,dropdown_ports)] =
   'ArTPort port_%0(%0);'
        .replace(/%0/g, dropdown_ports);

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = '// звучит нота \ntone(port_%0.PWM(), %1, %2);'
                         .replace(/%0/g, dropdown_ports)
                         .replace(/%1/g, dropdown_notes)
                         .replace(/%2/g, value_delay);

    //var code = ' nnn ';
    // TODO: Change ORDER_NONE to the correct strength.
  return code;
};
