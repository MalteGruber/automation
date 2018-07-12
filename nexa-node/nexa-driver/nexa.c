#include <wiringPi.h>
#include "nexa.h"

int T = 249;
int itterator = 0;
int txPin=15;
//11000010001100110000010001 11'0101
long key = 0b11000010001100110000010100;
          // 110000100011001100000101001001000
         //S HHHHHHHHHHHHHHHHHHHHHHHHHHGOCCEEP                              GOCCEEPP
void toggleBit(int lowTime) {
  digitalWrite(txPin, HIGH);
  delayMicrosecondsHard(T);
  digitalWrite(txPin, LOW);
  delayMicrosecondsHard(T);
  for (itterator = 0; itterator < lowTime - 1; itterator++) {
    delayMicrosecondsHard(T);
  }
}

void sendBit(int bit) {
  if (bit) {
    toggleBit(5);
    toggleBit(1);
  } else {
    toggleBit(1);
    toggleBit(5);
  }
}


void sendNexa(int channel, int state) {
  for (int k = 0; k < 2; k++) {
    digitalWrite(txPin, HIGH);

    toggleBit(10); //Start bit
    for (int i = 0; i < 26; i++) {
      sendBit(((key >> (25 - i)) & 1) == 0);
    }
    sendBit(0); //Group
    sendBit(state); //OnOff
    //Send INVERTED address
    sendBit((channel & 8) == 0); //!Msb
    sendBit((channel & 4) == 0); //!Msb
    sendBit((channel & 2) == 0); //!Msb
    sendBit((channel & 1) == 0); //!Msb
    toggleBit(40); //Stop bit
    digitalWrite(txPin, LOW);
  }
}

void sendNexaBursts(int channel, int state, int bursts) {
  for (int k = 0; k < bursts; k++) {
    digitalWrite(txPin, HIGH);

    toggleBit(10); //Start bit
    for (int i = 0; i < 26; i++) {
      sendBit(((key >> (25 - i)) & 1) == 0);
    }
    sendBit(0); //Group
    sendBit(state); //OnOff
    //Send INVERTED address
    sendBit((channel & 8) == 0); //!Msb
    sendBit((channel & 4) == 0); //!Msb
    sendBit((channel & 2) == 0); //!Msb
    sendBit((channel & 1) == 0); //!Msb
    toggleBit(40); //Stop bit
    digitalWrite(txPin, LOW);
  }
}
void sendDimBit() {
  toggleBit(1);
  toggleBit(1);
}

void sendNexaDimmerValue(int channel, int dimValue) {
  for (int k = 0; k < 3; k++) {
    digitalWrite(txPin, HIGH);
    toggleBit(10); //Start bit
    for (int i = 0; i < 26; i++) {
      sendBit(((key >> (25 - i)) & 1) == 0);
    }
    sendBit(0); //Group
    sendDimBit();//Instead of: sendBit(state); //OnOff
    //Send INVERTED address
    sendBit((channel & 8) == 0); //!Msb
    sendBit((channel & 4) == 0); //!Msb
    sendBit((channel & 2) == 0); //!Msb
    sendBit((channel & 1) == 0); //!Msb
    //Send INVERTED dim level (Yes, this is ugly.))
    sendBit((dimValue & 8) == 0); //!Msb
    sendBit((dimValue & 4) == 0); //!Msb
    sendBit((dimValue & 2) == 0); //!Msb
    sendBit((dimValue & 1) == 0); //!Msb
    toggleBit(60); //Stop bit
    digitalWrite(txPin, LOW);
  }
}


