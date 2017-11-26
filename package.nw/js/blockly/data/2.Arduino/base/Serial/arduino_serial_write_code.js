

'use strict';

Blockly.Arduino['arduino_serial_write'] = function(block) {
  var content = Blockly.Arduino.valueToCode(this, 'CONTENT', Blockly.Arduino.ORDER_ATOMIC) || '0';
  var dropdown_baude = block.getFieldValue('BAUDE');
  var len = Blockly.Arduino.valueToCode(this, 'LEN', Blockly.Arduino.ORDER_ATOMIC) || '0';

  Blockly.Arduino.setups_['setup_serial'] = 'Serial.begin(' + dropdown_baude + ');\n';

  var code = 'что-то пошло не так';

  if(len < 1)
  {
      code = `Serial.write(${content});\n`;
  }
  else
  {
      code = `Serial.write(${content}, ${len});\n`;
  }
  return code;
};