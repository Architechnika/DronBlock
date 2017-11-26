

'use strict';

goog.provide('Blockly.Blocks.logic');

goog.require('Blockly.Blocks');

const switch_str  = 'Значение';
const default_str = 'не совпадает';
const case_str    = 'совпадает с';

Blockly.Blocks['controls_switch'] = {
  /**
   * Block for if/case/else condition.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(120);
    this.appendValueInput('SW0')
        .appendField(switch_str);
    this.appendStatementInput('CS0')
        .appendField(default_str);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setMutator(new Blockly.Mutator(['controls_switch_case']));
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip('Блок выбора');
    this.caseCount_ = 0;
    this.defaultCount_ = 0;
  },
  /**
   * Create XML to represent the number of else-if and else inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() 
  {
    if (!this.caseCount_ && !this.defaultCount_) 
    {
      return null;
    }
    var container = document.createElement('mutation');
    if (this.caseCount_) 
    {
      container.setAttribute('case', this.caseCount_);
    }
    if (this.defaultCount_) 
    {
      container.setAttribute('default', 1);
    }
    return container;
  },
  /**
   * Parse XML to restore the else-if and else inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.caseCount_ = parseInt(xmlElement.getAttribute('case'), 10) || 0;
    this.defaultCount_ = parseInt(xmlElement.getAttribute('default'), 10) || 0;
    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function(workspace) 
  {
    var containerBlock = workspace.newBlock('controls_switch_default');
    containerBlock.initSvg();
    var connection = containerBlock.nextConnection;
    for (var i = 1; i <= this.caseCount_; i++) 
    {
      var caseBlock = workspace.newBlock('controls_switch_case');
      caseBlock.initSvg();
      connection.connect(caseBlock.previousConnection);
      connection = caseBlock.nextConnection;
    }

    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function(containerBlock) {
    var clauseBlock = containerBlock.nextConnection.targetBlock();
    // Count number of inputs.
    this.caseCount_ = 0;
    this.defaultCount_ = 0;
    var valueConnections = [null];
    var statementConnections = [null];
    var elseStatementConnection = null;
    while (clauseBlock) 
    {
      switch (clauseBlock.type) 
      {
        case 'controls_switch_case':
          this.caseCount_++;
          valueConnections.push(clauseBlock.valueConnection_);
          statementConnections.push(clauseBlock.statementConnection_);
          break;
        default:
          throw 'Unknown block type.';
      }
      clauseBlock = clauseBlock.nextConnection &&
                    clauseBlock.nextConnection.targetBlock();
    }
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 1; i <= this.caseCount_; i++) 
    {
      Blockly.Mutator.reconnect(valueConnections[i], this, 'SW' + i);
      Blockly.Mutator.reconnect(statementConnections[i], this, 'CS' + i);
    }
    Blockly.Mutator.reconnect(elseStatementConnection, this, 'default');
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function(containerBlock) {
    var clauseBlock = containerBlock.nextConnection.targetBlock();
    var i = 1;
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'controls_switch_case':
          var inputIf = this.getInput('SW' + i);
          var inputDo = this.getInput('CS' + i);
          clauseBlock.valueConnection_ =
              inputIf && inputIf.connection.targetConnection;
          clauseBlock.statementConnection_ =
              inputDo && inputDo.connection.targetConnection;
          i++;
          break;
        default:
          throw 'Unknown block type.';
      }
      clauseBlock = clauseBlock.nextConnection &&
                    clauseBlock.nextConnection.targetBlock();
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @private
   * @this Blockly.Block
   */
  updateShape_: function() {
    // Delete everything.
    if (this.getInput('default')) 
    {
      this.removeInput('default');
    }
    var i = 1;
    while (this.getInput('SW' + i)) 
    {
      this.removeInput('SW' + i);
      this.removeInput('CS' + i);
      i++;
    }
    // Rebuild block.
    for (var i = 1; i <= this.caseCount_; i++) {
      this.appendValueInput('SW' + i)
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField(case_str);
      this.appendStatementInput('CS' + i);
    }
    if (this.defaultCount_) 
    {
      this.appendStatementInput('default')
          .appendField('default');
    }
  }
};

Blockly.Blocks['controls_switch_default'] = {
  /**
   * Mutator block for if container.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(120);
    this.appendDummyInput()
        .appendField(switch_str);
    this.setNextStatement(true);
    this.setTooltip('Головной болк выбора');
    this.contextMenu = false;
  }
};

Blockly.Blocks['controls_switch_case'] = {
  /**
   * Mutator bolck for else-if condition.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(120);
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(case_str);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Блок выбора');
    this.contextMenu = false;
  }
};

