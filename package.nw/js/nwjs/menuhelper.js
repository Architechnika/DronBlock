/*
Набор методов для создания и обработки команд меню
*/
'use strict';

var Control     = require('./control');

var nw          = nw || {};

var console     = console || {};

var openOption  = openOption || {};

var compilerMethod = {};
var serialportmonitorOpen = {};

var HREF = {};

var createMenu = function(nw, Control, console, openOption, compilerMethod, documentHref, serialportmonitorOpen)
{
    this.Control = Control;
    this.nw = nw;
    this.console = console;
    this.openOption = openOption;
    this.compilerMethod = compilerMethod;
    this.serialportmonitorOpen = serialportmonitorOpen;
    this.HREF = documentHref;

    // Создать пустое меню
    console.log('Start create submenu');
    var menu_file = new nw.Menu();
    var menu_file_export = new nw.Menu();
    var menu_instruments = new nw.Menu();

    // .. и повесить на них обработчики
    menu_file.append(new nw.MenuItem(
    {
        label: 'Новый проект',
        click: Control.newProject
    }));
    menu_file.append(new nw.MenuItem(
    {
        label: 'Открыть проект',
        click: Control.openProject
    }));
    menu_file.append(new nw.MenuItem(
    {
        type: 'separator'
    }));
    menu_file.append(new nw.MenuItem(
    {
        label: 'Сохранить проект',
        click: Control.saveProject
    }));

    menu_file_export.append(new nw.MenuItem(
    {
        label: 'Экспортировать в Blockly',
        click: function()
        {
            Control.exportProject('xml');
        }
    }));
    menu_file_export.append(new nw.MenuItem(
    {
        label: 'Экспортировать в Arduino',
        click: function()
        {
            Control.exportProject('ino');
        }
    }));
    menu_file.append(new nw.MenuItem(
    {
        label: 'Экспортировать проект',
        submenu: menu_file_export
    }));
    menu_file.append(new nw.MenuItem(
    {
        type: 'separator'
    }));
    menu_file.append(new nw.MenuItem(
    {
        label: 'Выход',
        click: function()
        {
            nw.App.quit();
        }
    }));

    // Создать верхнее меню
    var menubar = new nw.Menu(
    {
        type: 'menubar'
    });

    // В качестве вложенных меню используем такой же код, как в примере c контекстным меню.
    menubar.append(new nw.MenuItem(
    {
        label: 'Файл',
        submenu: menu_file
    }));

    menu_instruments.append(new nw.MenuItem(
    {
        label: 'Настройки программы',
        click: function()
        {
            console.log('Start Open Option');
            openOption();
        }
    }));

    menu_instruments.append(new nw.MenuItem(
    {
        type: 'separator'
    }));

    menu_instruments.append(new nw.MenuItem(
    {
        label: 'Компилировать',
        click: function()
        {
            console.log('Start Compiler');
            compilerMethod();
        }
    }));

    menu_instruments.append(new nw.MenuItem(
    {
        label: 'Монитор порта',
        click: function()
        {
            console.log('Start port monitor');
            serialportmonitorOpen();
        }
    }));



    menu_instruments.append(new nw.MenuItem(
    {
        type: 'separator'
    }));

    menu_instruments.append(new nw.MenuItem(
    {
        label: 'Запустить конструктор блоков',
        click: function()
        {
            console.log('Start Factory');
            window.open('./factory/factory.html', '_blank')

        }
    }));

    menu_instruments.append(new nw.MenuItem(
    {
        type: 'separator'
    }));

    menu_instruments.append(new nw.MenuItem(
    {
        label: 'Обновить страницу (СЛУЖЕБНОЕ)',
        click: function()
        {
            //document.location.href = document.location.href;
            HREF = HREF;
        }
    }));

    menu_instruments.append(new nw.MenuItem(
    {
        label: 'Перестроить страницу (СЛУЖЕБНОЕ)',
        click: function()
        {
            Control.htmlGenerate();
        }
    }));

    menubar.append(new nw.MenuItem(
    {
        label: 'Инструменты',
        submenu: menu_instruments
    }));


    console.log('Записываю новое меню в глобальную переменную');
    //Получить текущее окно и подключить к нему верхнее меню
    nw.Window.get().menu = menubar;

    
};

exports.createMenu = createMenu;
