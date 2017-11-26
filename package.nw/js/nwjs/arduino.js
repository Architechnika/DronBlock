/*
Модуль работы с компилятором ардуино и не только

*/

'use strict'

//const SerialPort    = require('serialport');

var prefs = "";
var compile = "";
var programm = "";
var LOG = {};
var LOG_OBJECT = {};
var PROCESS = {};
var PROCESS_END = {};

var LOG = {};
var PORTS = {};
var BOARD = "nano328";

exports.initPortList = function(LOG, callback, html_object)
{
    this.LOG = LOG;
    //SerialPort.list(function (err, ports)
    chrome.serial.getDevices(function (ports)
        {
            PORTS = ports;

            LOG('PORT_LLIST:');
            ports.forEach((port) =>
                {
                    LOG(port.path);
                });

            callback(ports, html_object);
        });
};

exports.getPortList = function(LOG, callback, html_object)
{
    LOG("ARDUINO_RETURN_PORTS");
    exports.initPortList(LOG, callback, html_object);
    //return PORTS;
};

exports.BuildProject = function(arduinoPath, buildPath, projectPath, libPath, LOG, LOG_OBJECT, PROCESS, PROCESS_END, PORT, BOARD)
{
    this.LOG = LOG;
    this.LOG_OBJECT = LOG_OBJECT;
    this.PROCESS = PROCESS;
    this.PROCESS_END = PROCESS_END;
    this.BOARD = BOARD;

    PROCESS.style="display: true;";

    var board_build = "";
    var board_programm = "";
    var board_baude = "57600";
    /*<option value="art">Архитехника</option>
                        <option value="nano328">Arduino Nano (328)</option>
                        <option value="UNO">Arduino UNO</option>*/
// -fqbn=arduino:avr:${board_version} -ide-version=10612
    switch(this.BOARD)
    {
        case "art10":
        {
            board_build = "nano:cpu=atmega328";
            board_programm = "atmega328p";
            board_baude = "57600";
        } break;

        case "nano328":
        {
            board_build = "nano:cpu=atmega328";
            board_programm = "atmega328p";
            board_baude = "57600";
        } break;

        case "UNO":
        {
            board_build = "uno";
            board_programm = "atmega328p";
            board_baude = "115200";
        } break;
    }

    LOG(libPath);
    LOG(libPath.split('|').length);
    LOG(libPath.split('|'));
    LOG(`ArduinoCompilerStart`);
    // готовим список всех библиотек
    var libList = "";
    if(libPath.split('|').length > 1)
    {
        for(var i = 0; i < libPath.split('|').length; i++)
        {
            libList += ` -libraries "${libPath.split('|')[0]}" `;
            LOG(`LIbPathAdr = ${libPath.split('|')[0]}`);
        }
    }
    else
    {
        libList = ` -libraries "${libPath}" `;
    }

    prefs = `"${arduinoPath}/arduino-builder" -dump-prefs -logger=machine -hardware "${arduinoPath}/hardware" -tools "${arduinoPath}/tools-builder" -tools "${arduinoPath}/hardware/tools/avr" -built-in-libraries "${arduinoPath}/libraries" ${libList} -fqbn=arduino:avr:${board_build} -ide-version=10612 -build-path "${buildPath}" -warnings=none -prefs=build.warn_data_percentage=75 -verbose "${projectPath}"`;
                                                                                                                                                                                                
    compile = `"${arduinoPath}/arduino-builder" -compile -logger=machine -hardware "${arduinoPath}/hardware" -tools "${arduinoPath}/tools-builder" -tools "${arduinoPath}/hardware/tools/avr" -built-in-libraries "${arduinoPath}/libraries" ${libList} -fqbn=arduino:avr:${board_build} -ide-version=10612 -build-path "${buildPath}" -warnings=none -prefs=build.warn_data_percentage=75 -verbose "${projectPath}"`;

    programm = `"${arduinoPath}/hardware/tools/avr/bin/avrdude" -C"${arduinoPath}/hardware/tools/avr/etc/avrdude.conf" -v -p${board_programm} -carduino -P${PORT} -b${board_baude} -D -Uflash:w:"${buildPath}/temp.ino.hex":i`;

    LOG('Запуск подготовки проекта');
    LOG_OBJECT.innerHTML = 'Подготовка проекта';
    require('child_process').exec(prefs, (error, stdout, stderr) =>
        {
            if (error)
            {
                alert(`Ошибка подготовки проекта: \n${error}`);
                LOG_OBJECT.innerHTML = 'ОШИБКА!!!';
                PROCESS.style="display: none;";
                PROCESS_END.style="display: none;";

                return;
            }
            LOG(`stdout: ${stdout}\nstderr: ${stderr}`);

            LOG('Запуск компиляции проекта');
            LOG_OBJECT.innerHTML = 'Компиляция проекта';

            require('child_process').exec(compile, (error, stdout, stderr) =>
                {
                    if (error)
                    {
                        alert(`Ошибка компиляции проекта: \n${error}`);
                        LOG_OBJECT.innerHTML = 'ОШИБКА!!!';
                        PROCESS.style="display: none;";
                        PROCESS_END.style="display: none;";

                        return;
                    }
                    LOG(`stdout: ${stdout}\nstderr: ${stderr}`);

                    LOG('Загружаем прошивку');
                    LOG_OBJECT.innerHTML = 'Прошивка проекта';
                    require('child_process').exec(programm, (error, stdout, stderr) =>
                        {
                            if (error)
                            {
                                alert(`Ошибка прошивки проекта: \n${error}`);
                                LOG_OBJECT.innerHTML = 'ОШИБКА!!!';
                                PROCESS.style="display: none;";
                                PROCESS_END.style="display: none;";

                                return;
                            }
                            LOG(`stdout: ${stdout}\nstderr: ${stderr}`);

                            LOG('Завершено');
                            LOG_OBJECT.innerHTML = 'Завершено';
                            PROCESS.style="display: none;";
                            PROCESS_END.style="display: true;";
                        });
                });
        });
};
