/*
  Simple example for receiving
  
  https://github.com/sui77/rc-switch/
*/

#include "RCSwitch.h"

RCSwitch mySwitch = RCSwitch();

void setup() {
  Serial.begin(115200);

  int pullupPin=6;
  pinMode(pullupPin,OUTPUT);  
  digitalWrite(pullupPin,HIGH);
  pinMode(3,OUTPUT);
  mySwitch.enableReceive(0);  // Receiver on interrupt 0 => that is pin #2
}

void loop() {
  if (mySwitch.available()) {
    
    Serial.print("{\"val\":");
    Serial.print( mySwitch.getReceivedValue() );
    Serial.print(",\"proto\":");
    Serial.print( mySwitch.getReceivedProtocol() );
    Serial.print("}\r\n");
    digitalWrite(3,1);delay(20);digitalWrite(3,0);
    mySwitch.resetAvailable();
  }
}
