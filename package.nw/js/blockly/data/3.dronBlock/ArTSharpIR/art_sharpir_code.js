Blockly.Arduino['art_sharpir'] = function(block) {
  var dropdown_sharptype = block.getFieldValue('sharptype');
  var dropdown_ports = block.getFieldValue('ports');
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  Blockly.Arduino.definitions_['artport'] = '#include <ArTPort.h>';
  Blockly.Arduino.definitions_['art_sharpir'] = '#include <SharpIR.h>';

  // #define - если требуется - указать дефайны
  Blockly.Arduino.definitions_['define_port_%0'.replace(/%0/g,dropdown_ports)] = 
		'ArTPort port_%0(%0);'
			.replace(/%0/g, dropdown_ports);
  Blockly.Arduino.definitions_['define_sharpir_%0'.replace(/%0/g,dropdown_ports)] = 
		'SharpIR sharp%0(port_%0.A(), %1);\n'
			.replace(/%0/g, dropdown_ports)
      .replace(/%1/g, dropdown_sharptype);

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = 'sharp%0.distance()'.replace(/%0/g, dropdown_ports);
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Arduino.ORDER_NONE];
};