/*
модуль описания триггера на цыфровой вход

*/

#include "Arduino.h"

class TriggerInput
{
    public:
        TriggerInput(int inp);
        int getTrigged(int tim);
        int getRAW();

    private:
        int Trig_pin;
};