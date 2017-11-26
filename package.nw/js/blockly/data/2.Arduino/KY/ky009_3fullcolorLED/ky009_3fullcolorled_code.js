Blockly.Arduino['ky009_3fullcolorled'] = function(block) {
  var dropdown_pin_r = block.getFieldValue('PIN_R');
  var dropdown_pin_g = block.getFieldValue('PIN_G');
  var dropdown_pin_b = block.getFieldValue('PIN_B');
  var dropdown_color = block.getFieldValue('color');
  var dropdown_state = block.getFieldValue('state');

  var number_block = `${dropdown_pin_r}${dropdown_pin_g}${dropdown_pin_b}`;
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  Blockly.Arduino.definitions_[`ky009_include_${number_block}`] = 
        '#include "ArTPort.h"\n#include "ArTLed3color.h"\n';

  // #define - если требуется - указать дефайны
  Blockly.Arduino.definitions_[`ky009_3fullcolorled${number_block}`] =
`// Многоцветный светодиод RGB
ArTPort port_${number_block}(${dropdown_pin_b}, ${dropdown_pin_g}, ${dropdown_pin_r});
ArTLed3color ky009_3fullcolorled${number_block}(&port_${number_block});
`;

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = '(!!! что-то пошло не так !!!)';

  if(dropdown_state == 1)
  {
      code = `ky009_3fullcolorled${number_block}.ON(${dropdown_color});\n`;
  }
  else
  {
      code = `ky009_3fullcolorled${number_block}.OFF();\n`;
  }

  return code;
};