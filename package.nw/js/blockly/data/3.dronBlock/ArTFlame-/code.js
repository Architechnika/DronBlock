Blockly.Arduino['artflame_sence'] = function(block) {
  var dropdown_port = block.getFieldValue('port');
    // #include - ниже следует добавить бибилотеки, необходимые для модуля
    Blockly.Arduino.definitions_['artport'] = '#include <ArTPort.h>';
    Blockly.Arduino.definitions_['artflame_sence'] = '#include <ArTFlame.h>';

  // #define - если требуется - указать дефайны
   Blockly.Arduino.definitions_['define_port_%0'.replace(/%0/g,dropdown_port)] =
		'ArTPort port_%0(%0);'
			.replace(/%0/g, dropdown_port);
	Blockly.Arduino.definitions_['define_flame_sence_%0'.replace(/%0/g,dropdown_port)] =
		'ArTFlame flame_sence_%0(&port_%0);\n'
			.replace(/%0/g, dropdown_port);

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = 'flame_sence_%0.GetValue()'
							.replace(/%0/g, dropdown_port);
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Arduino.ORDER_NONE];
};
