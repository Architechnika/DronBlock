Blockly.Arduino['artbarrier_sence'] = function(block) {
  var dropdown_port = block.getFieldValue('port');
  var value_delay = Blockly.Arduino.valueToCode(block, 'delay', Blockly.Arduino.ORDER_ATOMIC);
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  Blockly.Arduino.definitions_['artport'] = '#include <ArTPort.h>';

  // #define - если требуется - указать дефайны
   Blockly.Arduino.definitions_['define_port_%0'.replace(/%0/g,dropdown_port)] =
		'ArTPort port_%0(%0);'.replace(/%0/g, dropdown_port);
	Blockly.Arduino.definitions_['define_artbarrier_sence_%0'.replace(/%0/g,dropdown_port)] =
		'ArTBarrier artbarrier_sence_%0(&port_%0);\n'.replace(/%0/g, dropdown_port);

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = 'artbarrier_sence_%0.isBarrier(%1)'
							.replace(/%0/g, dropdown_port)
							.replace(/%1/g, value_delay);
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Arduino.ORDER_NONE];
};
