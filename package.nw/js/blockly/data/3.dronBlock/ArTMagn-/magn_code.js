
Blockly.Arduino['artmagn'] = function(block) {
    var dropdown_ports = block.getFieldValue('ports');
    var dropdown_work_mode = block.getFieldValue('work_mode');
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  // Blockly.Arduino.definitions_['artmagn'] = '#include <Magn.h>';

  // #define - если требуется - указать дефайны
   Blockly.Arduino.definitions_['define_port_%0'.replace(/%0/g,dropdown_ports)] =
		'ArTPort port_%0(%0);'
			.replace(/%0/g, dropdown_ports);
	Blockly.Arduino.definitions_['define_artmagn_%0'.replace(/%0/g,dropdown_ports)] =
		'ArTMagn magn_sence_%0(&port_%0);\n'
			.replace(/%0/g, dropdown_ports);

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
    var code = '(!!! что-то пошло не так !!!)';

    if(dropdown_work_mode == 1)
    {
        code = 'magn_sence_%0.isTrigged()'
                               .replace(/%0/g, dropdown_ports);
    }
    else
    {
        code = 'magn_sence_%0.GetValue()'
                               .replace(/%0/g, dropdown_ports);
    }
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Arduino.ORDER_NONE];
};
