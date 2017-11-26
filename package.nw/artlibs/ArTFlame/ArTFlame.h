#ifndef Flame_h
#define Flame_h

#if ARDUINO >= 100
  #include "Arduino.h"
#else
  #include "WProgram.h"
#endif
#include "../ArTPort/ArTPort.h"

class ArTFlame
{
  public:
   ArTFlame(ArTPort* Port);
    int GetValue();
    void LedON();
    void LedOFF();
  private:
   ArTPort* _port;

};

#endif
