'use strict';
/*GENERATE*/

//goog.provide('Blockly.Arduino.ardutech.servo');

//goog.require('Blockly.Arduino');

// управление сервоприводом
Blockly.Arduino.artservo = function(block) {
	var dropdown_ports = this.getFieldValue('ports');
	var value_angle = Blockly.Arduino.valueToCode(block, 'angle', Blockly.Arduino.ORDER_ATOMIC);

	// #include
    Blockly.Arduino.definitions_['artport'] = '#include <ArTPort.h>';
	Blockly.Arduino.definitions_['artservo'] = '#include <Servo.h>';
  
  // definitions
	Blockly.Arduino.definitions_[`define_port_${dropdown_ports}`] = 
		`ArTPort port_${dropdown_ports}(${dropdown_ports});`;

	Blockly.Arduino.definitions_[`define_servo_${dropdown_ports}`] = 
		`Servo servo_${dropdown_ports};\n`;
		
  // void setup()
	Blockly.Arduino.setups_[`setup_servo_${dropdown_ports}`] = 
        `servo_${dropdown_ports}.attach(port_${dropdown_ports}.PWM());\n`;
  
  // void loop() 
	var code = `servo_${dropdown_ports}.write(${value_angle});\n`;

  return code;
};