'use strict';
/*GENERATE*/

//goog.provide('Blockly.Arduino.ardutech.linecense');

//goog.require('Blockly.Arduino');

// ИК датчик линии
Blockly.Arduino.artirsence = function(block) {
	var dropdown_ports = this.getFieldValue('ports');
	var value_cnt = Blockly.Arduino.valueToCode(block, 'cnt', Blockly.Arduino.ORDER_ATOMIC);

	// #include
    Blockly.Arduino.definitions_['artport'] = '#include <ArTPort.h>';
    Blockly.Arduino.definitions_['artirsence'] = '#include <ArTIRSence.h>';
  
  // definitions
	Blockly.Arduino.definitions_['define_port_%0'.replace(/%0/g,dropdown_ports)] = 
		'ArTPort port_%0(%0);'
			.replace(/%0/g, dropdown_ports);
	Blockly.Arduino.definitions_['define_irsence_%0'.replace(/%0/g,dropdown_ports)] = 
		'ArTIRSence analogIR_%0(&port_%0);\n'
			.replace(/%0/g, dropdown_ports);		
		
  // void setup()
//  Blockly.Arduino.setups_['setup_motor_'+dropdown_ports] = 'ArTMotorDriver motor_%0(%0);'.replace(/%0/g, dropdown_ports);
  
  // void loop() 
	var code = 'analogIR_%0.getIntensity(%1)'
				.replace(/%0/g, dropdown_ports)
				.replace(/%1/g, value_cnt);
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};