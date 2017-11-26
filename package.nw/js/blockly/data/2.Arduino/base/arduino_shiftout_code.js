Blockly.Arduino['arduino_shiftout'] = function(block) {
  var dropdown_datapin = block.getFieldValue('DATAPIN');
  var dropdown_clockpin = block.getFieldValue('CLOCKPIN');
  var dropdown_latchpin = block.getFieldValue('LATCHPIN');
  var value_data = Blockly.Arduino.valueToCode(block, 'DATA', Blockly.Arduino.ORDER_ATOMIC);
  var dropdown_bitdir = block.getFieldValue('BITDIR');
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  // Blockly.Arduino.definitions_['уникальное имя'] = '#include <библиотека>';

  // #define - если требуется - указать дефайны
  // Blockly.Arduino.definitions_['уникальное имя'] = '#define что-то чем-то';

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  Blockly.Arduino.setups_['arduino_shift_%0%1%2'
                          .replace(/%0/, dropdown_datapin)
                          .replace(/%1/, dropdown_clockpin)
                          .replace(/%2/, dropdown_latchpin)] = 'pinMode(%2, OUTPUT);\npinMode(%1, OUTPUT);\npinMode(%0, OUTPUT);\n'
                                                                .replace(/%0/, dropdown_datapin)
                                                                .replace(/%1/, dropdown_clockpin)
                                                                .replace(/%2/, dropdown_latchpin);
  
  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  
  if(value_data > 0xFF)
  {
    alert('Данные не могут превышать значение 255');
  }
  
  var code =  'digitalWrite(%0, LOW);\n' + 
              'shiftOut(%1, %2, %3, %4);\n' + 
              'digitalWrite(%0, HIGH);\n';
  code = code.replace(/%4/, value_data)
              .replace(/%1/, dropdown_datapin)
              .replace(/%2/, dropdown_clockpin)
              .replace(/%0/g, dropdown_latchpin)
              .replace(/%3/, dropdown_bitdir);
  return code;
};