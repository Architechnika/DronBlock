Blockly.Blocks['artline_sence_ky033'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(image('ArTLineSence_KY033'), 64, 64, "*"))
        .appendField("Модуль датчика линии (KY-033):")
        .appendField(new Blockly.FieldDropdown(ports), "port");
    this.setOutput(true, "Boolean");
    this.setColour(120);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
