Blockly.Blocks['ide_variables_declare'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Объявить ")
        .appendField(new Blockly.FieldDropdown([
													["переменную", ""], 
													["константу", "const"]
												]), "varType")
        .appendField(new Blockly.FieldVariable(Blockly.LANG_VARIABLES_SET_ITEM), "var")
        .appendField(new Blockly.FieldDropdown([
													["целочисленного", "int"], 
													["целочисленного беззнакового", "unsigned int"], 
													["дробного", "float"], 
													["дробного точного", "double"]
												]), "TYPE")
        .appendField("типа");
    this.appendValueInput("value")
        .setCheck("Number");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setInputsInline(true);
    this.setColour(270);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};