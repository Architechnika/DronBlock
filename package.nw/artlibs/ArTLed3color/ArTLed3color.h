#ifndef Leds_h
#define Leds_h

#if ARDUINO >= 100
  #include "Arduino.h"
#else
  #include "WProgram.h"
#endif
#include "../ArTPort/ArTPort.h"


class ArTLed3color
{
  public:
    ArTLed3color (ArTPort* Port);
    void ON(int rgb);
    void OFF();

  private:
   ArTPort* _port;

};

#endif
