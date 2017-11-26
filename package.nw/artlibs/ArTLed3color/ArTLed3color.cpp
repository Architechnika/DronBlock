#if ARDUINO >= 100
  #include "Arduino.h"
#else
  #include "WProgram.h"
#endif

#include "ArTLed3color.h"

ArTLed3color::ArTLed3color(ArTPort* Port)
{
    _port = Port;
    pinMode (_port->A(), OUTPUT);
    pinMode (_port->D(), OUTPUT);
    pinMode (_port->PWM(), OUTPUT);

}

void ArTLed3color::ON(int rgb)
{
    digitalWrite(_port->PWM(), ((rgb >> 2) & 0x0001)); // R
    digitalWrite(_port->D(), ((rgb >> 1) & 0x0001)); // G
    digitalWrite(_port->A(), ((rgb >> 0) & 0x0001)); // B
}

void ArTLed3color::OFF()
{
    digitalWrite(_port->PWM(), 0); // R
    digitalWrite(_port->D(), 0); // G
    digitalWrite(_port->A(), 0); // B
}
