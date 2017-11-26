/**
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * http://code.google.com/p/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Helper functions for generating Arduino for blocks.
 * @author gasolin@gmail.com (Fred Lin)
 */
'use strict';

// //goog.provide(''Blockly.Arduino');

//goog.require('Blockly.Generator');

var arduino_image = function(val)
{
	return 'js/blockly/data/2.Arduino/%0/image.jpg'.replace(/%0/g, val);
};

/**
 * Arduino code generator.
 * @type !Blockly.Generator
 */
Blockly.Arduino = new Blockly.Generator('Arduino');

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
Blockly.Arduino.addReservedWords(
  // http://arduino.cc/en/Reference/HomePage
  'setup,loop,if,else,for,switch,case,while,do,break,continue,return,goto,define,include,HIGH,LOW,INPUT,OUTPUT,INPUT_PULLUP,true,false,interger, constants,floating,point,void,bookean,char,unsigned,byte,int,word,long,float,double,string,String,array,static, volatile,const,sizeof,pinMode,digitalWrite,digitalRead,analogReference,analogRead,analogWrite,tone,noTone,shiftOut,shitIn,pulseIn,millis,micros,delay,delayMicroseconds,min,max,abs,constrain,map,pow,sqrt,sin,cos,tan,randomSeed,random,lowByte,highByte,bitRead,bitWrite,bitSet,bitClear,bit,attachInterrupt,detachInterrupt,interrupts,noInterrupts'
);

/**
 * Order of operation ENUMs.
 *
 */
Blockly.Arduino.ORDER_ATOMIC = 0;         // 0 "" ...
Blockly.Arduino.ORDER_UNARY_POSTFIX = 1;  // expr++ expr-- () [] .
Blockly.Arduino.ORDER_UNARY_PREFIX = 2;   // -expr !expr ~expr ++expr --expr
Blockly.Arduino.ORDER_MULTIPLICATIVE = 3; // * / % ~/
Blockly.Arduino.ORDER_ADDITIVE = 4;       // + -
Blockly.Arduino.ORDER_SHIFT = 5;          // << >>
Blockly.Arduino.ORDER_RELATIONAL = 6;     // is is! >= > <= <
Blockly.Arduino.ORDER_EQUALITY = 7;       // == != === !==
Blockly.Arduino.ORDER_BITWISE_AND = 8;    // &
Blockly.Arduino.ORDER_BITWISE_XOR = 9;    // ^
Blockly.Arduino.ORDER_BITWISE_OR = 10;    // |
Blockly.Arduino.ORDER_LOGICAL_AND = 11;   // &&
Blockly.Arduino.ORDER_LOGICAL_OR = 12;    // ||
Blockly.Arduino.ORDER_CONDITIONAL = 13;   // expr ? expr : expr
Blockly.Arduino.ORDER_ASSIGNMENT = 14;    // = *= /= ~/= %= += -= <<= >>= &= ^= |=
Blockly.Arduino.ORDER_NONE = 99;          // (...)

/*
 * Arduino Board profiles
 *
 */
var profile = {
  arduino: {
    description: "Arduino standard-compatible board",
    digital: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"], ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]],
    analog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]],
    /*pwm: [],*/
    serial: [["9600", "9600"], ["19200", "19200"], ["57600", "57600"], ["115200", "115200"]]
  },
  arduino_mega: {
    description: "Arduino Mega-compatible board"
    //53 digital
    //15 analog
  }
};
//set default profile to arduino standard-compatible board
profile["default"] = profile["arduino"];
//alert(profile.default.digital[0]);

/**
 * Initialise the database of variable names.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
Blockly.Arduino.init = function(workspace) {
  // Create a dictionary of definitions to be printed before setups.
  Blockly.Arduino.definitions_ = Object.create(null);
  // Create a dictionary of setups to be printed before the code.
  Blockly.Arduino.setups_ = Object.create(null);

  // создаёт то, что вначале цикла должно быть
  Blockly.Arduino.loops_ = Object.create(null);

	if (!Blockly.Arduino.variableDB_) 
    {
		Blockly.Arduino.variableDB_ =
				new Blockly.Names(Blockly.Arduino.RESERVED_WORDS_);
	}
    else 
    {
		Blockly.Arduino.variableDB_.reset();
	}

	var defvars = [];
	var variables = Blockly.Variables.allVariables(workspace);
	/*for (var x = 0; x < variables.length; x++) {
		defvars[x] = 'int ' +
				Blockly.Arduino.variableDB_.getName(variables[x],
				Blockly.Variables.NAME_TYPE) + ';\n';
	}
	Blockly.Arduino.definitions_['variables'] = defvars.join('\n');*/
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.Arduino.finish = function(code) {
  // Indent every line.
  code = tab + code.replace(/\n/g, '\n' + tab);
  code = code.replace(/\n\s+$/, '\n');
  //code = /*'void loop() \n{\n'+ */code + '\n}';

  // Convert the definitions dictionary into a list.
  var imports = [];
  var definitions = [];
  for (var name in Blockly.Arduino.definitions_) 
  {
    var def = Blockly.Arduino.definitions_[name];
    if (def.match(/^#include/)) 
    {
      imports.push(def);
    } 
    else 
    {
      definitions.push(def);
    }
  }

  // Convert the setups dictionary into a list.
  var setups = [];
  for (var name in Blockly.Arduino.setups_) 
  {
    setups.push(Blockly.Arduino.setups_[name]);
  }

    var loops = [];
      for (var name in Blockly.Arduino.loops_) 
      {
        loops.push(Blockly.Arduino.loops_[name]);
      }
    //loops_

  var allDefs = imports.join('\n') + '\n\n' + 
                definitions.join('\n') + '\n' + 
                'void setup()\n' + 
                '{\n' +
                tab + setups.join('\n' + tab) + 
                '\n}\n\n\n\n' +
                'void loop() \n' + 
                '{\n' +
                tab + loops.join('\n' + tab) + '\n\n' + 
                code + 
                '\n}';

  return allDefs.replace(/\n\n+/g, '\n\n').replace(/\n*$/, '\n\n\n');// + code;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.  A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.Arduino.scrubNakedValue = function(line) {
  return line + ';\n';
};

/**
 * Encode a string as a properly escaped Arduino string, complete with quotes.
 * @param {string} string Text to encode.
 * @return {string} Arduino string.
 * @private
 */
Blockly.Arduino.quote_ = function(string) {
  // TODO: This is a quick hack.  Replace with goog.string.quote
  string = string.replace(/\\/g, '\\\\')
                 .replace(/\n/g, '\\\n')
                 .replace(/\$/g, '\\$')
                 .replace(/'/g, '\\\'');
  return '\"' + string + '\"';
};

/**
 * Common tasks for generating Arduino from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The Arduino code created for this block.
 * @return {string} Arduino code with comments and subsequent blocks added.
 * @private
 */
Blockly.Arduino.scrub_ = function(block, code) {
  if (code === null) {
    // Block has handled code generation itself.
    return '';
  }
  var commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    if (comment) {
      commentCode += Blockly.Arduino.prefixLines(comment, '// ') + '\n';
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var x = 0; x < block.inputList.length; x++) {
      if (block.inputList[x].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[x].connection.targetBlock();
        if (childBlock) {
          var comment = Blockly.Arduino.allNestedComments(childBlock);
          if (comment) {
            commentCode += Blockly.Arduino.prefixLines(comment, '// ');
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = Blockly.Arduino.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};

Blockly.Blocks['arduino_abs'] = {
  init: function() {
    this.appendValueInput("VALUE")
        .appendField("Абсолютное значение");
    this.setOutput(true);
    this.setColour(180);
    this.setTooltip('Возвращает абсолютное значение числа на входе:\n' +
                    'Если х = 1, то возвращает 1\n' + 
                    'Если x = -1, то возвращает 1');
    this.setHelpUrl('');
  }
};
Blockly.Arduino['arduino_abs'] = function(block) {
  var value_value = Blockly.Arduino.valueToCode(block, 'VALUE', Blockly.Arduino.ORDER_ATOMIC);
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  // Blockly.Arduino.definitions_['уникальное имя'] = '#include <библиотека>';

  // #define - если требуется - указать дефайны
  // Blockly.Arduino.definitions_['уникальное имя'] = '#define что-то чем-то';

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = 'abs(' + value_value + ')';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Arduino.ORDER_NONE];
};
Blockly.Blocks['arduino_anytext'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Произвольная программа")
        .appendField(new Blockly.FieldDropdown([["По месту", "inplace"], ["defines", "define"], ["void setup()", "setup"], ["void loop()", "loop"]]), "PLACE")
        .appendField(new Blockly.FieldTextInput("/*programmText();*/"), "PROGRAMM");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(200);
    this.setTooltip('Позволяет установить в поле программного кода любые текстовые значения.\n' +
                    'Применяется для добавления языковых конструкций, пока не поддерживаемых студией.');
    this.setHelpUrl('');
  }
};
Blockly.Arduino['arduino_anytext'] = function(block) {
  var dropdown_place = block.getFieldValue('PLACE');
   var value_programm = block.getFieldValue('PROGRAMM');
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  // Blockly.Arduino.definitions_['уникальное имя'] = '#include <библиотека>';

  // #define - если требуется - указать дефайны
  // Blockly.Arduino.definitions_['уникальное имя'] = '#define что-то чем-то';

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
 
 
 
  var code = 'то, что ставится по месту установки блока согласно логике программы';

  value_programm = value_programm.replace(/\'/g, '').replace(/\"/g, '') + '\n';

  switch(dropdown_place)
  {
    case 'define':
    {
      Blockly.Arduino.definitions_['arduino_anytext_'+dropdown_place] = value_programm;
      code = '';
    }break;

    case 'setup':
    {
      Blockly.Arduino.setups_['arduino_anytext_'+dropdown_place] = value_programm;
      code = '';
    }break;

    case 'loop':
    {
      Blockly.Arduino.loops_['arduino_anytext_'+dropdown_place] = value_programm;
      code = '';
    }break;

    case 'inplace':
    {
      code = value_programm;
    }break;
  }

  return code;
};
Blockly.Blocks['arduino_array_creat'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Объявить массив:")
        .appendField(new Blockly.FieldVariable(Blockly.LANG_VARIABLES_SET_ITEM), "ARRAY");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Тип данных:")
        .appendField(new Blockly.FieldDropdown([["Целое знаковое", "int"], ["Целое беззнаковое", "unsigned int"], ["Дробное", "float"], ["Дробное точное", "double"]]), "DATA_TYPE");
    this.appendValueInput("LINE")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Строк:");
    this.appendValueInput("ROW")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Столбцов:");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(65);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
Blockly.Arduino['arduino_array_creat'] = function(block) {
  var variable_array = Blockly.Arduino.variableDB_.getName(block.getFieldValue('ARRAY'), Blockly.Variables.NAME_TYPE);
  var dropdown_data_type = block.getFieldValue('DATA_TYPE');
  var value_line = Blockly.Arduino.valueToCode(block, 'LINE', Blockly.Arduino.ORDER_ATOMIC);
  var value_row = Blockly.Arduino.valueToCode(block, 'ROW', Blockly.Arduino.ORDER_ATOMIC);
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  // Blockly.Arduino.definitions_['уникальное имя'] = '#include <библиотека>';

  // #define - если требуется - указать дефайны
  // Blockly.Arduino.definitions_['уникальное имя'] = '#define что-то чем-то';

  if(value_line < 2)
  {
    Blockly.Arduino.definitions_[variable_array] = 
      `${dropdown_data_type} ${variable_array}[${value_row}];\n`;
  }
  else
  {
    Blockly.Arduino.definitions_[variable_array] = 
      `${dropdown_data_type} ${variable_array}[${value_line}][${value_row}];\n`;
  }
  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = '';
  return code;
};
Blockly.Blocks['arduino_array_get'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Значение ячейки массива")
        .appendField(new Blockly.FieldVariable(Blockly.LANG_VARIABLES_SET_ITEM), "array");
    this.appendValueInput("LINE")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Строка:");
    this.appendValueInput("ROW")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Столбец:");
    this.setOutput(true);
    this.setColour(65);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
Blockly.Arduino['arduino_array_get'] = function(block) {
  var variable_array = Blockly.Arduino.variableDB_.getName(block.getFieldValue('array'), Blockly.Variables.NAME_TYPE);
  var value_line = Blockly.Arduino.valueToCode(block, 'LINE', Blockly.Arduino.ORDER_ATOMIC);
  var value_row = Blockly.Arduino.valueToCode(block, 'ROW', Blockly.Arduino.ORDER_ATOMIC);
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  // Blockly.Arduino.definitions_['уникальное имя'] = '#include <библиотека>';

  // #define - если требуется - указать дефайны
  // Blockly.Arduino.definitions_['уникальное имя'] = '#define что-то чем-то';

  if( Blockly.Arduino.definitions_[variable_array] == undefined || 
      Blockly.Arduino.definitions_[variable_array] == '')
  {
    if(value_line < 2)
    {
      Blockly.Arduino.definitions_[variable_array] = 
        `int ${variable_array}[${value_row}];\n`;
    }
    else
    {
      Blockly.Arduino.definitions_[variable_array] = 
        `int ${variable_array}[${value_line}][${value_row}];\n`;
    }
  }
  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = 'что-то пошло не так';

  if(value_line < 2)
  {
    code = `${variable_array}[${value_row}]`;
  }
  else
  {
    code = `${variable_array}[${value_line}][${value_row}]`;
  }
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Arduino.ORDER_NONE];
};
Blockly.Blocks['arduino_array_set'] = {
  init: function() {
    this.appendValueInput("VAL")
        .appendField("Присвоить значение");
    this.appendDummyInput()
        .appendField("ячейке массива")
        .appendField(new Blockly.FieldVariable(Blockly.LANG_VARIABLES_SET_ITEM), "ARRAY");
    this.appendValueInput("LINE")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Строка:");
    this.appendValueInput("ROW")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Столбец:");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(65);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
Blockly.Arduino['arduino_array_set'] = function(block) {
  var value_val = Blockly.Arduino.valueToCode(block, 'VAL', Blockly.Arduino.ORDER_ATOMIC);
  var variable_array = Blockly.Arduino.variableDB_.getName(block.getFieldValue('ARRAY'), Blockly.Variables.NAME_TYPE);
  var value_line = Blockly.Arduino.valueToCode(block, 'LINE', Blockly.Arduino.ORDER_ATOMIC);
  var value_row = Blockly.Arduino.valueToCode(block, 'ROW', Blockly.Arduino.ORDER_ATOMIC);
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  // Blockly.Arduino.definitions_['уникальное имя'] = '#include <библиотека>';

  // #define - если требуется - указать дефайны
  // Blockly.Arduino.definitions_['уникальное имя'] = '#define что-то чем-то';

  if(Blockly.Arduino.definitions_[variable_array] == undefined || Blockly.Arduino.definitions_[variable_array] == '')
  {
    if(value_line < 2)
    {
      Blockly.Arduino.definitions_[variable_array] = '%0 %1[%2];\n'.replace(/%0/, 'int')
                                                                .replace(/%1/, variable_array)
                                                                .replace(/%2/, value_row);
    }
    else
    {
      Blockly.Arduino.definitions_[variable_array] = '%0 %1[%2][%3];\n'.replace(/%0/, 'int')
                                                                    .replace(/%1/, variable_array)
                                                                    .replace(/%2/, value_line)
                                                                    .replace(/%3/, value_row);
    }
  }
  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = 'что-то пошло не так';

  if(value_line < 2)
  {
    code = '%0[%1] = %2;\n'.replace(/%0/, variable_array)
                          .replace(/%1/, value_row)
                          .replace(/%2/, value_val);
  }
  else
  {
    code = '%0[%1][%2] = %3;\n'.replace(/%0/, variable_array)
                          .replace(/%1/, value_line)
                          .replace(/%2/, value_row)
                          .replace(/%3/, value_val);
  }
  return code;
};
Blockly.Blocks['arduino_constrain'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Ограничение диапазоном");
    this.appendValueInput("MIN")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Нижняя граница");
    this.appendValueInput("MAX")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Верхняя граница");
    this.appendValueInput("VAL")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Значение");
    this.setOutput(true, "Number");
    this.setColour(180);
    this.setTooltip('Ограничивает входное значение указанным диапазоном');
    this.setHelpUrl('');
  }
};
Blockly.Arduino['arduino_constrain'] = function(block) {
  var value_min = Blockly.Arduino.valueToCode(block, 'MIN', Blockly.Arduino.ORDER_ATOMIC);
  var value_max = Blockly.Arduino.valueToCode(block, 'MAX', Blockly.Arduino.ORDER_ATOMIC);
  var value_val = Blockly.Arduino.valueToCode(block, 'VAL', Blockly.Arduino.ORDER_ATOMIC);
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  // Blockly.Arduino.definitions_['уникальное имя'] = '#include <библиотека>';

  // #define - если требуется - указать дефайны
  // Blockly.Arduino.definitions_['уникальное имя'] = '#define что-то чем-то';

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = 'constrain(%val, %min, %max)'
                  .replace(/%val/, value_val)
                  .replace(/%min/, value_min)
                  .replace(/%max/, value_max);
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Arduino.ORDER_NONE];
};
/**/


'use strict';

Blockly.Blocks['arduino_delay'] = {
  helpUrl: 'http://arduino.cc/en/Reference/delay',
  init: function() {
    this.setColour(120);
    this.appendValueInput("DELAY_TIME", 'Number')
        .appendField("Пауза на")
        .setCheck('Number');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Остановить программу на заданное количество миллисекунд');
  }
};
/**/

'use strict';

Blockly.Arduino['arduino_delay'] = function() {
  var delay_time = Blockly.Arduino.valueToCode(this, 'DELAY_TIME', Blockly.Arduino.ORDER_ATOMIC) || '1000'
  var code = 'delay(' + delay_time + ');\n';
  return code;
};
/**/


'use strict';

Blockly.Blocks['arduino_map'] = {
  helpUrl: 'http://arduino.cc/en/Reference/map',
  init: function() {
    this.setColour(180);
    this.appendValueInput("NUM", 'Number')
        .appendField("Перевести ") 
        .setCheck('Number');
	this.appendDummyInput()
        .appendField("из диапазона ");
	this.appendValueInput("FMIN", 'Number')
        .appendField("от:")
        .setCheck('Number');
	this.appendValueInput("FMAX", 'Number')
        .appendField("до:")
        .setCheck('Number');
    this.appendValueInput("DMIN", 'Number')
        .appendField("в диапазон от:")
        .setCheck('Number');
	this.appendValueInput("DMAX", 'Number')
        .appendField("до:")
        .setCheck('Number');
    this.setInputsInline(true);
    this.setOutput(true);
    this.setTooltip('Переводит значение из одного диапазона в другой.');
  }
};

/**/

'use strict';



Blockly.Arduino['arduino_map'] = function() 
{
  var value_num = Blockly.Arduino.valueToCode(this, 'NUM', Blockly.Arduino.ORDER_NONE);

  var value_fmin = Blockly.Arduino.valueToCode(this, 'FMIN', Blockly.Arduino.ORDER_ATOMIC);
  var value_fmax = Blockly.Arduino.valueToCode(this, 'FMAX', Blockly.Arduino.ORDER_ATOMIC);

  var value_dmin = Blockly.Arduino.valueToCode(this, 'DMIN', Blockly.Arduino.ORDER_ATOMIC);
  var value_dmax = Blockly.Arduino.valueToCode(this, 'DMAX', Blockly.Arduino.ORDER_ATOMIC);

  var code = `map(${value_num}, ${value_fmin}, ${value_fmax}, ${value_dmin}, ${value_dmax})`;

  return [code, Blockly.Arduino.ORDER_NONE];
};
Blockly.Blocks['arduino_millis'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Время от запуска программы, мс");
    this.setOutput(true);
    this.setColour(180);
    this.setTooltip('Возвращает количество милисекунд, прошедших от момента запуска программы.');
    this.setHelpUrl('');
  }
};
Blockly.Arduino['arduino_millis'] = function(block) {
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  // Blockly.Arduino.definitions_['уникальное имя'] = '#include <библиотека>';

  // #define - если требуется - указать дефайны
  // Blockly.Arduino.definitions_['уникальное имя'] = '#define что-то чем-то';

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = 'millis()';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Arduino.ORDER_NONE];
};
'use strict';

//To support syntax defined in http://arduino.cc/en/Reference/HomePage

////goog.provide(''Blockly.Blocks.arduino');

////goog.require('Blockly.Blocks');


Blockly.Blocks['arduino_digital_write'] = {
  helpUrl: 'http://arduino.cc/en/Reference/DigitalWrite',
  init: function() {
    this.setColour(180);
    this.appendDummyInput()
	    .appendField("Цифровой пин")
	    .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN")
      	.appendField(new Blockly.FieldDropdown([
                                                    ["в HIGH", "HIGH"], 
                                                    ["в LOW", "LOW"],
                                                    ["подтянуть вход", "INPUT_PULLUP"]
                                                    
                                                ]), "STAT");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Устанавливает на цифровом выходе либо 1 либо 0");
  }
};

Blockly.Blocks['arduino_digital_read'] = {
  helpUrl: 'http://arduino.cc/en/Reference/DigitalRead',
  init: function() {
    this.setColour(180);
    this.appendDummyInput()
	      .appendField("Читать цифровой пин")
	      .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN");
    this.setOutput(true, 'Boolean');
    this.setTooltip('');
  }
};

Blockly.Blocks['arduino_analog_write'] = {
  helpUrl: 'http://arduino.cc/en/Reference/AnalogWrite',
  init: function() {
    this.setColour(180);
    this.appendDummyInput()
        .appendField("Аналоговый выход")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN");
    this.appendValueInput("NUM", 'Number')
        .appendField("значение")
        .setCheck('Number');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Write analog value between 0 and 255 to a specific Port');
  }
};

Blockly.Blocks['arduino_analog_read'] = {
  helpUrl: 'http://arduino.cc/en/Reference/AnalogRead',
  init: function() {
    this.setColour(180);
    this.appendDummyInput()
        .appendField("Читать аналоговый пин")
        .appendField(new Blockly.FieldDropdown(profile.default.analog), "PIN");
    this.setOutput(true, 'Number');
    this.setTooltip('Return value between 0 and 1024');
  }
};

/**
 * Visual Blocks Language
 *
 * Copyright 2012 Fred Lin.
 * https://github.com/gasolin/BlocklyDuino
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Helper functions for generating Arduino blocks.
 * @author gasolin@gmail.com (Fred Lin)
 */
'use strict';

////goog.provide(''Blockly.Arduino.base');

////goog.require('Blockly.Arduino');




Blockly.Arduino['arduino_digital_write'] = function() {
  var dropdown_pin = this.getFieldValue('PIN');
  var dropdown_stat = this.getFieldValue('STAT');

  var code = 'что-то пошло не так';
  if(dropdown_stat == 'INPUT_PULLUP')
  {
      Blockly.Arduino.setups_['setup_output_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', INPUT_PULLUP);';
      code = '';
  }
  else
  {
      if(Blockly.Arduino.setups_['setup_output_' + dropdown_pin]  == null ||
         Blockly.Arduino.setups_['setup_output_' + dropdown_pin]  == '')
      {
          Blockly.Arduino.setups_['setup_output_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', OUTPUT);';
      }
    code = 'digitalWrite(' + dropdown_pin + ', ' + dropdown_stat + ');\n'
  }
 
  return code;
};

Blockly.Arduino['arduino_digital_read'] = function() {
  var dropdown_pin = this.getFieldValue('PIN');

  var code = 'digitalRead(' + dropdown_pin + ')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['arduino_analog_write'] = function() {
  var dropdown_pin = this.getFieldValue('PIN');
  //var dropdown_stat = this.getFieldValue('STAT');
  var value_num = Blockly.Arduino.valueToCode(this, 'NUM', Blockly.Arduino.ORDER_ATOMIC);
  //Blockly.Arduino.setups_['setup_output'+dropdown_pin] = 'pinMode('+dropdown_pin+', OUTPUT);';
  var code = 'analogWrite(' + dropdown_pin + ', ' + value_num + ');\n';
  return code;
};

Blockly.Arduino['arduino_analog_read'] = function() {
  var dropdown_pin = this.getFieldValue('PIN');
  //Blockly.Arduino.setups_['setup_input_'+dropdown_pin] = 'pinMode('+dropdown_pin+', INPUT);';
  var code = 'analogRead(' + dropdown_pin + ')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};





Blockly.Blocks['arduino_random'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Случайное значение");
    this.setOutput(true);
    this.setColour(200);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
Blockly.Arduino['arduino_random'] = function(block) {
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  // Blockly.Arduino.definitions_['уникальное имя'] = '#include <библиотека>';

  // #define - если требуется - указать дефайны
  // Blockly.Arduino.definitions_['уникальное имя'] = '#define что-то чем-то';

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  Blockly.Arduino.setups_['random'] = 'randomSeed(analogRead(A4));';

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = 'random(1000)';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Arduino.ORDER_NONE];
};
Blockly.Blocks['arduino_random_diap'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Случайное значение из диапазона");
    this.appendValueInput("START")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("от");
    this.appendValueInput("END")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("до");
    this.setOutput(true);
    this.setColour(200);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
Blockly.Arduino['arduino_random_diap'] = function(block) {
  var value_start = Blockly.Arduino.valueToCode(block, 'START', Blockly.Arduino.ORDER_ATOMIC);
  var value_end = Blockly.Arduino.valueToCode(block, 'END', Blockly.Arduino.ORDER_ATOMIC);
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  // Blockly.Arduino.definitions_['уникальное имя'] = '#include <библиотека>';

  // #define - если требуется - указать дефайны
  Blockly.Arduino.setups_['random'] = 'randomSeed(analogRead(A4));';

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = `random(${value_start}, ${value_end})`;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Arduino.ORDER_NONE];
};
Blockly.Blocks['arduinno_shftin'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Программный SPI - чтение данных \u27F8");
    this.appendDummyInput()
        .appendField("Data PIN")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "DATAPIN")
        .appendField("Clock PIN")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "CLOCKPIN")
        .appendField("ChipSelect PIN")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "LATCHPIN");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["Старшим вперёд", "MSBFIRST"], ["Младшим вперёд", "LSBFIRST"]]), "BITDIR");
    this.setOutput(true);
    this.setColour(180);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
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
Blockly.Blocks['arduino_shiftout'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Программный SPI - передача данных \u27F9");
    this.appendDummyInput()
        .appendField("Data PIN")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "DATAPIN")
        .appendField("Clock PIN")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "CLOCKPIN")
        .appendField("ChipSelect:")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "LATCHPIN");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["Старшим вперёд", "MSBFIRST"], ["Младшим вперёд", "LSBFIRST"]]), "BITDIR");
    this.appendValueInput("DATA");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(180);
    this.setTooltip('Модуль порограммного SPI. Позволяет передавать данные между различной периферией.\n' + 
                    'ChipSelect используется всегда по низкому уровню. Можно не подключать пин (но  он всегда будет управляться)');
    this.setHelpUrl('');
  }
};
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
Blockly.Blocks['arduino_tone'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["Включить", "1"], ["Выключить", "0"]]), "ENA")
        .appendField("тональный сигнал на")
        .appendField("пине:")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN");
    this.appendValueInput("freq")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("частота:");
    this.appendValueInput("duration")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("длительность:");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(180);
    this.setTooltip('Управляет звуковым сигналом на внешнем пине.\n' + 
                    'Частота должна иметь значение от 35 до 65535\n' + 
                    'Длительность задаётся в миллисекундах\n' + 
                    'Может не работать с пинами, не поддерживающими ШИМ');
    this.setHelpUrl('');
  }
};
Blockly.Arduino['arduino_tone'] = function(block) {
  var dropdown_ena = block.getFieldValue('ENA');
  var dropdown_pin = block.getFieldValue('PIN');
  var value_freq = Blockly.Arduino.valueToCode(block, 'freq', Blockly.Arduino.ORDER_ATOMIC);
  var value_duration = Blockly.Arduino.valueToCode(block, 'duration', Blockly.Arduino.ORDER_ATOMIC);
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  // Blockly.Arduino.definitions_['уникальное имя'] = '#include <библиотека>';

  // #define - если требуется - указать дефайны
  // Blockly.Arduino.definitions_['уникальное имя'] = '#define что-то чем-то';

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = 'что-то пошло не так';

  if(dropdown_ena == 1)
  {
    code = 'tone(%0, %1, %2);\n'
                .replace(/%0/g, dropdown_pin)
                .replace(/%1/g, value_freq)
                .replace(/%2/g, value_duration);
  }
  else
  {
    code = 'notone(%0);\n'.replace(/%0/g, dropdown_pin);
  }
  return code;
};

Blockly.Arduino['math_trig'] = function(block) {
  var dropdown_func = block.getFieldValue('OP');
  var value_val = Blockly.Arduino.valueToCode(block, 'NUM', Blockly.Arduino.ORDER_ATOMIC);
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  // Blockly.Arduino.definitions_['уникальное имя'] = '#include <библиотека>';

  // #define - если требуется - указать дефайны
  // Blockly.Arduino.definitions_['уникальное имя'] = '#define что-то чем-то';

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = 'что-то пошло не так';

  code = dropdown_func + '(' + value_val + ')';

  return [code, Blockly.Arduino.ORDER_NONE];
};
Blockly.Blocks['arduino_serial_available'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Доступно данных в последовательном порту");
    this.setOutput(true);
    this.setColour(180);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
Blockly.Arduino['arduino_serial_available'] = function(block) {
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  // Blockly.Arduino.definitions_['уникальное имя'] = '#include <библиотека>';

  // #define - если требуется - указать дефайны
  // Blockly.Arduino.definitions_['уникальное имя'] = '#define что-то чем-то';

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = 'Serial.available()';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Arduino.ORDER_NONE];
};
Blockly.Blocks['arduino_serial_print'] = {
  helpUrl: 'http://www.arduino.cc/en/Serial/Print',
  init: function() {
    this.setColour(180);
    this.appendValueInput("CONTENT", 'String')
        .appendField("Последовательный порт. Передать ")
        .appendField(new Blockly.FieldDropdown([
                                                ["строку", "print"], 
                                                ["строку с окончанием", "println"]
                                                ]), "SPMETHOD")
        .appendField(" на скорости:")
        .appendField(new Blockly.FieldDropdown(profile.default.serial), "BAUDE");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Prints data to the console/serial port as human-readable ASCII text.');
  }
};





Blockly.Arduino['arduino_serial_print'] = function(block) {
  var content = Blockly.Arduino.valueToCode(this, 'CONTENT', Blockly.Arduino.ORDER_ATOMIC) || '0';
  var dropdown_baude = block.getFieldValue('BAUDE');
  var dropdown_method = block.getFieldValue('SPMETHOD');

  Blockly.Arduino.setups_['setup_serial'] = 'Serial.begin(' + dropdown_baude + ');\n';

  var code = `Serial.${dropdown_method}(${content});\n`;
  return code;
};


Blockly.Blocks['arduino_serial_settimeout'] = {
  init: function() {
    this.appendValueInput("TIMEOUT")
        .setCheck("Number")
        .appendField("Последовательный порт. Установить время ожидания");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(180);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
Blockly.Arduino['arduino_serial_settimeout'] = function(block) {
  var value_timeout = Blockly.Arduino.valueToCode(block, 'TIMEOUT', Blockly.Arduino.ORDER_ATOMIC);
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  // Blockly.Arduino.definitions_['уникальное имя'] = '#include <библиотека>';

  // #define - если требуется - указать дефайны
  // Blockly.Arduino.definitions_['уникальное имя'] = '#define что-то чем-то';

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['setup_serial_' + dropdown_baude] = 'Serial.begin(' + dropdown_baude + ');\n';

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = `Serial.setTimeout(${value_timeout});\n`;
  return code;
};


'use strict';

Blockly.Blocks['arduino_serial_write'] = {
  init: function() {
    this.setColour(180);
    this.appendDummyInput()
        .appendField("Последовательный порт. Передать на скорости ")
        .appendField(new Blockly.FieldDropdown(profile.default.serial), "BAUDE");
    this.appendValueInput("CONTENT")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(" данные:");
    this.appendValueInput("LEN")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("длиной:");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Prints data to the console/serial port as human-readable ASCII text.');
  }
};


'use strict';

Blockly.Arduino['arduino_serial_write'] = function(block) {
  var content = Blockly.Arduino.valueToCode(this, 'CONTENT', Blockly.Arduino.ORDER_ATOMIC) || '0';
  var dropdown_baude = block.getFieldValue('BAUDE');
  var len = Blockly.Arduino.valueToCode(this, 'LEN', Blockly.Arduino.ORDER_ATOMIC) || '0';

  Blockly.Arduino.setups_['setup_serial'] = 'Serial.begin(' + dropdown_baude + ');\n';

  var code = 'что-то пошло не так';

  if(len < 1)
  {
      code = `Serial.write(${content});\n`;
  }
  else
  {
      code = `Serial.write(${content}, ${len});\n`;
  }
  return code;
};
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

Blockly.Blocks['ky002_vibration_switch'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(arduino_image('KY/ky002_vibration_switch'), 64, 64, "*"))
        .appendField("Датчик вибрации (KY-002)")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN");
    this.setOutput(true);
    this.setColour(300);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Arduino['ky002_vibration_switch'] = function(block) {
  var dropdown_pin = block.getFieldValue('PIN');
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  Blockly.Arduino.definitions_['include_triggerInput'] = '#include "triggerInput.h"';

  // #define - если требуется - указать дефайны
  Blockly.Arduino.definitions_[`ky002_${dropdown_pin}`] = 
      `// Датчик вибрации\nTriggerInput trig_${dropdown_pin}(${dropdown_pin});\n`;

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_[`ky002_${dropdown_pin}`] = `pinMode(${dropdown_pin}, INPUT) ;`;

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = `trig_${dropdown_pin}.getRAW()`;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Arduino.ORDER_NONE];
};

Blockly.Blocks['ky003_hall_magnetic'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(arduino_image('KY/ky003_hall_magnetic'), 64, 64, "*"))
        .appendField("Датчик Холла (KY-003)")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN");
    this.setOutput(true);
    this.setColour(300);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Arduino['ky003_hall_magnetic'] = function(block) {
  var dropdown_pin = block.getFieldValue('PIN');
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  Blockly.Arduino.definitions_['include_triggerInput'] = '#include "triggerInput.h"';

  // #define - если требуется - указать дефайны
  Blockly.Arduino.definitions_[`ky003_${dropdown_pin}`] = 
      `// датчик Холла\nTriggerInput trig_${dropdown_pin}(${dropdown_pin});\n`;

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_[`ky003_${dropdown_pin}`] = `pinMode(${dropdown_pin}, INPUT) ;`;

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = `trig_${dropdown_pin}.getRAW()`;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Arduino.ORDER_NONE];
};

Blockly.Blocks['ky004_keyswitch'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(arduino_image('KY/ky004_keyswitch'), 64, 64, "*"))
        .appendField("Кнопка (KY-004), пин:")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN");
    this.appendValueInput("time")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("фильтр:");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("мс");
    this.setInputsInline(true);
    this.setOutput(true);
    this.setColour(300);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Arduino['ky004_keyswitch'] = function(block) {
  var dropdown_pin = block.getFieldValue('PIN');
  var value_time = Blockly.Arduino.valueToCode(block, 'time', Blockly.Arduino.ORDER_ATOMIC);
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  Blockly.Arduino.definitions_['include_triggerInput'] = '#include "triggerInput.h"';

  // #define - если требуется - указать дефайны
  Blockly.Arduino.definitions_[`ky004_${dropdown_pin}`] =
      `// Кнопка\nTriggerInput trig_${dropdown_pin}(${dropdown_pin});\n`;

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_[`ky004_${dropdown_pin}`] =  `pinMode(${dropdown_pin}, INPUT) ;`;

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = `trig_${dropdown_pin}.getTrigged(${value_time})`;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Arduino.ORDER_NONE];
};

Blockly.Blocks['ky005_iremissionsensor'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(arduino_image('KY/ky005_iremissionsensor'), 64, 64, "*"))
        .appendField("ИК приёмник (KY-005), пин:")
        .appendField(new Blockly.FieldDropdown(profile.default.analog), "PIN");
    this.setInputsInline(true);
    this.setOutput(true);
    this.setColour(300);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
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

Blockly.Blocks['ky006_passive_buzzer'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(arduino_image('KY/ky006_passive_buzzer'), 64, 64, "*"))
        .appendField("Малый пассивный зуммер (KY-006):")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN")
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Нота:")
        .appendField(new Blockly.FieldDropdown(notes), "notes");
    this.appendValueInput("delay")
        .setAlign(Blockly.ALIGN_RIGHT)
        .setCheck("Number")
        .appendField("(задержка, мс)");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(300);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Arduino['ky006_passive_buzzer'] = function(block) {
  var dropdown_pin = block.getFieldValue('PIN');
  var dropdown_notes = block.getFieldValue('notes');
  var value_delay = Blockly.Arduino.valueToCode(block, 'delay', Blockly.Arduino.ORDER_ATOMIC);
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
 //  Blockly.Arduino.definitions_['pass_sence'] = '#include <Pass.h>';

  // #define - если требуется - указать дефайны


  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = 
`// звучит нота
tone(${dropdown_pin}, ${dropdown_notes}, ${value_delay});
`;

    //var code = ' nnn ';
    // TODO: Change ORDER_NONE to the correct strength.
  return code;
};

Blockly.Blocks['ky009_3fullcolorled'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(arduino_image('KY/ky009_3fullcolorled'), 64, 64, "*"))
        .appendField("R")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN_R")
        .appendField("G")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN_G")
        .appendField("B")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN_B")
        .appendField("светодиод (KY-009)");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Цвет")
        .appendField(new Blockly.FieldDropdown([
                                                    ["Красный", "4"],
                                                    ["Зелёный", "2"],
                                                    ["Синий", "1"],
                                                    ["Желтый", "6"], /*R + G*/
                                                    ["Голубой", "3"], /*G + B*/
                                                    ["Фиолетовый", "5"], /*B + R*/
                                                    ["Белый", "7"]
                                                ]), "color");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Состояние")
        .appendField(new Blockly.FieldDropdown([["ВКЛ", "1"], ["ВЫКЛ", "0"]]), "state");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(300);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
Blockly.Arduino['ky009_3fullcolorled'] = function(block) {
  var dropdown_pin_r = block.getFieldValue('PIN_R');
  var dropdown_pin_g = block.getFieldValue('PIN_G');
  var dropdown_pin_b = block.getFieldValue('PIN_B');
  var dropdown_color = block.getFieldValue('color');
  var dropdown_state = block.getFieldValue('state');

  var number_block = `${dropdown_pin_r}${dropdown_pin_g}${dropdown_pin_b}`;
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  Blockly.Arduino.definitions_[`ky009_include_${number_block}`] = 
        '#include "ArTPort.h"\n#include "ArTLed3color.h"\n';

  // #define - если требуется - указать дефайны
  Blockly.Arduino.definitions_[`ky009_3fullcolorled${number_block}`] =
`// Многоцветный светодиод RGB
ArTPort port_${number_block}(${dropdown_pin_b}, ${dropdown_pin_g}, ${dropdown_pin_r});
ArTLed3color ky009_3fullcolorled${number_block}(&port_${number_block});
`;

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = '(!!! что-то пошло не так !!!)';

  if(dropdown_state == 1)
  {
      code = `ky009_3fullcolorled${number_block}.ON(${dropdown_color});\n`;
  }
  else
  {
      code = `ky009_3fullcolorled${number_block}.OFF();\n`;
  }

  return code;
};
Blockly.Blocks['ky010_opticalbroke'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(arduino_image('KY/ky010_opticalbroke'), 64, 64, "*")) 
        .appendField("Фотодатчик (KY-010)");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("пин:")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN");
    this.appendValueInput("TIME")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(", фильтр:");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("мс");
    this.setInputsInline(true);
    this.setOutput(true);
    this.setColour(300);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
Blockly.Arduino['ky010_opticalbroke'] = function(block) {
  var dropdown_pin = block.getFieldValue('PIN');
  var value_time = Blockly.Arduino.valueToCode(block, 'TIME', Blockly.Arduino.ORDER_ATOMIC);
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  Blockly.Arduino.definitions_['include_triggerInput'] = '#include "triggerInput.h"';

  // #define - если требуется - указать дефайны
  Blockly.Arduino.definitions_[`ky010_${dropdown_pin}`] =
      `// Фотопрерыватель\nTriggerInput trig_${dropdown_pin}(${dropdown_pin});\n`;

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = `trig_${dropdown_pin}.getTrigged(${value_time})`;
  // TODO: Change ORDER_NONE to the correct strength. 
  return [code, Blockly.Arduino.ORDER_NONE];
};
Blockly.Blocks['ky012_active_buzzer'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(arduino_image('KY/ky012_active_buzzer'), 64, 64, "*"))    
        .appendField("Активный пьезоизлучатель (KY-012)");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("пин:")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN");
    this.appendValueInput("TIME")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(", включить на");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("мс");
     this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(300);
    this.setTooltip(
`Блок управления пьезоизлучателем.
Введите длительность звучания:
1 - 3000 - для включения звучания на заданный период
-1 - для постоянного включения звука
0 - для выключения`);
    this.setHelpUrl('');
  }
};
Blockly.Arduino['ky012_active_buzzer'] = function(block) {
  var dropdown_pin = block.getFieldValue('PIN');
  var value_time = Blockly.Arduino.valueToCode(block, 'TIME', Blockly.Arduino.ORDER_ATOMIC);
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  // Blockly.Arduino.definitions_['уникальное имя'] = '#include <библиотека>';

  // #define - если требуется - указать дефайны
 // Blockly.Arduino.definitions_[`ky006_def_${dropdown_pin}`] = 'pinMode (buzzer, OUTPUT) ;';

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  Blockly.Arduino.setups_[`ky006_def_${dropdown_pin}`] = `// активный пьезоизлучатель\npinMode(${dropdown_pin}, OUTPUT);\n`;

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = 'что-тто пошло не так';

  if(value_time == 0)
  {
      code = 
`
digitalWrite(${dropdown_pin}, HIGH); // включаем звучание 
`;

  }
  else if(value_time[1] == '-')
  {
      code = 
`
digitalWrite(${dropdown_pin}, LOW); // выключаем
`;

  }
  else
  {
      code = 
`
digitalWrite(${dropdown_pin}, HIGH); // включаем звучание 
delay(${value_time}); // длительность звучания
digitalWrite(${dropdown_pin}, LOW); // выключаем
`;

  }



  // TODO: Change ORDER_NONE to the correct strength.
  return code;
};
Blockly.Blocks['arduino_linesensor'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(arduino_image('linesensor'), 64, 64, "*"))   
        .appendField("Датчик линии пин:")
        .appendField(new Blockly.FieldDropdown(profile.default.analog), "PIN");
    this.appendValueInput("DELAY")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("фильтр отсчётов");
    this.setOutput(true);
    this.setColour(300);
    this.setTooltip('фильтр осчётов определяет по скольки измерениям считать среднее арифметическое показаний датчика');
    this.setHelpUrl('');
  }
};
Blockly.Arduino['arduino_linesensor'] = function(block) {
  var dropdown_pin = block.getFieldValue('PIN');
  var value_delay = Blockly.Arduino.valueToCode(block, 'DELAY', Blockly.Arduino.ORDER_ATOMIC);
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  // Blockly.Arduino.definitions_['уникальное имя'] = '#include <библиотека>';

  // #define - если требуется - указать дефайны
  Blockly.Arduino.definitions_[`ArTIRSence`]    = '#include "ArTIRSence.h"';
  Blockly.Arduino.definitions_[`ArTPort`]       = '#include "ArTPort.h"';

  Blockly.Arduino.definitions_[`define_port_${dropdown_pin}`] = 
		`ArTPort port_${dropdown_pin}(${dropdown_pin}, 0, 0);`;

  Blockly.Arduino.definitions_[`define_irsence_${dropdown_pin}`] = 
		`ArTIRSence analogIR_${dropdown_pin}(&port_${dropdown_pin});\n`;
			

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = `analogIR_${dropdown_pin}.getIntensity(${value_delay})`;

  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Arduino.ORDER_NONE];
};
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
/**
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * http://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating Arduino for logic blocks.
 * @author gasolin@gmail.com  (Fred Lin)
 */
'use strict';

// //goog.provide(''Blockly.Arduino.logic');

//goog.require('Blockly.Arduino');


Blockly.Arduino.controls_if = function() {
  // If/elseif/else condition.
  var n = 0;
  var argument = Blockly.Arduino.valueToCode(this, 'IF' + n,
      Blockly.Arduino.ORDER_NONE) || 'false';
  var branch = Blockly.Arduino.statementToCode(this, 'DO' + n);
  var code = 'if (' + argument + ') \n{\n' + branch + '\n}\n';
  for (n = 1; n <= this.elseifCount_; n++) {
    argument = Blockly.Arduino.valueToCode(this, 'IF' + n,
      Blockly.Arduino.ORDER_NONE) || 'false';
    branch = Blockly.Arduino.statementToCode(this, 'DO' + n);
    code += 'else if (' + argument + ') \n{\n' + branch + '\n}\n';
  }
  if (this.elseCount_) {
    branch = Blockly.Arduino.statementToCode(this, 'ELSE');
    code += 'else \n{\n' + branch + '\n}\n';
  }
  return code + '\n';
};

Blockly.Arduino.logic_compare = function() {
  // Comparison operator.
  var mode = this.getFieldValue('OP');
  var operator = Blockly.Arduino.logic_compare.OPERATORS[mode];
  var order = (operator == '==' || operator == '!=') ?
      Blockly.Arduino.ORDER_EQUALITY : Blockly.Arduino.ORDER_RELATIONAL;
  var argument0 = Blockly.Arduino.valueToCode(this, 'A', order) || '0';
  var argument1 = Blockly.Arduino.valueToCode(this, 'B', order) || '0';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.Arduino.logic_compare.OPERATORS = {
  EQ: '==',
  NEQ: '!=',
  LT: '<',
  LTE: '<=',
  GT: '>',
  GTE: '>='
};

Blockly.Arduino.logic_operation = function() {
  // Operations 'and', 'or'.
  var operator = (this.getFieldValue('OP') == 'AND') ? '&&' : '||';
  var order = (operator == '&&') ? Blockly.Arduino.ORDER_LOGICAL_AND :
      Blockly.Arduino.ORDER_LOGICAL_OR;
  var argument0 = Blockly.Arduino.valueToCode(this, 'A', order) || 'false';
  var argument1 = Blockly.Arduino.valueToCode(this, 'B', order) || 'false';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.Arduino.logic_negate = function() {
  // Negation.
  var order = Blockly.Arduino.ORDER_UNARY_PREFIX;
  var argument0 = Blockly.Arduino.valueToCode(this, 'BOOL', order) || 'false';
  var code = '!' + argument0;
  return [code, order];
};

Blockly.Arduino.logic_boolean = function() {
  // Boolean values true and false.
  var code = (this.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.logic_null = function() {
  var code = 'NULL';
  return [code ,Blockly.Arduino.ORDER_ATOMIC];
};

// операторы битового сравнения
Blockly.Arduino.bits_operation = function() {
  // Operations 'and', 'or'.
  var operator = (this.getFieldValue('OP') == 'AND') ? '&' : '|';
  var order = (operator == '&') ? Blockly.Arduino.ORDER_LOGICAL_AND :
      Blockly.Arduino.ORDER_LOGICAL_OR;
  var argument0 = Blockly.Arduino.valueToCode(this, 'A', order) || 'false';
  var argument1 = Blockly.Arduino.valueToCode(this, 'B', order) || 'false';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

// операторы битового сравнения
Blockly.Arduino.bit_shift = function() {
  // Operations 'and', 'or'.
  var operator = (this.getFieldValue('OP') == '<<') ? '<<' : '>>';
  var order = (operator == '<<') ? '<<' : '>>';
  var argument0 = Blockly.Arduino.valueToCode(this, 'A', order) || '0';
  var argument1 = Blockly.Arduino.valueToCode(this, 'B', order) || '0';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};
/**
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * http://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating Arduino for control blocks.
 * @author gasolin@gmail.com  (Fred Lin)
 */
'use strict';

//goog.provide(''Blockly.Arduino.loops');

//goog.require('Blockly.Arduino');


Blockly.Arduino.controls_for = function() {
  // For loop.
  var variable0 = Blockly.Arduino.variableDB_.getName(
      this.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var argument_from = Blockly.Arduino.valueToCode(this, 'FROM',
      Blockly.Arduino.ORDER_ASSIGNMENT) || '0';
  var argument_to = Blockly.Arduino.valueToCode(this, 'TO',
      Blockly.Arduino.ORDER_ASSIGNMENT) || '0';

  var argument_by = Blockly.Arduino.valueToCode(this, 'BY',
      Blockly.Arduino.ORDER_ASSIGNMENT) || '0';

  var branch = Blockly.Arduino.statementToCode(this, 'DO');

  var code = 'что-то пошло не так';
  var sign = (argument_from >= argument_to) ? '>=' : '<';
  var code_by = (Math.abs(argument_by) == 1) ? 
                    ((argument_from >= argument_to) ? '--' : '++') :
                    ((argument_from >= argument_to) ? `-= ${argument_by}` : `+= ${argument_by}`);
  
  if(Blockly.Arduino.definitions_[variable0] == null ||
     Blockly.Arduino.definitions_[variable0] == '')
  {
    Blockly.Arduino.definitions_[variable0] = `int ${variable0} = 0;\n`;
  }

  code = 
'for(' + variable0 + ' = ' + argument_from + '; ' + variable0 + ' ' + sign + ' ' + argument_to + '; ' + variable0 + code_by + ')' + '\n' + 
'{\n' + 
branch + '\n' + 
'}\n';

  return code ;

};

Blockly.Arduino.controls_whileUntil = function() {
  // Do while/until loop.

  var until = this.getFieldValue('MODE') == 'UNTIL';
  var argument0 = Blockly.Arduino.valueToCode(this, 'BOOL', Blockly.Arduino.ORDER_NONE) || 'false';
  var branch = Blockly.Arduino.statementToCode(this, 'DO');

  var code = 'что-то пошло не так';

  if(until)
  {
    code = 
`do
{
${branch}
}while(${argument0});
`;
  }
  else
  {
      code = 
`while(${argument0})
{
${branch}
}
`;
  }
    return code;
}

/**
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * http://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating Arduino for math blocks.
 * @author gasolin@gmail.com  (Fred Lin)
 */
'use strict';

//goog.provide(''Blockly.Arduino.math');

//goog.require('Blockly.Arduino');


Blockly.Arduino.math_number = function() {
  // Numeric value.
  var code = window.parseFloat(this.getFieldValue('NUM'));
  // -4.abs() returns -4 in Dart due to strange order of operation choices.
  // -4 is actually an operator and a number.  Reflect this in the order.
  var order = code < 0 ?
      Blockly.Arduino.ORDER_UNARY_PREFIX : Blockly.Arduino.ORDER_ATOMIC;
  return [code, order];
};

Blockly.Arduino.math_arithmetic = function() {
  // Basic arithmetic operators, and power.
  var mode = this.getFieldValue('OP');
  var tuple = Blockly.Arduino.math_arithmetic.OPERATORS[mode];
  var operator = tuple[0];
  var order = tuple[1];
  var argument0 = Blockly.Arduino.valueToCode(this, 'A', order) || '0';
  var argument1 = Blockly.Arduino.valueToCode(this, 'B', order) || '0';
  var code;
  if (!operator) {
    code = 'Math.pow(' + argument0 + ', ' + argument1 + ')';
    return [code, Blockly.Arduino.ORDER_UNARY_POSTFIX];
  }
  code = argument0 + operator + argument1;
  return [code, order];
};

Blockly.Arduino.math_arithmetic.OPERATORS = {
  ADD: [' + ', Blockly.Arduino.ORDER_ADDITIVE],
  MINUS: [' - ', Blockly.Arduino.ORDER_ADDITIVE],
  MULTIPLY: [' * ', Blockly.Arduino.ORDER_MULTIPLICATIVE],
  DIVIDE: [' / ', Blockly.Arduino.ORDER_MULTIPLICATIVE],
  POWER: [null, Blockly.Arduino.ORDER_NONE]  // Handle power separately.
};

Blockly.Arduino['math_change'] = function(block) {
  // Add to a variable in place.
  var argument0 = Blockly.Arduino.valueToCode(block, 'DELTA',
      Blockly.Arduino.ORDER_ADDITION) || '0';
  var varName = Blockly.Arduino.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  return varName + ' = ' + varName + ' + ' + argument0 + ';\n';
};

Blockly.Blocks['arduino_motor_driver'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(arduino_image('motor_driver'), 64, 64, "*"))    
        .appendField("Мотор")
        .appendField("Направление:")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "IN1")
        .appendField("Скорость:")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "IN2");
    this.appendValueInput("speed")
        //.setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(" ")
        .appendField(new Blockly.FieldDropdown([["⟳", "1"], ["⟲", "-1"]]), "side")
        .appendField("Скорость:");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(300);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
Blockly.Arduino['arduino_motor_driver'] = function(block) {
  var in1 = block.getFieldValue('IN1');
  var in2 = block.getFieldValue('IN2');
  var side = block.getFieldValue('side');
  var speed = Blockly.Arduino.valueToCode(block, 'speed', Blockly.Arduino.ORDER_ATOMIC);

  if(!speed) speed = 0;
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  Blockly.Arduino.definitions_[`ArTMotorDriver`]    = '#include "ArTMotorDriver.h"';
  Blockly.Arduino.definitions_[`ArTPort`]           = '#include "ArTPort.h"';
  

  // #define - если требуется - указать дефайны
  Blockly.Arduino.definitions_[`define_port_${in1}${in2}`] = 
		`ArTPort port_${in1}${in2}(0, ${in1}, ${in2});`;

  Blockly.Arduino.definitions_[`define_motor_${in1}${in2}`] = 
		`ArTMotorDriver motor_${in1}${in2}(&port_${in1}${in2});\n`;

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = `motor_${in1}${in2}.Drive(${speed} * ${side});\n`;
  return code;
};
/**
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * http://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating Arduino for variable blocks.
 * @author gasolin@gmail.com  (Fred Lin)
 */
'use strict';

//goog.provide(''Blockly.Arduino.procedures');

//goog.require('Blockly.Arduino');


Blockly.Arduino.procedures_defreturn = function() {
  // Define a procedure with a return value.
  var funcName = Blockly.Arduino.variableDB_.getName(this.getFieldValue('NAME'),
      Blockly.Procedures.NAME_TYPE);
  var branch = Blockly.Arduino.statementToCode(this, 'STACK');
  if (Blockly.Arduino.INFINITE_LOOP_TRAP) {
    branch = Blockly.Arduino.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + this.id + '\'') + branch;
  }
  var returnValue = Blockly.Arduino.valueToCode(this, 'RETURN',
      Blockly.Arduino.ORDER_NONE) || '';
  if (returnValue) {
    returnValue = '  return ' + returnValue + ';\n';
  }
  var returnType = returnValue ? 'int' : 'void';
  var args = [];
  for (var x = 0; x < this.arguments_.length; x++) {
    args[x] = 'int ' + Blockly.Arduino.variableDB_.getName(this.arguments_[x],
        Blockly.Variables.NAME_TYPE);
  }
  var code = returnType + ' ' + funcName + '(' + args.join(', ') + ') {\n' +
      branch + returnValue + '}\n';
  code = Blockly.Arduino.scrub_(this, code);
  Blockly.Arduino.definitions_[funcName] = code;
  return null;
};

// Defining a procedure without a return value uses the same generator as
// a procedure with a return value.
Blockly.Arduino.procedures_defnoreturn = Blockly.Arduino.procedures_defreturn;

Blockly.Arduino.procedures_callreturn = function() {
  // Call a procedure with a return value.
  var funcName = Blockly.Arduino.variableDB_.getName(this.getFieldValue('NAME'),
      Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < this.arguments_.length; x++) {
    args[x] = Blockly.Arduino.valueToCode(this, 'ARG' + x,
        Blockly.Arduino.ORDER_NONE) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ')';
  return [code, Blockly.Arduino.ORDER_UNARY_POSTFIX];
};

Blockly.Arduino.procedures_callnoreturn = function() {
  // Call a procedure with no return value.
  var funcName = Blockly.Arduino.variableDB_.getName(this.getFieldValue('NAME'),
      Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < this.arguments_.length; x++) {
    args[x] = Blockly.Arduino.valueToCode(this, 'ARG' + x,
        Blockly.Arduino.ORDER_NONE) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ');\n';
  return code;
};

Blockly.Arduino.procedures_ifreturn = function() {
  // Conditionally return value from a procedure.
  var condition = Blockly.Arduino.valueToCode(this, 'CONDITION',
      Blockly.Arduino.ORDER_NONE) || 'false';
  var code = 'if (' + condition + ') {\n';
  if (this.hasReturnValue_) {
    var value = Blockly.Arduino.valueToCode(this, 'VALUE',
        Blockly.Arduino.ORDER_NONE) || 'null';
    code += '  return ' + value + ';\n';
  } else {
    code += '  return;\n';
  }
  code += '}\n';
  return code;
};

Blockly.Blocks['programm_block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Инициализация");
    this.appendStatementInput("setup");
    this.appendDummyInput()
        .appendField("Основная программа");
    this.appendStatementInput("loop");
    this.setColour(20);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
Blockly.Arduino['programm_block'] = function(block) {
  var statements_setup = Blockly.Arduino.statementToCode(block, 'setup');
  var statements_loop = Blockly.Arduino.statementToCode(block, 'loop');
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  // Blockly.Arduino.definitions_['уникальное имя'] = '#include <библиотека>';

  // #define - если требуется - указать дефайны
  // Blockly.Arduino.definitions_['уникальное имя'] = '#define что-то чем-то';

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = 'то, что ставится по месту установки блока согласно логике программы';
  return code;
};
Blockly.Blocks['setup_block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Инициализация");
    this.appendStatementInput("setup");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(180);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
Blockly.Arduino['setup_block'] = function(block) {
  var statements_setup = Blockly.Arduino.statementToCode(block, 'setup');
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  // Blockly.Arduino.definitions_['уникальное имя'] = '#include <библиотека>';

  // #define - если требуется - указать дефайны
  // Blockly.Arduino.definitions_['уникальное имя'] = '#define что-то чем-то';

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP
  Blockly.Arduino.setups_['setup_block'] = statements_setup;
  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = '';
  return code;
};
/**
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * http://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating Arduino for text blocks.
 * @author gasolin@gmail.com (Fred Lin)
 */
'use strict';

////goog.provide(''Blockly.Arduino.texts');

//goog.require('Blockly.Arduino');


Blockly.Arduino.text = function() {
  // Text value.
  var code = Blockly.Arduino.quote_(this.getFieldValue('TEXT'));
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.text_char = function() {
  // Text value.
  var code = Blockly.Arduino.simplequote_(this.getFieldValue('TEXT'));
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Blocks['arduino_ultrasonic'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(arduino_image('ultrasonic'), 64, 64, "*"))   
        .appendField("Ультразвуковой датчик");
    this.appendDummyInput()
        .appendField("trig:")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "TRIG")
        .appendField("echo:")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "ECHO");
    this.setOutput(true);
    this.setColour(300);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
Blockly.Arduino['arduino_ultrasonic'] = function(block) {
  var dropdown_trig = block.getFieldValue('TRIG');
  var dropdown_echo = block.getFieldValue('ECHO');
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  Blockly.Arduino.definitions_[`ultrasonic`]           = '#include "Ultrasonic.h"';

  // #define - если требуется - указать дефайны
  /*// Trig - 12, Echo - 13
Ultrasonic ultrasonic(12, 13);*/
    Blockly.Arduino.definitions_[`define_soundsence_${dropdown_echo}`] = 
        `Ultrasonic ultrasonic_${dropdown_trig}(${dropdown_trig}, ${dropdown_echo});\n`;

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = `ultrasonic_${dropdown_trig}.Ranging(CM)`;

  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Arduino.ORDER_NONE];
};
Blockly.Blocks['artbarrier_sence'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(image('ArTBarrier'), 64, 64, "*"))
        .appendField("Датчик препятствия (KY-032):")
        .appendField(new Blockly.FieldDropdown(ports), "port")
    this.appendValueInput("delay")
        .setAlign(Blockly.ALIGN_RIGHT)
        .setCheck("Number")
        .appendField("Задержка чтения");
    this.setOutput(true, "Boolean");
    this.setColour(120);
    this.setTooltip(
'Цифровой датчик препятствия\n\
Подключение:\n\
+ - красный провод\n\
- - синий провод\n\
OUT - белый провод\n\
EN - желтый провод\
');
    this.setHelpUrl('');
  }
};

Blockly.Arduino['artbarrier_sence'] = function(block) {
  var dropdown_port = block.getFieldValue('port');
  var value_delay = Blockly.Arduino.valueToCode(block, 'delay', Blockly.Arduino.ORDER_ATOMIC);
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  Blockly.Arduino.definitions_['artport'] = '#include <ArTPort.h>';

  // #define - если требуется - указать дефайны
   Blockly.Arduino.definitions_['define_port_%0'.replace(/%0/g,dropdown_port)] =
		'ArTPort port_%0(%0);'.replace(/%0/g, dropdown_port);
	Blockly.Arduino.definitions_['define_artbarrier_sence_%0'.replace(/%0/g,dropdown_port)] =
		'ArTBarrier artbarrier_sence_%0(&port_%0);\n'.replace(/%0/g, dropdown_port);

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = 'artbarrier_sence_%0.isBarrier(%1)'
							.replace(/%0/g, dropdown_port)
							.replace(/%1/g, value_delay);
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Arduino.ORDER_NONE];
};

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

'use strict';
/*GENERATE*/

// головной модуль определения версии платы Ардутека
Blockly.Arduino['artboard'] = function(block) {
    var dropdown_artboards = this.getFieldValue('artboards');
    var statements_setup = Blockly.Arduino.statementToCode(block, 'setup');
    var statements_loop = Blockly.Arduino.statementToCode(block, 'loop');

	var board_define = '';
	// #include
	switch(dropdown_artboards)
	{
		// добавляем библиотеки для ардутека
		case '0': case '1': case '2':
		{
			board_define += '// Работаем с конструктором ДРОН-Блок\n';
			//Blockly.Arduino.definitions_['define_ardutech'] 		= '#include "architechnic001.h"';
		}break;

		// добавляем библиотеки для стартового набора
		case '200':
		{
			board_define += '// Работаем с набором Arduino Kit #1\n';

		}break;
	}
	// definitions
	board_define += '#define ART_BOARD_VERSION %0\n'.replace(/%0/g, dropdown_artboards);

	Blockly.Arduino.definitions_['define_board_%0'.replace(/%0/g,dropdown_artboards)] = board_define;

	// void setup()
	//  Blockly.Arduino.setups_['setup_motor_'+dropdown_ports] = 'ArTMotorDriver motor_%0(%0);'.replace(/%0/g, dropdown_ports);
    Blockly.Arduino.setups_['setup_block'] = statements_setup;
	// void loop()
	var code = '';
	return statements_loop;
};

Blockly.Blocks['artflame_sence'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(image('ArTFlame'), 64, 64, "*"))
        .appendField("Датчик огня (KY-026):")
        .appendField(new Blockly.FieldDropdown(ports), "port");

    this.setOutput(true, "Number");
    this.setColour(120);
    this.setTooltip('Датчик пламени. Определяет условное значение интенсивности огня');
    this.setHelpUrl('');
  }
};

Blockly.Arduino['artflame_sence'] = function(block) {
  var dropdown_port = block.getFieldValue('port');
    // #include - ниже следует добавить бибилотеки, необходимые для модуля
    Blockly.Arduino.definitions_['artport'] = '#include <ArTPort.h>';
    Blockly.Arduino.definitions_['artflame_sence'] = '#include <ArTFlame.h>';

  // #define - если требуется - указать дефайны
   Blockly.Arduino.definitions_['define_port_%0'.replace(/%0/g,dropdown_port)] =
		'ArTPort port_%0(%0);'
			.replace(/%0/g, dropdown_port);
	Blockly.Arduino.definitions_['define_flame_sence_%0'.replace(/%0/g,dropdown_port)] =
		'ArTFlame flame_sence_%0(&port_%0);\n'
			.replace(/%0/g, dropdown_port);

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = 'flame_sence_%0.GetValue()'
							.replace(/%0/g, dropdown_port);
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Arduino.ORDER_NONE];
};

Blockly.Blocks['artholl_sence'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(image('ArTholl'), 64, 64, "*"))
        .appendField("Датчик холла (KY-024):")
        .appendField(new Blockly.FieldDropdown(ports), "ports");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Режим работы:")
        .appendField(new Blockly.FieldDropdown([["Цифровой", "1"], ["Аналоговый", "0"]]), "work_mode");
    this.appendValueInput("delay")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Задержка чтения");
    this.setOutput(true, "Number");
    this.setColour(120);
    this.setTooltip('Датчик Холла. Работает как ключ. Требуется магнит.');
    this.setHelpUrl('');
  }
};

Blockly.Arduino['artholl_sence'] = function(block) {
  var dropdown_ports = block.getFieldValue('ports');
  var dropdown_work_mode = block.getFieldValue('work_mode');
  var value_delay = Blockly.Arduino.valueToCode(block, 'delay', Blockly.Arduino.ORDER_ATOMIC);
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  Blockly.Arduino.definitions_['artport'] = '#include <ArTPort.h>';
  Blockly.Arduino.definitions_['artholl_sence'] = '#include <ArTHoll.h>';

  // #define - если требуется - указать дефайны
   Blockly.Arduino.definitions_['define_port_%0'.replace(/%0/g,dropdown_ports)] =
   'ArTPort port_%0(%0);'
        .replace(/%0/g, dropdown_ports);
   Blockly.Arduino.definitions_['define_artholl_sence_%0'.replace(/%0/g,dropdown_ports)] =
   'ArTHoll holl_sence_%0(&port_%0);\n'
        .replace(/%0/g, dropdown_ports);

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = '(!!! что-то пошло не так !!!)';

  if(dropdown_work_mode == 1)
  {
      code = 'holl_sence_%0.isTrigged(%1)'
                             .replace(/%0/g, dropdown_ports)
                             .replace(/%1/g, value_delay);
  }
  else
  {
      code = 'holl_sence_%0.GetValue(%1)'
                             .replace(/%0/g, dropdown_ports)
                             .replace(/%1/g, value_delay);
  }

    //var code = ' nnn ';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

'use strict';
/*BLOKS*/

//goog.provide('Blockly.Blocks.ardutech.linecense');

//goog.require('Blockly.Blocks');

// модуль работы с датчиком линии
Blockly.Blocks['artirsence'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Яркость ИК датчика:")
        .appendField(new Blockly.FieldDropdown(ports), "ports");
    this.appendValueInput("cnt")
        .setCheck("Number")
        .appendField("(отсчетов на измерение)");
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(120);
    this.setTooltip('Модуль ИК датчика линии.\nВ качестве входных параметров принимает:\nПорт, к оторому подключен\nЧисло отсчетов, по которому работает.');
    this.setHelpUrl('https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#2jv3r7');
  }
};

'use strict';
/*GENERATE*/

//goog.provide('Blockly.Arduino.ardutech.linecense');

//goog.require('Blockly.Arduino');

// ИК датчик линии
Blockly.Arduino.artirsence = function(block) {
	var dropdown_ports = this.getFieldValue('ports');
	var value_cnt = Blockly.Arduino.valueToCode(block, 'cnt', Blockly.Arduino.ORDER_ATOMIC);

	// #include
    Blockly.Arduino.definitions_['artport'] = '#include <ArTPort.h>';
    Blockly.Arduino.definitions_['artirsence'] = '#include <ArTIRSence.h>';
  
  // definitions
	Blockly.Arduino.definitions_['define_port_%0'.replace(/%0/g,dropdown_ports)] = 
		'ArTPort port_%0(%0);'
			.replace(/%0/g, dropdown_ports);
	Blockly.Arduino.definitions_['define_irsence_%0'.replace(/%0/g,dropdown_ports)] = 
		'ArTIRSence analogIR_%0(&port_%0);\n'
			.replace(/%0/g, dropdown_ports);		
		
  // void setup()
//  Blockly.Arduino.setups_['setup_motor_'+dropdown_ports] = 'ArTMotorDriver motor_%0(%0);'.replace(/%0/g, dropdown_ports);
  
  // void loop() 
	var code = 'analogIR_%0.getIntensity(%1)'
				.replace(/%0/g, dropdown_ports)
				.replace(/%1/g, value_cnt);
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};
Blockly.Blocks['artlazer_sence'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(image('ArTLazer'), 64, 64, "*"))
        .appendField("Красный лазерный излучатель (KY-008):")
        .appendField(new Blockly.FieldDropdown(ports), "ports");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Состояние:")
        .appendField(new Blockly.FieldDropdown([["ВКЛ", "1"], ["ВЫКЛ", "0"]]), "state");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(330);
    this.setTooltip(
'Модуль красного лазерного излучателя.\n\
+ - красный провод\n\
- - синий провод\n\
S - белый провод\
');
    this.setHelpUrl('');
  }
};

Blockly.Arduino['artlazer_sence'] = function(block) {
  var dropdown_ports = block.getFieldValue('ports');
  var dropdown_state = block.getFieldValue('state');
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  // Blockly.Arduino.definitions_['artlazer_sence'] = '#include <Lazer.h>';

  // #define - если требуется - указать дефайны
  Blockly.Arduino.definitions_['define_port_%0'.replace(/%0/g,dropdown_ports)] =
   'ArTPort port_%0(%0);'.replace(/%0/g, dropdown_ports);

   Blockly.Arduino.definitions_['define_artlazer_sence_%0'.replace(/%0/g,dropdown_ports)] =
   'ArTLazer lazer_sence_%0(&port_%0);\n'.replace(/%0/g, dropdown_ports);

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)

  var code = 'что-то пошло не так';
  if(dropdown_state == 1)
  {
      code =  'lazer_sence_%0.ON();\n'.replace(/%0/g, dropdown_ports);
  }
  else
  {
      code =  'lazer_sence_%0.OFF();\n'.replace(/%0/g, dropdown_ports);
  }


  return code;
};

Blockly.Blocks['artled3colors_sence'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(image('ArTLed3colors'), 64, 64, "*"))
        .appendField("3-цветный светод (KY-009):")
        .appendField(new Blockly.FieldDropdown(ports), "ports");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Цвет:")
        .appendField(new Blockly.FieldDropdown([
                                                    ["Красный", "4"],
                                                    ["Зелёный", "2"],
                                                    ["Синий", "1"],
                                                    ["Желтый", "6"], /*R + G*/
                                                    ["Голубой", "3"], /*G + B*/
                                                    ["Фиолетовый", "5"], /*B + R*/
                                                    ["Белый", "7"]
                                                ]), "color");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Состояние:")
        .appendField(new Blockly.FieldDropdown([["ВКЛ", "1"], ["ВЫКЛ", "0"]]), "state");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Arduino['artled3colors_sence'] = function(block) {
  var dropdown_ports = block.getFieldValue('ports');
  var dropdown_color = block.getFieldValue('color');
  var dropdown_state = block.getFieldValue('state');
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  // Blockly.Arduino.definitions_['led_sence'] = '#include <Led.h>';

  // #define - если требуется - указать дефайны
  Blockly.Arduino.definitions_['define_port_%0'.replace(/%0/g,dropdown_ports)] =
   'ArTPort port_%0(%0);'
        .replace(/%0/g, dropdown_ports);
   Blockly.Arduino.definitions_['define_artled3colors_sence_%0'.replace(/%0/g,dropdown_ports)] =
   'ArTLed3color artled3colors_sence_%0(&port_%0);\n'
        .replace(/%0/g, dropdown_ports);

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)

  var code = '(!!! что-то пошло не так !!!)';

  if(dropdown_state == 1)
  {
      code = 'artled3colors_sence_%0.ON(%1);\n'
                             .replace(/%0/g, dropdown_ports)
                             .replace(/%1/g, dropdown_color);
  }
  else
  {
      code = 'artled3colors_sence_%0.OFF();\n'
                             .replace(/%0/g, dropdown_ports);
  }


  return code;
};

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

Blockly.Arduino['artline_sence_ky033'] = function(block) {
  var dropdown_port = block.getFieldValue('port');
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  //Blockly.Arduino.definitions_['hunt_sence'] = '#include <Hunter.h>';

  // #define - если требуется - указать дефайны
   Blockly.Arduino.definitions_['define_port_%0'.replace(/%0/g,dropdown_port)] =
		'ArTPort port_%0(%0);'
			.replace(/%0/g, dropdown_port);
	Blockly.Arduino.definitions_['define_line_sence_ky033_%0'.replace(/%0/g,dropdown_port)] =
		'ArTLineSence line_sence_%0(&port_%0);\n'
			                 .replace(/%0/g, dropdown_port);

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = 'line_sence_%0.isTrigged()'
							.replace(/%0/g, dropdown_port);
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Arduino.ORDER_NONE];
};


Blockly.Blocks['artmagn'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(image('ArTMagn'), 64, 64, "*"))
        .appendField("Датчик магнитного поля с герконом (KY-025):")
        .appendField(new Blockly.FieldDropdown(ports), "ports");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Режим работы:")
        .appendField(new Blockly.FieldDropdown([["Цифровой", "1"], ["Аналоговый", "0"]]), "work_mode");
    this.setOutput(true, "Number");
    this.setColour(120);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


Blockly.Arduino['artmagn'] = function(block) {
    var dropdown_ports = block.getFieldValue('ports');
    var dropdown_work_mode = block.getFieldValue('work_mode');
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  // Blockly.Arduino.definitions_['artmagn'] = '#include <Magn.h>';

  // #define - если требуется - указать дефайны
   Blockly.Arduino.definitions_['define_port_%0'.replace(/%0/g,dropdown_ports)] =
		'ArTPort port_%0(%0);'
			.replace(/%0/g, dropdown_ports);
	Blockly.Arduino.definitions_['define_artmagn_%0'.replace(/%0/g,dropdown_ports)] =
		'ArTMagn magn_sence_%0(&port_%0);\n'
			.replace(/%0/g, dropdown_ports);

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
    var code = '(!!! что-то пошло не так !!!)';

    if(dropdown_work_mode == 1)
    {
        code = 'magn_sence_%0.isTrigged()'
                               .replace(/%0/g, dropdown_ports);
    }
    else
    {
        code = 'magn_sence_%0.GetValue()'
                               .replace(/%0/g, dropdown_ports);
    }
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Arduino.ORDER_NONE];
};

'use strict';
/*BLOKS*/

// модуль управления моментным бвигателем
Blockly.Blocks['artmotordriver'] = {
  init: function() {
    this.appendDummyInput()
	.appendField(new Blockly.FieldImage(image('ArTMotordriver'), 64, 64, "*"))
        .appendField("Мотор:")
        .appendField(new Blockly.FieldDropdown(ports), "ports")
        .appendField("вращать в ")
        .appendField(new Blockly.FieldDropdown([["⟲", "left"], ["⟳", "right"]]), "placeside");
    this.appendValueInput("SPD")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("со скоростью:");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip(
'Модуль управление двигателем.\n\
В качестве входных параметров принимает Порт, к которому подключен двигатель, и скорость вращения.\n\
Отрицательные значения скорости заставляют вращаться мотор в противоположном направлении.\
');
  }
};

'use strict';
/*GENERATE*/

//goog.provide('Blockly.Arduino.ardutech.dcmotor');

//goog.require('Blockly.Arduino');

// управление моментным двигателем
Blockly.Arduino.artmotordriver = function() {
  var dropdown_ports = this.getFieldValue('ports');
  var dropdown_placeside = this.getFieldValue('placeside');
  var value_spd = Blockly.Arduino.valueToCode(this, 'SPD', Blockly.Arduino.ORDER_ATOMIC) || '100';
  
  // #include
    Blockly.Arduino.definitions_['artport'] = '#include <ArTPort.h>';
    Blockly.Arduino.definitions_['artmotordriver'] = '#include <ArTMotorDriver.h>';
  // definitions
  Blockly.Arduino.definitions_['define_port_%0'.replace(/%0/g,dropdown_ports)] = 
		'ArTPort port_%0(%0);'
			.replace(/%0/g, dropdown_ports);
  Blockly.Arduino.definitions_['define_motor_%0'.replace(/%0/g,dropdown_ports)] = 
		'ArTMotorDriver motor_%0(&port_%0);\n'
			.replace(/%0/g, dropdown_ports);
  
  // void setup()
  Blockly.Arduino.setups_[`setup_motor_${dropdown_ports}`] = `motor_${dropdown_ports}.Stop();\n`;
//  Blockly.Arduino.setups_[`setup_motor_${dropdown_ports}`] = 'motor_3' + dropdown_ports + '.Stop();\n';
  
  // void loop() 
  var code = (dropdown_placeside == 'left') ? 
			'motor_%0.Drive(%1 * (-1));\n'
				.replace(/%0/g, dropdown_ports)
				.replace(/%1/g, value_spd) :
			'motor_%0.Drive(%1);\n'
				.replace(/%0/g, dropdown_ports)
				.replace(/%1/g, value_spd) ;
  return code;
};


Blockly.Blocks['passive_buzzer_ky006'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(image('ArTPassiveBuzzer'), 64, 64, "*"))
        .appendField("Малый пассивный модуль зуммер (KY-006):")
        .appendField(new Blockly.FieldDropdown(ports), "ports");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Нота:")
        .appendField(new Blockly.FieldDropdown(notes), "notes");
    this.appendValueInput("delay")
        .setAlign(Blockly.ALIGN_RIGHT)
        .setCheck("Number")
        .appendField("(задержка, мс)");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip('Подключение:\n\
GND (-) - Сниий провод\n\
Pwr (+) - Не подключать\n\
Out (S) - Белый провод');
    this.setHelpUrl('');
  }
};

Blockly.Arduino['passive_buzzer_ky006'] = function(block) {
  var dropdown_ports = block.getFieldValue('ports');
  var dropdown_notes = block.getFieldValue('notes');
  var value_delay = Blockly.Arduino.valueToCode(block, 'delay', Blockly.Arduino.ORDER_ATOMIC);
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
 //  Blockly.Arduino.definitions_['pass_sence'] = '#include <Pass.h>';

  // #define - если требуется - указать дефайны
   Blockly.Arduino.definitions_['define_port_%0'.replace(/%0/g,dropdown_ports)] =
   'ArTPort port_%0(%0);'
        .replace(/%0/g, dropdown_ports);

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = '// звучит нота \ntone(port_%0.PWM(), %1, %2);'
                         .replace(/%0/g, dropdown_ports)
                         .replace(/%1/g, dropdown_notes)
                         .replace(/%2/g, value_delay);

    //var code = ' nnn ';
    // TODO: Change ORDER_NONE to the correct strength.
  return code;
};

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
Blockly.Arduino['art_sharpir'] = function(block) {
  var dropdown_sharptype = block.getFieldValue('sharptype');
  var dropdown_ports = block.getFieldValue('ports');
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  Blockly.Arduino.definitions_['artport'] = '#include <ArTPort.h>';
  Blockly.Arduino.definitions_['art_sharpir'] = '#include <SharpIR.h>';

  // #define - если требуется - указать дефайны
  Blockly.Arduino.definitions_['define_port_%0'.replace(/%0/g,dropdown_ports)] = 
		'ArTPort port_%0(%0);'
			.replace(/%0/g, dropdown_ports);
  Blockly.Arduino.definitions_['define_sharpir_%0'.replace(/%0/g,dropdown_ports)] = 
		'SharpIR sharp%0(port_%0.A(), %1);\n'
			.replace(/%0/g, dropdown_ports)
      .replace(/%1/g, dropdown_sharptype);

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = 'sharp%0.distance()'.replace(/%0/g, dropdown_ports);
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Arduino.ORDER_NONE];
};
Blockly.Blocks['art_system_led'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["Включить", "HIGH"], ["Выключить", "LOW"]]), "mode");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["Красный", "A5"], ["Зелёный", "A4"]]), "systemled")
        .appendField("светодиод");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(20);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Arduino['art_system_led'] = function(block) {
  var dropdown_mode = block.getFieldValue('mode');
  var dropdown_systemled = block.getFieldValue('systemled');
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
  // Blockly.Arduino.definitions_['уникальное имя'] = '#include <библиотека>';

  // #define - если требуется - указать дефайны
  // Blockly.Arduino.definitions_['уникальное имя'] = '#define что-то чем-то';

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  Blockly.Arduino.setups_['art_system_led_%0'.replace(/%0/g, dropdown_systemled)]
                            =   '// инициализируем системный светодиодный индикатор\n' +
                                tab + 'pinMode(%0, OUTPUT);\n'.replace(/%0/g, dropdown_systemled);

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code =    '// управление системный индикаторныйм светодиодом\n' +
                'digitalWrite(%0, %1);\n'
                    .replace(/%0/g, dropdown_systemled)
                    .replace(/%1/g, dropdown_mode);
  return code;
};

Blockly.Blocks['arttilt_sence_ky020'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(image('ArTTilt'), 64, 64, "*"))
        .appendField("Датчик наклона (KY-020):")
        .appendField(new Blockly.FieldDropdown(ports), "port");
    this.appendValueInput("delay")
        .setAlign(Blockly.ALIGN_RIGHT)
        .setCheck("Number")
        .appendField("(задержка, мс)");
    this.setOutput(true, "Boolean");
    this.setColour(120);
    this.setTooltip('Подключение:\n\
GND (-) - Сниий провод\n\
Pwr (+) - Красный провод\n\
Out (S) - Белый провод');
    this.setHelpUrl('');
  }
};

Blockly.Arduino['arttilt_sence_ky020'] = function(block) {
  var dropdown_port = block.getFieldValue('port');
  var value_delay = Blockly.Arduino.valueToCode(block, 'delay', Blockly.Arduino.ORDER_ATOMIC);
  // #include - ниже следует добавить бибилотеки, необходимые для модуля
//  Blockly.Arduino.definitions_['artnaklon_sence_ky020'] = '#include <Naklon.h>';

  // #define - если требуется - указать дефайны
   Blockly.Arduino.definitions_['define_port_%0'.replace(/%0/g,dropdown_port)] =
		'ArTPort port_%0(%0);'
			.replace(/%0/g, dropdown_port);
	Blockly.Arduino.definitions_['define_tilt_sence_ky020_%0'.replace(/%0/g,dropdown_port)] =
		'ArTTilt naklon_sence_%0(&port_%0);\n'
			.replace(/%0/g, dropdown_port);

  // void setup() - тут описывается код, который будет присутсвовать в секции SETUP
  // Blockly.Arduino.setups_['уникальное имя'] = текст, который должен быть в блоке SETUP

  // void loop() собственно то, что в code и будет в блоке loop
  //Blockly.Arduino.loops_['уникальное имя'] = ТО, что выполняется в LOOP но не поместу установки блока (игнорирует логику и структуру программы)
  var code = 'naklon_sence_%0.isTilt(%1)'
							.replace(/%0/g, dropdown_port)
							.replace(/%1/g, value_delay);
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Arduino.ORDER_NONE];
};

'use strict';
/*BLOKS*/

//goog.provide('Blockly.Blocks.ardutech.servo');

//goog.require('Blockly.Blocks');

// модуль управления сервоприводом
Blockly.Blocks['artservo'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Установить сервопривод:")
        .appendField(new Blockly.FieldDropdown(ports), "ports");
    this.appendValueInput("angle")
        .setCheck("Number")
        .appendField("на угол:");
	this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip('Модуль управления сервоприводом с ограниченным вращением.\nВ качестве входных параметров принимает номер порта, к которому подключен, и угол в градусах.');
    this.setHelpUrl('https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#wbeppm');
  }
};

'use strict';
/*GENERATE*/

//goog.provide('Blockly.Arduino.ardutech.servo');

//goog.require('Blockly.Arduino');

// управление сервоприводом
Blockly.Arduino.artservo = function(block) {
	var dropdown_ports = this.getFieldValue('ports');
	var value_angle = Blockly.Arduino.valueToCode(block, 'angle', Blockly.Arduino.ORDER_ATOMIC);

	// #include
    Blockly.Arduino.definitions_['artport'] = '#include <ArTPort.h>';
	Blockly.Arduino.definitions_['artservo'] = '#include <Servo.h>';
  
  // definitions
	Blockly.Arduino.definitions_[`define_port_${dropdown_ports}`] = 
		`ArTPort port_${dropdown_ports}(${dropdown_ports});`;

	Blockly.Arduino.definitions_[`define_servo_${dropdown_ports}`] = 
		`Servo servo_${dropdown_ports};\n`;
		
  // void setup()
	Blockly.Arduino.setups_[`setup_servo_${dropdown_ports}`] = 
        `servo_${dropdown_ports}.attach(port_${dropdown_ports}.PWM());\n`;
  
  // void loop() 
	var code = `servo_${dropdown_ports}.write(${value_angle});\n`;

  return code;
};
'use strict';
/*BLOKS*/

//goog.provide('Blockly.Blocks.ardutech.ultrasonic');

//goog.require('Blockly.Blocks');

// модуль стения расстояния УЗ датчика HC-04
Blockly.Blocks['artsoundsence'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Расстояние УЗ датчика")
        .appendField(new Blockly.FieldDropdown(ports), "ports");
    this.setOutput(true, "Number");
    this.setColour(120);
    this.setTooltip('Модуль ультразвукового датчика расстояния от 1см до 4метров.\nВ качество входного параметра необходимо указать порт, к которому он подключен (указан на плате).');
    this.setHelpUrl('https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#riqr4z');
  }
};


'use strict';
/*GENERATE*/

//goog.provide('Blockly.Arduino.ardutech.ultrasonic');

//goog.require('Blockly.Arduino');

// датчик расстояния УЗ HC-04
Blockly.Arduino.artsoundsence = function(block) {
	var dropdown_ports = this.getFieldValue('ports');

	// #include
    Blockly.Arduino.definitions_['artport'] = '#include <ArTPort.h>';
    Blockly.Arduino.definitions_['artsoundsence'] = '#include <Ultrasonic.h>';
  
  // definitions
	Blockly.Arduino.definitions_['define_port_%0'.replace(/%0/g,dropdown_ports)] = 
		'ArTPort port_%0(%0);'
			.replace(/%0/g, dropdown_ports);
			/*// Trig - 12, Echo - 13
Ultrasonic ultrasonic(12, 13);*/
	Blockly.Arduino.definitions_['define_soundsence_%0'.replace(/%0/g,dropdown_ports)] = 
		'Ultrasonic ultrasonic_%0(port_%0.PWM(), port_%0.D());\n'
			.replace(/%0/g, dropdown_ports);		
		
  // void setup()
//  Blockly.Arduino.setups_['setup_motor_'+dropdown_ports] = 'ArTMotorDriver motor_%0(%0);'.replace(/%0/g, dropdown_ports);
  
  // void loop() 
	var code = 'ultrasonic_%0.Ranging(CM)'
				.replace(/%0/g, dropdown_ports);
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};
'use strict';
/*BLOKS*/

//goog.provide('Blockly.Blocks.architechnic.ports');

//goog.require('Blockly.Blocks');

// Объявляем порты платы
var ports = [
			["PortA", "0"],
			["PortB", "1"],
			["PortC", "2"],
			["PortD", "3"],
			["PortE", "4"],
			["PortF", "5"]
	     ];

var notes = [
    ["Си 0", "31"],
    ["До 1", "33"],
    ["До #1", "35"],
    ["Ре 1", "37"],
    ["Ре #1", "39"],
    ["Ми 1", "41"],
    ["Фа 1", "44"],
    ["Фа #1", "46"],
    ["Соль 1", "49"],
    ["Соль #1", "52"],
    ["Ля 1", "55"],
    ["Ля #1", "58"],
    ["Си 1", "62"],
    ["До #2", "69"],
    ["До 2", "65"],
    ["Ре 2", "73"],
    ["Ре #2", "78"],
    ["Ми 2", "82"],
    ["Фа 2", "87"],
    ["Фа #2", "93"],
    ["Соль 2", "98"],
    ["Соль #2", "104"],
    ["Ля 2", "110"],
    ["Ля #2", "117"],
    ["Си 2", "123"],
    ["До 3", "131"],
    ["До #3", "139"],
    ["Ре 3", "147"],
    ["Ре #3", "156"],
    ["Ми 3", "165"],
    ["Фа 3", "175"],
    ["Фа #3", "185"],
    ["Соль 3", "196"],
    ["Соль #3", "208"],
    ["Ля 3", "220"],
    ["Ля #3", "233"],
    ["Си 3", "247"],
    ["До 4", "262"],
    ["До #4", "277"],
    ["Ре 4", "294"],
    ["Ре #4", "311"],
    ["Ми 4", "330"],
    ["Фа 4", "349"],
    ["Фа #4", "370"],
    ["Соль 4", "392"],
    ["Соль #4", "415"],
    ["Ля 4", "440"],
    ["Ля #4", "466"],
    ["Си 4", "494"],
    ["До 5", "523"],
    ["До #5", "554"],
    ["Ре 5", "587"],
    ["Ре #5", "622"],
    ["Ми 5", "659"],
    ["Фа 5", "698"],
    ["Фа #5", "740"],
    ["Соль 5", "784"],
    ["Соль #5", "831"],
    ["Ля 5", "880"],
    ["Ля #5", "932"],
    ["Си 5", "988"],
    ["До 6", "1047"],
    ["До #6", "1109"],
    ["Ре 6", "1175"],
    ["Ре #6", "1245"],
    ["Ми 6", "1319"],
    ["Фа 6", "1397"],
    ["Фа #6", "1480"],
    ["Соль 6", "1568"],
    ["Соль #6", "1661"],
    ["Ля 6", "1760"],
    ["Ля #6", "1865"],
    ["Си 6", "1976"],
    ["До 7", "2093"],
    ["До #7", "2217"],
    ["Ре 7", "2349"],
    ["Ре #7", "2489"],
    ["Ми 7", "2637"],
    ["Фа 7", "2794"],
    ["Фа #7", "2960"],
    ["Соль 7", "3136"],
    ["Соль #7", "3322"],
    ["Ля 7", "3520"],
    ["Ля #7", "3729"],
    ["Си 7", "3951"],
    ["До 8", "4186"],
    ["До #8", "4435"],
    ["Ре 8", "4699"],
    ["Ре #8", "4978"]
];
var image = function(val)
{
	return 'js/blockly/data/3.dronBlock/%0/image.jpg'.replace(/%0/g, val);
};

