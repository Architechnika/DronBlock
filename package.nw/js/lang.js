var fs = require('fs');
const osLocale = require('os-locale');

osLocale().then(lang => {
	console.log("local is " + lang);
	//=> 'en_US'
	//=> 'ru_RU'

	target = JSON.parse(fs.readFileSync("js/" + lang + '.json', 'utf8'));
	//target = {"FILE": "Файл", "NEW_PROJECT": "Новый проект"};
	$.each(target, function(key, value){
        var sel = $("#" + key);
		sel.append(value);
		console.log(sel);
		console.log(key + " " +value);
	});
	
});




