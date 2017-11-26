

#include "ArTPort.h"


// ---------------------------------------------------------------------------
// ArTPort constructor
// ---------------------------------------------------------------------------

ArTPort::ArTPort(int portnumb)
{
	switch(portnumb)
	{
		// PortA
		case 0:
		{
			_A = A0;
			_D = 2;
			_PWM = 3;
			
		}break;
		
		// PortB
		case 1:
		{
			_A = A1;
			_D = 4;
			_PWM = 5;
			
		}break;
		
		// PortC
		case 2:
		{
			_A = A2;
			_D = 7;
			_PWM = 6;
			
		}break;
		
		// PortD
		case 3:
		{
			_A = A3;
			_D = 8;
			_PWM = 9;
			
		}break;
		
		// PortE
		case 4:
		{
			_A = A6;
			_D = 12;
			_PWM = 10;
			
		}break;
		
		// PortF
		case 5:
		{
			_A = A7;
			_D = 13;
			_PWM = 11;
			
		}break;
	
	}
}

ArTPort::ArTPort(int A, int D, int PWM)
{
    _A = A;
    _D = D;
    _PWM = PWM;
}

int ArTPort::A()
{
	return _A;
}

int ArTPort::D()
{
	return _D;
}

int ArTPort::PWM()
{
	return _PWM;
}

