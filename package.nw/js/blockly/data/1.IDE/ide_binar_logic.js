

'use strict';

//goog.provide('Blockly.Blocks.logic');

goog.require('Blockly.Blocks');


/**
 * Common HSV hue for all blocks in this category.
 */
Blockly.Blocks['bits_operation'] = {
  /**
   * Block for logical operations: 'and', 'or'.
   * @this Blockly.Block
   */
  init: function() {
    var OPERATORS =
        [['битовое ' + Blockly.Msg.LOGIC_OPERATION_AND, 'AND'],
         ['битовое ' + Blockly.Msg.LOGIC_OPERATION_OR, 'OR']];
    this.setColour(220);
    this.setOutput(true);
    this.appendValueInput('A');
    this.appendValueInput('B')
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      var op = thisBlock.getFieldValue('OP');
      var TOOLTIPS = {
        'AND': 'битовая операция \"И\"',
        'OR': 'битовая операция \"ИЛИ\"'
      };
      return TOOLTIPS[op];
    });
  }
};

Blockly.Blocks['bit_shift'] = {
  /**
   * Block for logical operations: 'and', 'or'.
   * @this Blockly.Block
   */
  init: function() {
    var OPERATORS =
        [['<<', '<<'],
         ['>>', '>>']];
    this.setColour(220);
    this.setOutput(true);
    this.appendValueInput('A');
    this.appendValueInput('B')
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      var op = thisBlock.getFieldValue('OP');
      var TOOLTIPS = {
        '<<': 'битовый сдвиг влево',
        '>>': 'битовый сдвиг вправо'
      };
      return TOOLTIPS[op];
    });
  }
};