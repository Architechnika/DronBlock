

'use strict';

goog.provide('Blockly.Arduino.logic');

goog.require('Blockly.Arduino');

Blockly.Arduino['controls_switch'] = function() 
{
  // If/elseif/else condition.
  var n = 0;
  var argument = Blockly.Arduino.valueToCode(this, 'SW' + n,
                                                Blockly.Arduino.ORDER_NONE) || 'false';
  var branch = `${tab}${Blockly.Arduino.statementToCode(this, 'CS' + n).replace(/\n/g, `\n${tab}`)}`;

  var code = '';

code = 
`switch(${argument})
{
${tab}default:
${tab}{
${branch}
${tab}} break;
`;
  for (n = 1; n <= this.caseCount_; n++) 
  {
    argument = Blockly.Arduino.valueToCode(this, 'SW' + n,
                                            Blockly.Arduino.ORDER_NONE) || 'false';
    branch = `${tab}${Blockly.Arduino.statementToCode(this, 'CS' + n).replace(/\n/g, `\n${tab}`)}`;
//    code += '\n\tcase (' + argument + '): \n\t{\n\t' + branch + '\n\t} break;\n';

    code +=
`${tab}case (${argument}):
${tab}{
${branch}
${tab}} break;
`;
  }

  return code + '}\n';
};
