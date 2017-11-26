/*
Название: Библиотека работы с ИК датчиком линии с аналоговым и цифровым выходами
Автор: Юдин Максим и Ко
Версия: 1.0

Изменения:
			
*/


#ifndef ArTIRSence_h
#define ArTIRSence_h

#if defined(ARDUINO) && (ARDUINO >= 100)
#include <Arduino.h>
#else
#include <WProgram.h>
#endif

#include "../ArTPort/ArTPort.h"

class	ArTIRSence
{
	public:		
		ArTIRSence(ArTPort * port);			//	инициализация модуля	(вывод TRIG, вывод ECHO)
		
		// считываем показание освещенности в течении заданного времени
		// cnt - по скольким отсчетам определять интенсивность
		uint16_t getIntensity(uint8_t cnt);		//	читаем показания интенсивности освещения
		
		// возвращает true (1) если датчик попадает на черное поле
		// возвращает false (0) если датчик попадает на бело поле
		// яркость черного и белого определяется аппаратными настройками самого датчика
		// time - количество десятков микросекунд, которые должен стоять этотуровень
		bool isBlack(int time);
		
	private:
		ArTPort* _port;

};

#endif
