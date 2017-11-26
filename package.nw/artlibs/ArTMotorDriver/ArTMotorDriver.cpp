

#include "ArTMotorDriver.h"


// ---------------------------------------------------------------------------
// ArTPort constructor
// ---------------------------------------------------------------------------

ArTMotorDriver::ArTMotorDriver(ArTPort* portnmb)
{
	_port = portnmb;
	
	pinMode(_port->D(), OUTPUT);
}

void ArTMotorDriver::Drive(int spd)
{
	_spd = spd;
	
	if(_spd >= 0)
	{
		digitalWrite(_port->D(), LOW);
		analogWrite(_port->PWM(), _spd);
	}
	else
	{
		digitalWrite(_port->D(), HIGH);
		analogWrite(_port->PWM(), 255 + _spd);
	}
}

void ArTMotorDriver::Stop()
{
	Drive(0);
}

int ArTMotorDriver::GetSpeed()
{
	return _spd;
}
