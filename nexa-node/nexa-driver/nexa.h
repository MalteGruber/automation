#ifndef NEXA_H
#define NEXA_H


void toggleBit(int lowTime);

void sendBit(int bit);


void sendNexa(int channel, int state);
void sendNexaBursts(int channel, int state, int bursts);
void sendDimBit();
void sendNexaDimmerValue(int channel, int dimValue);

#endif