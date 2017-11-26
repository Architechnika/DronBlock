/*
Методы, помогающие в работе с файловой системой ПК
*/

var fh = fh || {};

var path = path || require('path');
var fs = fs || require('fs');

// метод получения содержимого указанной дерриктории
fh.walk = function(dir, done, files, dirs)
{
    var results = [];
    var files = [];
    var dirs = [dir];
    // читаем содержимое дирректории
    fs.readdir(dir, function(err, list)
    {
        if (err) return done(err);

        // проверяем не пуста ли папка
        var pending = list.length;
        if (!pending) return done(null, results, files, dirs);

        // если папка не пуста - для каждого содержимого элемента
        list.forEach(function(file)
        {
            // проверяем что это: папка или файл и существует ли оно вообще
            file = path.join(dir, file);
            fs.stat(file, function(err, stat)
            {
                // если это дирректория
                if (stat && stat.isDirectory())
                {
                    dirs.push(file);
                    // рекурсивно переходим в неё
                    fh.walk(file, function(err, res, fls, drs)
                    {
                        results = results.concat(res);
                        files = files.concat(fls);
                        dirs = dirs.concat(drs);
                        if (!--pending) done(null, results, files, dirs);
                    });
                }
                else
                {// если это файл
                    files.push(file);
                    if (!--pending) done(null, results, files, dirs);
                }
            });
        });
    });
};

// метод удаления папок со вложенным содержимым
fh.removeDir = function(addr, callback)
{
    // получаем список всех файлов и папок в указанном адресе
    fh.walk(addr, function(err, results, files, dirs)
    {
        if (err)
        {
            console.log('Ошибка удаления папки: ' + err);
        }
        else
        {
            files.sort(function(a, b)
            {
                if (a.length < b.length) return 1;
                else return -1;
            });

            files.forEach(function(file)
            {
                fs.unlink(file, function(err)
                {
                    if(err) throw err;
                });
            });

            dirs.sort(function(a, b)
            {
                if (a.length < b.length)
                {
                    return 1;
                }
                else
                {
                    return -1;
                }
            });

            dirs.forEach(function(dir)
            {
                fs.rmdir(dir, function(err)
                {
                    if(err) throw(err);
                });
            });
        }

        console.log('Удаление папки - Запускаем callback');
        callback();
    });
};

fh.getFileList = function(addr, callback, filter )
{
    var fl = [];
    var wait = 1;

    console.log('start read dir: ' + addr + '\n' +
                'with filter: ' + filter);

    fh.walk(addr, function(err, results, files, dirs)
    {
        if (err) throw err;

        console.log('File list from walk:');
        var fl = files.filter(elem =>
        {
            //console.log(elem);
            //console.log(filter + ' = ' + elem.indexOf(filter));
            return elem.indexOf(filter) > -1;
        });

        callback(fl, dirs);
    });

    console.log('Wait reading file list is ENDED');

    return fl;
};

// проверям файл на существование
fh.isExist = function(file)
{
    try
    {
        fs.accessSync(file, fs.constants.R_OK);
        console.log('File Exist');
        return true;

    } catch (err)
    {
        console.log(err);
    }

    console.log('File don\'t Exist');
    return false;
};

fh.extentionCheck = function(addr, extention)
{
    // берём длину строки без учетарасширения файла
    var len = addr.length - 4;
    // ищем в конце строки расширение файла
    if(extention[0] != '.') extention = '.' + extention;
    var index = addr.toLowerCase().lastIndexOf(extention);
    if(index < len)
    {// если вконце не найдено расширение - добавлем его
        addr += extention;
    }
    return addr;
};


// EXPORTS
exports.extentionCheck      = fh.extentionCheck;
exports.isExist             = fh.isExist;
exports.getFileList         = fh.getFileList;
exports.removeDir           = fh.removeDir;