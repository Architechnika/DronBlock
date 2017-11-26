'use strict';
/*GENERATE*/

//goog.provide(''Blockly.Arduino.liquidcrystal');

//goog.require('Blockly.Arduino');

Blockly.Arduino['arduino_liquidcrystal_init'] = function(block) {
  var dropdown_pin1 = block.getFieldValue('pin1');
  var dropdown_pin2 = block.getFieldValue('pin2');
  var dropdown_pin3 = block.getFieldValue('pin3');
  var dropdown_pin4 = block.getFieldValue('pin4');
  var dropdown_pin5 = block.getFieldValue('pin5');
  var dropdown_pin6 = block.getFieldValue('pin6');
  var value_columns = Blockly.Arduino.valueToCode(block, 'columns', Blockly.Arduino.ORDER_ATOMIC);
  var value_rows = Blockly.Arduino.valueToCode(block, 'rows', Blockly.Arduino.ORDER_ATOMIC);
  
    // #include - ниже следует добавить бибилотеки, необходимые для модуля
  Blockly.Arduino.definitions_['include_lcd'] = '#include <LiquidCrystal.h>';

  // #define - если требуется - указать дефайны
  Blockly.Arduino.definitions_['define_lcd'] = 
      'LiquidCrystal lcd(%1, %2, %3, %4, %5, %6);'
        .replace(/%1/g, dropdown_pin1)
        .replace(/%2/g, dropdown_pin2)
        .replace(/%3/g, dropdown_pin3)
        .replace(/%4/g, dropdown_pin4)
        .replace(/%5/g, dropdown_pin5)
        .replace(/%6/g, dropdown_pin6);
  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  Blockly.Arduino.setups_['setup_lcd'] = 
      'lcd.begin(%1, %2);'
        .replace(/%1/g, value_columns)
        .replace(/%2/g, value_rows);
  // void loop() собственно то, что в code и будет в блоке loop
  var code = '';
  return code;
};

Blockly.Arduino['arduino_liquidcrystal_print'] = function(block) {
  var value_colum = Blockly.Arduino.valueToCode(block, 'colum', Blockly.Arduino.ORDER_ATOMIC);
  var value_row = Blockly.Arduino.valueToCode(block, 'row', Blockly.Arduino.ORDER_ATOMIC);
  var value_text = Blockly.Arduino.valueToCode(block, 'text', Blockly.Arduino.ORDER_ATOMIC);
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  // Blockly.Arduino.definitions_['уникальное имя'] = '#include <библиотека>';
  // #define - если требуется - указать дефайны
  // Blockly.Arduino.definitions_['уникальное имя'] = '#define что-то чем-то';
  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP
  // void loop() собственно то, что в code и будет в блоке loop
    var code =  'lcd.setCursor(%1, %2);\n'
                    .replace(/%1/g, value_colum)
                    .replace(/%2/g, value_row) + 
                'lcd.print(%3);\n'
                    .replace(/%3/g, value_text);
  return code;
};