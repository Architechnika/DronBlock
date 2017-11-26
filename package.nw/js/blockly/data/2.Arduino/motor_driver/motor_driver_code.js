Blockly.Arduino['arduino_motor_driver'] = function(block) {
  var in1 = block.getFieldValue('IN1');
  var in2 = block.getFieldValue('IN2');
  var side = block.getFieldValue('side');
  var speed = Blockly.Arduino.valueToCode(block, 'speed', Blockly.Arduino.ORDER_ATOMIC);

  if(!speed) speed = 0;
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  Blockly.Arduino.definitions_[`ArTMotorDriver`]    = '#include "ArTMotorDriver.h"';
  Blockly.Arduino.definitions_[`ArTPort`]           = '#include "ArTPort.h"';
  

  // #define - если требуется - указать дефайны
  Blockly.Arduino.definitions_[`define_port_${in1}${in2}`] = 
		`ArTPort port_${in1}${in2}(0, ${in1}, ${in2});`;

  Blockly.Arduino.definitions_[`define_motor_${in1}${in2}`] = 
		`ArTMotorDriver motor_${in1}${in2}(&port_${in1}${in2});\n`;

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = `motor_${in1}${in2}.Drive(${speed} * ${side});\n`;
  return code;
};