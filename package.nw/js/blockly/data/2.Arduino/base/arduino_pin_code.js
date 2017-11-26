/**
 * Visual Blocks Language
 *
 * Copyright 2012 Fred Lin.
 * https://github.com/gasolin/BlocklyDuino
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Helper functions for generating Arduino blocks.
 * @author gasolin@gmail.com (Fred Lin)
 */
'use strict';

////goog.provide(''Blockly.Arduino.base');

////goog.require('Blockly.Arduino');




Blockly.Arduino['arduino_digital_write'] = function() {
  var dropdown_pin = this.getFieldValue('PIN');
  var dropdown_stat = this.getFieldValue('STAT');

  var code = 'что-то пошло не так';
  if(dropdown_stat == 'INPUT_PULLUP')
  {
      Blockly.Arduino.setups_['setup_output_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', INPUT_PULLUP);';
      code = '';
  }
  else
  {
      if(Blockly.Arduino.setups_['setup_output_' + dropdown_pin]  == null ||
         Blockly.Arduino.setups_['setup_output_' + dropdown_pin]  == '')
      {
          Blockly.Arduino.setups_['setup_output_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', OUTPUT);';
      }
    code = 'digitalWrite(' + dropdown_pin + ', ' + dropdown_stat + ');\n'
  }
 
  return code;
};

Blockly.Arduino['arduino_digital_read'] = function() {
  var dropdown_pin = this.getFieldValue('PIN');

  var code = 'digitalRead(' + dropdown_pin + ')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['arduino_analog_write'] = function() {
  var dropdown_pin = this.getFieldValue('PIN');
  //var dropdown_stat = this.getFieldValue('STAT');
  var value_num = Blockly.Arduino.valueToCode(this, 'NUM', Blockly.Arduino.ORDER_ATOMIC);
  //Blockly.Arduino.setups_['setup_output'+dropdown_pin] = 'pinMode('+dropdown_pin+', OUTPUT);';
  var code = 'analogWrite(' + dropdown_pin + ', ' + value_num + ');\n';
  return code;
};

Blockly.Arduino['arduino_analog_read'] = function() {
  var dropdown_pin = this.getFieldValue('PIN');
  //Blockly.Arduino.setups_['setup_input_'+dropdown_pin] = 'pinMode('+dropdown_pin+', INPUT);';
  var code = 'analogRead(' + dropdown_pin + ')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};




