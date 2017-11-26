'use strict';
/*BLOKS*/

//goog.provide(''Blockly.Blocks.ky001_tempsensor_ds18b20');

//goog.require('Blockly.Blocks');

// датчик температуры DS18B20
Blockly.Blocks['ky001_tempsensor_ds18b20'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(arduino_image('KY/ky001_tempsensor_ds18b20'), 64, 64, "*"))
        .appendField("Температура DS18 (KY-001):")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "pin");
    this.setOutput(true, "Number");
    this.setColour(300);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
