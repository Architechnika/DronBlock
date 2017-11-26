'use strict';
/*BLOKS*/

// Объявляем порты платы
/*var ports = [
			["PortA", "0"],
			["PortB", "1"],
			["PortC", "2"],
			["PortD", "3"],
			["PortE", "4"],
			["PortF", "5"]
	     ];
*/
// стартовый блок Ардутеха
// объявляет необзодимые библиотеки
// определяет версию используемой платы
Blockly.Blocks['artboard'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Начало программы для набора dronBlock")
        /*.appendField(new Blockly.FieldDropdown(
			[
				["v1.0", "0"],
				["v1.5", "1"],
				["v2.0", "2"]

            ]), "artboards")*/;
    this.appendDummyInput()
        .appendField("Инициализация");
    this.appendStatementInput("setup")
        .setCheck(null);
    this.appendDummyInput()
        .appendField("Действия");
    this.appendStatementInput("loop")
        .setCheck(null);
	this.setNextStatement(false, null);
    this.setColour(20);
    this.setTooltip('Данный модуль обязателен для корректной работы программы.\nБез него прграмма может работать некорректно.\nдля начала работы установите модуль на форму и выбирите комплект, с которым желаете работать.');
    this.setHelpUrl('https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#8ydgd6');
  }
};
