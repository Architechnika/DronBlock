/* основной файл методов взаимодействия HTML и системы

*/

'use strict'

var tab = '  ';


var workspace           = workspace || '';
var container           = container || '';
var content_blocks      = content_blocks || '';
var category            = category || '';
var editor              = editor || '';

var blockly_width       = blockly_width || 70; // 70%
var toolboxHeight       = toolboxHeight || 32;

var mouse_upButton      = "null";
var mouse_downButton    = "null";
var mouse_pinX          = 0;
var mouse_x             = 0;
var mouse_pinY          = 0;
var mouse_y             = 0;

// инициализация для NWJS
var Menu                = Menu || {};
var Control             = Control || {};

var HTML_newProject = {};
var HTML_openProject = {};
var HTML_saveProject = {};
var HTML_compileProject = {};
var HTML_getPortsList = {};

var HTML_openOption = {};
var HTML_saveOptions = {};

var HTML_refresh = {};

var HTML_lastPlatform = 'toolbox_ArT';

var JSON_parce = {};
var JSON_stringify = {};

/* Глобальные переменные */
var globalSelectedPlatform; 	// Нужно для определения походящего типа платы
var globalPlatformList = {}; 	// Список всех поддерживаемых платформ
var globalDevMode = "blockly";	// Текущий режим разработки.
								// "blockly"	- графический. Создание программы из блоков
								// "code" 		- редактирование кода. Блоки убраны


var OPTIONS =   {
                    compiler : './app/arduino/arduino-builder',
                    toolbox : true,
                    editor :
                    {
                        canEdit : false,
                        visible : true
                    },
                    lastPort : 'none'
                };

var initialValue = "<xml xmlns=\"http://www.w3.org/1999/xhtml\"><block type=\"artboard\" id=\"9\" x=\"38\" y=\"13\"><field name=\"artboard\">0</field></block></xml>";

var ns4 = {};
var ie4 = {};



var HTML_Init = function(dialog)
{
    var ns4 = (document.layers) ? true : false;
    var ie4 = (document.all) ? true : false;

    // конфигурируем в зависимости от рабочей платформы
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // ------------------------------------------------
    if(NWJS !== undefined || NWJS == true)
    {
		// значит работаем под NWJS
        var optionsOK = false;

        Menu = require('./js/nwjs/menuhelper');
        Control = require('./js/nwjs/control');

        Control.Init(
                        document.getElementById('openFile'),
                        document.getElementById('saveFile'),
                        Blockly,
                        initialValue,
                        console,
                        document.getElementById('compile_state'),
                        document.getElementById('table_process'),
                        document.getElementById('table_process_end')
                    );
        console.log('Сопоставляю методы работы программы');

        HTML_newProject         = Control.newProject;
        HTML_openProject        = Control.openProject;
        HTML_saveProject        = Control.saveProject;
        HTML_compileProject     = function(port, BOARD)
        {
            console.log('Адрес компилятора:\n' + OPTIONS.compiler);

            Control.compileProject(port, BOARD, editor.getValue());
        };


		// Составляем список портов
        HTML_getPortsList       = function(html_object, needRestorePort)
        {
            Control.getPortsList((ports, html_object) =>
                {
                    var select; // = `<option value="com0">COM0</option>`;
                    ports.forEach((port) =>
                        {
                            console.log('PORT NAME : ' + port.path);
                            select += `<option value="${port.path}">${port.path}</option>`;
                        });

                    html_object.innerHTML = select;

                    // Вспоминаем последний использовавшийся порт
                    if(needRestorePort == true)
						compileDialogRestorePort();

                }, html_object);
        };

        HTML_refresh            = Control.htmlGenerate;

        HTML_openOption         = openOption;
        JSON_parce              = Control.JSON_parce;
        JSON_stringify          = Control.JSON_stringify;


        // инициализируем меню
        /*console.log('Создаю меню для NWJS');
        Menu.createMenu(
                            nw,
                            Control,
                            console,
                            openOption,
                            run_compile,
                            document.location.href,
                            serialportmonitorOpen);
        console.log('OK');
*/
        HTML_readOptions();

        console.log(OPTIONS);

        Control.setOptions(OPTIONS);

        // TEST value
        /*{
                            compiler : './app/arduino/arduino-builder',
                            toolbox : true,
                            editor :
                            {
                                canEdit : false,
                                visible : true
                            }
                        };*/
       /* if(OPTIONS.toolbox)
        {
            document.getElementById('topToolbar').style = "display: true;";
        }
        else
        {
            document.getElementById('topToolbar').style = "display: none;";
        }*/


        dialog.showModal();
    }
    else
    {
        HTML_newProject         = Server.newProject;
        HTML_openProject        = Server.openProject;
        HTML_saveProject        = Server.saveProject;
        HTML_compileProject     = function()
        {
            console.log('Адрес компилятора:\n' + OPTIONS.compiler);
            Server.compileProject();
        };
        HTML_openOption         = openOption;

        //style="display: none;"
        document.getElementById('topToolbar').style = "display: true;";
    }

    // Инициализация и настройка редактора кода
    console.log('Start init Editor');

    ace.require("ace/ext/language_tools");
    editor = ace.edit("editor_sorce");


    editor.setTheme("js/ace/theme/clouds");
    editor.session.setMode("js/ace/mode/c_cpp");
    editor.enableEmmet = true;
    editor.spellcheck = true;
    editor.enableSnippets = true;
    editor.enableBasicAutocompletion = true;
    editor.enableLiveAutocompletion = true;

    console.log('End init Editor');

    doOptions();
};

var HTML_initMainScreen = function(typeProject)
{

    console.log('Start init Blockly');
    // инициализация blockly
    //--------------------------------------------------------------
    // собственно описание инициализации рабочего поля блокли
    workspace = Blockly.inject(document.getElementById('content_blocks'),
    {
        zoom:
            {
                controls: true,
                wheel: false,
                startScale: 1.0,
                maxScale: 3.0,
                minScale: 0.3,
                scaleSpeed: 1.2
            },
        /*trashcan: true,*/
        grid:
            {
                spacing: 25,
                length: 3,
                colour: '#ccc',
                snap: true
            },
        media: 'js/blockly/media/', // */
        toolbox: document.getElementById(`${typeProject}`)
    });

    // добавляем событие изменения схемы
    workspace.addChangeListener(renderCodeAndXML);

    // загружаем данные с локального хранилища
    // с учетом выбранной платформы
    if(window.localStorage[`autosave_${HTML_lastPlatform}`])    setXML(window.localStorage[`autosave_${HTML_lastPlatform}`]);
    else
    {
        switch(typeProject)
        {
            default:
            {
                setXML(initialValue);
            } break;

            case 'toolbox_arduino':
            {
                setXML('');
            } break;

            case 'toolbox_ArT':
            {
                setXML(initialValue);
            } break;
        }
    }

    // добавляем событие изменения размера окна
    window.addEventListener('resize', redrawAll, true);

    console.log('End init Blockly');

    // запустим отслеживание координат мыши
    if (ns4)
    {
        document.captureEvents(Event.MOUSEMOVE);
        document.captureEvents(Event.MOUSEUP);
    }
    document.onmousemove = mouse_move;
    document.onmouseup = mouse_up;

    resize_panel.addEventListener("mousedown", mouse_down);
    resize_panel.addEventListener("mouseup", mouse_up);

    mouse_upButton = "null";
    mouse_downButton = "null";

    redrawAll();
};

var toolboxstate = true;
var HTML_hideToolbox = function()
{
    if(toolboxstate)
    {
        toolboxstate = false;

        document.getElementsByClassName('blocklyToolboxDiv').style = "left: 0px; height: 649px; display: none;";
    }
    else
    {
        toolboxstate = true;
        document.getElementsByClassName('blocklyToolboxDiv').style = "left: 0px; height: 649px; display: block;";
    }

};

var HTML_readOptions = function()
{
    if(NWJS !== undefined || NWJS == true)
    {// значит работаем под NWJS
        var options = window.localStorage['options'];
        HTML_lastPlatform = window.localStorage['lastPlatform'];

        // для отработки кнопки "Продолжить"
        if(!HTML_lastPlatform)
        {
            HTML_lastPlatform = 'toolbox_ArT';
        }

        if(!options)
        {
            console.log('Настройки не найдены - запускаю мастер =>');
            //openOption();
        }
        else
        {
            console.log('Настройки обнаружены - запукаю парсинг =>' + options);
            OPTIONS = JSON_parce(options);
        //        console.log(Control.OPTIONS);
            console.log('Система настроена\n' + OPTIONS);
        }
    }
    else
    {
        var options = Server.readOption();

        // начинаем парсинг

    }
};

var HTML_clearAutoSave = function()
{
    window.localStorage[`autosave_${HTML_lastPlatform}`] = '';
};

var HTML_saveOptions = function()
{
    window.localStorage['options'] = JSON_stringify(OPTIONS);
    window.localStorage['lastPlatform'] = HTML_lastPlatform;
};

// Метод перерисовки всех областей студии
var redrawAll = function()
{
    var toolbox = document.getElementById("topToolbar");
    var container = document.getElementById('blocks_panel');
    var content_blocks = document.getElementById('content_blocks');
    var resize_panel = document.getElementById("resize_panel");
    var code_panel = document.getElementById("code_panel");
    var code_sorce = document.getElementById("code_sorce");

    var window_width = window.innerWidth;
    var window_heght = window.innerHeight;

    var blocks_width = (code_panel.style.display == "none") ? window_width : window_width / 100 * blockly_width;
    var code_width = window_width - blocks_width - 1;

    var toolH = (toolbox.style.display == "none") ? 0 : toolboxHeight;

    console.log('Blockly resize');
    console.log('Размер всего окна: ' + window_width + ' x ' + window_heght);

    console.log('Перерисуем панель кнопок');
    toolbox.style.top = '0px';
    toolbox.style.left = '0px';
    toolbox.style.width = window_width + 'px';
    toolbox.style.height = toolH + 'px';
    container.style.width = blocks_width + 'px';
    container.style.height = window_heght - toolH + 'px';

    console.log('Ширина поля блоков: ' + container.offsetWidth);

    content_blocks.style.width = blocks_width + 'px';
    content_blocks.style.height = window_heght - toolH + 'px';

    console.log('Ширина поля кода: ' + code_width);

    code_panel.style.height = window_heght - toolH + 'px';
    code_panel.style.width = code_width + 'px';
    code_panel.style.left = blocks_width + 'px';
    code_panel.style.top = toolH + 'px';

    console.log('OK');

    console.log('Resize panel replace');

    resize_panel.style.left = (code_panel.offsetLeft - resize_panel.offsetWidth) + 'px'

    console.log('OK');

    console.log('Refresh desktop');
    editor.resize();
    console.log('Refresh OK');

    // Перерисовать содержимое Blockly
    Blockly.svgResize(workspace);
};

// событие НАЖАТИЯ кнопки мыши
var mouse_down = function(event)
{
    mouse_upButton = "null";
    console.log('MOUSE DOWN:');
    if (event.which == 1)
    {
        console.log("Левая");
        mouse_downButton = "left";
        mouse_pinX = mouse_x;
        mouse_pinY = mouse_y;
    }
    else if (event.which == 2)
    {
        console.log("Средняя");
        mouse_downButton = "middle";
    }
    else if (event.which == 3)
    {
        console.log("Правая");
        mouse_downButton = "right";
    }
};

// событие ОТЖАТИЯ кнопки мыши
var mouse_up = function(event)
{
    mouse_downButton = "null";
    mouse_pinX = -1;
    mouse_pinY = -1;
    console.log('MOUSE UP:');
    if (event.which == 1)
    {
        console.log("Левая");
        mouse_upButton = "left";
    }
    else if (event.which == 2)
    {
        console.log("Средняя");
        mouse_upButton = "middle";
    }
    else if (event.which == 3)
    {
        console.log("Правая");
        mouse_upButton = "right";
    }
};

// метод получения координат мыши в окне программы
var mouse_move = function(event)
{
    var window_width = window.innerWidth;

    mouse_x = mouse_y = 0;

    if(mouse_downButton != "null")
    {
        if (document.attachEvent != null)
        {
            mouse_x = window.event.clientX;
            mouse_y = window.event.clientY;
        }
        else if (!document.attachEvent && document.addEventListener)
        {
            mouse_x = event.clientX;
            mouse_y = event.clientY;
        }

        // если требуется двигать
        if(mouse_x >= 0)
        {
            blockly_width = mouse_x / window_width * 100;
            blockly_width = blockly_width < 30 ? 30 : blockly_width;
            redrawAll();
            console.log(blockly_width);
        }
    }
//    console.log('Mous coordinate: ' + mouse_status);
};

// событие изменения схемы
// по кажому изменению обновляем текстовку
var renderCodeAndXML = function(event)
{
    console.log('Try save local storage');
    window.localStorage[`autosave_${HTML_lastPlatform}`] = getXML();
    console.log('OK');

    console.log('Try get Code from Blockly...');
    setCode(getCode());
    console.log('OK');
};

// очистка рабочего поля
var workspaceClear = function()
{
    Blockly.mainWorkspace.clear();
};

// читаем код текущего варианта схемы
var getCode = function()
{
    console.log('Try Get Code');
    return Blockly.Arduino.workspaceToCode(Blockly.mainWorkspace);
};

// читаем XML текущего варианта схемы
var getXML = function()
{
    var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    var data = Blockly.Xml.domToText(xml);

    return data;
};

// записываем новый вариант XML для схемы
// value - простой текст XML
var setXML = function(value)
{
    var xml = Blockly.Xml.textToDom(value);

    Blockly.mainWorkspace.setVisible(false);

    Blockly.Xml.domToWorkspace(xml, Blockly.mainWorkspace);

    Blockly.mainWorkspace.render();

    Blockly.mainWorkspace.setVisible(true);
};

// метод рендеригнга редактора текста
var setCode = function(value)
{
//    editor = ace.edit("editor_sorce");
    editor.setTheme("ace/theme/clouds");

    //var editor_ena = document.getElementById('code_editor_ena');
    //editor.setReadOnly(!editor_ena.checked);  // false to make it editable

    editor.session.setMode("ace/mode/c_cpp");

    if(value != 'null')
    {
        editor.session.setValue(value);
    }
};

var openOption = function ()
{
    var dialog = document.getElementById("dialog_options");
    var toolbox_visible = document.getElementById('toolbox_visible');
    var editor_setEdit = document.getElementById('editor_setEdit');
    var editor_visible = document.getElementById('editor_visible');

    console.log('Проверка парамтеров');
    checkOptions();

    toolbox_visible.checked = OPTIONS.toolbox;
    editor_setEdit.checked  = OPTIONS.editor.canEdit;
    editor_visible.checked  = OPTIONS.editor.visible;

    document.getElementById('options_cancel').onclick = function()
    {
        dialog.close();
    };

    document.getElementById('options_accept').onclick = function()
    {
        var dialog = document.getElementById("dialog_options");
        var toolbox_visible = document.getElementById('toolbox_visible');
        var editor_setEdit = document.getElementById('editor_setEdit');
        var editor_visible = document.getElementById('editor_visible');

        console.log('Start options accept');

        OPTIONS.toolbox = toolbox_visible.checked;
        OPTIONS.editor.canEdit = editor_setEdit.checked;
        OPTIONS.editor.visible = editor_visible.checked;

        doOptions();
        HTML_saveOptions();

        console.log('End options accept and close dialog');

        dialog.close();
    };

    dialog.showModal();
}

var checkOptions = function()
{
    console.log('Start checking options');

    try
    {
        OPTIONS.toolbox = OPTIONS.toolbox;
    }
    catch (e)
    {
        console.log(e);
        OPTIONS.toolbox = true;
    }

    try
    {
        OPTIONS.editor = OPTIONS.editor;
    }
    catch (e)
    {
        console.log(e);
        OPTIONS.editor = {};
    }

    try
    {
        OPTIONS.editor.canEdit = OPTIONS.editor.canEdit;
    }
    catch (e)
    {
        console.log(e);
        OPTIONS.editor.canEdit = false;
    }

    try
    {
        OPTIONS.editor.visible = OPTIONS.editor.visible;
    }
    catch (e)
    {
        console.log(e);
        OPTIONS.editor.visible = true;
    }

    try
    {
        OPTIONS.lastPort = OPTIONS.lastPort;
    }
    catch (e)
    {
        console.log(e);
        OPTIONS.lastPort = "none";
    }

    console.log('End checking options');
};

var doOptions = function()
{
    var toolbox = document.getElementById("topToolbar");
    toolbox.style.display = OPTIONS.toolbox ? "" : "none";


    var code_panel = document.getElementById("code_panel");
    code_panel.style.display = OPTIONS.editor.visible ? "" : "none";

    editor.setReadOnly(!OPTIONS.editor.canEdit);

    redrawAll();
};

/*	Переключение режима разработки	*/
var blocklyWidthPrev;
function switchDevMode()
{
	var codeWindow = document.getElementById("code_sorce");
	var blocksWindow = document.getElementById("blocks_panel");

	/* Переходим в режим "только код" */
	if(globalDevMode == "blockly")
	{
		globalDevMode = "code";

		// Сохраняем текущее значение ширины редактора блоков
		// и убираем редактор (ширина = 0)
		blocklyWidthPrev = blockly_width;
		blockly_width = 0;
		redrawAll();

		// Разрешаем редактирование в Ace Editor
		editor.setOptions({
			readOnly: false
		})

	}

	/* Режим с блоками */
	else if(globalDevMode == "code")
	{
		globalDevMode = "blockly";

		// Восстанавливаем значение ширины редактора блоков
		// Теперь он снова видимый
		blockly_width = blocklyWidthPrev;
		redrawAll();

		// Запрещаем редактирование в Ace Editor
		editor.setOptions({
			readOnly: true
		})
	}
	else
		return;
}

/* Запомнить последний ипользованный для прошивки порт */
function compileDialogRememberPort()
{
	// Запомнить выбранный порт
	// Использовать его по умолчанию в следующий раз
	OPTIONS.lastPort = document.getElementById("comport_list").value;

	// Сохранить настройки программы, в т.ч. и порт
	HTML_saveOptions();
}

/* Восстановить последний ипользованный для прошивки порт */
function compileDialogRestorePort()
{
	if(OPTIONS.lastPort != 'none')
	{
		// Попытка восстановить последний порт
		document.getElementById("comport_list").value = OPTIONS.lastPort;
		
		// Если к запомненному порту не подключена плата, то поле выбора
		// порта будет пустым.
		// Тогда просто обновляем список портов в надежде найти
		// активный
		if(document.getElementById("comport_list").value == '')
		{
			console.log("Restored port is not acitive! Refreshing");
			serialport_refresh(false);
		}
	}
	else
		console.log("compileDialogRestorePort(): OPTIONS.lastPort is none");
}
