Blockly.Arduino['artholl_sence'] = function(block) {
  var dropdown_ports = block.getFieldValue('ports');
  var dropdown_work_mode = block.getFieldValue('work_mode');
  var value_delay = Blockly.Arduino.valueToCode(block, 'delay', Blockly.Arduino.ORDER_ATOMIC);
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  Blockly.Arduino.definitions_['artport'] = '#include <ArTPort.h>';
  Blockly.Arduino.definitions_['artholl_sence'] = '#include <ArTHoll.h>';

  // #define - если требуется - указать дефайны
   Blockly.Arduino.definitions_['define_port_%0'.replace(/%0/g,dropdown_ports)] =
   'ArTPort port_%0(%0);'
        .replace(/%0/g, dropdown_ports);
   Blockly.Arduino.definitions_['define_artholl_sence_%0'.replace(/%0/g,dropdown_ports)] =
   'ArTHoll holl_sence_%0(&port_%0);\n'
        .replace(/%0/g, dropdown_ports);

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = '(!!! что-то пошло не так !!!)';

  if(dropdown_work_mode == 1)
  {
      code = 'holl_sence_%0.isTrigged(%1)'
                             .replace(/%0/g, dropdown_ports)
                             .replace(/%1/g, value_delay);
  }
  else
  {
      code = 'holl_sence_%0.GetValue(%1)'
                             .replace(/%0/g, dropdown_ports)
                             .replace(/%1/g, value_delay);
  }

    //var code = ' nnn ';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};
