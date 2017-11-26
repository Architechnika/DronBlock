Blockly.Arduino['artled3colors_sence'] = function(block) {
  var dropdown_ports = block.getFieldValue('ports');
  var dropdown_color = block.getFieldValue('color');
  var dropdown_state = block.getFieldValue('state');
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  // Blockly.Arduino.definitions_['led_sence'] = '#include <Led.h>';

  // #define - если требуется - указать дефайны
  Blockly.Arduino.definitions_['define_port_%0'.replace(/%0/g,dropdown_ports)] =
   'ArTPort port_%0(%0);'
        .replace(/%0/g, dropdown_ports);
   Blockly.Arduino.definitions_['define_artled3colors_sence_%0'.replace(/%0/g,dropdown_ports)] =
   'ArTLed3color artled3colors_sence_%0(&port_%0);\n'
        .replace(/%0/g, dropdown_ports);

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)

  var code = '(!!! что-то пошло не так !!!)';

  if(dropdown_state == 1)
  {
      code = 'artled3colors_sence_%0.ON(%1);\n'
                             .replace(/%0/g, dropdown_ports)
                             .replace(/%1/g, dropdown_color);
  }
  else
  {
      code = 'artled3colors_sence_%0.OFF();\n'
                             .replace(/%0/g, dropdown_ports);
  }


  return code;
};
