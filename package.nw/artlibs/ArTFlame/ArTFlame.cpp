#if ARDUINO >= 100
  #include "Arduino.h"
#else
  #include "WProgram.h"
#endif

#include "ArTFlame.h"

ArTFlame::ArTFlame(ArTPort* Port)
{
 _port = Port;
 pinMode (_port->D(), OUTPUT) ;// define LED as output interface
 pinMode (_port->A(), INPUT) ;// output interface defines the flame sensor
}

int ArTFlame::GetValue()
{
  int sensor = analogRead(_port->A());
  return (sensor);

}
void ArTFlame::LedON()
{
   digitalWrite(_port->D(), HIGH);
}

void ArTFlame::LedOFF()
{
   digitalWrite(_port->D(), LOW);
}
