#if ARDUINO >= 100
  #include "Arduino.h"
#else
  #include "WProgram.h"
#endif

#include "ArTHoll.h"

ArTHoll::ArTHoll(ArTPort* Port)
{
 _port = Port;
 pinMode (_port->A(), INPUT);
 pinMode (_port->PWM(), INPUT);

}

int ArTHoll::GetValue(int cnt)
{
    int val = analogRead(_port->A());

	for(int i = 1; i < cnt; i++)
	{
		val += analogRead(_port->A());
	}

	if(cnt > 0) val = val / cnt;

	return val;
}

int ArTHoll::isTrigged(int ms)
{
    int val = digitalRead (_port->PWM()) ; // read sensor line
    delay(ms);
    return (val & digitalRead(_port->PWM())) ;
}
