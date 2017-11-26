Blockly.Arduino['art_system_led'] = function(block) {
  var dropdown_mode = block.getFieldValue('mode');
  var dropdown_systemled = block.getFieldValue('systemled');
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  // Blockly.Arduino.definitions_['уникальное имя'] = '#include <библиотека>';

  // #define - если требуется - указать дефайны
  // Blockly.Arduino.definitions_['уникальное имя'] = '#define что-то чем-то';

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  Blockly.Arduino.setups_['art_system_led_%0'.replace(/%0/g, dropdown_systemled)]
                            =   '// инициализируем системный светодиодный индикатор\n' +
                                tab + 'pinMode(%0, OUTPUT);\n'.replace(/%0/g, dropdown_systemled);

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code =    '// управление системный индикаторныйм светодиодом\n' +
                'digitalWrite(%0, %1);\n'
                    .replace(/%0/g, dropdown_systemled)
                    .replace(/%1/g, dropdown_mode);
  return code;
};
