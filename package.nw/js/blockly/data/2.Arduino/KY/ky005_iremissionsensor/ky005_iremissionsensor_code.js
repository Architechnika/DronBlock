Blockly.Arduino['ky005_iremissionsensor'] = function(block) {
  var dropdown_pin = block.getFieldValue('PIN');
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  Blockly.Arduino.definitions_[`include_ky005_${dropdown_pin}`] = '#include <IRremote.h>';

  // #define - если требуется - указать дефайны
  Blockly.Arduino.definitions_[`ky005_def_${dropdown_pin}`] =
    `// ИК приёмник\nIRrecv irrecv_${dropdown_pin}(${dropdown_pin});\n` +
    `decode_results results_${dropdown_pin};\n`

  Blockly.Arduino.definitions_[`ky005_method_${dropdown_pin}`] =
`
// метод чтения кода с ИК приёмника
int getIR_${dropdown_pin}_Code()
{
	if (irrecv_${dropdown_pin}.decode(&results_${dropdown_pin}))
	{
		irrecv_${dropdown_pin}.resume(); // Receive the next value
        return results_${dropdown_pin}.value;
	}
}
`;
    
  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = `getIR_${dropdown_pin}_Code()`;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Arduino.ORDER_NONE];
};