Blockly.Arduino['arduino_anytext'] = function(block) {
  var dropdown_place = block.getFieldValue('PLACE');
   var value_programm = block.getFieldValue('PROGRAMM');
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  // Blockly.Arduino.definitions_['уникальное имя'] = '#include <библиотека>';

  // #define - если требуется - указать дефайны
  // Blockly.Arduino.definitions_['уникальное имя'] = '#define что-то чем-то';

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
 
 
 
  var code = 'то, что ставится по месту установки блока согласно логике программы';

  value_programm = value_programm.replace(/\'/g, '').replace(/\"/g, '') + '\n';

  switch(dropdown_place)
  {
    case 'define':
    {
      Blockly.Arduino.definitions_['arduino_anytext_'+dropdown_place] = value_programm;
      code = '';
    }break;

    case 'setup':
    {
      Blockly.Arduino.setups_['arduino_anytext_'+dropdown_place] = value_programm;
      code = '';
    }break;

    case 'loop':
    {
      Blockly.Arduino.loops_['arduino_anytext_'+dropdown_place] = value_programm;
      code = '';
    }break;

    case 'inplace':
    {
      code = value_programm;
    }break;
  }

  return code;
};