'use strict';
/*GENERATE*/

//goog.provide('Blockly.Arduino.ardutech.ultrasonic');

//goog.require('Blockly.Arduino');

// датчик расстояния УЗ HC-04
Blockly.Arduino.artsoundsence = function(block) {
	var dropdown_ports = this.getFieldValue('ports');

	// #include
    Blockly.Arduino.definitions_['artport'] = '#include <ArTPort.h>';
    Blockly.Arduino.definitions_['artsoundsence'] = '#include <Ultrasonic.h>';
  
  // definitions
	Blockly.Arduino.definitions_['define_port_%0'.replace(/%0/g,dropdown_ports)] = 
		'ArTPort port_%0(%0);'
			.replace(/%0/g, dropdown_ports);
			/*// Trig - 12, Echo - 13
Ultrasonic ultrasonic(12, 13);*/
	Blockly.Arduino.definitions_['define_soundsence_%0'.replace(/%0/g,dropdown_ports)] = 
		'Ultrasonic ultrasonic_%0(port_%0.PWM(), port_%0.D());\n'
			.replace(/%0/g, dropdown_ports);		
		
  // void setup()
//  Blockly.Arduino.setups_['setup_motor_'+dropdown_ports] = 'ArTMotorDriver motor_%0(%0);'.replace(/%0/g, dropdown_ports);
  
  // void loop() 
	var code = 'ultrasonic_%0.Ranging(CM)'
				.replace(/%0/g, dropdown_ports);
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};