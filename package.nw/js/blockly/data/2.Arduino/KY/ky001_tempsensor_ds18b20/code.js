'use strict';
/*GENERATE*/

//goog.provide(''Blockly.Arduino.ky001_tempsensor_ds18b20');

//goog.require('Blockly.Arduino');

// датчик температуры DS18B20
Blockly.Arduino['ky001_tempsensor_ds18b20'] = function(block) {
    var dropdown_pin = block.getFieldValue('pin');
    // #include - ниже следует добавить бибилотеки, необходимые для модуля
    Blockly.Arduino.definitions_['OneWire'] = '#include <OneWire.h>';
    Blockly.Arduino.definitions_['DallasTemperature'] = '#include <DallasTemperature.h>';

    // #define - если требуется - указать дефайны
    Blockly.Arduino.definitions_['OneWire_%1'.replace(/%1/g, dropdown_pin)] =
                                '// Тадчик температуры\nOneWire oneWire_%1(%1);\n'.replace(/%1/g, dropdown_pin);

    Blockly.Arduino.definitions_['DallasTemperature_%1'.replace(/%1/g, dropdown_pin)] =
                                'DallasTemperature dallasTemp_%1(&oneWire_%1);\n'.replace(/%1/g, dropdown_pin);

//    Blockly.Arduino.definitions_['DeviceAddress_%1'.replace(/%1/g, dropdown_pin)] =
//                                'DeviceAddress deviceAddress_%1;\n'.replace(/%1/g, dropdown_pin);

    // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
    Blockly.Arduino.setups_['DallasTemperature_%1'.replace(/%1/g, dropdown_pin)] =
                            'dallasTemp_%1.begin();\n'.replace(/%1/g, dropdown_pin);
//    Blockly.Arduino.setups_['DallasTemperature_%1%1'.replace(/%1/g, dropdown_pin)] =
//                            'dallasTemp_%1.getAddress(tempDeviceAddress_%1, 0);\n'.replace(/%1/g, dropdown_pin);

    // void loop() собственно то, что в code и будет в блоке loop
    Blockly.Arduino.loops_['DallasTemperature_%1'.replace(/%1/g, dropdown_pin)] =
                            'dallasTemp_%1.requestTemperatures();\n'.replace(/%1/g, dropdown_pin)


    var code = 'dallasTemp_%1.getTempCByIndex(0)'.replace(/%1/g, dropdown_pin);
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.Arduino.ORDER_NONE];
};
