Blockly.Blocks['artholl_sence'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(image('ArTholl'), 64, 64, "*"))
        .appendField("Датчик холла (KY-024):")
        .appendField(new Blockly.FieldDropdown(ports), "ports");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Режим работы:")
        .appendField(new Blockly.FieldDropdown([["Цифровой", "1"], ["Аналоговый", "0"]]), "work_mode");
    this.appendValueInput("delay")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Задержка чтения");
    this.setOutput(true, "Number");
    this.setColour(120);
    this.setTooltip('Датчик Холла. Работает как ключ. Требуется магнит.');
    this.setHelpUrl('');
  }
};
