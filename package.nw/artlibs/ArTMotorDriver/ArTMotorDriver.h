

#ifndef ArTMotorDriver_h
#define ArTMotorDriver_h

#if defined(ARDUINO) && ARDUINO >= 100
	#include <Arduino.h>
#else
	#include <WProgram.h>
	#include <pins_arduino.h>
#endif

#include "../ArTPort/ArTPort.h"

class ArTMotorDriver 
{
	private:
		ArTPort* _port;
		int _spd;
		
	public:
		ArTMotorDriver(ArTPort* portnmb);
		
		void Drive(int spd);
		void Stop();
		int GetSpeed();
	
};


#endif
