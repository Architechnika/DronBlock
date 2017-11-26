/* файл описания запросов на сервер */
'use strict'


var Server = {};

const SERVER_URL = "http://127.0.0.1:8888/";

Server.newProject = function()
{
    if(confirm("Вы хотите сохранить текущий проект?") || false)
    {
        Server.saveProject(getXML());
    }
    workspaceClear();
    setXML(initialValue);
};
//открываем файл проекта средствами браузера
Server.openProject = function()
{
    console.log('Start OFD');
    openFileDialog(openFile);
};

Server.saveProject = function()
{
    var code = getXML();
    
    serverMessage(SERVER_URL + 'SAVE_PROJECT', code, function(status, errorInfo) 
    {
        if (status == 200) 
        {
            alert("Проект успешно сохранён");
        } else 
        {
            alert("Ошибка сохранения проекта: " + errorInfo);
        }
    });
};

// отправка исходного кода в Arduino IDE
Server.compileProject = function()
{
    var code = getCode();
    
    serverMessage(SERVER_URL + 'ARTSERVERMODE_WRITE', code, function(status, errorInfo) 
    {
        if (status == 200) 
        {
            alert("Программа успешно загружена");
        } else 
        {
            alert("Ошибка загрузки программы: " + errorInfo);
        }
    });
};

Server.readOption = function()
{

};

Server.refreshHTML = function()
{

};

// служебная процедура запроса на сервер
var serverMessage = function(url, code, callback) 
{
    var target = document.getElementById('content_blocks');
    var spinner = new Spinner().spin(target);
    
//    var url = "http://127.0.0.1:8888/";
    var method = "POST";

    // You REALLY want async = true.
    // Otherwise, it'll block ALL execution waiting for server response.
    var async = true;

    var request = new XMLHttpRequest();
    
    request.onreadystatechange = function() 
    {
        if (request.readyState != 4) 
        { 
            return; 
        }
        
        spinner.stop();
        
        var status = parseInt(request.status); // HTTP response status, e.g., 200 for "200 OK"
        var errorInfo = null;
        
        switch (status) {
        case 200:
            break;
        case 0:
            errorInfo = "code 0\n\nCould not connect to server at " + url + ".  Is the local web server running?";
            break;
        case 400:
            errorInfo = "code 400\n\nBuild failed - probably due to invalid source code.  Make sure that there are no missing connections in the blocks.";
            break;
        case 500:
            errorInfo = "code 500\n\nUpload failed.  Is the Arduino connected to USB port?";
            break;
        case 501:
            errorInfo = "code 501\n\nUpload failed.  Is 'ino' installed and in your path?  This only works on Mac OS X and Linux at this time.";
            break;
        default:
            errorInfo = "code " + status + "\n\nUnknown error.";
            break;
        };
        
        callback(status, errorInfo);
    };
    
    request.open(method, url, async);
    request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
    
    // Шлём исходный код программы
    request.send(code);	     
}

// вызываем осбытие открытия файла для стандартного контрола
var openFileDialog = function(callback)
{
    // добавляем обработчик события
    var loadInput = document.getElementById('openFile');
    loadInput.value = '';
    loadInput.addEventListener('change', callback, false);
    // имитируем событие
    console.log("Start 'CLICK'");
    loadInput.click();
    console.log("End 'CLICK'");
};

// обраотчик события откытия файла
var openFile = function(event)
{
    console.log("Start  work with opened file");
    // проверим количество выбранных файлов
    var files = event.target.files;
    if (files.length != 1) {
        console.log('Nothingto work. Files zero');
        return;
    }

    // обявим читателя файлов
    var reader = new FileReader();
    // подключим обраотчик события окончания чтения файла
    reader.onloadend = function(event)
    {
        var target = event.target;
        console.log('File loaded with readystate = ' + target.readyState);
        // если сыбитие чтения файла удачно
        if (target.readyState == 2)
        {
            try
            {
                // пробуем распарсить файл проекта
                var xml = Blockly.Xml.textToDom(target.result);
            }
            catch (e)
            {
                alert('Ошибка загрузки проекта Ardutech:\n' + e);
                return;
            }

            // если файл проекта распарсили
            // очистим форму
            workspaceClear();
            // откроем проект
            setXML(target.result);
            
            console.log(document.getElementById('openFile').value);
            document.getElementById('openFile').value = '//';
            console.log('After clear.' + document.getElementById('openFile').value);
            console.log('End read file');

        }
        // сбросим данные выбранного файла
        // для отработки ошибки некоторых браузеров
        // document.getElementById('openFile').value = ' ';
    };
    // запускаем чтение файла
    reader.readAsText(files[0]);
};
