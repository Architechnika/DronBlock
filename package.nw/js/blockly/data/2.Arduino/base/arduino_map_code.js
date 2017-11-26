
/**/

'use strict';



Blockly.Arduino['arduino_map'] = function() 
{
  var value_num = Blockly.Arduino.valueToCode(this, 'NUM', Blockly.Arduino.ORDER_NONE);

  var value_fmin = Blockly.Arduino.valueToCode(this, 'FMIN', Blockly.Arduino.ORDER_ATOMIC);
  var value_fmax = Blockly.Arduino.valueToCode(this, 'FMAX', Blockly.Arduino.ORDER_ATOMIC);

  var value_dmin = Blockly.Arduino.valueToCode(this, 'DMIN', Blockly.Arduino.ORDER_ATOMIC);
  var value_dmax = Blockly.Arduino.valueToCode(this, 'DMAX', Blockly.Arduino.ORDER_ATOMIC);

  var code = `map(${value_num}, ${value_fmin}, ${value_fmax}, ${value_dmin}, ${value_dmax})`;

  return [code, Blockly.Arduino.ORDER_NONE];
};