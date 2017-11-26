'use strict';
/*BLOKS*/

//goog.provide(''Blockly.Blocks.arduino.liquidcrystal');

//goog.require('Blockly.Blocks');

// РАБОТА С ЖК ДИСПЛЕЕМ

// БЛОК ИНИЦИАЛИЗАЦИИ ДИСПЛЕЯ
Blockly.Blocks['arduino_liquidcrystal_init'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Инициализация LCD");
    this.appendDummyInput()
        .appendField("пин 1:")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "pin1")
        .appendField("пин 2:")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "pin2")
        .appendField("пин 3:")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "pin3")
        .appendField("пин 4:")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "pin4")
        .appendField("пин 5:")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "pin5")
        .appendField("пин 6:")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "pin6");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Формат LCD");
    this.appendValueInput("columns")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Столбцов");
    this.appendValueInput("rows")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Строк");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(300);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

// БЛОК ПОЗИЦИОНИРОВАНИЯ И ОТОБРАЖЕНИЯ
Blockly.Blocks['arduino_liquidcrystal_print'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Вывести на LCD");
    this.appendValueInput("colum")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Столбец");
    this.appendValueInput("row")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Строка");
    this.appendValueInput("text")
        .setCheck("String")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Сообщение:");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(300);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};