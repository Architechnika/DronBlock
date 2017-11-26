'use strict';
/*GENERATE*/

//goog.provide('Blockly.Arduino.ardutech.dcmotor');

//goog.require('Blockly.Arduino');

// управление моментным двигателем
Blockly.Arduino.artmotordriver = function() {
  var dropdown_ports = this.getFieldValue('ports');
  var dropdown_placeside = this.getFieldValue('placeside');
  var value_spd = Blockly.Arduino.valueToCode(this, 'SPD', Blockly.Arduino.ORDER_ATOMIC) || '100';
  
  // #include
    Blockly.Arduino.definitions_['artport'] = '#include <ArTPort.h>';
    Blockly.Arduino.definitions_['artmotordriver'] = '#include <ArTMotorDriver.h>';
  // definitions
  Blockly.Arduino.definitions_['define_port_%0'.replace(/%0/g,dropdown_ports)] = 
		'ArTPort port_%0(%0);'
			.replace(/%0/g, dropdown_ports);
  Blockly.Arduino.definitions_['define_motor_%0'.replace(/%0/g,dropdown_ports)] = 
		'ArTMotorDriver motor_%0(&port_%0);\n'
			.replace(/%0/g, dropdown_ports);
  
  // void setup()
  Blockly.Arduino.setups_[`setup_motor_${dropdown_ports}`] = `motor_${dropdown_ports}.Stop();\n`;
//  Blockly.Arduino.setups_[`setup_motor_${dropdown_ports}`] = 'motor_3' + dropdown_ports + '.Stop();\n';
  
  // void loop() 
  var code = (dropdown_placeside == 'left') ? 
			'motor_%0.Drive(%1 * (-1));\n'
				.replace(/%0/g, dropdown_ports)
				.replace(/%1/g, value_spd) :
			'motor_%0.Drive(%1);\n'
				.replace(/%0/g, dropdown_ports)
				.replace(/%1/g, value_spd) ;
  return code;
};
