# Summary
This system is based on web-socket supported broadcasting. This allows for real-time communication of internet-connected units without the need of exposing ports. The system uses *nodes* that all connect to one central web-socket server. Nodes include programs running on virtual private servers, local units such as raspberry PIs or as a website on smartphones or computers.

## Nodes
The following nodes exist in the broadcast network.
### 433 MHz Transmitter
A unit running on an always-on raspberry PI. It has a 433.92 MHz transmitter for controlling Nexa wall plugs.

### Timer Module
VPS Based module that can be programmed to send commands at a specific time.

### Control Web Page
A web interface for controlling and debugging the network.

![alt text](/docs/web-buttons.PNG "Part of web-GUI")

### 433 MHz Receiver
A 433 MHz receiver constructed from a modified wall plug (Normal receiver modules such as the RWS-371 are not fast enough) connected to an Arduino, the Arduino spits JSON encoded messages to a raspberry pi on successful reception. The receiver could just as well be connected to the raspberry PI, in fact, that would be more precise due to its higher speed, however; due to the high-frequency noise from the AGC triggering the comparator of the ASK receiver, the raspberry PI would experience constant interrupts, producing a very high CPU utilization. Hence a dedicated microcontroller is used to sift out the interesting signals.


![alt text](/docs/receiver.png "Picture of 433.92 MHz receiver")
