/**
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * http://blockly.googlecode.com/
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
 * @fileoverview Generating Arduino for control blocks.
 * @author gasolin@gmail.com  (Fred Lin)
 */
'use strict';

//goog.provide(''Blockly.Arduino.loops');

//goog.require('Blockly.Arduino');


Blockly.Arduino.controls_for = function() {
  // For loop.
  var variable0 = Blockly.Arduino.variableDB_.getName(
      this.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var argument_from = Blockly.Arduino.valueToCode(this, 'FROM',
      Blockly.Arduino.ORDER_ASSIGNMENT) || '0';
  var argument_to = Blockly.Arduino.valueToCode(this, 'TO',
      Blockly.Arduino.ORDER_ASSIGNMENT) || '0';

  var argument_by = Blockly.Arduino.valueToCode(this, 'BY',
      Blockly.Arduino.ORDER_ASSIGNMENT) || '0';

  var branch = Blockly.Arduino.statementToCode(this, 'DO');

  var code = 'что-то пошло не так';
  var sign = (argument_from >= argument_to) ? '>=' : '<';
  var code_by = (Math.abs(argument_by) == 1) ? 
                    ((argument_from >= argument_to) ? '--' : '++') :
                    ((argument_from >= argument_to) ? `-= ${argument_by}` : `+= ${argument_by}`);
  
  if(Blockly.Arduino.definitions_[variable0] == null ||
     Blockly.Arduino.definitions_[variable0] == '')
  {
    Blockly.Arduino.definitions_[variable0] = `int ${variable0} = 0;\n`;
  }

  code = 
'for(' + variable0 + ' = ' + argument_from + '; ' + variable0 + ' ' + sign + ' ' + argument_to + '; ' + variable0 + code_by + ')' + '\n' + 
'{\n' + 
branch + '\n' + 
'}\n';

  return code ;

};

Blockly.Arduino.controls_whileUntil = function() {
  // Do while/until loop.

  var until = this.getFieldValue('MODE') == 'UNTIL';
  var argument0 = Blockly.Arduino.valueToCode(this, 'BOOL', Blockly.Arduino.ORDER_NONE) || 'false';
  var branch = Blockly.Arduino.statementToCode(this, 'DO');

  var code = 'что-то пошло не так';

  if(until)
  {
    code = 
`do
{
${branch}
}while(${argument0});
`;
  }
  else
  {
      code = 
`while(${argument0})
{
${branch}
}
`;
  }
    return code;
}
