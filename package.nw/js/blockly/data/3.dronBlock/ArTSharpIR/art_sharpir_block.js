Blockly.Blocks['art_sharpir'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Датчик расстояния Sharp")
        .appendField(new Blockly.FieldDropdown([["GP2Y0A02YK0F (20150)", "20150"], 
                                                ["GP2Y0A21YK (1080)", "1080"], 
                                                ["GP2Y0A710K0F (100500)", "100500"], 
                                                ["GP2YA41SK0F(0430)", "430"]]), "sharptype")
        .appendField("Порт:")
        .appendField(new Blockly.FieldDropdown(ports), "ports");
    this.setOutput(true);
    this.setColour(120);
    this.setTooltip('Инфракрасный датчик расстояния');
    this.setHelpUrl('');
  }
};