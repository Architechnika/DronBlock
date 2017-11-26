Blockly.Blocks['arduino_anytext'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Произвольная программа")
        .appendField(new Blockly.FieldDropdown([["По месту", "inplace"], ["defines", "define"], ["void setup()", "setup"], ["void loop()", "loop"]]), "PLACE")
        .appendField(new Blockly.FieldTextInput("/*programmText();*/"), "PROGRAMM");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(200);
    this.setTooltip('Позволяет установить в поле программного кода любые текстовые значения.\n' +
                    'Применяется для добавления языковых конструкций, пока не поддерживаемых студией.');
    this.setHelpUrl('');
  }
};