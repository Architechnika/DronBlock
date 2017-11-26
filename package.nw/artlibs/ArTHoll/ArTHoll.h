#ifndef Holl_h
#define Holl_h

#if ARDUINO >= 100
  #include "Arduino.h"
#else
  #include "WProgram.h"
#endif
#include "../ArTPort/ArTPort.h"

class ArTHoll
{
  public:
   ArTHoll (ArTPort* Port);
    int GetValue(int cnt);
    int isTrigged(int ms);

  private:
   ArTPort* _port;

};

#endif
