/*
Название: Библиотека работы с ИК датчиком линии с аналоговым и цифровым выходами
Автор: Юдин Максим и Ко
Версия: 1.0

Изменения:
			
*/


#include "ArTIRSence.h"

//		инициализация модуля
ArTIRSence::ArTIRSence(ArTPort * port)
{	
	_port = port;

	pinMode(_port->A(), INPUT);
	pinMode(_port->D(), INPUT );
}
//		определение интенсивности
uint16_t ArTIRSence::getIntensity(uint8_t cnt)
{	
	uint16_t intenc = analogRead(_port->A());
	
	for(int i = 1; i < cnt; i++)
	{
		intenc += analogRead(_port->A());
	}
	//	ограничиваемся максимально допустимым расстоянием
	if(cnt > 0) intenc = intenc / cnt;
	
	return intenc;
}

// если высокий уровень на входе стоит больше половины указанной 
// блительности - то считаем, что триггер отработал
bool ArTIRSence::isBlack(int time)
{
	int trig = digitalRead(_port->D());
	
	for(int i = 1; i < time; i++)
	{
		delayMicroseconds(10);
		trig += digitalRead(_port->D());
	}
	
	if(time > 0) trig = trig / time;
	
	return (trig > (time / 2)) ? true : false;
}