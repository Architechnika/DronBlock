/*
Server Options class
класс содержит параметры сервера:
    расположение файлов
    расопложение компилятора
    расопложение библиотек и прочее

*/

var Control     = Control || {};

var os          = require('os');          // модуль взаимодействия с ОС

var path        = require('path');      // модуль работы с путями

var fs          = require('fs');          // модуль работы с файловой системой

var JSON5       = require('json5');    // навороченная версия парсера для JSON
var ncp         = require('ncp').ncp;    // модуль для копирования папок
var mkdirp      = require('mkdirp');  // модуль для создания дерева папок

var fh          = require('./fshelper.js');

var arduino     = require('./arduino');
/*gui.Window.get(); //окно
gui.Shell(); //оболочка
gui.Tray // трей
gui.Menu // менюшки
gui.Clipboard // буффер обмена
gui.Shortcut // сочетания клавиш

// Print arguments
Control.console.log(gui.App.argv);

// Quit current app
gui.App.quit();

// Get the name field in manifest
gui.App.manifest.name
*/



// Control.URL = '127.0.0.1';
// Control.PORT = '8080';
// Control.DATA_PATH = gui.App.dataPath;
// Control.ROOT_PATH = os.path.abspath(os.path.dirname(sys.argv[0].decode(sys.getfilesystemencoding())))
Control.LIB_PATH        = './artlibs';
Control.OPT_PATH        = './options.ini';
Control.DATA_PATH       = './js/blockly/data/';
Control.HTML_SRC        = './template/src.html';
Control.HTML_GEN        = './index_gen.html';
Control.BUILDER         = './app/arduino/arduino-builder';
Control.BUILDER_PATH    = './app/arduino/';
Control.TMP_PATH        = path.join(os.tmpdir(), 'art', 'temp');
Control.BUILD_PATH      = path.join(os.tmpdir(), 'art', 'build');
Control.TMP_PRJ         = path.join(Control.TMP_PATH, 'temp.ino');
Control.OPTIONS =   {
                        compiler : './app/arduino/arduino-builder',
                        toolbox : true,
                        editor :
                        {
                            canEdit : false,
                            visible : true
                        }
                    };

var LOG = {};
var LOG_OBJECT = {};
var PROC_OBJECT = {};
var PROC_END_OBJECT = {};

// fileOpen - оъект HTML который открывает файл
// blockly - объект blockly
// initialValue - первоначальное значение для инициализации блокли
Control.Init = function
(
    fileOpen, // - оъект HTML который открывает файл
    saveFile, // - для сохранения файла
    blockly, // - объект blockly
    initialValue, // - первоначальное значение для инициализации блокли
    console,
    log,
    PROC,
    PROC_END
)
{
    Control.fileOpen        = fileOpen;
    Control.saveFile        = saveFile;
    Control.Blockly         = blockly;
    Control.initialValue    = initialValue;
    LOG                     = console.log;
    LOG_OBJECT              = log;
    PROC_OBJECT             = PROC;
    PROC_END_OBJECT         = PROC_END;

    arduino.initPortList(LOG);

};

Control.JSON_parce = function(json)
{
    return JSON5.parse(json);
};

Control.JSON_stringify = function(json)
{
    return JSON5.stringify(json);
};

Control.setOptions = function(options)
{
    Control.OPTIONS = options;
};

Control.getPortsList = function(callback, html_object)
{
    arduino.getPortList(LOG, callback, html_object);
};

// медот запуска компилации проекта
// по факту создает проект для ардуино и запускает студию
Control.compileProject = function(port, BOARD, text)
{

    LOG_OBJECT.innerHTML = 'Создаём структуру проекта';
    PROC_OBJECT.style="display: true;";
    // удалим временую папку, чтобы очистить её
    Control.LOG_OBLECT = 'Подготовка проекта';
    LOG('Подготовка проекта');
    fh.removeDir(Control.TMP_PATH, function(err)
    {
        if(err)
        {
            return alert('ERROR!!!\n' + err);
        }
        LOG('Удалили временную папку');

        mkdirp(Control.TMP_PATH, function (err)
        {
            if (err)
            {
                return alert('ERROR!!!\n' + err);
            }

            LOG('Создали временную папку заново');
            // копируем папку библиотек в папку проекта
//            ncp(Control.LIB_PATH, Control.TMP_PATH, function (err)
//            {
//                if (err)
//                {
//                    return alert('ERROR!!!\n' + err);
//                }

//                ncp(Control.BUILDER_PATH + '/libraries', Control.TMP_PATH, function (err)
//                {
//                    if(err)
//                    {
//                        return alert('ERROR!!!\n' + err)

                    mkdirp(Control.BUILD_PATH, (err) =>
                    {
                        if(err)
                        {
                            return alert (`ERROR!!!\n${err}`);
                        }

                        LOG('Запускаем компиляцию');
                        Control.arduinoExport(Control.TMP_PRJ, Control.runCompiler, port, BOARD, text);

                    });
//                });
//            });
        });
    });
};

// метод запуска компилятора
Control.runCompiler = function(port, BOARD)
{

   arduino.BuildProject(Control.BUILDER_PATH,
                        Control.BUILD_PATH,
                        Control.TMP_PRJ,
                        (
                            Control.LIB_PATH + "|" +
                            Control.BUILDER_PATH + '/libraries'
                        ),
                        LOG,
                        LOG_OBJECT,
                        PROC_OBJECT,
                        PROC_END_OBJECT,
                        port,
                        BOARD);

};



// инициируем события генерации странички
Control.htmlGenerate = function()
{
    Control.getScripts();
};

// сперва составляем спсок скриптов
Control.getScripts = function()
{
    LOG("Читаем список файлов *.js")
    fh.getFileList(Control.DATA_PATH, function(scripts)
    {
        // как только составили список скриптов - составляем список контроллов
        Control.getControlList(scripts);
    }, ".js");
};

// метод построения списка контролов
// в качестве аргумента передаем список скриптов
// это необходимость из-за ассинхронно-событийной работы
Control.getControlList = function(scriptList)
{
    LOG("Читайем список файлов *.xml")
    fh.getFileList(Control.DATA_PATH, function(category)
    {
        LOG("Читаем исходный HTML")
        fs.readFile(Control.HTML_SRC, 'utf8', function(err, text)
        {
            var arduino = [];
            var architec = []
            var other = [];

            if(err) return alert(err);

            LOG('Формируем список скриптов');
            // отсуортируем скрипты так, чтобы скрипты отардуино всегда были первыми в
            // списке инициализации скриптов
            scriptList.forEach(elem =>
            {
                if(elem.toLowerCase().indexOf('arduino') > -1)
                {
                    LOG("Нашли модуль Arduino");
                    arduino.push(elem);
                }
                else if (elem.toLowerCase().indexOf('dronblock') > -1)
                {
                    LOG("Нашли модуль dronBlock");
                    architec.push(elem);
                }
                else
                {
                    LOG("Нашли модуль какой-то остальной фигни");
                    other.push(elem);
                }
            });

            LOG("Приступаем к формированию нового HTML");
            // создаём отсортированный список скриптов
            scriptList = arduino.concat(architec).concat(other);

    //        LOG(scriptList);
            // переведём данные из массива в строковую последоватлеьность
            var scripts = '<script src="js\\blockly\\data\\union.min.js"></script>\n';
            scriptList.forEach(elem =>
            {
                if(elem.toLowerCase().indexOf('ide') > -1)
                {
                    scripts += '<script src="%0"></script>\n'.replace(/%0/g, elem.replace('src/', '').replace('src\\',''));
                }
            });

   //         LOG(scripts);

            // создаём строковую последовательность контроллов
            // пишем в разные переменные, чтобы создать наборы контролов для разных платыорм
            var controls_IDE = '';
            var controls_arduino = '';
            var controls_ArT = '';
            var controls_other = '';
            category.forEach(elem =>
            {
    //            LOG(elem);
                if(elem.toLowerCase().indexOf('ide') > -1)
                {
                    controls_IDE += fs.readFileSync(elem, 'utf8') + '\n';
                }
                else if(elem.toLowerCase().indexOf('arduino') > -1)
                {
                    controls_arduino += fs.readFileSync(elem, 'utf8') + '\n';
                }
                else if(elem.toLowerCase().indexOf('dronblock') > -1)
                {
                    controls_ArT += fs.readFileSync(elem, 'utf8') + '\n';
                }
                else
                {
                    controls += fs.readFileSync(elem, 'utf8') + '\n';
                }
                
            });

            // отрабатываем текст новой странички
 //           LOG(controls_IDE);
 //           LOG(controls_arduino);
 //           LOG(controls_ArT);
            text = text.replace(/%script%/, scripts)
                        .replace(/%category_IDE%/g, controls_IDE)
                        .replace(/%category_arduino%/g, controls_arduino)
                        .replace(/%category_ArT%/g, controls_ArT);
                        //.replace(/%category%/, controls);
            
      //      LOG(text);

            // используем node.js для записи файлов на диск
            // сохраняем новую страничку
            fs.writeFile(Control.HTML_GEN, text, function (err)
            {
                if (err)
                {
                    alert("Write failed: " + err);
                    return;
                }

                LOG('Сохранили новый HTML. Запускаем компилирование скриптов');
                // переходим на новую страничку
                //Control.document.location.href = Control.HTML_GEN;
                require('child_process').exec(`union.bat`,
                                                {
                                                    maxBuffer : 819200,
                                                    cwd : Control.DATA_PATH,
                                                    encoding : '1251',
                                                    shell : 'cmd.exe'
                                                }, (error, stdout, stderr) =>
                        {
                            if (error)
                            {
                                alert(`Ошибка сборки и сжатия скриптов: \n${error}`);

                                LOG(`Ошибка сборки и сжатия скриптов: \n${error}`);
                                return;
                            }
                            LOG(`stdout: ${stdout}\nstderr: ${stderr}`);

                            LOG('Завершено');

                            alert('Новый документ создан');
                        });
                
            });
        });

    }, ".xml");
};

// создаём новый проект
Control.newProject = function()
{
    if(confirm("Вы хотите сохранить текущий проект?") || false)
    {
        Control.saveProject(getXML());
    }
    Control.Blockly.mainWorkspace.clear();
    setXML(Control.initialValue);
};

// вызываем осбытие открытия файла для стандартного контрола
Control.openFileDialog = function(callback)
{
    // добавляем обработчик события
    Control.fileOpen.value = '';
 	Control.fileOpen.addEventListener('change', callback, false);
    // имитируем событие
 	Control.fileOpen.click();
};

// вызываем осбытие открытия файла для стандартного контрола
Control.openProject = function()
{
    Control.openFileDialog(Control.openFile);
};
// обраотчик события откытия файла
Control.openFile = function(event)
{
    // проверим количество выбранных файлов
	var files = event.target.files;
	if (files.length != 1) {
		return;
	}

	// обявим читателя файлов
	var reader = new FileReader();
    // подключим обраотчик события окончания чтения файла
	reader.onloadend = function(event)
    {
		var target = event.target;
		// если сыбитие чтения файла удачно
		if (target.readyState == 2)
        {
			try
            {
                // пробуем распарсить файл проекта
				var xml = Control.Blockly.Xml.textToDom(target.result);
			}
            catch (e)
            {
				alert('Ошибка загрузки проекта Ardutech:\n' + e);
				return;
			}

            // если файл проекта распарсили
            // очистим форму
            Control.Blockly.mainWorkspace.clear();
            // откроем проект
            setXML(target.result);
		}

	};
    // запускаем чтение файла
	reader.readAsText(files[0]);
};

// сохранение файла проекта
Control.saveProject = function()
{
    // подключаем обработчик события и инициируем его
    Control.saveFile.value = '';
 	Control.saveFile.addEventListener('change', Control.saveFilePrg, false);
    Control.saveFile.nwsaveas='*.art';
 	Control.saveFile.click();
};
// обработка события сохранения файла
Control.saveFilePrg = function(event)
{
    var files = event.target.files;
    if (files.length != 1)
    {
    	return;
    }

    // используем node.js для записи файлов на диск
    fs.writeFile(event.target.value, getXML(), function (err)
    {
        if (err)
        {
            alert("Write failed: " + err);
            return;
        }
    });
};

// метод экспорта проекта в различные файлы
Control.exportProject = function(val)
{
    Control._exportType = val;
    // подключаем обработчик события и инициируем его
    var xprt = Control.saveFile;
    xprt.addEventListener('change', Control.exportFile, false);
    switch (Control._exportType)
    {
        case 'xml':
        {
            xprt.nwsaveas='*.xml';
        } break;
        case 'ino':
        {
            xprt.nwsaveas='*.ino';
        } break;
        default:
            xprt.nwsaveas='*.xml';
    }

    xprt.click();
};

Control.exportFile = function(event)
{
    var files = event.target.files;
    if (files.length != 1)
    {
    	return;
    }
    // определим тип файла экспорта
    switch (Control._exportType)
    {
        case 'xml':
        {
            // используем node.js для записи файлов на диск
            fs.writeFile(fh.extentionCheck(event.target.value, '.xml'), getXML(), function (err)
            {
                if (err)
                {
                    alert("Write failed: " + err);
                    return;
                }
            });
        } break;
        case 'ino':
        {
            Control.arduinoExport(fh.extentionCheck(event.target.value, '.ino'));
        } break;
        default:
            // используем node.js для записи файлов на диск
            fs.writeFile(fh.extentionCheck(event.target.value, '.xml'), getXML(), function (err)
            {
                if (err)
                {
                    alert("Write failed: " + err);
                    return;
                }
            });
    }
};

// метод экспортирования проекта под платформу Ардуино
Control.arduinoExport = function(addr, callback, port, BOARD,text)
{
    // используем node.js для записи файлов на диск
    fs.writeFile(addr, text/*getCode()*/, function (err)
    {
        if (err)
        {
            alert("Write failed: " + err);
            return;
        }

        callback(port, BOARD);
    });
};

var getCode = function()
{
    return Control.Blockly.Arduino.workspaceToCode(Control.Blockly.mainWorkspace);
};

var setXML = function(value)
{
    var xml = Control.Blockly.Xml.textToDom(value);

    Control.Blockly.mainWorkspace.setVisible(false);

    Control.Blockly.Xml.domToWorkspace(xml, Control.Blockly.mainWorkspace);

    Control.Blockly.mainWorkspace.render();

    Control.Blockly.mainWorkspace.setVisible(true);
};

// читаем XML текущего варианта схемы
var getXML = function()
{
    var xml = Control.Blockly.Xml.workspaceToDom(Control.Blockly.mainWorkspace);
    var data = Control.Blockly.Xml.domToText(xml);

    return data;
};

// EXPORTS
exports.newProject      = Control.newProject;
exports.openProject     = Control.openProject;
exports.saveProject     = Control.saveProject;
exports.exportProject   = Control.exportProject;
exports.openOption      = Control.openOption;
exports.compileProject  = Control.compileProject;
exports.htmlGenerate    = Control.htmlGenerate;
exports.Init            = Control.Init;
exports.readOptions     = Control.readOptions;
exports.saveOptions     = Control.saveOptions;
exports.JSON_parce      = Control.JSON_parce;
exports.JSON_stringify  = Control.JSON_stringify;
exports.setOptions      = Control.setOptions;
exports.getPortsList    = Control.getPortsList;
