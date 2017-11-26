Blockly.Arduino['arduinno_shftin'] = function(block) {
  var dropdown_datapin = block.getFieldValue('DATAPIN');
  var dropdown_clockpin = block.getFieldValue('CLOCKPIN');
  var dropdown_latchpin = block.getFieldValue('LATCHPIN');
  var dropdown_bitdir = block.getFieldValue('BITDIR');
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  // Blockly.Arduino.definitions_['уникальное имя'] = '#include <библиотека>';

  // #define - если требуется - указать дефайны
  

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  Blockly.Arduino.setups_[`arduino_shift_${dropdown_datapin}${dropdown_clockpin}${dropdown_latchpin}`] = 
                        `pinMode(${dropdown_latchpin}, OUTPUT);\n` + 
                        `${tab}pinMode(${dropdown_clockpin}, OUTPUT);\n` + 
                        `${tab}pinMode(${dropdown_datapin}, OUTPUT);\n`;

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  /*var code = 'shiftIn(%0, %1, %2)'
                .replace(/%0/, dropdown_datapin)
                .replace(/%1/, dropdown_clockpin)
                .replace(/%2/, dropdown_bitdir);*/
   var code =`shiftIn(${dropdown_datapin}, ${dropdown_clockpin}, ${dropdown_bitdir})`;
         //       .replace(/%0/, dropdown_datapin)
          //      .replace(/%1/, dropdown_clockpin)
          //      .replace(/%2/, dropdown_bitdir);
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Arduino.ORDER_NONE];
};