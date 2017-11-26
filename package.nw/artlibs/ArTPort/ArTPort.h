

#ifndef ArTPort_h
#define ArTPort_h

#if defined(ARDUINO) && ARDUINO >= 100
	#include <Arduino.h>
#else
	#include <WProgram.h>
	#include <pins_arduino.h>
#endif


class ArTPort 
{
	private:
		int _A,
			_D,
			_PWM;
		
	public:
		ArTPort(int portnumb);
        ArTPort(int A, int D, int PWM);
		
		int A();
		int D();
		int PWM();
	
};


#endif