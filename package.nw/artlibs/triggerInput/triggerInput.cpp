/**/


#include "triggerInput.h"

TriggerInput::TriggerInput(int inp)
{
    pinMode(inp, INPUT);

    Trig_pin = inp;
}

// примитивная фильтрация дребезга на контактах
int TriggerInput::getTrigged(int tim)
{
    int pin = digitalRead(Trig_pin);
    delay(tim);

    return (pin & digitalRead(Trig_pin));
}

int TriggerInput::getRAW()
{
    return digitalRead(Trig_pin);
}