#include <stdio.h>
#include <wiringPi.h>
#include "nexa.h"
#include <sys/time.h>
#define LED 15

void helpText(){
  printf("id state\n");
}
int main (int argc, char **argv[]){
  wiringPiSetup () ;
  pinMode (LED, OUTPUT) ;
  printf("args %d \n",argc );
  if(argc==3){
    int id=atoi(argv[1]);
    int state=atoi(argv[2]);
    printf("Sending nexa switching command to %d with state %d\n",id,state );
    sendNexa(id,state);
  }
  if(argc==4){
    int id=atoi(argv[1]);
    int dim=atoi(argv[2]);
    printf("Sending nexa dimming command to %d with dimming %d\n",id,dim );
    sendNexaDimmerValue(id,dim);
  }
  return 0 ;
}
