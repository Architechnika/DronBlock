

Blockly.Arduino['arduino_serial_print'] = function(block) {
  var content = Blockly.Arduino.valueToCode(this, 'CONTENT', Blockly.Arduino.ORDER_ATOMIC) || '0';
  var dropdown_baude = block.getFieldValue('BAUDE');
  var dropdown_method = block.getFieldValue('SPMETHOD');

  Blockly.Arduino.setups_['setup_serial'] = 'Serial.begin(' + dropdown_baude + ');\n';

  var code = `Serial.${dropdown_method}(${content});\n`;
  return code;
};

